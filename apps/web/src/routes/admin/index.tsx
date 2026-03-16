import { createFileRoute } from "@tanstack/react-router";

const AdminDashboard = () => (
  <div className="flex min-h-[calc(100vh-97px)]">
    <aside className="w-56 border-r border-border p-4">
      <nav className="flex flex-col gap-1">
        <span className="rounded-md bg-muted px-3 py-1.5 text-sm font-medium">
          Users
        </span>
      </nav>
    </aside>
    <main className="flex-1 p-6">
      <h1 className="mb-4 text-2xl font-bold">User Management</h1>
      <p className="text-muted-foreground">User management coming soon.</p>
    </main>
  </div>
);

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});
