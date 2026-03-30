import { PostHog } from "posthog-node";

import { serverEnv } from "./env";

// Reference: https://posthog.com/docs/error-tracking/installation/node

/** PostHog server client — `undefined` when PostHog env vars are not set. */
export const posthog = serverEnv.posthog
  ? new PostHog(serverEnv.posthog.VITE_PUBLIC_POSTHOG_KEY, {
      host: serverEnv.posthog.VITE_PUBLIC_POSTHOG_HOST,
      enableExceptionAutocapture: true,
      // Prevent fetch failures from becoming unhandled rejections in dev (miniflare)
      disableGeoip: true,
    })
  : undefined;

posthog?.on("error", () => {});
