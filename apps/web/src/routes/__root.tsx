import { consts } from "@packages/shared/consts";
import { Toaster } from "@packages/ui/components/sonner";
import { PostHogProvider } from "@posthog/react";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Providers } from "../components/providers";
import { clientEnv } from "../lib/env";
import * as m from "../paraglide/messages";

import appCss from "../styles.css?url";

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

const AppContent = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    {children}
    <Footer />
    <TanStackDevtools
      config={{ position: "bottom-right" }}
      plugins={[
        {
          name: "Tanstack Router",
          render: <TanStackRouterDevtoolsPanel />,
        },
      ]}
    />
  </>
);

const RootDocument = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" suppressHydrationWarning>
    <head>
      {/* oxlint-disable-next-line react/no-danger -- Inline theme init script to prevent FOUC */}
      <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      <HeadContent />
    </head>
    <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
      <Providers>
        {clientEnv.posthog ? (
          <PostHogProvider
            apiKey={clientEnv.posthog.VITE_PUBLIC_POSTHOG_KEY}
            options={{
              api_host: clientEnv.posthog.VITE_PUBLIC_POSTHOG_HOST,
              defaults: "2026-01-30",
            }}
          >
            <AppContent>{children}</AppContent>
          </PostHogProvider>
        ) : (
          <AppContent>{children}</AppContent>
        )}
        <Toaster />
      </Providers>
      <Scripts />
    </body>
  </html>
);

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: m.og_title() },
      { name: "description", content: m.og_description() },
      { property: "og:title", content: m.og_title() },
      { property: "og:description", content: m.og_description() },
      { property: "og:image", content: "/api/og" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
  }),
  shellComponent: RootDocument,
});
