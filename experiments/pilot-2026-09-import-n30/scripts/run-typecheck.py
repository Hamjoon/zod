"""run-typecheck.py: Phase 5 step 2. For each structured extraction, copy it in place (D6), run
`npx tsc --noEmit --pretty false -p <generated tsconfig>` where the tsconfig extends packages/zod/tsconfig.test.json
and includes only the in-place file, then remove the copy. Records ok/error, error counts (in the checked file and
elsewhere in the program) and categories. Output: results/typecheck/{unit}.{TECH}.{tsconfig.json,tsc.log} and
results/phase5-typecheck.json. Run from the zod repo root.
"""
import argparse, json, re, subprocess, time
from pilot_common import ROOT, EXP, structured_files, placed, assert_clean

CATS = {"TS2307": "module_or_export_not_found", "TS2305": "module_or_export_not_found", "TS2459": "module_or_export_not_found", "TS2834": "module_or_export_not_found", "TS2835": "module_or_export_not_found", "TS2304": "name_not_found",
        "TS2339": "property_does_not_exist", "TS2345": "type_mismatch", "TS2322": "type_mismatch", "TS2551": "did_you_mean"}
CATS["TS2348"] = "constructor_called_without_new"
LINE = re.compile(r"^(.*?)\((\d+),(\d+)\): error (TS\d+): (.*)$", re.M)
tsdir = EXP / "results/typecheck"; tsdir.mkdir(parents=True, exist_ok=True)
ap = argparse.ArgumentParser(); ap.add_argument("--only"); args = ap.parse_args()
rows = []
for unit, tech, gen in structured_files():
    if args.only and f"{unit['unit_id']}.{tech}" != args.only: continue
    with placed(unit, gen) as dst:
        cfg = tsdir / f"{unit['unit_id']}.{tech}.tsconfig.json"
        cfg.write_text(json.dumps({"extends": str(ROOT / "packages/zod/tsconfig.test.json"), "compilerOptions": {"noEmit": True}, "include": [str(dst)]}, indent=2))
        t0 = time.perf_counter()
        p = subprocess.run(["npx", "tsc", "--noEmit", "--pretty", "false", "-p", str(cfg)], capture_output=True, text=True, cwd=ROOT)
        dt = time.perf_counter() - t0
        (tsdir / f"{unit['unit_id']}.{tech}.tsc.log").write_text(p.stdout + p.stderr, encoding="utf-8")
        rel = str(dst.relative_to(ROOT))
        errs = [{"file": m[0], "line": int(m[1]), "col": int(m[2]), "code": m[3], "message": m[4]} for m in LINE.findall(p.stdout)]
        in_file = [e for e in errs if e["file"].endswith(rel)]
        other = [e for e in errs if not e["file"].endswith(rel)]
        cats = {}
        for e in in_file:
            c = CATS.get(e["code"], "other"); cats[c] = cats.get(c, 0) + 1
        codes = {}
        for e in in_file: codes[e["code"]] = codes.get(e["code"], 0) + 1
        rows.append({"unit_id": unit["unit_id"], "technique": tech, "in_place_path": rel, "tsc_exit": p.returncode, "tsc_seconds": round(dt, 1),
                     "tsc_ok": p.returncode == 0 and not errs, "errors_in_file": len(in_file), "errors_elsewhere": len(other),
                     "categories": cats, "codes": codes, "first_errors": in_file[:5], "other_files_with_errors": sorted({e["file"] for e in other})[:5]})
        print(f"{unit['unit_id']:<24} {tech:<5} tsc_ok={rows[-1]['tsc_ok']} errors_in_file={len(in_file)} elsewhere={len(other)} cats={cats} ({dt:.0f}s)", flush=True)
assert_clean("Phase 5 typecheck")
if args.only:
    old_path = EXP / "results/phase5-typecheck.json"
    old = json.loads(old_path.read_text(encoding="utf-8")) if old_path.exists() else []
    keys = {(r["unit_id"], r["technique"]) for r in rows}
    rows = [r for r in old if (r["unit_id"], r["technique"]) not in keys] + rows
(EXP / "results/phase5-typecheck.json").write_text(json.dumps(rows, indent=2), encoding="utf-8")
