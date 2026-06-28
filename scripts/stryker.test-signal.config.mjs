const artifactDir =
  process.env.TEST_SIGNAL_ARTIFACT_DIR ?? "artifacts/test-signal/current";

export default {
  packageManager: "pnpm",
  plugins: ["@stryker-mutator/vitest-runner"],
  reporters: ["clear-text", "json"],
  testRunner: "vitest",
  testFiles: ["packages/zod/src/v4/classic/tests/object.test.ts"],
  mutate: ["packages/zod/src/v4/core/util.ts:651-677"],
  concurrency: 2,
  coverageAnalysis: "perTest",
  disableTypeChecks: true,
  ignoreStatic: true,
  jsonReporter: {
    fileName: `${artifactDir}/stryker/mutation.json`,
  },
  tempDirName: ".stryker-tmp/test-signal",
  thresholds: {
    high: 0,
    low: 0,
    break: 0,
  },
  vitest: {
    configFile: "scripts/vitest.test-signal.config.ts",
    related: false,
  },
};
