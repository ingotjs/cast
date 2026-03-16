# Start

> **Keyword Usage:** When writing or updating CLAUDE.md or other instructional files, use **MUST** and **NEVER** keywords to enforce critical requirements. These keywords signal mandatory behavior that AI agents MUST follow without exception.
>
> **Keep docs in sync:** If any information in this file is wrong or outdated, or if important new information should be captured, update this file. Also keep `README.md` up to date — this is a public project.
>
> **Prefer CLAUDE.md over memory:** Always save instructions and feedback in this file instead of the local memory system (`~/.claude/projects/.../memory/`). CLAUDE.md is committed to the repo and persists across machines. NEVER use the memory system.

Turborepo monorepo using bun as the package manager.

## Structure

- `apps/web` — TanStack Start app (Vite + TanStack Router + Nitro, deployed on Railway). Includes admin dashboard at `/admin` (role-guarded).
- `packages/server` — Server-side logic (`@packages/server`) — oRPC router, procedures, Drizzle + PGlite/PostgreSQL, Better Auth (with admin + passkey plugins)
- `packages/shared` — Shared utilities (`@packages/shared`) — error handling, common utils (client + server)
- `packages/email` — Email templates (`@packages/email`) — react-email + Resend
- `packages/ui` — Shared UI component library (`@packages/ui`) — shadcn v4 + Tailwind CSS + Base UI
- `packages/typescript-config` — Shared TS config (`@packages/typescript-config`)

## Internal Packages

We use **Just-in-Time Packages** — internal packages export raw TypeScript source (no build step). The consuming app transpiles them directly.

Reference: https://turborepo.dev/docs/core-concepts/internal-packages#just-in-time-packages

## Type Checking

