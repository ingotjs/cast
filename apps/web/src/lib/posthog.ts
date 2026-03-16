import { env } from "./env";

// Reference: https://posthog.com/docs/libraries/react

export const posthogConfig = {
  key: env.VITE_PUBLIC_POSTHOG_KEY,
  host: env.VITE_PUBLIC_POSTHOG_HOST,
} as const;
