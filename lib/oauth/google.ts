import { createRemoteJWKSet, jwtVerify } from "jose";
import { getOAuthConfig, type OAuthConfig } from "@/lib/oauth/config";
import { s256Challenge } from "@/lib/oauth/pkce";

const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];

const googleJwks = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

export class GoogleIdentityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GoogleIdentityError";
  }
}

export type GoogleIdentity = {
  subject: string;
  email?: string;
  name?: string;
};

/** Adapter around Google's OIDC endpoints; the rest of the server never speaks Google. */
export function buildGoogleAuthorizationUrl(
  config: OAuthConfig,
  state: string,
  codeVerifier: string
): string {
  const url = new URL(GOOGLE_AUTH_ENDPOINT);
  url.searchParams.set("client_id", config.googleClientId);
  url.searchParams.set("redirect_uri", config.googleRedirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", s256Challenge(codeVerifier));
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("prompt", "select_account");
  return url.toString();
}

export async function exchangeGoogleCode(
  config: OAuthConfig,
  code: string,
  codeVerifier: string
): Promise<GoogleIdentity> {
  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: config.googleClientId,
      client_secret: config.googleClientSecret,
      redirect_uri: config.googleRedirectUri,
      grant_type: "authorization_code",
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    throw new GoogleIdentityError("Google rejected the authorization code exchange");
  }

  const body = (await response.json()) as { id_token?: string };
  if (!body.id_token) throw new GoogleIdentityError("Google did not return an ID token");
  return verifyGoogleIdToken(config, body.id_token);
}

export async function verifyGoogleIdToken(
  config: OAuthConfig,
  idToken: string
): Promise<GoogleIdentity> {
  const { payload } = await jwtVerify(idToken, googleJwks, {
    issuer: GOOGLE_ISSUERS,
    audience: config.googleClientId,
  });

  if (!payload.sub) throw new GoogleIdentityError("The Google ID token has no subject");
  const email = typeof payload.email === "string" ? payload.email : undefined;
  if (email && payload.email_verified !== true) {
    throw new GoogleIdentityError("The Google account email is not verified");
  }

  return {
    subject: payload.sub,
    email,
    name: typeof payload.name === "string" ? payload.name : undefined,
  };
}

/**
 * Single-owner gate. Authenticating with Google proves who someone is; it does
 * not make them the site owner, so the allowlist is checked separately.
 */
export function isSiteOwner(identity: GoogleIdentity, config = getOAuthConfig()): boolean {
  if (config.allowedSubject && identity.subject === config.allowedSubject) return true;
  if (
    config.allowedEmail &&
    identity.email &&
    identity.email.toLowerCase() === config.allowedEmail.toLowerCase()
  ) {
    return true;
  }
  return false;
}
