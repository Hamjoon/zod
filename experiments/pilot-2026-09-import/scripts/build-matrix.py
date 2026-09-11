"""build-matrix.py: merge Phase 4 to 7 outputs into results/rq2-syntax-typecheck-run.json,
results/rq7-static-quality.json and results/matrix.md (rows COT, TOT, GTOT, DEV; ZSL/FSL pending).
Run from the zod repo root after run-biome.py.
"""
import json, pathlib, statistics as st
ROOT = pathlib.Path.cwd(); EXP = ROOT / "experiments/pilot-2026-09-import"; R = EXP / "results"
J = lambda p: json.loads(p.read_text(encoding="utf-8"))
TECHS = ["COT", "TOT", "GTOT"]; PENDING = ["ZSL", "FSL"]
sampled = J(R / "units-sampled.json")["sampled"]; UIDS = [s["unit_id"] for s in sampled]; N = len(UIDS)
rq1 = {(r["unit_id"], r["technique"]): r for r in J(R / "rq1-extraction.json")["rows"]}
rq1_summary = J(R / "rq1-extraction.json")["per_technique"]
syn = {}
for r in J(R / "phase5-syntax.json"):
    name = pathlib.Path(r["file"]).name[:-len(".test.ts")]; uid, tech = name.rsplit(".", 1); syn[(uid, tech)] = r
tc = {(r["unit_id"], r["technique"]): r for r in J(R / "phase5-typecheck.json")}
te = {(r["unit_id"], r["technique"]): r for r in J(R / "phase5-tests.json")}
cov = {(r["unit_id"], r["technique"]): r for r in J(R / "rq5-coverage.json")["rows"]}
biome = J(R / "phase7-biome.json"); bl = {(r["unit_id"], r["technique"]): r for r in biome["llm_files"]}
sm_llm = {}
for r in J(R / "smells-llm.json"):
    name = pathlib.Path(r["file"]).name[:-len(".test.ts")]; uid, tech = name.rsplit(".", 1); sm_llm[(uid, tech)] = r
sm_dev = J(R / "smells-dev.json")
devc = J(EXP / "dev-baseline/dev-counts.json"); devcov = {r["unit_id"]: r for r in J(EXP / "dev-baseline/dev-coverage-units.json")["units"]}
pool_ids = [r["unit_id"] for r in J(R / "units-selected.json")["units"] if r["kept"]]
excl = set(J(R / "units-sampled.json")["exclusions"]["identifier_initializer"])
pool_ids = [u for u in pool_ids if u not in excl]

# ---- RQ2 merged rows
# Category mapping for reporting (instruction §7 plus Cowork rulings R-02 / R-02b: TS2834 and TS2835 folded into "module or path not found").
# Per-row categories are recomputed from the recorded tsc codes; the Phase 5 mapping is kept as categories_phase5_mapping.
CAT_MAP = {"TS2307": "module_or_path_not_found", "TS2305": "module_or_path_not_found", "TS2459": "module_or_path_not_found", "TS2834": "module_or_path_not_found", "TS2835": "module_or_path_not_found",
           "TS2304": "name_not_found", "TS2339": "property_does_not_exist", "TS2345": "type_mismatch", "TS2322": "type_mismatch", "TS2551": "did_you_mean"}
CAT_MAP["TS2348"] = "constructor_called_without_new"
PAPER_MAP = {
    "TS2307": "PDNE_like", "TS2834": "PDNE_like", "TS2835": "PDNE_like",
    "TS2305": "CFS_like", "TS2459": "CFS_like", "TS2724": "CFS_like", "TS2304": "CFS_like", "TS2552": "CFS_like", "TS2339": "CFS_like", "TS2551": "CFS_like",
    "TS2322": "type_or_argument_mismatch", "TS2345": "type_or_argument_mismatch", "TS2554": "type_or_argument_mismatch", "TS2555": "type_or_argument_mismatch",
}
PAPER_MAP["TS2348"] = "constructor_called_without_new"
def categorize(codes):
    out = {}
    for k, v in codes.items():
        c = CAT_MAP.get(k, "other"); out[c] = out.get(c, 0) + v
    return out
def paper_layers(codes):
    out = {}
    for k, v in codes.items():
        c = PAPER_MAP.get(k, "other"); out[c] = out.get(c, 0) + v
    return out
