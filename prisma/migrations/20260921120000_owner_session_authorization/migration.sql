-- The owner now approves authorizations with the admin session instead of Google,
-- so the per-request Google PKCE verifier becomes the approval-form nonce that
-- binds the consent POST to the GET that rendered it.
ALTER TABLE "OAuthAuthorization" RENAME COLUMN "googleVerifier" TO "approvalNonce";

-- Records when the owner explicitly approved the request. An authorization with
-- no approvedAt has never been consented to and can never be exchanged.
ALTER TABLE "OAuthAuthorization" ADD COLUMN "approvedAt" TIMESTAMP(3);
