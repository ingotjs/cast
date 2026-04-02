import { Toaster } from "@ingot/ui/components/sonner";
import { consts } from "@ingot/utils/consts";
import { msg } from "@lingui/core/macro";
import { I18nProvider } from "@lingui/react";
import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Suspense, lazy, useEffect, useState } from "react";

import { AuthModalProvider } from "../components/auth/auth-modal";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Providers } from "../components/providers";
import { clientEnv } from "../lib/env";
import type { RouterContext } from "../lib/i18n";

const ProspectOverlay = import.meta.env.DEV
  ? lazy(async () => {
      const [{ CoverageOverlay }, { routes }] = await Promise.all([
        import("@ingot/prospect/overlay"),
        import("@ingot/e2e-coverage"),
      ]);
      return { default: () => <CoverageOverlay coverage={routes} /> };
    })
  : () => null;

const { appName } = consts;

import appCss from "../styles.css?url";

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=(stored==='light'||stored==='dark')?stored:(prefersDark?'dark':'light');var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);root.setAttribute('data-theme',resolved);root.style.colorScheme=resolved;}catch(e){}})();`;

const ogTitle = msg`${appName}`;
const ogDescription = msg`The modern full-stack starter`;

const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? children : null;
};

const AppContent = ({ children }: { children: React.ReactNode }) => (
  <>
    <AuthModalProvider>
      <div className="flex min-h-dvh flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </AuthModalProvider>
    <TanStackDevtools
      config={{ position: "bottom-right" }}
      plugins={[
        {
          name: "Tanstack Router",
          render: <TanStackRouterDevtoolsPanel />,
        },
      ]}
    />
    {import.meta.env.DEV && (
      <ClientOnly>
        <Suspense>
          <ProspectOverlay />
        </Suspense>
      </ClientOnly>
    )}
  </>
);

const RootDocument = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = Route.useRouteContext();

  return (
    <html lang={i18n.locale} suppressHydrationWarning>
      <head>
        {/* oxlint-disable-next-line react/no-danger -- Inline theme init script to prevent FOUC */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <I18nProvider i18n={i18n}>
          <Providers>
            {clientEnv.posthog ? (
              <PostHogProvider
                apiKey={clientEnv.posthog.VITE_PUBLIC_POSTHOG_KEY}
                options={{
                  api_host: "/api/ph",
                  ui_host: clientEnv.posthog.VITE_PUBLIC_POSTHOG_HOST,
                  defaults: "2026-01-30",
                  capture_exceptions: true,
                }}
              >
                <PostHogErrorBoundary>
                  <AppContent>{children}</AppContent>
                </PostHogErrorBoundary>
              </PostHogProvider>
            ) : (
              <AppContent>{children}</AppContent>
            )}
            <Toaster />
          </Providers>
        </I18nProvider>
        <Scripts />
      </body>
    </html>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  head: (ctx) => {
    const { i18n } = ctx.match.context;
    return {
      meta: [
        { charSet: "utf8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: i18n._(ogTitle.id, { appName }) },
        { name: "description", content: i18n._(ogDescription.id) },
        { property: "og:title", content: i18n._(ogTitle.id, { appName }) },
        { property: "og:description", content: i18n._(ogDescription.id) },
        { property: "og:image", content: "/api/og" },
        { property: "og:type", content: "website" },
        { property: "og:url", content: consts.siteUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: i18n._(ogTitle.id, { appName }) },
        { name: "twitter:description", content: i18n._(ogDescription.id) },
        { name: "twitter:image", content: "/api/og" },
      ],
      links: [
        {
          rel: "icon",
          href: "/api/icon?theme=light",
          media: "(prefers-color-scheme: light)",
        },
        {
          rel: "icon",
          href: "/api/icon?theme=dark",
          media: "(prefers-color-scheme: dark)",
        },
        { rel: "stylesheet", href: appCss },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: consts.appName,
            url: consts.siteUrl,
            publisher: {
              "@type": "Organization",
              name: consts.appName,
              url: consts.siteUrl,
            },
          }),
        },
      ],
    };
  },
  shellComponent: RootDocument,
});