rq2_rows = []
for uid in UIDS:
    for t in TECHS:
        e = rq1[(uid, t)]; row = {"unit_id": uid, "technique": t, "detected": e["detected"], "extracted_structured": e["extracted_structured"]}
        if e["extracted_structured"]:
            s = syn[(uid, t)]; c = tc[(uid, t)]; x = te[(uid, t)]
            row["syntax"] = {"ok": s["syntax_ok"], "error_count": s["error_count"], "first_messages": s["first_messages"]}
            row["typecheck"] = {"ok": c["tsc_ok"], "errors_in_file": c["errors_in_file"], "errors_elsewhere": c["errors_elsewhere"], "categories": categorize(c["codes"]), "categories_phase5_mapping": c["categories"], "paper_layers": paper_layers(c["codes"]), "codes": c["codes"], "first_errors": c["first_errors"][:3]}
            row["execution"] = {"runner_error": bool(x["runner_error"]), "load_error": x["load_error"], "load_error_message": (x["load_error_message"] or "")[:300] or None,
                                "runner_error_detail": x["runner_error"], "cases": x["cases"], "passed": x["passed"], "failed": x["failed"], "skipped": x["skipped"], "pass_rate": x["pass_rate"], "failure_kinds": x["failure_kinds"],
                                "case_results": x["case_results"]}
        else:
            row["syntax"] = row["typecheck"] = row["execution"] = None; row["note"] = "not extracted as a structured file (Phase 4)"
        rq2_rows.append(row)
def tech_rows(t): return [r for r in rq2_rows if r["technique"] == t]
rq2_summary = {}
for t in TECHS:
    rs = tech_rows(t); ex = [r for r in rs if r["extracted_structured"]]
    cases = sum(r["execution"]["cases"] for r in ex); passed = sum(r["execution"]["passed"] for r in ex)
    ran = [r for r in ex if not r["execution"]["load_error"] and not r["execution"]["runner_error"]]
    rq2_summary[t] = {"units": N, "structured_files": len(ex), "syntax_ok": sum(1 for r in ex if r["syntax"]["ok"]), "tsc_ok": sum(1 for r in ex if r["typecheck"]["ok"]),
                      "tsc_errors_in_file_total": sum(r["typecheck"]["errors_in_file"] for r in ex),
                      "tsc_categories_total": {k: sum(r["typecheck"]["categories"].get(k, 0) for r in ex) for k in sorted({k for r in ex for k in r["typecheck"]["categories"]})},
                      "tsc_paper_layers_total": {k: sum(r["typecheck"]["paper_layers"].get(k, 0) for r in ex) for k in sorted({k for r in ex for k in r["typecheck"]["paper_layers"]})},
                      "files_loaded": len(ran), "load_errors": sum(1 for r in ex if r["execution"]["load_error"]), "cases": cases, "passed": passed,
                      "pass_rate_pooled": round(passed / cases, 4) if cases else None,
                      "pass_rate_mean_per_file": round(st.mean([r["execution"]["pass_rate"] for r in ex if r["execution"]["pass_rate"] is not None]), 4) if any(r["execution"]["pass_rate"] is not None for r in ex) else None,
                      "failure_kinds_total": {k: sum(r["execution"]["failure_kinds"].get(k, 0) for r in ex) for k in sorted({k for r in ex for k in r["execution"]["failure_kinds"]})}}
week1_rq2 = J(R / "week1/rq2-syntax-typecheck-run.json")
def layer_summary(rows):
    out = {}
    for t in TECHS:
        codes = {}
        for r in rows:
            if r["technique"] == t and r.get("typecheck"):
                for k, v in r["typecheck"].get("codes", {}).items(): codes[k] = codes.get(k, 0) + v
        out[t] = {"codes": codes, "week1_categories": categorize(codes), "paper_layers": paper_layers(codes)}
    return out
paper_layer_view = {"definition": {"PDNE_like": ["TS2307", "TS2834", "TS2835"], "CFS_like": ["TS2305", "TS2459", "TS2724", "TS2304", "TS2552", "TS2339", "TS2551"], "type_or_argument_mismatch": ["TS2322", "TS2345", "TS2554", "TS2555"], "constructor_called_without_new": ["TS2348"], "other": "all remaining codes", "note": "TS2305 and TS2459 are module_or_path_not_found in the week-1 category view but CFS_like in this paper-layer view."},
                    "week1": layer_summary(week1_rq2["rows"]), "week2": layer_summary(rq2_rows)}
