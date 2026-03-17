import { PostHog } from "posthog-node";

import { serverEnv } from "./env";
// Side-effect import: initializes OpenTelemetry SDK for PostHog Logs
import "./otel";

// Reference: https://posthog.com/docs/error-tracking/installation/node

/** PostHog server client — `undefined` when the posthog feature flag is disabled. */
export const posthog = serverEnv.posthog
  ? new PostHog(serverEnv.posthog.VITE_PUBLIC_POSTHOG_KEY, {
      host: serverEnv.posthog.VITE_PUBLIC_POSTHOG_HOST,
      enableExceptionAutocapture: true,
    })
  : undefined;
