import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline";

// ---------------------------------------------------------------------------
// Constants & paths
// ---------------------------------------------------------------------------

const ROOT = resolve(import.meta.dirname, "../..");
export const ENV_PATH = resolve(ROOT, ".env");
export const WRANGLER_CONFIG = resolve(ROOT, "wrangler.jsonc");

// ---------------------------------------------------------------------------
// ANSI formatting
// ---------------------------------------------------------------------------

export const bold = (s: string) => `\u001B[1m${s}\u001B[0m`;
export const dim = (s: string) => `\u001B[2m${s}\u001B[0m`;
export const green = (s: string) => `\u001B[32m${s}\u001B[0m`;
export const yellow = (s: string) => `\u001B[33m${s}\u001B[0m`;

// ---------------------------------------------------------------------------
// Prompt helpers
// ---------------------------------------------------------------------------

export const askYesNo = async (question: string, defaultYes = true): Promise<boolean> => {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const hint = defaultYes ? "[Y/n]" : "[y/N]";
  return new Promise((resolve) => {
    rl.question(`${question} ${hint} `, (answer) => {
      rl.close();
      const trimmed = answer.trim().toLowerCase();
      resolve(trimmed === "" ? defaultYes : trimmed === "y" || trimmed === "yes");
    });
  });
};

// ---------------------------------------------------------------------------
// Shell helpers
// ---------------------------------------------------------------------------

export const run = (cmd: string, opts?: { cwd?: string; silent?: boolean }) => {
  try {
    return execSync(cmd, {
      cwd: opts?.cwd ?? ROOT,
      stdio: opts?.silent ? "pipe" : "inherit",
      encoding: "utf8",
    });
  } catch {
    return null;
  }
};

export const runJson = <T>(cmd: string): T | null => {
  const out = run(cmd, { silent: true });
  if (!out) {
    return null;
  }
  try {
    return JSON.parse(out) as T;
  } catch {
    return null;
  }
};

// ---------------------------------------------------------------------------
// File helpers
// ---------------------------------------------------------------------------

export const parseEnvFile = (content: string): Map<string, string> => {
  const vars = new Map<string, string>();
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) {
      continue;
    }
    vars.set(trimmed.slice(0, eqIndex), trimmed.slice(eqIndex + 1));
  }
  return vars;
};

export const readWranglerConfig = () => {
  const raw = readFileSync(WRANGLER_CONFIG, "utf8");
  const stripped = raw.replaceAll(/\/\/.*$/gm, "").replaceAll(/\/\*[\s\S]*?\*\//g, "");
  return JSON.parse(stripped);
};

export const updateWranglerField = (field: string, value: string) => {
  let content = readFileSync(WRANGLER_CONFIG, "utf8");
  const pattern = new RegExp(`("${field}":\\s*)"[^"]*"`, "g");
  content = content.replace(pattern, `$1"${value}"`);
  writeFileSync(WRANGLER_CONFIG, content);
};

export const isPlaceholder = (v: string) => !v || v === "NOT_SET";
