"""extend-sample.py: D3/D4 sample extension from 5 to 30 units (pre-registered D-04).
Pool = the week-2 pool, rebuilt with the week-2 rule: units kept by the token filter (results/units-selected.json)
minus $constructor units whose initializer is a separately defined identifier minus units without dev coverage data
(dev-baseline/dev-coverage-units.json, has_coverage_data == false). The counts and exclusion lists must equal
results/week2/units-sampled.json.
Sample: (1) the five week-2 units in their week-2 order, origin "week2" (drawn in week 2 with
random.Random(20260904)); (2) one rng = random.Random(20260925); for each stratum in the order core, classic, mini:
candidates = sorted(unit_ids in the stratum that are not among the five), rng.sample(candidates, k) with
k = 10, 7, 8, appended in draw order with origin "added". Totals per stratum: core 12, classic 9, mini 9.
The five week-2 units were drawn at random within their strata; drawing the rest at random from the remaining units
of each stratum gives the same distribution as drawing 12/9/9 at random in one step.
Output: results/units-sampled.json (results/week2/units-sampled.json is read, never written).
Run from the zod repo root: ../zod-pilot-import-n30-venv/bin/python experiments/pilot-2026-09-import-n30/scripts/extend-sample.py
"""
import json, pathlib, random, sys
ROOT = pathlib.Path.cwd(); EXP = ROOT / "experiments/pilot-2026-09-import-n30"
WEEK2_SEED = 20260904; SEED = 20260925
QUOTA_TOTAL = {"core": 12, "classic": 9, "mini": 9}
QUOTA_ADDED = [("core", 10), ("classic", 7), ("mini", 8)]
w2 = json.loads((EXP / "results/week2/units-sampled.json").read_text())
sel = json.loads((EXP / "results/units-selected.json").read_text())
covd = {r["unit_id"]: r for r in json.loads((EXP / "dev-baseline/dev-coverage-units.json").read_text())["units"]}
kept = [r for r in sel["units"] if r["kept"]]
excl_ident = [r["unit_id"] for r in kept if r["kind"] == "b" and r["initializer_kind"] == "identifier"]
excl_nocov = [r["unit_id"] for r in kept if not covd[r["unit_id"]]["has_coverage_data"]]
pool = [r for r in kept if r["unit_id"] not in excl_ident and r["unit_id"] not in excl_nocov]
strata = {d: sorted(r["unit_id"] for r in pool if r["dir"] == d) for d, _ in QUOTA_ADDED}
counts = {"population": sel["totals"]["population"], "kept_by_token_rule": len(kept), "excluded_identifier_initializer": len(excl_ident),
          "excluded_no_coverage_data": len(excl_nocov), "pool": len(pool), "pool_by_stratum": {d: len(v) for d, v in strata.items()}}
exclusions = {"over_token_limit": [r["unit_id"] for r in sel["excluded"]], "identifier_initializer": excl_ident, "no_coverage_data": excl_nocov}
if counts != w2["counts"] or exclusions != w2["exclusions"]:
    sys.exit(f"STOP: pool differs from week 2\n{json.dumps(counts)}\n{json.dumps(w2['counts'])}\n{json.dumps(exclusions)}\n{json.dumps(w2['exclusions'])}")

by_id = {r["unit_id"]: r for r in kept}
def row(uid, d, origin):
    r = by_id[uid]; c = covd[uid]
    return {"unit_id": uid, "origin": origin, "class_name": r["class_name"], "file": r["file"], "dir": d, "kind": r["kind"], "kind_label": r["kind_label"],
            "loc": r["loc"], "unit_tokens": r["unit_tokens"], "prompt_tokens": r["prompt_tokens"], "max_prompt_tokens": r["max_prompt_tokens"],
            "dev_line_pct": c["line_pct"], "dev_executable_lines": c["executable_lines"], "dev_covered_lines": c["covered_lines"],
            "dev_branch_pct": c["branch_pct"], "dev_branches_total": c["branches_total"], "dev_branches_covered": c["branches_covered"]}

sampled = []
for s in w2["sampled"]:
    r = row(s["unit_id"], s["dir"], "week2")
    if {k: v for k, v in r.items() if k != "origin"} != s:
        sys.exit(f"STOP: rebuilt week-2 row differs for {s['unit_id']}")
    sampled.append(r)
week2_ids = {s["unit_id"] for s in sampled}
rng = random.Random(SEED)
for d, k in QUOTA_ADDED:
    candidates = sorted(uid for uid in strata[d] if uid not in week2_ids)
    sampled += [row(uid, d, "added") for uid in rng.sample(candidates, k)]
got = {d: sum(1 for s in sampled if s["dir"] == d) for d in QUOTA_TOTAL}
assert got == QUOTA_TOTAL, got

out = {"seeds": {"week2": WEEK2_SEED, "added": SEED}, "python": sys.version.split()[0], "method": __doc__.strip(),
       "quota": {"total": QUOTA_TOTAL, "week2": {d: sum(1 for s in w2["sampled"] if s["dir"] == d) for d in QUOTA_TOTAL}, "added": dict(QUOTA_ADDED)},
       "counts": counts, "exclusions": exclusions, "exclusions_source": "equal to results/week2/units-sampled.json (checked)",
       "sampled": sampled}
(EXP / "results/units-sampled.json").write_text(json.dumps(out, indent=2, ensure_ascii=False))
print(json.dumps(counts)); print("exclusions:", json.dumps(exclusions))
for i, s in enumerate(sampled, 1):
    print(i, s["unit_id"], s["origin"], s["dir"], s["class_name"], s["file"].removeprefix("packages/zod/src/v4/"), "./" + pathlib.PurePosixPath(s["file"]).stem + ".js", sep=" | ")
