# Start

> **Keep docs in sync:** If any information in this file is wrong or outdated, or if important new information should be captured, update this file. Also keep `README.md` up to date — this is a public project.
>
> **Prefer CLAUDE.md over memory:** Always save instructions and feedback in this file instead of the local memory system (`~/.claude/projects/.../memory/`). CLAUDE.md is committed to the repo and persists across machines.

Turborepo monorepo using bun as the package manager.

## Structure

- `apps/web` — TanStack Start app (Vite + TanStack Router + Nitro, deployed on Railway)
- `packages/ui` — Shared UI component library (`@repo/ui`) — shadcn v4 + Tailwind CSS + Base UI
- `packages/typescript-config` — Shared TS config (`@repo/typescript-config`)

## Internal Packages

We use **Just-in-Time Packages** — internal packages export raw TypeScript source (no build step). The consuming app transpiles them directly.

Reference: https://turborepo.dev/docs/core-concepts/internal-packages#just-in-time-packages

## Type Checking

We use [typescript-go](https://github.com/microsoft/typescript-go) (`tsgo`) for type checking via `@typescript/native-preview`. The regular `typescript` package is still installed for tooling compatibility (Next.js, etc).

## Linting & Formatting

We use [Ultracite](https://github.com/haydenbleasel/ultracite), a zero-config preset that enforces strict code quality through Oxlint + Oxfmt. Config files: `.oxlintrc.json` and `.oxfmtrc.jsonc`.

## Dependency Management

- All dependency versions MUST be pinned (no `^` or `~`). Enforced by [syncpack](https://syncpack.dev/) and `bunfig.toml` (`install.exact = true`).
- New packages won't install if published less than 3 days ago (`install.minimumReleaseAge` in `bunfig.toml`).
- [@socketsecurity/bun-security-scanner](https://www.npmjs.com/package/@socketsecurity/bun-security-scanner) is installed for supply chain security scanning (free tier). It checks for known vulnerabilities on `bun install`.

## Hosting

Deployed on [Railway](https://railway.com/). Reference: https://tanstack.com/start/latest/docs/framework/react/guide/hosting#railway--official-partner

## Commands

- `bun install` — Install dependencies
- `turbo dev` — Run all apps in dev mode
- `turbo build` — Build all apps
- `bun ok` — Run all checks (type check + lint). Use this to validate changes.

---

## Quality Verification

- **ALWAYS run `bun ok` after finishing any task or when facing issues**
- A task is NOT complete until `bun ok` passes fully
- **`bun ok` MUST ALWAYS be run from the project root directory** — NEVER from subdirectories
- **ALWAYS use `bun ok`** for type checking and linting — never use `bun ts`, `bun lint`, or `tsc` directly
- **NEVER run `tsc` or `tsgo` directly** — always use `bun ok`
- **NEVER run `bun build`** — use `bun ok` to validate types and linting

## General Rules

- **NEVER remove features, UI elements, or content unless explicitly asked.** If something is broken, FIX IT — never delete or disable it.
- **NEVER use placeholder/dummy values when refactoring.** Every field MUST be properly computed. Hardcoding `0`, `null`, `""` is forbidden. If a field existed before, the new implementation MUST compute it correctly.
- When referring to code (files, functions, lines), ALWAYS provide the reference in `file_path:line_number` format.
- Do not try to run development servers — they should already be running and are not accessible to you. Do not try to call API endpoints.
- **NEVER suggest restarting any server.** All services run in watch mode and automatically pick up code changes.
- Do not undo changes or revert to previous code unless explicitly instructed.
- **If told to do something in a specific way, do it that way.** Do not substitute with workarounds or alternative approaches.
- When in doubt, ask for clarifications.
- NEVER use `setTimeout` or similar for delaying code execution. Use proper async/await patterns or event-driven approaches.
- NEVER use `sleep` commands — they are unnecessary and wasteful.
- NEVER add `timeout` to bash commands.
- NEVER run background tasks. Run everything directly.

## Git Workflow

- **NEVER commit or push code unless explicitly instructed.** Do not commit as part of a workflow (e.g., after fixing PR comments, after completing a task, after `bun ok`). Show what changed and wait for explicit instruction.
- When told to "commit", **MUST commit EVERYTHING** — all unstaged, staged, modified, and untracked files. Also push to the remote. **NEVER skip files or question what should be committed.** The instruction is absolute.
- Use a single chained command for committing: `git add -A && git commit -m "..." && git push`. No separate calls.
- When creating a new branch, ALWAYS base it on `origin/main` (remote), not local `main`. Use `git fetch origin && git checkout -b <branch-name> origin/main`.
- When creating a branch, immediately set tracking on first push with `git push -u origin <branch-name>`.
- Always use `gh` CLI for GitHub operations (viewing PRs, checking CI status, etc.) instead of accessing GitHub URLs directly.

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
- Do not use `catch (error: any)` — leave it untyped so `unknown` is used by TS
- Reuse existing types — don't create duplicate types
- Prefer type-safe solutions. Prefer using existing Zod schemas and types if they fit.
- Prefer optional chaining for callbacks: `onComplete?.(data)` instead of `if (onComplete) onComplete(data)`
- Add comments to properties of object types only if not self-explanatory (skip obvious ones like `className`)

### Import Conventions

- **NEVER use barrel files** — Barrel files (index.ts files that re-export everything) are forbidden
- **Always import directly from source files** — Import from the actual file where the code is defined
- **Avoid dynamic imports** — Prefer static `import` over `await import()`. Only use dynamic imports for genuine code splitting or conditional loading.

### Function Parameters

- Prefer object parameters over multiple direct parameters
- Example: `function foo({ name, age }: { name: string; age: number })` instead of `function foo(name: string, age: number)`

### Comments

- Do NOT add comments explaining what changes you just made
- Only add comments for complex logic that isn't self-evident
- **Always add reference links** when implementing code from documentation or external sources
  - Format: `// Reference: https://example.com/docs/feature`

### Console Logging (Debug)

- Always stringify objects: `console.log('DEBUG:', JSON.stringify(data, null, 2))`
- Use a common keyword prefix (e.g., `DEBUG:`) for easy filtering and bulk copying
- **Always clean up debug code** once the root cause is found

### React Conventions

- **Server Components by default** — Use `"use client"` directive only when needed
- **ALWAYS follow the Rules of Hooks** — Only call hooks at the top level, never inside loops/conditions/nested functions. Do not return early if there's a hook later.

#### CSS Flexbox — `min-w-0` Pattern

**Problem**: Flex items have `min-width: auto` by default, preventing them from shrinking below their content size. This breaks `truncate` on text elements.

**Pattern for truncating text in flex layouts**:
```tsx
<div className="flex min-w-0">                    // Parent: Allow shrinking
  <Icon className="flex-shrink-0" />              // Fixed elements: Prevent shrinking
  <span className="min-w-0 flex-1 truncate">     // Text: Shrink + truncate
    Long text here...
  </span>
  <Button className="flex-shrink-0" />           // Fixed elements: Prevent shrinking
</div>
```

### Implementation Standards

- When asked to implement something, implement it FULLY and completely
- NEVER add placeholder comments like "to be implemented later"
- If something cannot be completed, explain why explicitly rather than leaving incomplete code
- **NEVER create documentation files** unless explicitly requested — the only exception is updating CLAUDE.md when architecture changes

### Debugging Mindset

- **Don't assume the cause** — Add targeted debugging to see what's actually happening
- **Trace data flow backwards** — From error location, work backwards to see where data originates
- **Question "obvious" fixes** — If data should exist, find out why it doesn't
- **Try solutions before suggesting them** — Attempt fixes until things fully work
- **Always clean up debug code** once the root cause is found

### Security

- Code MUST always be safe. NEVER allow users to change other users' data when they shouldn't.
