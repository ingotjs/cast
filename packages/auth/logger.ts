// Structured console logger — Cloudflare Workers compatible.
// JSON in prod (works with Cloudflare Logpush), readable in dev.
// Reference: https://developers.cloudflare.com/workers/observability/logs/

// oxlint-disable-next-line node/no-process-env -- logger needs to determine environment
const isDev = process.env.NODE_ENV !== "production";

type LogData = Record<string, unknown>;

const emit = (level: string, msg: string, data?: LogData) => {
  const entry = { level, msg, ...data, timestamp: new Date().toISOString() };
  if (isDev) {
    const colors: Record<string, string> = {
      error: "\u001B[31m",
      warn: "\u001B[33m",
    };
    const color = colors[level] ?? "\u001B[36m";
    console.log(`${color}[${level.toUpperCase()}]\u001B[0m ${msg}`, data ?? "");
    return;
  }
  console.log(JSON.stringify(entry));
};

export const logger = {
  info: (msg: string, data?: LogData) => emit("info", msg, data),
  warn: (msg: string, data?: LogData) => emit("warn", msg, data),
  error: (msg: string, data?: LogData) => emit("error", msg, data),
  debug: (msg: string, data?: LogData) => {
    if (isDev) {
      emit("debug", msg, data);
    }
  },
};
