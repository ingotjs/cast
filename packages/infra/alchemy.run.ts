// oxlint-disable -- infrastructure script, not application code

import alchemy from "alchemy";
import { D1Database, KVNamespace, TanStackStart } from "alchemy/cloudflare";

const app = await alchemy("app");

const db = await D1Database("db", {
  name: "db",
  migrationsDir: `${import.meta.dirname}/../db/drizzle`,
  adopt: true,
});

const kv = await KVNamespace("kv", {
  title: "kv",
});

export const website = await TanStackStart("website", {
  name: "worker",
  cwd: `${import.meta.dirname}/../../apps/web`,
  bindings: {
    DB: db,
    SESSION_KV: kv,
  },
  compatibilityDate: "2025-09-24",
  compatibility: "node",
  wrangler: {
    transform: (spec) => ({
      ...spec,
      observability: { enabled: true },
    }),
  },
});

console.log({ url: website.url });

await app.finalize();
