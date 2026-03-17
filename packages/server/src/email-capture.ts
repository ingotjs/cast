import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

// Reference: https://nodejs.org/api/fs.html

// Use import.meta.dirname to resolve relative to this file, then navigate to project root
const EMAIL_CAPTURE_DIR = join(import.meta.dirname, "../../../.email-captures");

/** Ensure the capture directory exists */
const ensureDir = () => {
  if (!existsSync(EMAIL_CAPTURE_DIR)) {
    mkdirSync(EMAIL_CAPTURE_DIR, { recursive: true });
  }
};

/** Capture an email to a JSON file for E2E test verification */
export const captureEmail = ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  ensureDir();
  const filename = to.replaceAll(/[^a-zA-Z0-9@._-]/g, "_");
  const filepath = join(EMAIL_CAPTURE_DIR, `${filename}.json`);

  let existing: Record<string, { subject: string; html: string }> = {};
  if (existsSync(filepath)) {
    existing = JSON.parse(readFileSync(filepath, "utf8"));
  }

  existing[new Date().toISOString()] = { subject, html };
  writeFileSync(filepath, JSON.stringify(existing, null, 2));
};

/** Read captured emails for a recipient */
export const readCapturedEmails = (
  email: string
): Record<string, { subject: string; html: string }> => {
  ensureDir();
  const filename = email.replaceAll(/[^a-zA-Z0-9@._-]/g, "_");
  const filepath = join(EMAIL_CAPTURE_DIR, `${filename}.json`);

  if (!existsSync(filepath)) {
    return {};
  }
  return JSON.parse(readFileSync(filepath, "utf8"));
};

/** Clear all captured emails */
export const clearCapturedEmails = () => {
  ensureDir();
  for (const file of readdirSync(EMAIL_CAPTURE_DIR)) {
    unlinkSync(join(EMAIL_CAPTURE_DIR, file));
  }
};
