import { createFileRoute } from "@tanstack/react-router";

const Analytics = () => (
  <div className="flex min-h-[calc(100vh-49px)] items-center justify-center">
    <p className="text-muted-foreground">
      PostHog analytics dashboard will be embedded here.
    </p>
  </div>
);

export const Route = createFileRoute("/analytics")({
  component: Analytics,
});
