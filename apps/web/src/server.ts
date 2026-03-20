import { initKv } from "@ingot/auth/kv-storage";
import { initDb } from "@ingot/db";
import handler from "@tanstack/react-start/server-entry";
import { env } from "cloudflare:workers";

// Initialize bindings from the Workers environment
initDb(env.DB);
initKv(env.SESSION_KV);

export default {
  async fetch(req: Request): Promise<Response> {
    return handler.fetch(req);
  },

  async queue(batch: MessageBatch, _env: never, _ctx: ExecutionContext): Promise<void> {
    for (const msg of batch.messages) {
      // TODO: dispatch by message type
      console.log("queue:", JSON.stringify(msg.body));
      msg.ack();
    }
  },

  async scheduled(event: ScheduledEvent, _env: never, _ctx: ExecutionContext): Promise<void> {
    // TODO: dispatch by event.cron pattern
    console.log("cron:", event.cron);
  },
};
