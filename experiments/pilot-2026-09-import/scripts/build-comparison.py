"""Build the Phase 8 week-1/week-2 comparison only from recorded result files."""
import json, pathlib, statistics as st

ROOT = pathlib.Path.cwd(); EXP = ROOT / "experiments/pilot-2026-09-import"; R = EXP / "results"
J = lambda p: json.loads(pathlib.Path(p).read_text(encoding="utf-8"))
TECHS = ["COT", "TOT", "GTOT"]
CAT = {"TS2307": "module_or_path_not_found", "TS2305": "module_or_path_not_found", "TS2459": "module_or_path_not_found", "TS2834": "module_or_path_not_found", "TS2835": "module_or_path_not_found",
       "TS2304": "name_not_found", "TS2339": "property_does_not_exist", "TS2345": "type_mismatch", "TS2322": "type_mismatch", "TS2551": "did_you_mean"}
CAT["TS2348"] = "constructor_called_without_new"
PAPER = {"TS2307": "PDNE_like", "TS2834": "PDNE_like", "TS2835": "PDNE_like",
         "TS2305": "CFS_like", "TS2459": "CFS_like", "TS2724": "CFS_like", "TS2304": "CFS_like", "TS2552": "CFS_like", "TS2339": "CFS_like", "TS2551": "CFS_like",
         "TS2322": "type_or_argument_mismatch", "TS2345": "type_or_argument_mismatch", "TS2554": "type_or_argument_mismatch", "TS2555": "type_or_argument_mismatch"}
PAPER["TS2348"] = "constructor_called_without_new"

sampled = J(R / "units-sampled.json")["sampled"]
uids = [u["unit_id"] for u in sampled]
devcov = {u["unit_id"]: u for u in J(EXP / "dev-baseline/dev-coverage-units.json")["units"]}
audit = J(R / "rq2-import-audit.json")["rows"]

def grouped(codes, mapping):
    out = {}
    for code, n in codes.items():
        key = mapping.get(code, "other"); out[key] = out.get(key, 0) + n
    return out

def load_run(run):
    base = R if run == "week2" else R / "week1"
    return {"rq1": J(base / "rq1-extraction.json"), "rq2": J(base / "rq2-syntax-typecheck-run.json"), "rq5": J(base / "rq5-coverage.json"),
            "rq7": J(base / "rq7-static-quality.json"), "biome": J(base / "phase7-biome.json"), "smells": J(base / "smells-llm.json")}

def metrics(run, tech, d):
    r1 = [x for x in d["rq1"]["rows"] if x["technique"] == tech]
    r2 = [x for x in d["rq2"]["rows"] if x["technique"] == tech]
    r5 = [x for x in d["rq5"]["rows"] if x["technique"] == tech]
    ar = [x for x in audit if x["run"] == run and x["technique"] == tech]
    codes = {}
    for x in r2:
        if x.get("typecheck"):
            for code, n in x["typecheck"].get("codes", {}).items(): codes[code] = codes.get(code, 0) + n
    cases = sum((x.get("execution") or {}).get("cases", 0) for x in r2)
    passed = sum((x.get("execution") or {}).get("passed", 0) for x in r2)
    loaded = sum(1 for x in r2 if x.get("execution") and not x["execution"].get("load_error") and not x["execution"].get("runner_error"))
    lines = [((x.get("coverage") or {}).get("line_pct") or 0.0) for x in r5]
    by_cov = {(x["unit_id"], x["technique"]): x for x in r5}
    branches = [(((by_cov.get((uid, tech)) or {}).get("coverage") or {}).get("branch_pct") or 0.0) for uid in uids if devcov[uid]["branches_total"]]
    cut = {}
    for x in ar: cut[x["cut_import"]] = cut.get(x["cut_import"], 0) + 1
    q = d["rq7"]["per_technique"][tech]
    return {"run": run, "technique": tech, "files": len(r1), "MSR": sum(x["detected"] for x in r1), "CSR": sum(x["extracted_structured"] for x in r1),
            "CSR_strict": sum(x["extracted_structured_strict"] for x in r1), "syntax_ok": sum(bool((x.get("syntax") or {}).get("ok")) for x in r2),
            "tsc_ok": sum(bool((x.get("typecheck") or {}).get("ok")) for x in r2), "files_load": loaded, "cases_run": cases, "passed": passed,
            "pass_rate": round(passed / cases, 4) if cases else None, "unit_line_cov_mean": round(st.mean(lines), 2) if lines else None,
            "unit_branch_cov_mean": round(st.mean(branches), 2) if branches else None, "tsc_errors_in_file": sum(codes.values()), "tsc_codes": codes,
            "tsc_week1_categories": grouped(codes, CAT), "tsc_paper_layers": grouped(codes, PAPER), "cut_import_counts": cut,
            "non_cut_imports_unresolved": sum(x["non_cut_imports"]["unresolved"] for x in ar), "biome_errors": q["biome_errors"], "biome_warnings": q["biome_warnings"],
            "files_with_cut_calls_without_new": sum(x["cut_constructor_usage"]["calls_without_new"] > 0 for x in ar),
            "cut_calls_without_new": sum(x["cut_constructor_usage"]["calls_without_new"] for x in ar),
            "files_using_new_on_cut": sum(x["cut_constructor_usage"]["new_expressions"] > 0 for x in ar),
            "tests_ast": q["tests_ast"], "assertion_roulette": q["assertion_roulette_tests"], "magic_number": q["magic_number_tests"]}

