/**
 * Decodes an image the caller sent inline as base64.
 *
 * The URL path in remoteImage.ts remains the one an agent should normally
 * take: tool arguments are JSON, so inline bytes travel base64 through the
 * model's context at roughly 68k tokens for a 200KB image. This path exists
 * for the case with no alternative -- a file the client holds locally that is
 * not reachable over HTTPS. The ceiling below therefore protects the server
 * from a large decode; it is not the binding limit, which is the client's own
 * context window and sits far lower.
 */

export class InlineImageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InlineImageError";
  }
}

export const INLINE_IMAGE_MAX_BYTES = 2 * 1024 * 1024;

const DATA_URL_BASE64_PREFIX = /^data:[a-z0-9.+/-]*(?:;[a-z0-9.=-]+)*;base64,/i;
const DATA_URL_ANY_PREFIX = /^data:/i;
const BASE64_BODY = /^[A-Za-z0-9+/]+={0,2}$/;

const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

/**
 * Identifies the format from the bytes themselves. A caller-declared MIME type
 * is a claim about content the server is about to hand to an image decoder, so
 * the claim is ignored and the content is read instead.
 */
export function sniffImageContentType(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "image/png";
  }

  const ascii = buffer.subarray(0, 12).toString("latin1");
  if (ascii.startsWith("GIF87a") || ascii.startsWith("GIF89a")) return "image/gif";
  if (ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP") return "image/webp";

  // ISO base media container: the brand at bytes 8..12 separates AVIF from
  // the video formats that share the same box header.
  if (ascii.slice(4, 8) === "ftyp") {
    const brand = ascii.slice(8, 12);
    if (brand === "avif" || brand === "avis") return "image/avif";
  }

  return null;
}

export type InlineImage = { buffer: Buffer; contentType: string };

export function decodeInlineImage(raw: string): InlineImage {
  // Clients wrap long base64 at fixed widths, and JSON transport can introduce
  // padding whitespace, neither of which is part of the payload.
  let body = raw.replace(/\s+/g, "");

  if (DATA_URL_BASE64_PREFIX.test(body)) {
    body = body.replace(DATA_URL_BASE64_PREFIX, "");
  } else if (DATA_URL_ANY_PREFIX.test(body)) {
    throw new InlineImageError("Only base64 data URLs are supported (data:<type>;base64,...)");
  }

  if (!body) throw new InlineImageError("image_base64 is empty");
  // Buffer.from silently discards characters outside the alphabet, which would
  // turn a truncated or mistyped payload into a corrupt image rather than an
  // error, so the encoding is checked before it is decoded.
  if (body.length % 4 !== 0 || !BASE64_BODY.test(body)) {
    throw new InlineImageError("image_base64 is not valid base64");
  }

  // Checked from the encoded length so an oversized payload is refused before
  // a buffer is allocated for it.
  const approximateBytes = (body.length / 4) * 3;
  if (approximateBytes > INLINE_IMAGE_MAX_BYTES) {
    throw new InlineImageError(
      `Inline image exceeds the ${INLINE_IMAGE_MAX_BYTES / 1024 / 1024}MB limit. ` +
        "Host the file and pass source_url instead."
    );
  }

  const buffer = Buffer.from(body, "base64");
  if (!buffer.length) throw new InlineImageError("image_base64 decoded to no bytes");

  const contentType = sniffImageContentType(buffer);
  if (!contentType || !ALLOWED_CONTENT_TYPES.has(contentType)) {
    throw new InlineImageError(
      "Inline data is not a recognised image. Expected a JPEG, PNG, WebP, GIF or AVIF."
    );
  }

  return { buffer, contentType };
}
