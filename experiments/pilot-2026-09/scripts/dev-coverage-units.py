"""dev-coverage-units.py: per-unit line and branch coverage of the dev suite at t, restricted to each
unit's declaring statement line range (code_start_line..end_line of the class / $constructor statement;
type-only statements are not counted). Input: dev-baseline/coverage/coverage-final.json (istanbul-format
JSON written by @vitest/coverage-v8), results/units-all.json. Output: dev-baseline/dev-coverage-units.json.
Line rule: a statementMap entry counts as an executable line if its start line lies in the range; it is
covered if its counter s[id] > 0 (v8-to-istanbul emits one statement per non-empty source line).
Branch rule: a branchMap entry belongs to the unit if its `line` lies in the range; each of its locations
is one branch, covered if the matching b[id][i] > 0 (istanbul's convention).
Run from the zod repo root: ../.venv/bin/python experiments/pilot-2026-09/scripts/dev-coverage-units.py
"""
import json, pathlib
ROOT = pathlib.Path.cwd(); EXP = ROOT / "experiments/pilot-2026-09"
cov = json.loads((EXP / "dev-baseline/coverage/coverage-final.json").read_text())
units = json.loads((EXP / "results/units-all.json").read_text())
prefix = str(ROOT) + "/"
by_rel = {(k[len(prefix):] if k.startswith(prefix) else k): v for k, v in cov.items()}

def unit_cov(u):
    f = by_rel.get(u["file"])
    lo, hi = u["declaring_statement"]["code_start_line"], u["declaring_statement"]["end_line"]
    r = {"unit_id": u.get("unit_id"), "class_name": u["class_name"], "file": u["file"], "dir": u["dir"], "kind": u["kind"],
         "range": [lo, hi], "range_lines": hi - lo + 1, "file_in_coverage": f is not None}
    if f is None:
        r.update(executable_lines=0, covered_lines=0, line_pct=None, branches_total=0, branches_covered=0, branch_pct=None, has_coverage_data=False)
        return r
    ex, cv = set(), set()
    for sid, loc in f["statementMap"].items():
        ln = loc["start"]["line"]
        if lo <= ln <= hi:
            ex.add(ln)
            if f["s"][sid] > 0: cv.add(ln)
    bt = bc = 0
    for bid, br in f["branchMap"].items():
        if lo <= br["line"] <= hi:
            counts = f["b"][bid]
            bt += len(counts); bc += sum(1 for c in counts if c > 0)
    r.update(executable_lines=len(ex), covered_lines=len(cv), line_pct=(round(100 * len(cv) / len(ex), 2) if ex else None),
             branches_total=bt, branches_covered=bc, branch_pct=(round(100 * bc / bt, 2) if bt else None),
             has_coverage_data=len(ex) > 0)
    return r

rows = [unit_cov(u) for u in units["units"]]
example = unit_cov(units["example_unit"]) if units.get("example_unit") else None
# sanity: file-level statement/line relation
def file_info(rel):
    f = by_rel.get(rel); p = ROOT / rel
    if not f: return None
    lines = p.read_text().split("\n"); nonblank = sum(1 for l in lines if l.strip())
    return {"file_lines": len(lines), "nonblank_lines": nonblank, "statementMap_entries": len(f["statementMap"]), "branchMap_entries": len(f["branchMap"])}
checks = {rel: file_info(rel) for rel in ["packages/zod/src/v4/core/schemas.ts", "packages/zod/src/v4/classic/schemas.ts", "packages/zod/src/v4/mini/schemas.ts"]}
pop_files = sorted({u["file"] for u in units["units"]})
missing_files = [f for f in pop_files if f not in by_rel]
summary = {
    "units": len(rows),
    "file_not_in_coverage": sum(1 for r in rows if not r["file_in_coverage"]),
    "zero_executable_lines": sum(1 for r in rows if r["file_in_coverage"] and r["executable_lines"] == 0),
    "has_coverage_data_line_reading": sum(1 for r in rows if r["has_coverage_data"]),
    "zero_branches_among_has_data": sum(1 for r in rows if r["has_coverage_data"] and r["branches_total"] == 0),
    "population_files_missing_from_coverage": missing_files,
    "coverage_files_total": len(cov),
}
out = {"source": "dev-baseline/coverage/coverage-final.json (dev suite at t, @vitest/coverage-v8 2.1.9)", "rule": __doc__.strip(), "summary": summary, "file_checks": checks, "example_unit": example, "units": rows}
(EXP / "dev-baseline/dev-coverage-units.json").write_text(json.dumps(out, indent=2))
print(json.dumps(summary)); print(json.dumps(checks))
lp = sorted(r["line_pct"] for r in rows if r["line_pct"] is not None)
print("line_pct over units with data: n", len(lp), "min", lp[0], "median", lp[len(lp)//2], "mean", round(sum(lp)/len(lp), 2), "max", lp[-1])
print("units with line_pct < 50:", [(r["unit_id"], r["line_pct"], r["executable_lines"]) for r in rows if r["line_pct"] is not None and r["line_pct"] < 50][:15])
print("no-data units:", [r["unit_id"] for r in rows if not r["has_coverage_data"]])
