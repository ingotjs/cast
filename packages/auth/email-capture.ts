// Email capture for E2E test verification — dev/test only.
// Uses node:fs which is not available in Cloudflare Workers.
// Dynamic imports ensure fs/path are only loaded in dev.

// oxlint-disable-next-line node/no-process-env -- email capture needs to check environment
const isDev = process.env.NODE_ENV !== "production";

const DIR_SUFFIX = "../../.email-captures";

/** Capture an email to a JSON file for E2E test verification */
export const captureEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  if (!isDev) {
    return;
  }

  const fs = await import("node:fs");
  const path = await import("node:path");
  const dir = path.join(import.meta.dirname, DIR_SUFFIX);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filename = to.replaceAll(/[^a-zA-Z0-9@._-]/g, "_");
  const filepath = path.join(dir, `${filename}.json`);

  let existing: Record<string, { subject: string; html: string }> = {};
  if (fs.existsSync(filepath)) {
    existing = JSON.parse(fs.readFileSync(filepath, "utf8"));
  }

  existing[new Date().toISOString()] = { subject, html };
  fs.writeFileSync(filepath, JSON.stringify(existing, null, 2));
};

/** Read captured emails for a recipient */
export const readCapturedEmails = async (
  email: string
): Promise<Record<string, { subject: string; html: string }>> => {
  if (!isDev) {
    return {};
  }

  const fs = await import("node:fs");
  const path = await import("node:path");
  const dir = path.join(import.meta.dirname, DIR_SUFFIX);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filename = email.replaceAll(/[^a-zA-Z0-9@._-]/g, "_");
  const filepath = path.join(dir, `${filename}.json`);

  if (!fs.existsSync(filepath)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(filepath, "utf8"));
};

/** Clear all captured emails */
export const clearCapturedEmails = async () => {
  if (!isDev) {
    return;
  }

  const fs = await import("node:fs");
  const path = await import("node:path");
  const dir = path.join(import.meta.dirname, DIR_SUFFIX);

  if (!fs.existsSync(dir)) {
    return;
  }

  for (const file of fs.readdirSync(dir)) {
    fs.unlinkSync(path.join(dir, file));
  }
};
