import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "../components/landing-page/landing-page";

export const Route = createFileRoute("/")({
  component: LandingPage,
});
