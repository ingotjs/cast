// Email capture for E2E test verification — dev/test only.
//
// In Workers (miniflare), node:fs writes to a virtual filesystem — not the host disk.
// So captureEmail() POSTs to the Vite dev server's /__email-capture endpoint (see
// apps/web/vite-email-capture-plugin.ts) which runs in Node.js and writes to disk.
// For unit tests (bun test), the Vite server isn't running, so we fall back to node:fs.

// oxlint-disable-next-line node/no-process-env -- email capture needs to check environment
const isDev = process.env.NODE_ENV !== "production";

// oxlint-disable-next-line -- dev-only import for email capture endpoint
import { DEV_URL } from "@ingot/utils/consts";

const CAPTURE_ENDPOINT = `${DEV_URL}/__email-capture`;
const DIR_SUFFIX = ".email-captures";

/** Capture an email to a JSON file for E2E test verification */
export const captureEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  if (!isDev) {
    return;
  }

  try {
    // Post to the Vite dev server endpoint (works from miniflare)
    await fetch(CAPTURE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, html }),
    });
  } catch {
    // Fallback to node:fs for unit tests where the Vite server isn't running
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
  }
};

/** Read captured emails for a recipient */
export const readCapturedEmails = async (email: string): Promise<Record<string, { subject: string; html: string }>> => {
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
