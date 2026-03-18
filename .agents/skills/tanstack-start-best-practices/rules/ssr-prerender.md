# ssr-prerender: Configure Static Prerendering and ISR

## Priority: MEDIUM

## Explanation

Static prerendering generates HTML at build time. Incremental Static Regeneration (ISR) revalidates on a schedule. Use these for content that doesn't change per-request to reduce server load and improve performance.

## Good Example: ISR with Cache-Control

```tsx
export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await getPost(params.slug)
    if (!post) throw notFound()
    return post
  },
  headers: () => ({
    // Serve cached for 60s, revalidate in background for 5 min
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
  }),
})
```

## Good Example: Hybrid Strategy

```tsx
// Static pages — prerender at build time
// Product listings — ISR with 5-minute cache
// User-specific pages (cart, account) — SSR with no-store
```

## Cache-Control Reference

| Directive | Effect |
|-----------|--------|
| `s-maxage` | CDN cache duration |
| `stale-while-revalidate` | Serve stale while refreshing |
| `private` | No CDN caching (user-specific) |
| `no-store` | No caching at all |

## Context

- Static prerendering executes loaders at build time
- ISR is controlled via Cache-Control headers
- User-specific content should never be cached publicly
- On-demand revalidation via API endpoints for immediate updates
