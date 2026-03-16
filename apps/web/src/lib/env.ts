import { createEnv } from "@t3-oss/env-core";

// Reference: https://env.t3.gg/docs/core
export const env = createEnv({
  clientPrefix: "VITE_",
  client: {},
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
  skipValidation: Boolean(import.meta.env.SKIP_ENV_VALIDATION),
});
