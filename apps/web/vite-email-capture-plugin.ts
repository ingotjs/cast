// Dev-only Vite plugin: email capture endpoint for E2E tests.
// Workers (miniflare) can't write to the host filesystem via node:fs,
// so captureEmail() POSTs to this endpoint which runs in Node.js.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import type { PluginOption } from "vite-plus";

const CAPTURE_DIR = resolve(import.meta.dirname, "../../packages/email/.email-captures");

export function emailCapturePlugin(): PluginOption {
  return {
    name: "email-capture",
    configureServer(server) {
      server.middlewares.use("/__email-capture", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end();
          return;
        }

        let body = "";
        req.on("data", (chunk: Buffer) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const { to, subject, html } = JSON.parse(body);
            if (!existsSync(CAPTURE_DIR)) {
              mkdirSync(CAPTURE_DIR, { recursive: true });
            }

            const filename = to.replaceAll(/[^a-zA-Z0-9@._-]/g, "_");
            const filepath = join(CAPTURE_DIR, `${filename}.json`);

            let existing: Record<string, { subject: string; html: string }> = {};
            if (existsSync(filepath)) {
              existing = JSON.parse(readFileSync(filepath, "utf8"));
            }

            existing[new Date().toISOString()] = { subject, html };
            writeFileSync(filepath, JSON.stringify(existing, null, 2));

            res.statusCode = 200;
            res.end("ok");
          } catch {
            res.statusCode = 500;
            res.end("error");
          }
        });
      });
    },
  };
}
