import { consts } from "@ingot/utils/consts";
import { msg } from "@lingui/core/macro";
import { createFileRoute } from "@tanstack/react-router";

import { Cta } from "../components/landing/cta";
import { Faq } from "../components/landing/faq";
import { Features } from "../components/landing/features";
import { Hero } from "../components/landing/hero";
import { Logos } from "../components/landing/logos";
import { Testimonials } from "../components/landing/testimonials";
import { seoMeta } from "../lib/seo";

const { appName } = consts;

const metaHomeTitle = msg`${appName} — The Modern Full-Stack Starter`;
const metaHomeDescription = msg`Ship production TypeScript apps in minutes. Auth, API, database, email, i18n, and deployment — all wired up and ready.`;

const App = () => (
  <main>
    <Hero />
    <Logos />
    <Features />
    <Testimonials />
    <Faq />
    <Cta />
  </main>
);

export const Route = createFileRoute("/")({
  head: (ctx) => ({
    meta: [
      ...seoMeta({
        title: ctx.match.context.i18n._(metaHomeTitle.id, { appName }),
        description: ctx.match.context.i18n._(metaHomeDescription.id),
      }),
    ],
  }),
  component: App,
});
