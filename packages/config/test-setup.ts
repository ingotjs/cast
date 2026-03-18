/**
 * Global test setup — loaded via bunfig.toml preload before any test runs.
 *
 * Console output is suppressed by default. Run with VERBOSE=1 to see logs:
 *   VERBOSE=1 bun test
 */
// oxlint-disable-next-line node/no-process-env -- test setup reads env directly
if (!process.env.VERBOSE) {
  const noop = () => {};
  console.log = noop;
  console.error = noop;
  console.warn = noop;
  console.info = noop;
  console.debug = noop;
}
