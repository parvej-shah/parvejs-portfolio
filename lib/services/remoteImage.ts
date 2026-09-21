import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

/**
 * Fetches an image the caller named, for ingestion into storage.
 *
 * An MCP client chooses this URL, so the server is being asked to make a
 * request on behalf of something it does not control. Left unguarded that is
 * server-side request forgery: the deployment can reach cloud metadata
 * endpoints and anything else inside its network perimeter that a browser
 * could not. Every check below exists to keep that reachable set to "public
 * HTTPS hosts serving images".
 */

export class RemoteImageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RemoteImageError";
  }
}

export const REMOTE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 3;

const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

/**
 * Blocks the address ranges that are not routable on the public internet.
 * 169.254.169.254 (cloud metadata) is the one that turns an image fetcher into
 * a credential leak, but every private range is refused rather than special
 * casing that single address.
 */
export function isDisallowedAddress(address: string): boolean {
  const version = isIP(address);

  if (version === 4) {
    const [a, b] = address.split(".").map(Number);
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true; // link-local, incl. cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true; // carrier-grade NAT
    if (a >= 224) return true; // multicast and reserved
    return false;
  }

  if (version === 6) {
    const normalized = address.toLowerCase().replace(/^\[|\]$/g, "");
    if (normalized === "::1" || normalized === "::") return true;
    if (normalized.startsWith("fe80")) return true; // link-local
    if (/^f[cd]/.test(normalized)) return true; // unique local
    // IPv4-mapped (::ffff:a.b.c.d) must be judged by its IPv4 value.
    const mapped = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isDisallowedAddress(mapped[1]);
    return false;
  }

  return true;
}

async function assertPublicHost(hostname: string): Promise<void> {
  const literal = hostname.replace(/^\[|\]$/g, "");
  if (isIP(literal)) {
    if (isDisallowedAddress(literal)) {
      throw new RemoteImageError(`Refusing to fetch a non-public address: ${hostname}`);
    }
    return;
  }

  let addresses: { address: string }[];
  try {
    addresses = await lookup(hostname, { all: true });
  } catch {
    throw new RemoteImageError(`Could not resolve host: ${hostname}`);
  }

  if (!addresses.length) throw new RemoteImageError(`Host resolved to no addresses: ${hostname}`);
  for (const { address } of addresses) {
    if (isDisallowedAddress(address)) {
      throw new RemoteImageError(`Host ${hostname} resolves to a non-public address`);
    }
  }
}

export function assertFetchableUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new RemoteImageError("source_url is not a valid absolute URL");
  }
  // Plain HTTP would let a network position swap the image in transit, and
  // other schemes (file:, data:, gopher:) are not fetches we ever want to make.
  if (url.protocol !== "https:") {
    throw new RemoteImageError("source_url must use https");
  }
  return url;
}

export type RemoteImage = {
  buffer: Buffer;
  contentType: string;
  sourceUrl: string;
};

/**
 * Redirects are followed manually so each hop is validated before it is taken.
 * Letting fetch follow them would check only the first URL, which an attacker
 * controls the redirect target of.
 */
export async function fetchRemoteImage(raw: string): Promise<RemoteImage> {
  let target = assertFetchableUrl(raw);

  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    await assertPublicHost(target.hostname);

    const response = await fetch(target, {
      redirect: "manual",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { accept: ALLOWED_CONTENT_TYPES.values().next().value + ",image/*" },
    }).catch((error: unknown) => {
      if (error instanceof Error && error.name === "TimeoutError") {
        throw new RemoteImageError("Timed out fetching source_url");
      }
      throw new RemoteImageError("Could not fetch source_url");
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new RemoteImageError("Redirect without a location header");
      target = assertFetchableUrl(new URL(location, target).toString());
      continue;
    }

    if (!response.ok) {
      throw new RemoteImageError(`source_url returned HTTP ${response.status}`);
    }

    const contentType = (response.headers.get("content-type") ?? "").split(";")[0].trim();
    if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
      throw new RemoteImageError(
        `Unsupported content type: ${contentType || "unknown"}. Expected a JPEG, PNG, WebP, GIF or AVIF image.`
      );
    }

    const declared = Number(response.headers.get("content-length"));
    if (Number.isFinite(declared) && declared > REMOTE_IMAGE_MAX_BYTES) {
      throw new RemoteImageError(
        `Image is ${Math.round(declared / 1024)}KB; the limit is ${REMOTE_IMAGE_MAX_BYTES / 1024 / 1024}MB`
      );
    }

    // Content-Length is a claim, so the body is measured as it arrives.
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > REMOTE_IMAGE_MAX_BYTES) {
      throw new RemoteImageError(
        `Image is ${Math.round(buffer.length / 1024)}KB; the limit is ${REMOTE_IMAGE_MAX_BYTES / 1024 / 1024}MB`
      );
    }
    if (!buffer.length) throw new RemoteImageError("source_url returned an empty body");

    return { buffer, contentType, sourceUrl: target.toString() };
  }

  throw new RemoteImageError(`source_url redirected more than ${MAX_REDIRECTS} times`);
}
