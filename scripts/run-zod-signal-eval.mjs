#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith("--")) throw new Error(`Unexpected arg: ${key}`);
    args[key.slice(2)] = argv[++i];
  }
  for (const key of ["case", "repo", "out", "tests", "prod", "mutate"]) {
    if (!args[key]) throw new Error(`Missing --${key}`);
  }
  return args;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    env: { ...process.env, ...options.env },
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: options.timeout ?? 300000,
  });
  return {
    command: [command, ...args].join(" "),
    status: result.status,
    signal: result.signal,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

function writeRunLog(path, result) {
  writeFileSync(
    path,
    [
      `$ ${result.command}`,
      `status=${result.status}`,
      result.signal ? `signal=${result.signal}` : "",
      "",
      "## stdout",
      result.stdout,
      "",
      "## stderr",
      result.stderr,
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function summarizeCoverage(summaryPath, prod) {
  if (!existsSync(summaryPath)) return { available: false, productionFile: prod };
  const summary = readJson(summaryPath);
  const key = Object.keys(summary).find((entry) => entry.endsWith(prod));
  return {
    available: Boolean(key),
    productionFile: prod,
    fileKey: key ?? null,
    metrics: key ? summary[key] : null,
  };
}

function summarizeMutation(path, prod) {
  if (!existsSync(path)) return { available: false, productionFile: prod };
  const report = readJson(path);
  const files = report.files ?? {};
  const key = Object.keys(files).find((entry) => entry.endsWith(prod));
  const mutants = key ? files[key].mutants ?? [] : [];
  const totals = {};
  for (const mutant of mutants) totals[mutant.status] = (totals[mutant.status] ?? 0) + 1;
  return {
    available: Boolean(key),
    productionFile: prod,
    fileKey: key ?? null,
    totals,
    mutants: mutants.map((mutant) => ({
      id: mutant.id,
      mutatorName: mutant.mutatorName,
      replacement: mutant.replacement,
      status: mutant.status,
      location: mutant.location,
      killedBy: mutant.killedBy,
    })),
  };
}

const args = parseArgs(process.argv.slice(2));
const repo = resolve(args.repo);
const out = resolve(args.out);
const tests = args.tests.split(",").map((part) => part.trim()).filter(Boolean);
const prod = args.prod;
const mutate = args.mutate;
const coverageDir = join(out, "coverage");
const strykerDir = join(out, "stryker");
const configDir = join(repo, ".openclaw-signal", args.case);
const vitestConfig = join(configDir, "vitest.signal.config.ts");
const strykerConfig = join(configDir, "stryker.signal.config.mjs");

rmSync(out, { recursive: true, force: true });
mkdirSync(coverageDir, { recursive: true });
mkdirSync(strykerDir, { recursive: true });
mkdirSync(configDir, { recursive: true });

writeFileSync(
  vitestConfig,
  `import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = dirname(fileURLToPath(new URL("${repo.replaceAll("\\", "\\\\")}/package.json", import.meta.url)));

export default defineConfig({
  resolve: { conditions: ["@zod/source", "default"], externalConditions: ["@zod/source", "default"] },
  ssr: { resolve: { conditions: ["@zod/source", "default"], externalConditions: ["@zod/source", "default"] } },
  test: {
    include: ${JSON.stringify(tests)},
    isolate: true,
    setupFiles: ${existsSync(join(repo, "scripts/fail-on-console.ts")) ? `[resolve(root, "scripts/fail-on-console.ts")]` : "[]"},
    silent: true,
    typecheck: { enabled: false },
    watch: false,
  },
});
`,
);

writeFileSync(
  strykerConfig,
  `export default {
  packageManager: "pnpm",
  plugins: ["@stryker-mutator/vitest-runner"],
  reporters: ["clear-text", "json"],
  testRunner: "vitest",
  testFiles: ${JSON.stringify(tests)},
  mutate: ${JSON.stringify(mutate.split(",").map((part) => part.trim()).filter(Boolean))},
  concurrency: 2,
  coverageAnalysis: "perTest",
  disableTypeChecks: true,
  ignoreStatic: true,
  jsonReporter: { fileName: ${JSON.stringify(join(strykerDir, "mutation.json"))} },
  tempDirName: ${JSON.stringify(`.stryker-tmp/${args.case}`)},
  thresholds: { high: 0, low: 0, break: 0 },
  vitest: { configFile: ${JSON.stringify(vitestConfig)}, related: false },
};
`,
);

const validation = run("pnpm", ["vitest", "run", ...tests, "--config", vitestConfig, "--reporter=dot"], {
  cwd: repo,
  timeout: 300000,
});
writeRunLog(join(out, "validation.log"), validation);

let coverage = null;
let stryker = null;
if (validation.status === 0) {
  coverage = run(
    "pnpm",
    [
      "vitest",
      "run",
      ...tests,
      "--config",
      vitestConfig,
      "--coverage.enabled",
      "true",
      "--coverage.provider",
      "v8",
      "--coverage.reporter",
      "json",
      "--coverage.reporter",
      "json-summary",
      "--coverage.reportsDirectory",
      coverageDir,
      "--coverage.include",
      prod,
    ],
    { cwd: repo, timeout: 300000 },
  );
  writeRunLog(join(out, "coverage.log"), coverage);

  if (coverage.status === 0) {
    stryker = run("pnpm", ["stryker", "run", strykerConfig], {
      cwd: repo,
      timeout: 900000,
    });
    writeRunLog(join(strykerDir, "run.log"), stryker);
  }
}

const coverageSummary = summarizeCoverage(join(coverageDir, "coverage-summary.json"), prod);
const mutationSummary = summarizeMutation(join(strykerDir, "mutation.json"), prod);
const killed = mutationSummary.totals?.Killed ?? 0;
const survived = mutationSummary.totals?.Survived ?? 0;
const noCoverage = mutationSummary.totals?.NoCoverage ?? 0;
let verdict = "signal_unknown";
if (validation.status !== 0) verdict = "partial_repair";
else if (coverage?.status !== 0 || !coverageSummary.available) verdict = "signal_unknown";
else if (!mutationSummary.available) verdict = "signal_unknown";
else if (survived > 0 || noCoverage > 0 || killed === 0) verdict = "signal_weakened";
else verdict = "signal_preserved";

const summary = {
  case: args.case,
  repo,
  tests,
  productionFile: prod,
  mutate,
  validation: { status: validation.status, signal: validation.signal },
  coverage: {
    status: coverage?.status ?? null,
    signal: coverage?.signal ?? null,
    summary: coverageSummary,
  },
  mutation: {
    status: stryker?.status ?? null,
    signal: stryker?.signal ?? null,
    summary: mutationSummary,
  },
  verdict,
};
writeFileSync(join(out, "signal-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);

const metrics = coverageSummary.metrics;
const mutationTotals = mutationSummary.totals ?? {};
writeFileSync(
  join(out, "signal-summary.md"),
  [
    `# Signal Evaluation - ${args.case}`,
    "",
    `- tests: ${tests.map((test) => `\`${test}\``).join(", ")}`,
    `- production file: \`${prod}\``,
    `- mutate: \`${mutate}\``,
    `- validation status: ${validation.status}`,
    `- coverage status: ${coverage?.status ?? "not_run"}`,
    metrics
      ? `- coverage lines: ${metrics.lines.covered}/${metrics.lines.total} (${metrics.lines.pct}%)`
      : "- coverage lines: unavailable",
    `- stryker status: ${stryker?.status ?? "not_run"}`,
    `- mutants killed: ${mutationTotals.Killed ?? 0}`,
    `- mutants survived: ${mutationTotals.Survived ?? 0}`,
    `- mutants no coverage: ${mutationTotals.NoCoverage ?? 0}`,
    `- verdict: ${verdict}`,
    "",
  ].join("\n"),
);

console.log(JSON.stringify(summary, null, 2));
