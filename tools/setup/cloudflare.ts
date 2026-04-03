import {
  bold,
  dim,
  green,
  isPlaceholder,
  readWranglerConfig,
  run,
  runJson,
  updateWranglerField,
  WRANGLER_CONFIG,
  yellow,
} from "./helpers.ts";

// ---------------------------------------------------------------------------
// Cloudflare resource provisioning
// ---------------------------------------------------------------------------

export function provisionCloudflare() {
  console.log(bold("\n── Cloudflare ──\n"));

  if (!run("npx wrangler whoami", { silent: true })) {
    console.log(yellow("⚠ Not authenticated — skipping resource provisioning"));
    console.log(dim("  Run: npx wrangler login"));
    return;
  }

  const config = readWranglerConfig();
  let changed = false;

  changed = provisionD1(config) || changed;
  changed = provisionKV(config) || changed;
  provisionR2(config);
  provisionQueue(config);

  if (changed) {
    console.log(dim(`\n  Updated ${WRANGLER_CONFIG}`));
  }

  provisionAuthSecret();

  console.log(dim("\n  For CI deploy, add this GitHub Actions secret:"));
  console.log(dim("    CLOUDFLARE_API_TOKEN — dash.cloudflare.com → API Tokens"));
}

function provisionD1(config: Record<string, unknown>): boolean {
  const d1Config = (config.d1_databases as Record<string, string>[] | undefined)?.[0];
  if (!d1Config) {
    return false;
  }

  if (!isPlaceholder(d1Config.database_id)) {
    console.log(dim(`  D1 "${d1Config.database_name}" — already configured`));
    return false;
  }

  const dbName = d1Config.database_name;
  type D1Entry = { uuid: string; name: string };
  const list = runJson<D1Entry[]>("npx wrangler d1 list --json");
  const found = list?.find((db) => db.name === dbName);

  if (found) {
    updateWranglerField("database_id", found.uuid);
    console.log(green(`✓ D1 "${dbName}"`) + dim(` — found (${found.uuid.slice(0, 8)}...)`));
  } else {
    const output = run(`npx wrangler d1 create ${dbName}`, { silent: true });
    const match = output?.match(/database_id\s*=\s*"([^"]+)"/);
    if (match?.[1]) {
      updateWranglerField("database_id", match[1]);
      console.log(green(`✓ D1 "${dbName}"`) + dim(` — created (${match[1].slice(0, 8)}...)`));
    } else {
      console.log(yellow(`⚠ Failed to create D1 "${dbName}"`));
    }
  }
  return true;
}

function provisionKV(config: Record<string, unknown>): boolean {
  const kvConfig = (config.kv_namespaces as Record<string, string>[] | undefined)?.[0];
  if (!kvConfig) {
    return false;
  }

  if (!isPlaceholder(kvConfig.id)) {
    console.log(dim(`  KV "${kvConfig.binding}" — already configured`));
    return false;
  }

  const title = `${(config as Record<string, string>).name}-${kvConfig.binding}`;
  type KvEntry = { id: string; title: string };
  const list = runJson<KvEntry[]>("npx wrangler kv namespace list --json");
  const found = list?.find((ns) => ns.title === title);

  if (found) {
    updateWranglerField("id", found.id);
    console.log(green(`✓ KV "${title}"`) + dim(` — found (${found.id.slice(0, 8)}...)`));
  } else {
    const output = run(`npx wrangler kv namespace create ${kvConfig.binding}`, { silent: true });
    const match = output?.match(/id\s*=\s*"([^"]+)"/);
    if (match?.[1]) {
      updateWranglerField("id", match[1]);
      console.log(green(`✓ KV "${title}"`) + dim(` — created (${match[1].slice(0, 8)}...)`));
    } else {
      console.log(yellow("⚠ Failed to create KV namespace"));
    }
  }
  return true;
}

function provisionR2(config: Record<string, unknown>) {
  const r2Config = (config.r2_buckets as Record<string, string>[] | undefined)?.[0];
  if (!r2Config) {
    return;
  }

  const bucketName = r2Config.bucket_name;
  type R2Entry = { name: string };
  const list = runJson<R2Entry[]>("npx wrangler r2 bucket list --json");

  if (list?.find((b) => b.name === bucketName)) {
    console.log(dim(`  R2 "${bucketName}" — already exists`));
  } else {
    const result = run(`npx wrangler r2 bucket create ${bucketName}`, { silent: true });
    if (result) {
      console.log(green(`✓ R2 "${bucketName}"`) + dim(" — created"));
    } else {
      console.log(yellow(`⚠ Failed to create R2 "${bucketName}"`));
    }
  }
}

function provisionQueue(config: Record<string, unknown>) {
  const queues = config.queues as Record<string, Record<string, string>[]> | undefined;
  const queueConfig = queues?.producers?.[0];
  if (!queueConfig) {
    return;
  }

  const queueName = queueConfig.queue;
  type QueueEntry = { queue_name: string };
  const list = runJson<QueueEntry[]>("npx wrangler queues list --json");

  if (list?.find((q) => q.queue_name === queueName)) {
    console.log(dim(`  Queue "${queueName}" — already exists`));
  } else {
    const result = run(`npx wrangler queues create ${queueName}`, { silent: true });
    if (result) {
      console.log(green(`✓ Queue "${queueName}"`) + dim(" — created"));
    } else {
      console.log(yellow(`⚠ Failed to create queue "${queueName}"`));
    }
  }
}

function provisionAuthSecret() {
  const secretCheck = run("npx wrangler secret list --json", { silent: true });
  if (secretCheck?.includes("BETTER_AUTH_SECRET")) {
    console.log(dim("  BETTER_AUTH_SECRET — already set"));
    return;
  }

  const secret = crypto.randomUUID() + crypto.randomUUID();
  const result = run(`echo "${secret}" | npx wrangler secret put BETTER_AUTH_SECRET`, { silent: true });
  if (result) {
    console.log(green("✓ BETTER_AUTH_SECRET") + dim(" — generated and stored"));
  } else {
    console.log(
      yellow("⚠ Failed to set BETTER_AUTH_SECRET — set it manually: npx wrangler secret put BETTER_AUTH_SECRET")
    );
  }
}
