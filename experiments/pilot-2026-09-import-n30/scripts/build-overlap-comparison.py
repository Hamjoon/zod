"""build-overlap-comparison.py: Phase 8 (D10a). The five units repeated from week 2, x COT, TOT, GTOT = 15 pairs.
For each pair, one row per run (week2, n30) with the measures below, read from recorded result files only:
week 2 from results/week2/ (import audit: rows with run == "week2") and results/week2-generated/ (the week-2
extracted test files, copied from the week-2 archive commit); this run from results/ and generated/.
Per pair: whether the extracted test files are byte-identical and, if not, the size of the unified diff in lines
(difflib.unified_diff, n=3, all output lines including headers) and the added/removed line counts.
Output: results/comparison-week2-overlap.json and .md. Run from the zod repo root.
"""
import difflib, json, pathlib
ROOT = pathlib.Path.cwd(); EXP = ROOT / "experiments/pilot-2026-09-import-n30"; R = EXP / "results"
J = lambda p: json.loads(p.read_text(encoding="utf-8"))
TECHS = ["COT", "TOT", "GTOT"]
units = [s["unit_id"] for s in J(R / "units-sampled.json")["sampled"] if s["origin"] == "week2"]
assert units == [s["unit_id"] for s in J(R / "week2/units-sampled.json")["sampled"]]

def load(base, audit_run, gen_dir):
    k = lambda r: (r["unit_id"], r["technique"])
    p3 = {k(r): r for r in J(base / "phase3-runs.json")}
    rq1 = {k(r): r for r in J(base / "rq1-extraction.json")["rows"]}
    rq2 = {k(r): r for r in J(base / "rq2-syntax-typecheck-run.json")["rows"]}
    cov = {k(r): r for r in J(base / "rq5-coverage.json")["rows"]}
    aud = {k(r): r for r in J(base / "rq2-import-audit.json")["rows"] if r["run"] == audit_run}
    q7 = {k(r): r for r in J(base / "rq7-static-quality.json")["per_file_llm"]}
    return {"p3": p3, "rq1": rq1, "rq2": rq2, "cov": cov, "aud": aud, "q7": q7, "gen": gen_dir}

RUNS = {"week2": load(R / "week2", "week2", R / "week2-generated"), "n30": load(R, "n30", EXP / "generated")}

def measures(run, u, t):
    d = RUNS[run]; key = (u, t)
    p3 = d["p3"].get(key) or {}; e = d["rq1"].get(key) or {}; r2 = d["rq2"].get(key) or {}
    ex = r2.get("execution") or {}; tc = r2.get("typecheck") or {}; sy = r2.get("syntax") or {}
    c = ((d["cov"].get(key) or {}).get("coverage") or {}); a = d["aud"].get(key) or {}; q = d["q7"].get(key) or {}
    structured = bool(e.get("extracted_structured"))
    return {
        "provider": p3.get("provider"), "completion_tokens": p3.get("completion_tokens"), "finish_reason": p3.get("finish_reason"),
        "csr": structured, "csr_strict": e.get("extracted_structured_strict"),
        "syntax_ok": sy.get("ok") if structured else None, "tsc_ok": tc.get("ok") if structured else None,
        "tsc_errors_in_file": tc.get("errors_in_file") if structured else None, "tsc_codes": tc.get("codes") if structured else None,
        "file_loads": (not ex.get("load_error") and not ex.get("runner_error")) if structured else None,
        "cases": ex.get("cases") if structured else None, "passed": ex.get("passed") if structured else None,
        "unit_line_cov": c.get("line_pct"),
        "cut_import": a.get("cut_import"), "cut_calls_without_new": (a.get("cut_constructor_usage") or {}).get("calls_without_new"),
        "cut_new_expressions": (a.get("cut_constructor_usage") or {}).get("new_expressions"),
        "biome_errors": (q.get("biome") or {}).get("errors"), "tests_ast": (q.get("smells") or {}).get("test_count"),
    }

def gen_file(run, u, t):
    p = RUNS[run]["gen"] / f"{u}.{t}.test.ts"
    return p.read_text(encoding="utf-8") if p.exists() else None

pairs = []
for u in units:
    for t in TECHS:
        w, n = measures("week2", u, t), measures("n30", u, t)
        a, b = gen_file("week2", u, t), gen_file("n30", u, t)
        if a is None or b is None:
            ident = None; diff_lines = added = removed = None
        else:
            ident = a == b
            dl = list(difflib.unified_diff(a.splitlines(), b.splitlines(), "week2", "n30", lineterm="", n=3)) if not ident else []
            diff_lines = len(dl)
            added = sum(1 for l in dl if l.startswith("+") and not l.startswith("+++"))
            removed = sum(1 for l in dl if l.startswith("-") and not l.startswith("---"))
        uses_new = lambda m: (m["cut_new_expressions"] or 0) > 0
        load_status = lambda m: "no file" if not m["csr"] else ("loads" if m["file_loads"] else "load error")
        pairs.append({"unit_id": u, "technique": t, "week2": w, "n30": n, "extracted_file_identical": ident,
                      "unified_diff_lines": diff_lines, "diff_added_lines": added, "diff_removed_lines": removed,
                      "load_status": {"week2": load_status(w), "n30": load_status(n)}, "load_status_changed": load_status(w) != load_status(n),
                      "passed_changed": (w["passed"] or 0) != (n["passed"] or 0),
                      "new_use_changed": uses_new(w) != uses_new(n),
                      "calls_without_new_presence_changed": ((w["cut_calls_without_new"] or 0) > 0) != ((n["cut_calls_without_new"] or 0) > 0)})

