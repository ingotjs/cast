import { consts, requireIfEnabled } from "@packages/shared/consts";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

// Reference: https://env.t3.gg/docs/core
export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_PUBLIC_POSTHOG_KEY: requireIfEnabled(
      consts.features.posthog.enabled,
      z.string().min(1)
    ),
    VITE_PUBLIC_POSTHOG_HOST: requireIfEnabled(
      consts.features.posthog.enabled,
      z.url()
    ),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
  skipValidation: Boolean(import.meta.env.SKIP_ENV_VALIDATION),
});
