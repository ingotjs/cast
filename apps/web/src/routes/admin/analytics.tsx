import { createFileRoute } from "@tanstack/react-router";

const AdminAnalytics = () => (
  <div className="flex min-h-[calc(100vh-97px)] items-center justify-center">
    <p className="text-muted-foreground">PostHog analytics dashboard will be embedded here.</p>
  </div>
);

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalytics,
});