We use [typescript-go](https://github.com/microsoft/typescript-go) (`tsgo`) for type checking via `@typescript/native-preview`. The regular `typescript` package is still installed for tooling compatibility.

## Linting & Formatting

We use [Ultracite](https://github.com/haydenbleasel/ultracite), a zero-config preset that enforces strict code quality through Oxlint + Oxfmt. Config files: `.oxlintrc.json` and `.oxfmtrc.jsonc`.

## Environment Variables

**NEVER use `process.env` or `import.meta.env` directly.** Enforced by `node/no-process-env` oxlint rule. Use the typed env objects instead:

- **Server env:** `import { serverEnv } from "@packages/server/env"` — for server-only vars (`DATABASE_URL`, `URL`, `NODE_ENV`)
- **Client env:** `import { env } from "@/lib/env"` — for `VITE_` prefixed client vars

The only files allowed to access `process.env` are the env definition files themselves (`**/env.ts`).

## Internationalization (i18n)

We use [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) for type-safe i18n. **All user-facing text (frontend and backend) MUST be internationalized** — never hardcode user-facing strings.

**i18n projects (separate concerns):**

- `apps/web/messages/` — frontend UI text
- `packages/server/messages/` — backend text (error messages, API responses)
- `packages/email/messages/` — email template text

**Languages:** Currently only English (`en`). When adding a new string for English, you MUST also add translations for all other languages listed in the `locales` array of each `project.inlang/settings.json`.

**Translations:** Do NOT use machine translation. Write translations manually with full project context — understand where and how the text is used before translating.

**Usage:** Import from the generated `paraglide/messages` in each package.

**Server-side i18n:** Paraglide's `overwriteGetLocale()` handles per-request locale on the server. Reference: https://inlang.com/m/gerre34r/library-inlang-paraglideJs/strategy#server-side

**Zod validation errors:**

- **Frontend:** Zod's built-in locale system (`z.config()`) — set on app init based on user's locale.
- **Backend:** Use paraglide message functions in Zod custom error messages (e.g., `z.string({ error: () => m.field_required() })`). These resolve per-request via paraglide's server runtime.

## Dependency Management

- All dependency versions MUST be pinned (no `^` or `~`). Enforced by [syncpack](https://syncpack.dev/) and `bunfig.toml` (`install.exact = true`).
- New packages won't install if published less than 3 days ago (`install.minimumReleaseAge` in `bunfig.toml`).
- [@socketsecurity/bun-security-scanner](https://www.npmjs.com/package/@socketsecurity/bun-security-scanner) is installed for supply chain security scanning (free tier). It checks for known vulnerabilities on `bun install`.

## Hosting

Deployed on [Railway](https://railway.com/). Reference: https://tanstack.com/start/latest/docs/framework/react/guide/hosting#railway--official-partner

## Commands

- `bun install` — Install dependencies
- `bun dev` — Run all apps in dev mode
- `bun dev:email` — Run email template preview (port 3002)
- `bun build` — Build all apps
- `bun ok` — Run all checks (type check + lint + tests). Use this to validate changes.
- `bun ok:ci` — Same as `bun ok` but without auto-fixes (for CI)

---

## Testing

- **Tests are REQUIRED.** MUST add tests when adding or modifying endpoints, server functions, utilities, or business logic.
- Test files colocated with source: `{name}.test.ts` as siblings or in `__tests__/` directory.
- Use `bun:test` for packages/server tests.
- After completing any task, verify test coverage for changed files:
  - Modified behavior — update affected tests
  - New functionality — add tests for it
  - Tests MUST catch regressions
- NEVER ship backend changes without test coverage.

## Quality Verification

- **ALWAYS run `bun ok` after finishing any task or when facing issues**
- A task is NOT complete until `bun ok` passes fully
- **`bun ok` MUST ALWAYS be run from the project root directory** — NEVER from subdirectories
- **ALWAYS use `bun ok`** for type checking and linting — NEVER use `bun ts`, `bun lint`, or `tsc` directly
- **NEVER run `tsc` or `tsgo` directly** — always use `bun ok`
- **NEVER run `bun build`** — use `bun ok` to validate types and linting

## General Rules

- **NEVER remove features, UI elements, or content unless explicitly asked.** If something is broken, FIX IT — NEVER delete or disable it.
- **NEVER use placeholder/dummy values when refactoring.** Every field MUST be properly computed. Hardcoding `0`, `null`, `""` is forbidden. If a field existed before, the new implementation MUST compute it correctly.
- When referring to code (files, functions, lines), MUST ALWAYS provide the reference in `file_path:line_number` format.
- NEVER try to run development servers — they should already be running and are not accessible to you. NEVER try to call API endpoints.
- **NEVER suggest restarting any server.** All services run in watch mode and automatically pick up code changes.
- NEVER undo changes or revert to previous code unless explicitly instructed.
- **If told to do something in a specific way, MUST do it that way.** NEVER substitute with workarounds or alternative approaches.
- When in doubt, ask for clarifications.
- NEVER use `setTimeout` or similar for delaying code execution. Use proper async/await patterns or event-driven approaches.
- NEVER use `sleep` commands — they are unnecessary and wasteful.
- NEVER add `timeout` to bash commands.
- NEVER run background tasks. Run everything directly.

## Git Workflow

- **NEVER commit or push code unless explicitly instructed.** Do not commit as part of a workflow (e.g., after fixing PR comments, after completing a task, after `bun ok`). Show what changed and wait for explicit instruction.
- When told to "commit", **MUST commit EVERYTHING** — all unstaged, staged, modified, and untracked files. Also push to the remote. **NEVER skip files or question what should be committed.** The instruction is absolute.
- When told to "commit staged only", commit ONLY what's already staged. Use `git commit --no-verify` to skip the pre-commit hook (which auto-stages formatting changes). Then push.
- Use a single chained command for committing: `git add -A && git commit -m "..." && git push`. No separate calls.
- **When reviewing changes for a commit message**, use `git diff HEAD --stat` for a quick summary. If you need to see actual code changes, filter out noise: `git diff HEAD -- '*.ts' '*.tsx' '*.json' ':!bun.lock'`. NEVER read the full unfiltered `git diff` — it's huge (especially `bun.lock`) and wastes time with chunked reads.
- When creating a new branch, MUST ALWAYS base it on `origin/main` (remote), not local `main`. Use `git fetch origin && git checkout -b <branch-name> origin/main`.
- When creating a branch, MUST immediately set tracking on first push with `git push -u origin <branch-name>`.
- MUST ALWAYS use `gh` CLI for GitHub operations (viewing PRs, checking CI status, etc.) — NEVER access GitHub URLs directly.
- When committing, MUST update `CLAUDE.md` (and `README.md` if relevant) to reflect the changes being committed — keep docs in sync with the code.

## Code Standards

Follow **Clean Code + SOLID + KISS + YAGNI**:

- **Clean Code**: Self-documenting, readable code with meaningful names and single responsibility
- **SOLID**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **KISS**: Simplest solution that solves the problem, avoid over-engineering
- **YAGNI**: Don't add functionality until actually needed

### TypeScript Conventions

- **NEVER use `any` type** — Use `unknown` if type is truly unknown
- **NEVER use `as any` assertions** — Find the proper type or use specific type assertions
- **NEVER use `interface`** — Always use `type` instead
- NEVER use `catch (error: any)` — leave it untyped so `unknown` is used by TS
- MUST reuse existing types — NEVER create duplicate types
- MUST prefer type-safe solutions. MUST use existing Zod schemas and types if they fit.
- Prefer optional chaining for callbacks: `onComplete?.(data)` instead of `if (onComplete) onComplete(data)`
- Add comments to properties of object types only if not self-explanatory (skip obvious ones like `className`)

### Import Conventions

- **NEVER use barrel files** — Barrel files (index.ts files that re-export everything) are forbidden
- **MUST ALWAYS import directly from source files** — Import from the actual file where the code is defined
- **NEVER use dynamic imports** — MUST use static `import` over `await import()`. Only use dynamic imports for genuine code splitting or conditional loading.

### Function Parameters

- Prefer object parameters over multiple direct parameters
- Example: `function foo({ name, age }: { name: string; age: number })` instead of `function foo(name: string, age: number)`

### Comments

- NEVER add comments explaining what changes you just made
- Only add comments for complex logic that isn't self-evident
- **MUST ALWAYS add reference links** when implementing code from documentation or external sources
  - Format: `// Reference: https://example.com/docs/feature`

### Console Logging (Debug)

- MUST ALWAYS stringify objects: `console.log('DEBUG:', JSON.stringify(data, null, 2))`
- MUST use a common keyword prefix (e.g., `DEBUG:`) for easy filtering and bulk copying
- **MUST ALWAYS clean up debug code** once the root cause is found

### React Conventions

- **Server Components by default** — Use `"use client"` directive only when needed
- **ALWAYS follow the Rules of Hooks** — Only call hooks at the top level, never inside loops/conditions/nested functions. Do not return early if there's a hook later.

#### CSS Flexbox — `min-w-0` Pattern

**Problem**: Flex items have `min-width: auto` by default, preventing them from shrinking below their content size. This breaks `truncate` on text elements.

**Pattern for truncating text in flex layouts**:

```tsx
<div className="flex min-w-0">
  <Icon className="flex-shrink-0" /> {/* Fixed elements: Prevent shrinking */}
  <span className="min-w-0 flex-1 truncate">
    {" "}
    {/* Text: Shrink + truncate */}
    Long text here...
  </span>
  <Button className="flex-shrink-0" /> {/* Fixed elements: Prevent shrinking */}
</div>
```

### Implementation Standards

- When asked to implement something, MUST implement it FULLY and completely
- NEVER add placeholder comments like "to be implemented later"
- If something cannot be completed, MUST explain why explicitly rather than leaving incomplete code
- **NEVER create documentation files** unless explicitly requested — the only exception is updating CLAUDE.md when architecture changes

### Debugging Mindset

- **NEVER assume the cause** — MUST add targeted debugging to see what's actually happening
- **MUST trace data flow backwards** — From error location, work backwards to see where data originates
- **MUST question "obvious" fixes** — If data should exist, find out why it doesn't
- **MUST try solutions before suggesting them** — Attempt fixes until things fully work
- **MUST ALWAYS clean up debug code** once the root cause is found

### Security

- Code MUST ALWAYS be safe. NEVER allow users to change other users' data when they shouldn't.
