#!/usr/bin/env bun

/**
 * CLI entry point for `bunx @ingot/cast`.
 *
 * - Prompt for project directory and app name
 * - Clone the Cast repo and strip meta files
 * - Replace app name across config files
 * - Hand off to `bun setup` for provisioning, deps, deploy
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { input } from "@inquirer/prompts";

const REPO = "ingotjs/cast";
const REPO_URL = `https://github.com/${REPO}.git`;

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

function clone(dest: string, dir: string) {
  console.log(`\nCloning ${REPO}...`);
  execSync(`git clone --depth 1 ${REPO_URL} ${dest}`, { stdio: "pipe" });
  rmSync(resolve(dir, ".git"), { recursive: true, force: true });

  // Remove meta/ — users don't need CLI or docs site
  rmSync(resolve(dir, "meta"), { recursive: true, force: true });

  // Remove meta/* from workspaces + deploy-site workflow
  const pkgPath = resolve(dir, "package.json");
  const pkg = readFileSync(pkgPath, "utf8");
  writeFileSync(pkgPath, pkg.replace(/,?\s*"meta\/\*"/, ""));
  rmSync(resolve(dir, ".github/workflows/deploy-site.yml"), { force: true });
}

function replaceAppName(dir: string, appName: string) {
  const files = [
    "packages/utils/shared/consts.ts",
    "apps/web/messages/en.json",
    "apps/web/public/manifest.json",
    "apps/web/public/llms.txt",
    "wrangler.jsonc",
    "packages/db/drizzle.config.ts",
    ".github/workflows/ci.yml",
  ];

  for (const file of files) {
    const path = resolve(dir, file);
    if (!existsSync(path)) continue;
    const content = readFileSync(path, "utf8");
    writeFileSync(path, content.replaceAll("Cast", appName).replaceAll("cast", appName.toLowerCase()));
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  let dest = process.argv[2];
  if (!dest) dest = await input({ message: "Project directory", default: "my-app" });

  const dir = resolve(process.cwd(), dest);
  if (existsSync(dir)) {
    console.error(`Directory "${dest}" already exists.`);
    process.exit(1);
  }

  const appName = await input({
    message: "App name",
    default: dest
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim(),
  });

  clone(dest, dir);
  replaceAppName(dir, appName);

  // Hand off to setup — provisions Cloudflare, installs deps, offers deploy
  execSync("bun setup", { cwd: dir, stdio: "inherit" });

  console.log("\nInitializing git...");
  execSync("git init && git add -A && git commit -m 'Initial commit'", { cwd: dir, stdio: "pipe" });

  console.log(`\n${appName} is ready. Run \`cd ${dest} && bun dev\` to start.\n`);
}

main();
