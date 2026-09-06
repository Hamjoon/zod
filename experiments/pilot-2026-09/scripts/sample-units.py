"""sample-units.py: D3 pool and stratified random sample.
Pool = units kept by the token filter (results/units-selected.json) minus $constructor units whose
initializer is a separately defined identifier minus units without dev coverage data
(dev-baseline/dev-coverage-units.json, has_coverage_data == false, line reading).
Sample: 2 core, 2 classic, 1 mini, drawn with Python random.Random(20260904).sample(sorted_ids, k) per stratum
in the order core, classic, mini. Output: results/units-sampled.json.
Run from the zod repo root: ../.venv/bin/python experiments/pilot-2026-09/scripts/sample-units.py
"""
import json, pathlib, random, sys
ROOT = pathlib.Path.cwd(); EXP = ROOT / "experiments/pilot-2026-09"
SEED = 20260904; QUOTA = [("core", 2), ("classic", 2), ("mini", 1)]
sel = json.loads((EXP / "results/units-selected.json").read_text())
covd = {r["unit_id"]: r for r in json.loads((EXP / "dev-baseline/dev-coverage-units.json").read_text())["units"]}
kept = [r for r in sel["units"] if r["kept"]]
excl_ident = [r["unit_id"] for r in kept if r["kind"] == "b" and r["initializer_kind"] == "identifier"]
excl_nocov = [r["unit_id"] for r in kept if not covd[r["unit_id"]]["has_coverage_data"]]
pool = [r for r in kept if r["unit_id"] not in excl_ident and r["unit_id"] not in excl_nocov]
strata = {d: sorted(r["unit_id"] for r in pool if r["dir"] == d) for d, _ in QUOTA}
rng = random.Random(SEED)
drawn = []
for d, k in QUOTA:
    drawn += [(d, uid) for uid in rng.sample(strata[d], k)]
by_id = {r["unit_id"]: r for r in kept}
sampled = []
for d, uid in drawn:
    r = by_id[uid]; c = covd[uid]
    sampled.append({"unit_id": uid, "class_name": r["class_name"], "file": r["file"], "dir": d, "kind": r["kind"], "kind_label": r["kind_label"],
                    "loc": r["loc"], "unit_tokens": r["unit_tokens"], "prompt_tokens": r["prompt_tokens"], "max_prompt_tokens": r["max_prompt_tokens"],
                    "dev_line_pct": c["line_pct"], "dev_executable_lines": c["executable_lines"], "dev_covered_lines": c["covered_lines"],
                    "dev_branch_pct": c["branch_pct"], "dev_branches_total": c["branches_total"], "dev_branches_covered": c["branches_covered"]})
out = {"seed": SEED, "python": sys.version.split()[0], "method": __doc__.strip(),
       "counts": {"population": sel["totals"]["population"], "kept_by_token_rule": len(kept), "excluded_identifier_initializer": len(excl_ident),
                  "excluded_no_coverage_data": len(excl_nocov), "pool": len(pool), "pool_by_stratum": {d: len(v) for d, v in strata.items()}},
       "exclusions": {"over_token_limit": [r["unit_id"] for r in sel["excluded"]], "identifier_initializer": excl_ident, "no_coverage_data": excl_nocov},
       "sampled": sampled}
(EXP / "results/units-sampled.json").write_text(json.dumps(out, indent=2, ensure_ascii=False))
print(json.dumps(out["counts"])); print("exclusions:", json.dumps(out["exclusions"]))
for s in sampled: print(s["unit_id"], "|", s["file"], "| unit_tok", s["unit_tokens"], "| maxprompt", s["max_prompt_tokens"], "| dev line", s["dev_line_pct"], f"({s['dev_covered_lines']}/{s['dev_executable_lines']})", "| dev branch", s["dev_branch_pct"], f"({s['dev_branches_covered']}/{s['dev_branches_total']})")
