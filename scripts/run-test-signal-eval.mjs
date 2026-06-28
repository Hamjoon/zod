#!/usr/bin/env node
import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";

const testFile = "packages/zod/src/v4/classic/tests/object.test.ts";
const productionFile = "packages/zod/src/v4/core/util.ts";

function parseArgs(argv) {
  const args = {
    label: "current",
    out: "artifacts/test-signal/current",
    testSource: "current",
    skipStryker: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--label") args.label = argv[++i];
    else if (arg === "--out") args.out = argv[++i];
    else if (arg === "--test-source") args.testSource = argv[++i];
    else if (arg === "--skip-stryker") args.skipStryker = true;
    else if (arg === "--help") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/run-test-signal-eval.mjs --label llm-repair --out artifacts/test-signal/llm
  node scripts/run-test-signal-eval.mjs --label oracle --test-source hamjoon/repair/object-extend-refinement-test --out artifacts/test-signal/oracle

Options:
  --label <name>        Label written into the report.
  --out <dir>           Artifact directory.
  --test-source <ref>   "current" or a git ref whose ${testFile} should be measured.
  --skip-stryker        Run coverage/assertion analysis only.
`);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env: { ...process.env, ...options.env },
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
  });

  if (result.status !== 0) {
    const message = options.capture
      ? `\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
      : "";
    throw new Error(
      `${command} ${args.join(" ")} failed with status ${result.status}${message}`,
    );
  }

  return result;
}

function gitShow(ref, file) {
  return execFileSync("git", ["show", `${ref}:${file}`], { encoding: "utf8" });
}

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function extractRelevantTests(source) {
  const tests = [];
  const testRegex =
    /test\((["'`])([^"'`]*object with refinements[^"'`]*)\1,\s*\(\)\s*=>\s*\{([\s\S]*?)\n\}\);/g;
  let match;
  while ((match = testRegex.exec(source)) !== null) {
    tests.push({
      name: match[2],
      body: match[3],
    });
  }
  return tests;
}

function analyzeAssertions(source) {
  const tests = extractRelevantTests(source);
  return {
    testFile,
    relevantTestCount: tests.length,
    tests: tests.map((test) => {
      const expects = [
        ...test.body.matchAll(
          /expect(?:TypeOf)?\s*\(([\s\S]*?)\)\s*((?:\.\w+)+)/g,
        ),
      ].map((match) => {
        const matcher = match[2].slice(1).split(".").join(".");
        return {
          target: match[1].replace(/\s+/g, " ").trim(),
          matcher,
        };
      });
      return {
        name: test.name,
        expectCount: expects.length,
        matchers: expects.map((expect) => expect.matcher),
        expects,
      };
    }),
  };
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function summarizeCoverage(summaryPath) {
  const summary = readJson(summaryPath);
  const key = Object.keys(summary).find((entry) =>
    entry.endsWith(productionFile),
  );
  return {
    productionFile,
    metrics: key ? summary[key] : null,
  };
}

function summarizeMutation(reportPath) {
  if (!existsSync(reportPath)) return null;
  const report = readJson(reportPath);
  const files = report.files ?? {};
  const fileKey = Object.keys(files).find((entry) =>
    entry.endsWith(productionFile),
  );
  if (!fileKey) return { productionFile, totals: {}, mutants: [] };

  const mutants = files[fileKey].mutants ?? [];
  const totals = mutants.reduce((acc, mutant) => {
    acc[mutant.status] = (acc[mutant.status] ?? 0) + 1;
    return acc;
  }, {});

  return {
    productionFile,
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

function writeMarkdownReport(path, result) {
  const coverage = result.coverage.metrics;
  const mutationTotals = result.mutation?.totals ?? {};
  const lines = [
    `# Test Signal Evaluation - ${result.label}`,
    "",
    `- test source: \`${result.testSource}\``,
    `- test file: \`${testFile}\``,
    `- production file: \`${productionFile}\``,
    "",
    "## Coverage",
    "",
    coverage
      ? `- lines: ${coverage.lines.covered}/${coverage.lines.total} (${coverage.lines.pct}%)`
      : "- util.ts coverage: unavailable",
    coverage
      ? `- branches: ${coverage.branches.covered}/${coverage.branches.total} (${coverage.branches.pct}%)`
      : "",
    coverage
      ? `- functions: ${coverage.functions.covered}/${coverage.functions.total} (${coverage.functions.pct}%)`
      : "",
    "",
    "## Assertion Shape",
    "",
    `- relevant tests: ${result.assertions.relevantTestCount}`,
    `- executable expects: ${result.assertions.tests.reduce((sum, test) => sum + test.expectCount, 0)}`,
    "",
    ...result.assertions.tests.flatMap((test) => [
      `### ${test.name}`,
      "",
      `- expects: ${test.expectCount}`,
      `- matchers: ${test.matchers.length ? test.matchers.join(", ") : "none"}`,
      "",
    ]),
    "## Mutation",
    "",
    result.mutation
      ? `- killed: ${mutationTotals.Killed ?? 0}`
      : "- mutation report: skipped or unavailable",
    result.mutation ? `- survived: ${mutationTotals.Survived ?? 0}` : "",
    result.mutation ? `- no coverage: ${mutationTotals.NoCoverage ?? 0}` : "",
    result.mutation ? `- timeout: ${mutationTotals.Timeout ?? 0}` : "",
    "",
  ].filter((line) => line !== "");

  writeFileSync(path, `${lines.join("\n")}\n`);
}

const args = parseArgs(process.argv.slice(2));
const outDir = resolve(args.out);
const coverageDir = join(outDir, "coverage");
const strykerDir = join(outDir, "stryker");
const originalTest = readFileSync(testFile, "utf8");

ensureDir(outDir);
rmSync(coverageDir, { recursive: true, force: true });
rmSync(strykerDir, { recursive: true, force: true });
ensureDir(coverageDir);
ensureDir(strykerDir);

try {
  if (args.testSource !== "current") {
    writeFileSync(testFile, gitShow(args.testSource, testFile));
  }

  const testSource = readFileSync(testFile, "utf8");
  const assertions = analyzeAssertions(testSource);
  writeFileSync(
    join(outDir, "assertions.json"),
    `${JSON.stringify(assertions, null, 2)}\n`,
  );

  run("pnpm", [
    "vitest",
    "run",
    testFile,
    "--config",
    "scripts/vitest.test-signal.config.ts",
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
    productionFile,
  ]);

  if (!args.skipStryker) {
    run("pnpm", ["stryker", "run", "scripts/stryker.test-signal.config.mjs"], {
      env: {
        TEST_SIGNAL_ARTIFACT_DIR: outDir,
      },
    });
  }

  const result = {
    label: args.label,
    testSource: args.testSource,
    testFile,
    productionFile,
    assertions,
    coverage: summarizeCoverage(join(coverageDir, "coverage-summary.json")),
    mutation: summarizeMutation(join(strykerDir, "mutation.json")),
  };

  writeFileSync(
    join(outDir, "summary.json"),
    `${JSON.stringify(result, null, 2)}\n`,
  );
  writeMarkdownReport(join(outDir, "summary.md"), result);
  console.log(`Wrote ${join(outDir, "summary.md")}`);
} finally {
  writeFileSync(testFile, originalTest);
}
