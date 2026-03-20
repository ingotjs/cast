// Re-export the Better Auth schema.
// auth-schema.ts is generated via `bun db:auth` (Better Auth CLI).
// Add custom (non-auth) tables below.

// oxlint-disable-next-line no-barrel-file -- intentional re-export of generated auth schema
export * from "./auth";
