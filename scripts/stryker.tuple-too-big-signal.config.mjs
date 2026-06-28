const variant = process.env.TUPLE_SIGNAL_VARIANT ?? "current";

export default {
  packageManager: "pnpm",
  plugins: ["@stryker-mutator/vitest-runner"],
  testRunner: "vitest",
  coverageAnalysis: "off",
  mutate: ["packages/zod/src/v4/core/schemas.ts:2537-2537"],
  reporters: ["clear-text", "json"],
  jsonReporter: { fileName: `artifacts/tuple-too-big-signal/${variant}/stryker/mutation.json` },
  tempDirName: ".stryker-tmp",
  concurrency: 2,
  vitest: {
    configFile: "scripts/vitest.tuple-too-big-signal.config.ts",
    related: false,
  },
};