(R / "rq2-syntax-typecheck-run.json").write_text(json.dumps({"definitions": {"syntax": "ts.createSourceFile parseDiagnostics empty", "typecheck": "tsc --noEmit with a tsconfig extending packages/zod/tsconfig.test.json including only the in-place file; ok = exit 0 and no errors", "execution": "vitest run with vitest.pilot.mts in place, one file at a time; 300 s timeout; pass_rate = passed/cases per file; pooled = sum passed / sum cases per technique", "denominators": "per-technique counts are over the 5 sampled units; a unit with no structured extraction counts as not ok / 0 cases", "typecheck_categories": "instruction week-1 mapping; categories_phase5_mapping keeps the direct Phase 5 mapping for audit", "paper_layers": "PDNE-like, CFS-like, type or argument mismatch, other; reported for both runs"}, "per_technique": rq2_summary, "paper_layer_view": paper_layer_view, "rows": rq2_rows}, indent=2), encoding="utf-8")

# ---- RQ5 summaries
def covsum(t):
    rs = [cov.get((u, t)) for u in UIDS]
    line_all, br_all, line_ran, br_ran = [], [], [], []
    for r in rs:
        c = (r or {}).get("coverage") or {}
        lp = c.get("line_pct"); bp = c.get("branch_pct")
        line_all.append(lp if lp is not None else 0.0)
        if c.get("branches_total"): br_all.append(bp)
        if lp is not None: line_ran.append(lp)
        if bp is not None: br_ran.append(bp)
    compilable = [cov.get((u, t)) for u in UIDS if tc[(u, t)]["tsc_ok"] and cov.get((u, t)) and (cov[(u, t)].get("coverage") or {}).get("line_pct") is not None]
    comp_lines = [r["coverage"]["line_pct"] for r in compilable]
    comp_branches = [r["coverage"]["branch_pct"] for r in compilable if r["coverage"].get("branch_pct") is not None]
    return {"line_mean_over_units_missing_as_0": round(st.mean(line_all), 2), "line_mean_over_files_ran": round(st.mean(line_ran), 2) if line_ran else None, "n_ran": len(line_ran),
            "branch_mean_over_units_with_branches_missing_as_0": round(st.mean([((cov.get((u, t)) or {}).get("coverage") or {}).get("branch_pct") or 0.0 for u in UIDS if devcov[u]["branches_total"]]), 2),
            "branch_mean_over_files_ran": round(st.mean(br_ran), 2) if br_ran else None,
            "line_mean_over_files_also_pass_tsc": round(st.mean(comp_lines), 2) if comp_lines else None, "branch_mean_over_files_also_pass_tsc": round(st.mean(comp_branches), 2) if comp_branches else None, "n_files_also_pass_tsc": len(compilable),
            "cases_total": sum((cov.get((u, t)) or {}).get("cases") or 0 for u in UIDS), "cases_mean_per_unit": round(sum((cov.get((u, t)) or {}).get("cases") or 0 for u in UIDS) / N, 2),
            "expect_calls_total": sum((cov.get((u, t)) or {}).get("expect_calls") or 0 for u in UIDS), "loc_total": sum((cov.get((u, t)) or {}).get("file_loc") or 0 for u in UIDS)}
rq5 = {t: covsum(t) for t in TECHS}
dev_line_sampled = round(st.mean([devcov[u]["line_pct"] for u in UIDS]), 2); dev_branch_sampled = round(st.mean([devcov[u]["branch_pct"] for u in UIDS if devcov[u]["branch_pct"] is not None]), 2)
dev_line_pool = round(st.mean([devcov[u]["line_pct"] for u in pool_ids]), 2); dev_branch_pool = round(st.mean([devcov[u]["branch_pct"] for u in pool_ids if devcov[u]["branch_pct"] is not None]), 2)

