import { consts } from "@ingot/utils/consts";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { createFileRoute } from "@tanstack/react-router";

import { seoMeta } from "../lib/seo";

const { appName } = consts;

const metaAboutTitle = msg`About — ${appName}`;
const metaAboutDescription = msg`Learn about ${appName}, the full-stack TypeScript starter built on TanStack Start, Bun, and Turborepo.`;

const About = () => (
  <main className="page-wrap px-4 py-12">
    <section className="island-shell rounded-2xl p-6 sm:p-8">
      <p className="island-kicker mb-2">
        <Trans>About</Trans>
      </p>
      <h1 className="display-title mb-3 font-bold text-4xl text-[var(--sea-ink)] sm:text-5xl">
        <Trans>A small starter with room to grow.</Trans>
      </h1>
      <p className="m-0 max-w-3xl text-[var(--sea-ink-soft)] text-base leading-8">
        <Trans>
          TanStack Start gives you type-safe routing, server functions, and modern SSR defaults. Use this as a clean
          foundation, then layer in your own routes, styling, and add-ons.
        </Trans>
      </p>
    </section>
  </main>
);

export const Route = createFileRoute("/about")({
  head: (ctx) => ({
    meta: [
      ...seoMeta({
        title: ctx.match.context.i18n._(metaAboutTitle.id, { appName }),
        description: ctx.match.context.i18n._(metaAboutDescription.id, { appName }),
      }),
    ],
  }),
  component: About,
});
