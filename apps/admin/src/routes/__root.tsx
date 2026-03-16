import {
  createRootRoute,
  HeadContent,
  Link,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

const RootDocument = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <head>
      <HeadContent />
    </head>
    <body className="min-h-screen bg-background font-sans text-foreground antialiased">
      <header className="border-b border-border">
        <nav className="flex items-center gap-1 px-4 py-2">
          <span className="mr-4 text-lg font-semibold">Admin</span>
          <Link
            to="/"
            className="rounded-md px-3 py-1.5 text-sm transition hover:bg-muted"
            activeProps={{ className: "bg-muted font-medium" }}
          >
            Main
          </Link>
          <Link
            to="/analytics"
            className="rounded-md px-3 py-1.5 text-sm transition hover:bg-muted"
            activeProps={{ className: "bg-muted font-medium" }}
          >
            Analytics
          </Link>
        </nav>
      </header>
      {children}
      <Scripts />
    </body>
  </html>
);

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Admin Dashboard" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
});