# ---- RQ7 static quality
rq7 = {}
for t in TECHS:
    fs = [(u, t) for u in UIDS if (u, t) in sm_llm]
    tests = sum(sm_llm[k]["test_count"] for k in fs); ar = sum(sm_llm[k]["assertion_roulette_tests"] for k in fs); mn = sum(sm_llm[k]["magic_number_tests"] for k in fs)
    rq7[t] = {"files": len(fs), "biome_errors": sum(bl[k]["errors"] for k in fs if k in bl), "biome_warnings": sum(bl[k]["warnings"] for k in fs if k in bl),
              "biome_categories": {c: sum(bl[k]["categories"].get(c, 0) for k in fs if k in bl) for c in sorted({c for k in fs if k in bl for c in bl[k]["categories"]})},
              "tests_ast": tests, "expect_calls": sum(sm_llm[k]["expect_calls"] for k in fs), "assertion_roulette_tests": ar, "assertion_roulette_share": round(ar / tests, 4) if tests else None,
              "magic_number_tests": mn, "magic_number_share": round(mn / tests, 4) if tests else None}
dt = sum(f["test_count"] for f in sm_dev); dar = sum(f["assertion_roulette_tests"] for f in sm_dev); dmn = sum(f["magic_number_tests"] for f in sm_dev)
rq7["DEV"] = {"files": len(sm_dev), "biome_errors": sum(d["errors"] for d in biome["dev_files"]), "biome_warnings": sum(d["warnings"] for d in biome["dev_files"]), "biome_categories": {},
              "tests_ast": dt, "expect_calls": sum(f["expect_calls"] for f in sm_dev), "assertion_roulette_tests": dar, "assertion_roulette_share": round(dar / dt, 4), "magic_number_tests": dmn, "magic_number_share": round(dmn / dt, 4)}
(R / "rq7-static-quality.json").write_text(json.dumps({"rules": "results/smell-rules.md; biome 1.9.4 with biome.jsonc, LLM files linted at their in-place path", "per_technique": rq7,
    "per_file_llm": [{"unit_id": u, "technique": t, "biome": {k: bl[(u, t)][k] for k in ["errors", "warnings", "categories"]} if (u, t) in bl else None, "smells": {k: sm_llm[(u, t)][k] for k in ["test_count", "expect_calls", "assertion_roulette_tests", "assertion_roulette_share", "magic_number_tests", "magic_number_share", "file_loc"]} if (u, t) in sm_llm else None} for u in UIDS for t in TECHS]}, indent=2), encoding="utf-8")

# ---- matrix.md
pct = lambda k, n: f"{100 * k / n:.0f}% ({k}/{n})"
L = []
L.append("# Pilot matrix: paper-prompt techniques vs dev tests at t (zod v4.0.5, 5 sampled units)\n")
L.append("Rows COT, TOT, GTOT: 5 units each. ZSL and FSL: pending authors' reply (rendered, not sent). DEV: zod's own v4 test suite at t.\n")
L.append("| technique | MSR | CSR | syntax ok | tsc ok | pass rate at t | cases per unit (mean) | unit line cov (mean) | unit branch cov (mean) |")
L.append("|---|---|---|---|---|---|---|---|---|")
for t in PENDING: L.append(f"| {t} | pending authors' reply | pending | pending | pending | pending | pending | pending | pending |")
for t in TECHS:
    s = rq2_summary[t]; c = rq5[t]; e = rq1_summary[t]
    pr = f"{100 * s['pass_rate_pooled']:.0f}% ({s['passed']}/{s['cases']}; {s['files_loaded']} of {s['structured_files']} files loaded)" if s["cases"] else f"n/a (0 cases; {s['files_loaded']} loaded)"
    L.append(f"| {t} | {pct(e['MSR_detected']['k'], N)} | {pct(e['CSR_structured']['k'], N)} | {pct(s['syntax_ok'], N)} | {pct(s['tsc_ok'], N)} | {pr} | {c['cases_mean_per_unit']} ({c['cases_total']} total) | {c['line_mean_over_units_missing_as_0']}% ({'files ran: ' + str(c['line_mean_over_files_ran']) + '%, n=' + str(c['n_ran']) if c['n_ran'] else 'no file ran'}) | {c['branch_mean_over_units_with_branches_missing_as_0']}% ({'files ran: ' + str(c['branch_mean_over_files_ran']) + '%' if c['branch_mean_over_files_ran'] is not None else 'no file ran'}) |")
