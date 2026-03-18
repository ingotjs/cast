// Minimal D1Database type for the server package.
// Full types come from @cloudflare/workers-types in the web app.
// Reference: https://developers.cloudflare.com/d1/worker-api/
declare type D1Database = {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
};

declare type D1PreparedStatement = {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown>(): Promise<T[]>;
};

declare type D1Result<T = unknown> = {
  results: T[];
  success: boolean;
  meta: Record<string, unknown>;
};

declare type D1ExecResult = {
  count: number;
  duration: number;
};
