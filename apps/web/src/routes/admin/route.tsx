import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";

import { authClient } from "../../lib/auth-client";

const AdminLayout = () => (
  <div>
    <nav className="flex items-center gap-1 border-b border-border px-4 py-2">
      <span className="mr-4 text-lg font-semibold">Admin</span>
      <Link
        to="/admin"
        className="rounded-md px-3 py-1.5 text-sm transition hover:bg-muted"
        activeOptions={{ exact: true }}
        activeProps={{ className: "bg-muted font-medium" }}
      >
        Main
      </Link>
      <Link
        to="/admin/analytics"
        className="rounded-md px-3 py-1.5 text-sm transition hover:bg-muted"
        activeProps={{ className: "bg-muted font-medium" }}
      >
        Analytics
      </Link>
    </nav>
    <Outlet />
  </div>
);

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const session = await authClient.getSession();

    if (!session.data?.user) {
      throw redirect({ to: "/auth/$path", params: { path: "sign-in" } });
    }

    if ((session.data.user as { role?: string }).role !== "admin") {
      throw redirect({ to: "/" });
    }
  },
  component: AdminLayout,
});
