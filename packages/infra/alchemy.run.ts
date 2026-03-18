// oxlint-disable -- infrastructure script, not application code

import alchemy from "alchemy";
import { D1Database, KVNamespace, TanStackStart } from "alchemy/cloudflare";

const app = await alchemy("omegastart");

const db = await D1Database("omegastart-db", {
  name: "omegastart-db",
  migrationsDir: `${import.meta.dirname}/../db/drizzle`,
  adopt: true,
});

const kv = await KVNamespace("omegastart-kv", {
  title: "omegastart-kv",
});

export const website = await TanStackStart("website", {
  name: "omegastart",
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
