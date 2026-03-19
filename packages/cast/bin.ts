#!/usr/bin/env bun

import { execSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { confirm, input } from "@inquirer/prompts";

const REPO = "ingotjs/cast";
const REPO_URL = `https://github.com/${REPO}.git`;

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------

let dest = process.argv[2];

if (!dest) {
  dest = await input({ message: "Project directory", default: "my-app" });
}

const dir = resolve(process.cwd(), dest);

if (existsSync(dir)) {
  console.error(`Directory "${dest}" already exists.`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Prompts
// ---------------------------------------------------------------------------

const appName = await input({
  message: "App name",
  default: dest
    .replace(/[^a-zA-Z0-9]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim(),
});

const enablePasskeys = await confirm({ message: "Enable passkeys (WebAuthn)?", default: true });
const enableWelcomeEmail = await confirm({ message: "Send welcome email on sign-up?", default: true });

// ---------------------------------------------------------------------------
// Clone
// ---------------------------------------------------------------------------

console.log(`\nCloning ${REPO}...`);
execSync(`git clone --depth 1 ${REPO_URL} ${dest}`, { stdio: "pipe" });
rmSync(resolve(dir, ".git"), { recursive: true, force: true });

// Remove the cast CLI package itself — users don't need it
rmSync(resolve(dir, "packages/cast"), { recursive: true, force: true });

// ---------------------------------------------------------------------------
// Replace app name
// ---------------------------------------------------------------------------

const filesToReplace = [
  "packages/utils/shared/consts.ts",
  "apps/web/messages/en.json",
  "apps/web/public/manifest.json",
  "apps/web/public/llms.txt",
  "packages/infra/alchemy.run.ts",
  "packages/db/drizzle.config.ts",
  ".github/workflows/ci.yml",
];

for (const file of filesToReplace) {
  const path = resolve(dir, file);
  if (!existsSync(path)) continue;
  const content = readFileSync(path, "utf8");
  writeFileSync(path, content.replaceAll("Cast", appName).replaceAll("cast", appName.toLowerCase()));
}

// ---------------------------------------------------------------------------
// Toggle features
// ---------------------------------------------------------------------------

const constsPath = resolve(dir, "packages/utils/shared/consts.ts");
if (existsSync(constsPath)) {
  let consts = readFileSync(constsPath, "utf8");
  if (!enablePasskeys) {
    consts = consts.replace("passkey: true", "passkey: false");
  }
  if (!enableWelcomeEmail) {
    consts = consts.replace("welcomeEmail: true", "welcomeEmail: false");
  }
  writeFileSync(constsPath, consts);
}

// ---------------------------------------------------------------------------
// Install & init
// ---------------------------------------------------------------------------

console.log("\nInstalling dependencies...");
execSync("bun install", { cwd: dir, stdio: "inherit" });

console.log("\nInitializing git...");
execSync("git init && git add -A && git commit -m 'Initial commit'", {
  cwd: dir,
  stdio: "pipe",
});

console.log(`
Done! Your ${appName} project is ready.

  cd ${dest}
  bun dev
`);
