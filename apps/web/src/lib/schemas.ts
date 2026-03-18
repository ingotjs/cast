import { z } from "zod";

/** Shared password schema matching Better Auth defaults (min 8, max 128) */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long");

/** Password requirements displayed to the user */
export const passwordRequirements = [{ label: "At least 8 characters", test: (pw: string) => pw.length >= 8 }];
