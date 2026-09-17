import { z } from "zod";

export const verifyRecaptchaSchema = z.object({
  token: z.string().min(1, "reCAPTCHA token is required"),
});

export type VerifyRecaptchaInput = z.infer<typeof verifyRecaptchaSchema>;