pool = lambda run, f: sum((p[run][f] or 0) for p in pairs)
summary = {
    "pairs": len(pairs),
    "identical_extracted_files": sum(1 for p in pairs if p["extracted_file_identical"]),
    "pairs_without_both_files": sum(1 for p in pairs if p["extracted_file_identical"] is None),
    "load_status_changed": sum(1 for p in pairs if p["load_status_changed"]),
    "passed_count_changed": sum(1 for p in pairs if p["passed_changed"]),
    "new_use_changed": sum(1 for p in pairs if p["new_use_changed"]),
    "calls_without_new_presence_changed": sum(1 for p in pairs if p["calls_without_new_presence_changed"]),
    "pooled": {run: {"cases": pool(run, "cases"), "passed": pool(run, "passed"), "files_loaded": sum(1 for p in pairs if p[run]["file_loads"]),
                     "tsc_ok": sum(1 for p in pairs if p[run]["tsc_ok"]), "structured": sum(1 for p in pairs if p[run]["csr"])} for run in ["week2", "n30"]},
    "definitions": {"load_status": "three states: loads, load error, no file (no structured extraction); changed if the state differs",
                    "passed_changed": "passed count differs, a pair side without a structured file counted as 0 passed (matrix convention)",
                    "new_use_changed": "whether the file has at least one `new <CUT>` expression differs between runs",
                    "calls_without_new_presence_changed": "whether the file has at least one call of the CUT without `new` differs between runs",
                    "unified_diff_lines": "number of lines of difflib.unified_diff(week2, n30, n=3), headers included"},
}
(R / "comparison-week2-overlap.json").write_text(json.dumps({"method": __doc__.strip(), "summary": summary, "pairs": pairs}, indent=2), encoding="utf-8")

fmt = lambda v: "-" if v is None else ("yes" if v is True else "no" if v is False else str(v))
codes = lambda c: ", ".join(f"{k}×{v}" for k, v in sorted(c.items(), key=lambda kv: -kv[1])) if c else ("-" if c is None else "none")
L = ["# Overlap comparison: five week-2 units regenerated in n30\n",
     "Same prompts (byte-identical), same model and settings. One row per run per pair; week-2 values read from `results/week2/`.\n",
     "| unit | tech | run | provider | compl. tokens | CSR | CSR strict | syntax | tsc ok | tsc errors | tsc codes | loads | cases | passed | line cov | CUT import | CUT calls w/o new | CUT new | biome errors | tests (AST) |",
     "|---|---|---|---|---:|---|---|---|---|---:|---|---|---:|---:|---:|---|---:|---:|---:|---:|"]
for p in pairs:
    for run in ["week2", "n30"]:
        m = p[run]
        L.append(f"| {p['unit_id']} | {p['technique']} | {run} | {fmt(m['provider'])} | {fmt(m['completion_tokens'])} | {fmt(m['csr'])} | {fmt(m['csr_strict'])} | {fmt(m['syntax_ok'])} | {fmt(m['tsc_ok'])} | {fmt(m['tsc_errors_in_file'])} | {codes(m['tsc_codes'])} | {fmt(m['file_loads'])} | {fmt(m['cases'])} | {fmt(m['passed'])} | {fmt(m['unit_line_cov'])} | {fmt(m['cut_import'])} | {fmt(m['cut_calls_without_new'])} | {fmt(m['cut_new_expressions'])} | {fmt(m['biome_errors'])} | {fmt(m['tests_ast'])} |")
L += ["", "## Per pair\n", "| unit | tech | extracted file identical | unified diff lines (+/-) | load status (week2 → n30) | passed (week2 → n30) | `new` use changed |", "|---|---|---|---|---|---|---|"]
for p in pairs:
    dd = "-" if p["unified_diff_lines"] is None else (f"{p['unified_diff_lines']} (+{p['diff_added_lines']}/-{p['diff_removed_lines']})" if not p["extracted_file_identical"] else "0")
    L.append(f"| {p['unit_id']} | {p['technique']} | {fmt(p['extracted_file_identical'])} | {dd} | {p['load_status']['week2']} → {p['load_status']['n30']}{' (changed)' if p['load_status_changed'] else ''} | {p['week2']['passed'] or 0}/{p['week2']['cases'] or 0} → {p['n30']['passed'] or 0}/{p['n30']['cases'] or 0}{' (changed)' if p['passed_changed'] else ''} | {fmt(p['new_use_changed'])} |")
s = summary
L += ["", "## Summary\n",
      f"- Pairs with byte-identical extracted files: {s['identical_extracted_files']} of {s['pairs']} (pairs without a structured file in at least one run: {s['pairs_without_both_files']}).",
      f"- Pairs whose load status changed: {s['load_status_changed']}.",
      f"- Pairs whose passed count changed: {s['passed_count_changed']}.",
      f"- Pairs whose use of `new` on the class changed: {s['new_use_changed']} (presence of calls without `new` changed: {s['calls_without_new_presence_changed']}).",
      f"- Pooled over the 15 pairs, week 2: {s['pooled']['week2']['passed']}/{s['pooled']['week2']['cases']} cases passed, {s['pooled']['week2']['files_loaded']} files loaded, {s['pooled']['week2']['tsc_ok']} tsc ok; n30: {s['pooled']['n30']['passed']}/{s['pooled']['n30']['cases']} cases passed, {s['pooled']['n30']['files_loaded']} files loaded, {s['pooled']['n30']['tsc_ok']} tsc ok.", ""]
(R / "comparison-week2-overlap.md").write_text("\n".join(L), encoding="utf-8")
print("\n".join(L[-7:]))
