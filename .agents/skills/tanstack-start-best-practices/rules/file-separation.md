# file-separation: Separate Server and Client Code

## Priority: LOW

## Explanation

Organize code by execution context to prevent server code from accidentally bundling into client builds. Use `.server.ts` for server-only code, `.functions.ts` for server function definitions, and standard `.ts` for shared code.

## Good Example: Clear Separation

```
lib/
├── posts.ts              # Shared types and utilities
├── posts.server.ts       # Server-only database logic
├── posts.functions.ts    # Server function definitions
└── schemas/
    └── post.ts           # Shared validation schemas
```

```tsx
// lib/posts.ts - Shared (safe to import anywhere)
export type Post = {
  id: string
  title: string
  content: string
  createdAt: Date
}

// lib/posts.server.ts - Server only (never import on client)
import { db } from './db'
import type { Post } from './posts'

export async function getPostsFromDb(): Promise<Post[]> {
  return db.posts.findMany({ orderBy: { createdAt: 'desc' } })
}

// lib/posts.functions.ts - Server functions (safe to import anywhere)
import { createServerFn } from '@tanstack/react-start'
import { getPostsFromDb } from './posts.server'

export const getPosts = createServerFn()
  .handler(async () => await getPostsFromDb())
```

## File Convention Summary

| Suffix | Purpose | Safe to Import on Client |
|--------|---------|-------------------------|
| `.ts` | Shared utilities, types | Yes |
| `.server.ts` | Server-only logic (db, secrets) | No |
| `.functions.ts` | Server function wrappers | Yes |
| `.client.ts` | Client-only code | Yes (client only) |

## Context

- `.server.ts` files should never be directly imported in client code
- Server functions in `.functions.ts` are safe - build replaces with RPC
- Types from `.server.ts` are safe if using `import type`
- This pattern enables tree-shaking and smaller client bundles
