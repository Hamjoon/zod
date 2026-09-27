// Stage C: merge Istanbul coverage maps with testpilot2's istanbul-lib-coverage, restrict to the file set D,
// normalise file keys (and each file's `path`) to paths relative to packages/zod/src/, and write
// <out>/coverage-final.json and <out>/coverage-summary.json (total + per file: lines, statements, functions, branches).
// usage: node merge-coverage.cjs <out dir> <file-set-D.txt> <list.json: array of coverage-final.json paths>
const fs = require("fs");
const path = require("path");
const libCoverage = require("/work/testpilot2/node_modules/istanbul-lib-coverage");

const [outDir, dFile, listFile] = process.argv.slice(2);
const D = new Set(fs.readFileSync(dFile, "utf8").split("\n").filter(Boolean));
const inputs = JSON.parse(fs.readFileSync(listFile, "utf8"));
const rel = (p) => {
  const m = p.match(/\/packages\/zod\/src\/(.*)$/);
  return m ? m[1] : null;
};

const map = libCoverage.createCoverageMap({});
for (const file of inputs) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const kept = {};
  for (const [key, fc] of Object.entries(data)) {
    const r = rel(key);
    if (r && D.has(r)) kept[r] = { ...fc, path: r };
  }
  map.merge(kept);
}

const final = {};
const summary = { total: libCoverage.createCoverageSummary() };
for (const f of map.files().sort()) {
  final[f] = map.fileCoverageFor(f).toJSON();
  const s = map.fileCoverageFor(f).toSummary();
  summary.total.merge(s);
  summary[f] = s.toJSON();
}
summary.total = summary.total.toJSON();
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "coverage-final.json"), JSON.stringify(final) + "\n");
fs.writeFileSync(path.join(outDir, "coverage-summary.json"), JSON.stringify(summary, null, 2) + "\n");
const missing = [...D].filter((f) => !map.files().includes(f));
console.log(JSON.stringify({ inputs: inputs.length, files: map.files().length, missingFromD: missing, total: summary.total }));