dr = devc["dev_row"]
L.append(f"| DEV | n/a (100% by construction) | n/a | n/a | n/a | {100 * dr['pass_rate']:.0f}% ({dr['passed']}/{dr['cases']} runtime cases, {dr['files']} files) | {dr['cases'] / dr['files']:.2f} per file (suite level; no per-unit mapping) | {dev_line_sampled}% (pool of {len(pool_ids)} units: {dev_line_pool}%) | {dev_branch_sampled}% (pool: {dev_branch_pool}%) |")
L.append("")
L.append("Definitions. MSR: a test block obtained from the response (delimiters or fallback) / 5 units. CSR: the block passes the structure checks (import, test call, expect, balanced braces, no fence lines, no HTML) / 5, with markdown emphasis around the markers accepted (J-02; strict values in `rq1-extraction.json`). syntax ok and tsc ok: structured files passing / 5 (a unit without a structured file counts as not ok). pass rate at t: pooled passed / cases over the technique's files; a file that fails to load contributes 0 cases. cases per unit: total cases / 5. Coverage: line and branch coverage of the unit's declaring statement (same rule as DEV); mean over the 5 units with a missing or non-loading file counted as 0%, and separately the mean over files that ran. Branch mean over units that have branches. DEV coverage: the whole dev suite's coverage of the same 5 units, and of the 228-unit pool.\n")
L.append("### Coverage restricted to files that also pass tsc\n")
L.append("| technique | compilable files with coverage | unit line cov (mean) | unit branch cov (mean) |")
L.append("|---|---:|---:|---:|")
for t in TECHS:
    c = rq5[t]
    L.append(f"| {t} | {c['n_files_also_pass_tsc']} | {str(c['line_mean_over_files_also_pass_tsc']) + '%' if c['line_mean_over_files_also_pass_tsc'] is not None else 'n/a'} | {str(c['branch_mean_over_files_also_pass_tsc']) + '%' if c['branch_mean_over_files_also_pass_tsc'] is not None else 'n/a'} |")
L.append("")
L.append("### tsc error codes in the checked files (all techniques)\n")
L.append("| technique | files checked | tsc ok | errors in file | module or path not found | name not found | property does not exist | type mismatch | did you mean | constructor called without new | other |")
L.append("|---|---|---|---|---|---|---|---|---|---|---|")
for t in TECHS:
    s_ = rq2_summary[t]; ct = s_["tsc_categories_total"]
    L.append(f"| {t} | {s_['structured_files']} | {s_['tsc_ok']} | {s_['tsc_errors_in_file_total']} | {ct.get('module_or_path_not_found', 0)} | {ct.get('name_not_found', 0)} | {ct.get('property_does_not_exist', 0)} | {ct.get('type_mismatch', 0)} | {ct.get('did_you_mean', 0)} | {ct.get('constructor_called_without_new', 0)} | {ct.get('other', 0)} |")
L.append("")
codes_all = {}
for r in rq2_rows:
    if r["extracted_structured"]:
        for k, v in r["typecheck"]["codes"].items(): codes_all[k] = codes_all.get(k, 0) + v
CODE_NOTE = {"TS2834": "relative import path needs an explicit file extension (nodenext)", "TS2835": "relative import path needs an explicit extension; did you mean './x.js'", "TS2304": "name not found", "TS2339": "property does not exist", "TS2348": "value is not callable; use new", "TS2459": "module declares symbol locally but does not export it", "TS7006": "parameter implicitly any", "TS7053": "element implicitly any (index)", "TS6133": "declared but never read", "TS2578": "unused @ts-expect-error", "TS2683": "'this' implicitly any", "TS18046": "value is of type unknown", "TS2698": "spread of non-object type"}
L.append("| code | count | meaning | reporting category |")
L.append("|---|---|---|---|")
for k, v in sorted(codes_all.items(), key=lambda kv: -kv[1]): L.append(f"| {k} | {v} | {CODE_NOTE.get(k, '')} | {CAT_MAP.get(k, 'other').replace('_', ' ')} |")
L.append("")
L.append("Categories follow the instruction's mapping with TS2834 and TS2835 (same import-path family) folded into 'module or path not found' (Cowork rulings R-02 and R-02b on O-10). The original Phase 5 mapping is kept per row in `rq2-syntax-typecheck-run.json` as `categories_phase5_mapping`.\n")
L.append("### Week-1 category view (both runs, recomputed from codes)\n")
L.append("| run | technique | module or path not found | name not found | property does not exist | type mismatch | did you mean | constructor called without new | other |")
L.append("|---|---|---:|---:|---:|---:|---:|---:|---:|")
for run in ["week1", "week2"]:
    for t in TECHS:
        p = paper_layer_view[run][t]["week1_categories"]
        L.append(f"| {run} | {t} | {p.get('module_or_path_not_found', 0)} | {p.get('name_not_found', 0)} | {p.get('property_does_not_exist', 0)} | {p.get('type_mismatch', 0)} | {p.get('did_you_mean', 0)} | {p.get('constructor_called_without_new', 0)} | {p.get('other', 0)} |")
