---
name: seo
description: SEO, Open Graph, LLMO, and structured data patterns — per-page meta tags, dynamic OG images, JSON-LD schemas, sitemap, robots.txt, and llms.txt. Use when creating new public routes, modifying meta tags, or working with SEO-related files.
---

# SEO, Open Graph & LLMO

**References:** [TanStack Start SEO guide](https://tanstack.com/start/latest/docs/framework/react/guide/seo) · [TanStack Start LLMO guide](https://tanstack.com/start/latest/docs/framework/react/guide/llmo)

## Core Setup

- `consts.siteUrl` in `packages/utils/src/shared/consts.ts` — **MUST update before deploying** (used in sitemap, robots.txt, JSON-LD)
- SSR enabled by default — crawlers receive fully rendered HTML
- Per-page `head()` on every public route — title, description, OG tags (i18n via Paraglide)
- Dynamic favicon at `/api/icon?theme=light|dark` — renders via `@vercel/og`, adapts to dark/light mode
- Dynamic OG image at `/api/og?title=...&description=...` — branded 1200×630 image, 1-hour cache

## Structured Data (JSON-LD)

- Root route (`__root.tsx`): `WebSite` + `Organization` schema using `consts.appName` / `consts.siteUrl`
- FAQ page (`/faq`): `FAQPage` schema with all Q&A pairs — highly effective for LLMO (AI systems extract Q&A pairs)

## SEO Files (all in `apps/web/public/`)

| File          | Purpose                                                                |
| :------------ | :--------------------------------------------------------------------- |
| `robots.txt`  | Allows all crawlers, disallows `/admin`, `/account`, `/auth/`, `/api/` |
| `sitemap.xml` | Static sitemap for all public pages                                    |
| `llms.txt`    | Machine-readable project summary for AI systems (LLMO)                 |

## Per-Page SEO Pattern (MUST follow for all new public routes)

```tsx
import { seoMeta } from "../lib/seo";
import { m } from "../paraglide/messages";

export const Route = createFileRoute("/my-page")({
  head: () => ({
    meta: [
      ...seoMeta({
        title: m.meta_mypage_title(),
        description: m.meta_mypage_description(),
      }),
    ],
  }),
  component: MyPage,
});
```

## Adding a New Public Page (SEO Checklist)

1. Create route with `head()` containing title, description, and OG meta tags (i18n)
2. Add i18n keys to `apps/web/messages/en.json` (pattern: `meta_{page}_title`, `meta_{page}_description`)
3. Add page to `apps/web/public/sitemap.xml`
4. Add page to `apps/web/public/llms.txt`
5. If FAQ-like content, add `FAQPage` JSON-LD schema in `head().scripts`
6. Add link in footer nav (`apps/web/src/components/footer.tsx`)
7. Regenerate paraglide: `cd apps/web && npx @inlang/paraglide-js compile --project ./project.inlang --outdir ./src/paraglide`

## i18n for Meta Tags

All meta tag values MUST use Paraglide message functions (e.g., `m.meta_home_title()`). Keys are in `apps/web/messages/en.json`.

## Key Files

| File | Purpose |
|:-----|:--------|
| `apps/web/src/lib/seo.ts` | `seoMeta()` — generates OG + Twitter + meta tags from title/desc |
| `apps/web/src/routes/api/icon.tsx` | Dynamic favicon (dark mode) |
| `apps/web/src/routes/api/og.tsx` | Dynamic OG image |
| `apps/web/src/routes/__root.tsx` | WebSite + Organization JSON-LD |
