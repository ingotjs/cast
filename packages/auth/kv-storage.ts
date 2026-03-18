// Reference: https://www.better-auth.com/docs/concepts/database#secondary-storage
// Reference: https://developers.cloudflare.com/kv/api/

/**
 * Minimal KVNamespace type for the auth package.
 * Full types come from @cloudflare/workers-types in the web app.
 */
type KVNamespace = {
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number }
  ): Promise<void>;
  delete(key: string): Promise<void>;
};

/** Cloudflare KV minimum TTL is 60 seconds */
const KV_MIN_TTL = 60;

let _kv: KVNamespace | undefined;

/** Initialize the KV binding (called from server.ts) */
export const initKv = (kv: KVNamespace) => {
  _kv = kv;
};

/**
 * Better Auth secondary storage backed by Cloudflare KV.
 *
 * Sessions, rate limiting, and verification tokens are stored here
 * instead of D1 for faster reads (globally replicated, <10ms).
 *
 * Gracefully no-ops when KV is not initialized (e.g. in tests).
 */
export const kvSecondaryStorage = {
  get: async (key: string) => {
    const value = await _kv?.get(key);
    return value ?? null;
  },
  set: async (key: string, value: string, ttl?: number) => {
    if (!_kv) {
      return;
    }
    await _kv.put(
      key,
      value,
      ttl ? { expirationTtl: Math.max(ttl, KV_MIN_TTL) } : undefined
    );
  },
  delete: async (key: string) => {
    if (!_kv) {
      return;
    }
    await _kv.delete(key);
  },
};
