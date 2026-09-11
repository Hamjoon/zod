"""run-coverage.py: Phase 6 (RQ5). For each structured extraction that loaded without error, copy it in place (D6),
run vitest with --coverage --coverage.reporter=json --coverage.include=<unit source file>, compute line/branch
coverage restricted to the unit's declaring statement range (same rule as the DEV baseline), then remove the copy.
Also records per (unit, technique): test cases, expect( calls, file LOC. Output: results/coverage/{unit}.{TECH}/ and
results/rq5-coverage.json. Run from the zod repo root.
"""
import json, re, subprocess, time
from pilot_common import ROOT, EXP, structured_files, placed, assert_clean, unit_coverage

tests = {(r["unit_id"], r["technique"]): r for r in json.loads((EXP / "results/phase5-tests.json").read_text(encoding="utf-8"))}
devcov = {r["unit_id"]: r for r in json.loads((EXP / "dev-baseline/dev-coverage-units.json").read_text(encoding="utf-8"))["units"]}
cdir = EXP / "results/coverage"; cdir.mkdir(parents=True, exist_ok=True)
rows = []
for unit, tech, gen in structured_files():
    code = gen.read_text(encoding="utf-8")
    size = {"file_loc": code.count("\n") + (0 if code.endswith("\n") else 1), "expect_calls": len(re.findall(r"\bexpect\s*\(", code)),
            "test_calls_static": len(re.findall(r"\b(test|it)(\.[A-Za-z]+)?\s*\(", code))}
    t = tests.get((unit["unit_id"], tech))
    row = {"unit_id": unit["unit_id"], "technique": tech, "source_file": unit["file"], "cases": t["cases"] if t else None, "passed": t["passed"] if t else None,
           "load_error": (t["load_error"] or bool(t["runner_error"])) if t else True, **size, "coverage": None, "dev_coverage": {k: devcov[unit["unit_id"]][k] for k in ["line_pct", "branch_pct", "executable_lines", "branches_total"]}}
    if row["load_error"]:
        row["coverage_skipped_reason"] = "file did not load without error in Phase 5"
    else:
        with placed(unit, gen) as dst:
            rd = cdir / f"{unit['unit_id']}.{tech}"; rd.mkdir(exist_ok=True)
            rel = str(dst.relative_to(ROOT)); t0 = time.perf_counter()
            timed_out = False
            try:
                p = subprocess.run(["npx", "vitest", "run", "--config", "experiments/pilot-2026-09-import/vitest.pilot.mts", "--coverage", "--coverage.reportOnFailure=true", "--coverage.reporter=json",
                                    f"--coverage.include={unit['file']}", f"--coverage.reportsDirectory={rd}", "--reporter=json", f"--outputFile.json={rd / 'run.json'}", rel],
                                   capture_output=True, text=True, cwd=ROOT, timeout=300)
            except subprocess.TimeoutExpired as e:
                timed_out = True
                stdout = e.stdout.decode("utf-8", "replace") if isinstance(e.stdout, bytes) else (e.stdout or "")
                stderr = e.stderr.decode("utf-8", "replace") if isinstance(e.stderr, bytes) else (e.stderr or "")
                p = subprocess.CompletedProcess(e.cmd, 124, stdout, stderr)
            (rd / "vitest.log").write_text(p.stdout + "\n--- stderr ---\n" + p.stderr, encoding="utf-8")
            cf = rd / "coverage-final.json"
            row["coverage"] = unit_coverage(cf, unit) if cf.exists() and not timed_out else {"error": "timeout" if timed_out else "no coverage-final.json", "vitest_exit": p.returncode}
            row["runner_error"] = "timeout" if timed_out else None
            row["coverage_seconds"] = round(time.perf_counter() - t0, 1)
    rows.append(row)
    c = row["coverage"] or {}
    print(f"{unit['unit_id']:<24} {tech:<5} load_error={row['load_error']} cases={row['cases']} expects={row['expect_calls']} loc={row['file_loc']} line={c.get('line_pct')} ({c.get('covered_lines')}/{c.get('executable_lines')}) branch={c.get('branch_pct')} ({c.get('branches_covered')}/{c.get('branches_total')}) dev_line={row['dev_coverage']['line_pct']}", flush=True)
assert_clean("Phase 6 coverage")
(EXP / "results/rq5-coverage.json").write_text(json.dumps({"rule": __doc__.strip(), "rows": rows}, indent=2), encoding="utf-8")
