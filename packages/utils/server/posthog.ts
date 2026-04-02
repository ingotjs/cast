import { PostHog } from "posthog-node";

import { isDevelopment, serverEnv } from "./env";

// Reference: https://posthog.com/docs/error-tracking/installation/node

/** PostHog server client — `undefined` when PostHog env vars are not set. */
export const posthog = serverEnv.posthog
  ? new PostHog(serverEnv.posthog.VITE_PUBLIC_POSTHOG_KEY, {
      host: serverEnv.posthog.VITE_PUBLIC_POSTHOG_HOST,
      enableExceptionAutocapture: true,
      disabled: isDevelopment,
    })
  : undefined;
