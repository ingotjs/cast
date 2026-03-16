import pino from "pino";

// Reference: https://getpino.io
// Reference: https://orpc.dev/docs/integrations/pino

// oxlint-disable-next-line node/no-process-env -- logger needs to determine environment
const isDev = process.env.NODE_ENV !== "production";

export const logger = pino({
  level: isDev ? "debug" : "info",
  ...(isDev && {
    transport: {
      target: "pino-pretty",
      options: { colorize: true, translateTime: "SYS:standard" },
    },
  }),
});
