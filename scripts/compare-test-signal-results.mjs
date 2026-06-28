#!/usr/bin/env node
import { readFileSync } from "node:fs";

function read(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function mutantKey(mutant) {
  const loc = mutant.location;
  return [
    mutant.mutatorName,
    `${loc.start.line}:${loc.start.column}-${loc.end.line}:${loc.end.column}`,
    mutant.replacement,
  ].join("|");
}

function coverageDelta(metric, left, right) {
  const l = left.coverage.metrics[metric];
  const r = right.coverage.metrics[metric];
  return {
    metric,
    left: l.pct,
    right: r.pct,
    delta: Number((l.pct - r.pct).toFixed(2)),
  };
}

function mutationTotals(result) {
  return result.mutation?.totals ?? {};
}

function assertionTotal(result) {
  return result.assertions.tests.reduce(
    (sum, test) => sum + test.expectCount,
    0,
  );
}

function formatMutant(mutant, otherStatus) {
  const loc = mutant.location.start.line;
  return `- line ${loc}, ${mutant.mutatorName}, replacement \`${mutant.replacement}\`: ${mutant.status} vs ${otherStatus}`;
}

const [leftPath, rightPath] = process.argv.slice(2);
if (!leftPath || !rightPath) {
  console.error(
    "Usage: node scripts/compare-test-signal-results.mjs <left-summary.json> <right-summary.json>",
  );
  process.exit(1);
}

const left = read(leftPath);
const right = read(rightPath);
const rightMutants = new Map(
  (right.mutation?.mutants ?? []).map((mutant) => [mutantKey(mutant), mutant]),
);
const regressions = (left.mutation?.mutants ?? []).filter((mutant) => {
  const other = rightMutants.get(mutantKey(mutant));
  return other && mutant.status !== "Killed" && other.status === "Killed";
});

const coverage = ["lines", "branches", "functions", "statements"].map(
  (metric) => coverageDelta(metric, left, right),
);

const output = `# Test Signal Comparison - ${left.label} vs ${right.label}

## Coverage Delta

${coverage.map((entry) => `- ${entry.metric}: ${entry.left}% vs ${entry.right}% (${entry.delta >= 0 ? "+" : ""}${entry.delta})`).join("\n")}

## Assertion Shape

- ${left.label}: ${left.assertions.relevantTestCount} relevant tests, ${assertionTotal(left)} executable expects
- ${right.label}: ${right.assertions.relevantTestCount} relevant tests, ${assertionTotal(right)} executable expects

## Mutation Totals

- ${left.label}: ${mutationTotals(left).Killed ?? 0} killed, ${mutationTotals(left).Survived ?? 0} survived, ${mutationTotals(left).NoCoverage ?? 0} no coverage
- ${right.label}: ${mutationTotals(right).Killed ?? 0} killed, ${mutationTotals(right).Survived ?? 0} survived, ${mutationTotals(right).NoCoverage ?? 0} no coverage

## Mutants Missed By ${left.label} But Killed By ${right.label}

${regressions.length ? regressions.map((mutant) => formatMutant(mutant, rightMutants.get(mutantKey(mutant)).status)).join("\n") : "- none"}
`;

process.stdout.write(`${output.trimEnd()}\n`);
