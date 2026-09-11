"""Compare current-Node DEV coverage for sampled units with the copied week-1 baseline."""
import json
from pilot_common import EXP, load_units, unit_coverage, assert_clean

coverage_file = EXP / "results/dev-coverage-recheck/coverage-final.json"
baseline = {r["unit_id"]: r for r in json.loads((EXP / "dev-baseline/dev-coverage-units.json").read_text(encoding="utf-8"))["units"]}
rows = []
for unit in load_units():
    current = unit_coverage(coverage_file, unit)
    old = baseline[unit["unit_id"]]
    keys = ["executable_lines", "covered_lines", "line_pct", "branches_total", "branches_covered", "branch_pct"]
    prior = {k: old.get(k) for k in keys}
    now = {k: current.get(k) for k in keys}
    rows.append({"unit_id": unit["unit_id"], "week1_node": "v24.11.0", "current_node": "v25.7.0", "week1": prior, "current": now, "matches": prior == now})
out = {"coverage_file": str(coverage_file.relative_to(EXP)), "rule": "unit_coverage from scripts/pilot_common.py", "all_match": all(r["matches"] for r in rows), "rows": rows}
(EXP / "results/dev-coverage-recheck-units.json").write_text(json.dumps(out, indent=2), encoding="utf-8")
for r in rows: print(r["unit_id"], "match=" + str(r["matches"]), "week1=", r["week1"], "current=", r["current"])
print("all_match", out["all_match"])
assert_clean("Phase 6 DEV coverage recheck")
