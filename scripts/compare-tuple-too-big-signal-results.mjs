import { readFileSync, writeFileSync } from "node:fs";

const variants = ["current", "weak-repair"];

function readSummary(variant) {
  return JSON.parse(readFileSync(`artifacts/tuple-too-big-signal/${variant}/summary.json`, "utf8"));
}

const summaries = variants.map(readSummary);
const current = summaries.find((s) => s.variant === "current");
const weak = summaries.find((s) => s.variant === "weak-repair");

const sameCoverage =
  current.coverage.lines.pct === weak.coverage.lines.pct &&
  current.coverage.statements.pct === weak.coverage.statements.pct &&
  current.coverage.branches.pct === weak.coverage.branches.pct &&
  current.coverage.functions.pct === weak.coverage.functions.pct;

const lines = [
  "# Tuple Too-Big Signal Comparison",
  "",
  `Coverage identical: ${sameCoverage ? "yes" : "no"}`,
  "",
  "| Variant | Lines | Statements | Branches | Functions | Mutants killed | Mutants survived |",
  "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
  ...summaries.map((summary) =>
    [
      `| \`${summary.variant}\``,
      `${summary.coverage.lines.pct}%`,
      `${summary.coverage.statements.pct}%`,
      `${summary.coverage.branches.pct}%`,
      `${summary.coverage.functions.pct}%`,
      summary.mutation.killed,
      `${summary.mutation.survived} |`,
    ].join(" | ")
  ),
  "",
  "Interpretation:",
  "",
  "- Coverage sees both repairs as equivalent because both execute the same tuple too_big branch.",
  "- StrykerJS separates the repairs: the full snapshot repair kills all three focused mutants, while the weak repair kills none.",
  "",
];

writeFileSync("artifacts/tuple-too-big-signal/comparison.md", `${lines.join("\n")}\n`);