L.append("")
L.append("### Paper compilation-error layers (both runs)\n")
L.append("| run | technique | PDNE-like | CFS-like | type or argument mismatch | constructor called without new | other |")
L.append("|---|---|---:|---:|---:|---:|---:|")
for run in ["week1", "week2"]:
    for t in TECHS:
        p = paper_layer_view[run][t]["paper_layers"]
        L.append(f"| {run} | {t} | {p.get('PDNE_like', 0)} | {p.get('CFS_like', 0)} | {p.get('type_or_argument_mismatch', 0)} | {p.get('constructor_called_without_new', 0)} | {p.get('other', 0)} |")
L.append("")
L.append("PDNE-like: TS2307, TS2834, TS2835. CFS-like: TS2305, TS2459, TS2724, TS2304, TS2552, TS2339, TS2551. Type or argument mismatch: TS2322, TS2345, TS2554, TS2555. Constructor called without new: TS2348. TS2305 and TS2459 remain in the week-1 module category above but are CFS-like here.\n")
L.append("## Per unit\n")
L.append("| unit | technique | structured | syntax | tsc errors (in file) | cases | passed | pass rate | line cov | branch cov | DEV line | DEV branch |")
L.append("|---|---|---|---|---|---|---|---|---|---|---|---|")
for u in UIDS:
    d = devcov[u]
    for t in TECHS:
        r = next(x for x in rq2_rows if x["unit_id"] == u and x["technique"] == t)
        if not r["extracted_structured"]:
            L.append(f"| {u} | {t} | no | - | - | - | - | - | - | - | {d['line_pct']}% | {d['branch_pct'] if d['branch_pct'] is not None else 'n/a'}% |"); continue
        x = r["execution"]; c = (cov.get((u, t)) or {}).get("coverage") or {}
        cats = ", ".join(f"{k}={v}" for k, v in r["typecheck"]["categories"].items()) or "0"
        run = "load error" if x["load_error"] else ("runner error" if x["runner_error"] else f"{x['pass_rate'] * 100:.0f}%" if x["pass_rate"] is not None else "-")
        lc = f"{c['line_pct']}% ({c['covered_lines']}/{c['executable_lines']})" if c.get("line_pct") is not None else "-"
        bc = f"{c['branch_pct']}% ({c['branches_covered']}/{c['branches_total']})" if c.get("branch_pct") is not None else ("n/a (0 branches)" if c and c.get("branches_total") == 0 else "-")
        L.append(f"| {u} | {t} | yes | {'ok' if r['syntax']['ok'] else 'error'} | {'ok' if r['typecheck']['ok'] else cats} | {x['cases']} | {x['passed']} | {run} | {lc} | {bc} | {d['line_pct']}% | {d['branch_pct'] if d['branch_pct'] is not None else 'n/a'}% |")
L.append("")
L.append("## Static quality (Phase 7)\n")
L.append("| technique | files | biome errors | biome warnings | tests (AST) | expect calls | assertion roulette | magic number |")
L.append("|---|---|---|---|---|---|---|---|")
for t in PENDING: L.append(f"| {t} | pending | pending | pending | pending | pending | pending | pending |")
for t in TECHS + ["DEV"]:
    q = rq7[t]
    L.append(f"| {t} | {q['files']} | {q['biome_errors']} | {q['biome_warnings']} | {q['tests_ast']} | {q['expect_calls']} | {q['assertion_roulette_tests']} ({100 * (q['assertion_roulette_share'] or 0):.1f}%) | {q['magic_number_tests']} ({100 * (q['magic_number_share'] or 0):.1f}%) |")
L.append("")
L.append("Smell rules: `results/smell-rules.md`. Biome: repo `biome.jsonc`, LLM files linted at their in-place path (the config ignores `experiments/`). Test counts here are static AST counts (dev: 820 = the typecheck-half count; the runtime half registers 888 because some tests are created in loops).\n")
(R / "matrix.md").write_text("\n".join(L), encoding="utf-8")
print("\n".join(L))
