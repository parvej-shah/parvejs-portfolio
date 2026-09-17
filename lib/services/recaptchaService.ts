interface GoogleRecaptchaVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

/**
 * Service to verify Google reCAPTCHA v2 token against the siteverify API.
 * Follows the MVC Service pattern to isolate external API integration.
 */
export async function verifyRecaptchaToken(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.error("Missing RECAPTCHA_SECRET_KEY environment variable");
    throw new Error("reCAPTCHA secret key is not configured");
  }

  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("response", token);

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    console.error(`Google reCAPTCHA API responded with HTTP status ${response.status}`);
    return false;
  }

  const data = (await response.json()) as GoogleRecaptchaVerifyResponse;
  return Boolean(data?.success);
}
