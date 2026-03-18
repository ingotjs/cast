# deploy-adapters: Choose Appropriate Deployment Adapter

## Priority: LOW

## Explanation

TanStack Start uses deployment adapters to target different hosting platforms. Each adapter optimizes the build output for its platform's runtime.

## Adapter Comparison

| Adapter | Runtime | Edge | Static | Best For |
|---------|---------|------|--------|----------|
| `vercel` | Node/Edge | Yes | Yes | Vercel hosting |
| `cloudflare-pages` | Workers | Yes | Yes | Cloudflare Pages |
| `cloudflare` | Workers | Yes | No | Cloudflare Workers |
| `netlify` | Node | Yes | Yes | Netlify hosting |
| `node-server` | Node | No | No | Docker, VPS, self-host |
| `static` | None | No | Yes | Any static host |
| `aws-lambda` | Node | No | No | AWS serverless |
| `bun` | Bun | No | No | Bun runtime |

## Good Example: Cloudflare Workers

```tsx
// app.config.ts
import { defineConfig } from '@tanstack/react-start/config'

export default defineConfig({
  server: {
    preset: 'cloudflare',
  },
})
```

## Context

- Adapters transform output for target platform
- Edge adapters have API limitations (no file system, etc.)
- Static preset requires all routes to be prerenderable
- Test locally with `npm run build && npm run preview`
- Some platforms auto-detect TanStack Start (no adapter needed)
