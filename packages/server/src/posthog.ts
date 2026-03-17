import { PostHog } from "posthog-node";

import { serverEnv } from "./env";

// Reference: https://posthog.com/docs/error-tracking/installation/node

/** PostHog server client — `undefined` when the posthog feature flag is disabled. */
export const posthog = serverEnv.posthog
  ? new PostHog(serverEnv.posthog.POSTHOG_API_KEY, {
      host: serverEnv.posthog.POSTHOG_HOST,
      enableExceptionAutocapture: true,
    })
  : undefined;
