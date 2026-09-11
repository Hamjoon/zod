"""run-tests.py: Phase 5 step 3. For each structured extraction, copy it in place (D6), run vitest with
experiments/pilot-2026-09-import/vitest.pilot.mts (JSON reporter, one file at a time), then remove the copy. Records per
case pass/fail and per file: cases, passed, failed, load error vs assertion vs runtime failure kinds.
Output: results/tests/{unit}.{TECH}.{json,log} and results/phase5-tests.json. Run from the zod repo root.
"""
import argparse, json, re, subprocess, time
from pilot_common import ROOT, EXP, structured_files, placed, assert_clean

tdir = EXP / "results/tests"; tdir.mkdir(parents=True, exist_ok=True)
ap = argparse.ArgumentParser(); ap.add_argument("--only"); args = ap.parse_args()
rows = []
def kind(msg):
    m = msg or ""
    if m.startswith("AssertionError") or "AssertionError" in m.split("\n")[0]: return "assertion_failure"
    return "runtime_error"
def error_name(msg):
    first = (msg or "").split("\n", 1)[0]
    m = re.match(r"(?:\x1b\[[0-9;]*m)*([A-Za-z_$][\w$]*(?:Error|Exception))\b", first)
    return m.group(1) if m else None
for unit, tech, gen in structured_files():
    if args.only and f"{unit['unit_id']}.{tech}" != args.only: continue
    with placed(unit, gen) as dst:
        out = tdir / f"{unit['unit_id']}.{tech}.json"
        if out.exists(): out.unlink()
        rel = str(dst.relative_to(ROOT))
        t0 = time.perf_counter()
        timed_out = False
        try:
            p = subprocess.run(["npx", "vitest", "run", "--config", "experiments/pilot-2026-09-import/vitest.pilot.mts", "--reporter=json", f"--outputFile.json={out}", rel],
                               capture_output=True, text=True, cwd=ROOT, timeout=300)
        except subprocess.TimeoutExpired as e:
            timed_out = True
            stdout = e.stdout.decode("utf-8", "replace") if isinstance(e.stdout, bytes) else (e.stdout or "")
            stderr = e.stderr.decode("utf-8", "replace") if isinstance(e.stderr, bytes) else (e.stderr or "")
            p = subprocess.CompletedProcess(e.cmd, 124, stdout, stderr)
        dt = time.perf_counter() - t0
        (tdir / f"{unit['unit_id']}.{tech}.log").write_text(p.stdout + "\n--- stderr ---\n" + p.stderr, encoding="utf-8")
        row = {"unit_id": unit["unit_id"], "technique": tech, "in_place_path": rel, "vitest_exit": p.returncode, "seconds": round(dt, 1),
               "runner_error": None, "load_error": False, "load_error_message": None, "cases": 0, "passed": 0, "failed": 0, "skipped": 0,
               "pass_rate": None, "failure_kinds": {}, "case_results": []}
        if timed_out:
            row["runner_error"] = "timeout"
        elif not out.exists():
            row["runner_error"] = (p.stderr or p.stdout)[-1500:]
        else:
            r = json.loads(out.read_text(encoding="utf-8"))
            ents = [e for e in r["testResults"] if e["name"].endswith(rel)] or r["testResults"]
            if not ents:
                row["runner_error"] = "no testResults entry"; row["load_error"] = True
            else:
                e = ents[0]; cases = e["assertionResults"]
                if e["status"] == "failed" and len(cases) == 0:
                    row["load_error"] = True; row["load_error_message"] = (e.get("message") or "")[:1500]
                for c in cases:
                    st = c["status"]; fm = (c.get("failureMessages") or [""])[0]
                    row["case_results"].append({"name": c["fullName"], "status": st, "failure_kind": kind(fm) if st == "failed" else None,
                                                "error_name": error_name(fm) if st == "failed" else None,
                                                "failure_message": fm[:400] if st == "failed" else None})
                row["cases"] = len(cases); row["passed"] = sum(1 for c in cases if c["status"] == "passed"); row["failed"] = sum(1 for c in cases if c["status"] == "failed")
                row["skipped"] = row["cases"] - row["passed"] - row["failed"]
                row["pass_rate"] = round(row["passed"] / row["cases"], 4) if row["cases"] else None
                for c in row["case_results"]:
                    if c["failure_kind"]: row["failure_kinds"][c["failure_kind"]] = row["failure_kinds"].get(c["failure_kind"], 0) + 1
                if row["load_error"]: row["failure_kinds"]["load_error"] = 1
        rows.append(row)
        print(f"{unit['unit_id']:<24} {tech:<5} exit={p.returncode} load_error={row['load_error']} cases={row['cases']} passed={row['passed']} failed={row['failed']} kinds={row['failure_kinds']} runner_error={'yes' if row['runner_error'] else 'no'} ({dt:.0f}s)", flush=True)
assert_clean("Phase 5 execution")
if args.only:
    old_path = EXP / "results/phase5-tests.json"
    old = json.loads(old_path.read_text(encoding="utf-8")) if old_path.exists() else []
    keys = {(r["unit_id"], r["technique"]) for r in rows}
    rows = [r for r in old if (r["unit_id"], r["technique"]) not in keys] + rows
(EXP / "results/phase5-tests.json").write_text(json.dumps(rows, indent=2), encoding="utf-8")