rows = []
for tech in TECHS:
    for run in ["week1", "week2"]: rows.append(metrics(run, tech, load_run(run)))

def pooled(run):
    rs = [r for r in rows if r["run"] == run]
    cases = sum(r["cases_run"] for r in rs); passed = sum(r["passed"] for r in rs)
    def merge(key):
        out = {}
        for r in rs:
            for k, v in r[key].items(): out[k] = out.get(k, 0) + v
        return out
    return {"run": run, "technique": "POOLED", "files": sum(r["files"] for r in rs), "MSR": sum(r["MSR"] for r in rs), "CSR": sum(r["CSR"] for r in rs),
            "CSR_strict": sum(r["CSR_strict"] for r in rs), "syntax_ok": sum(r["syntax_ok"] for r in rs), "tsc_ok": sum(r["tsc_ok"] for r in rs),
            "files_load": sum(r["files_load"] for r in rs), "cases_run": cases, "passed": passed, "pass_rate": round(passed / cases, 4) if cases else None,
            "unit_line_cov_mean": round(st.mean(r["unit_line_cov_mean"] for r in rs), 2), "unit_branch_cov_mean": round(st.mean(r["unit_branch_cov_mean"] for r in rs), 2),
            "tsc_errors_in_file": sum(r["tsc_errors_in_file"] for r in rs), "tsc_codes": merge("tsc_codes"), "tsc_week1_categories": merge("tsc_week1_categories"),
            "tsc_paper_layers": merge("tsc_paper_layers"), "cut_import_counts": merge("cut_import_counts"), "non_cut_imports_unresolved": sum(r["non_cut_imports_unresolved"] for r in rs),
            "biome_errors": sum(r["biome_errors"] for r in rs), "biome_warnings": sum(r["biome_warnings"] for r in rs), "tests_ast": sum(r["tests_ast"] for r in rs),
            "files_with_cut_calls_without_new": sum(r["files_with_cut_calls_without_new"] for r in rs), "cut_calls_without_new": sum(r["cut_calls_without_new"] for r in rs),
            "files_using_new_on_cut": sum(r["files_using_new_on_cut"] for r in rs),
            "assertion_roulette": sum(r["assertion_roulette"] for r in rs), "magic_number": sum(r["magic_number"] for r in rs)}
rows.extend([pooled("week1"), pooled("week2")])

def pct(k, n): return f"{100*k/n:.1f}% ({k}/{n})" if n else "n/a"
def compact(x): return ", ".join(f"{k}={v}" for k, v in sorted(x.items())) or "—"
L = ["# Week 1 vs week 2 comparison", "", "All numbers are read from the archived week-1 and current-run result files.", "",
     "| technique | run | MSR | CSR | CSR strict | syntax ok | tsc ok | files load | cases | passed | pass rate | line cov mean | branch cov mean | tsc errors | week-1 categories | paper layers | CUT imports | non-CUT unresolved | files CUT-called without new | CUT calls without new | files using new | biome E/W | tests AST | assertion roulette | magic number |",
     "|---|---|---|---|---|---|---|---|---:|---:|---:|---:|---:|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|"]
for r in rows:
    L.append(f"| {r['technique']} | {r['run']} | {pct(r['MSR'],r['files'])} | {pct(r['CSR'],r['files'])} | {pct(r['CSR_strict'],r['files'])} | {pct(r['syntax_ok'],r['files'])} | {pct(r['tsc_ok'],r['files'])} | {pct(r['files_load'],r['files'])} | {r['cases_run']} | {r['passed']} | {str(round(100*r['pass_rate'],1))+'%' if r['pass_rate'] is not None else 'n/a'} | {r['unit_line_cov_mean']}% | {r['unit_branch_cov_mean']}% | {r['tsc_errors_in_file']} | {compact(r['tsc_week1_categories'])} | {compact(r['tsc_paper_layers'])} | {compact(r['cut_import_counts'])} | {r['non_cut_imports_unresolved']} | {r['files_with_cut_calls_without_new']} | {r['cut_calls_without_new']} | {r['files_using_new_on_cut']} | {r['biome_errors']}/{r['biome_warnings']} | {r['tests_ast']} | {r['assertion_roulette']} | {r['magic_number']} |")
L.extend(["", "Notes: coverage means use the matrix definition (missing/non-running files count as 0; branch denominator is sampled units with branches). `TS2305` and `TS2459` are module/path-not-found in the week-1 category view and CFS-like in the paper-layer view; `TS2348` is constructor-called-without-new in both views.", ""])
(R / "comparison-week1.md").write_text("\n".join(L), encoding="utf-8")
print("\n".join(L))
