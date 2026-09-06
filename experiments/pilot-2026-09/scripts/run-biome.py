"""run-biome.py: Phase 7 biome lint with the repo config (biome.jsonc ignores experiments/, so LLM files are linted
at their in-place path per D6 and removed afterwards). Dev test files: one invocation over the three v4 tests
directories, diagnostics grouped per file. Output: results/phase7-biome.json. Run from the zod repo root.
"""
import json, subprocess
from pilot_common import ROOT, EXP, structured_files, placed, assert_clean

def biome(paths):
    p = subprocess.run(["npx", "biome", "lint", "--reporter=json", *paths], capture_output=True, text=True, cwd=ROOT)
    s = p.stdout; i = s.find("{")
    j = json.loads(s[i:]) if i >= 0 else {"summary": None, "diagnostics": [], "parse_error": (s + p.stderr)[-800:]}
    return p.returncode, j
def per_file(j):
    out = {}
    for d in j.get("diagnostics", []):
        f = ((d.get("location") or {}).get("path") or {}).get("file") or "?"
        e = out.setdefault(f, {"errors": 0, "warnings": 0, "categories": {}})
        sev = d.get("severity"); e["errors" if sev == "error" else "warnings"] += 1 if sev in ("error", "warning") else 0
        e["categories"][d.get("category")] = e["categories"].get(d.get("category"), 0) + 1
    return out
llm = []
for unit, tech, gen in structured_files():
    with placed(unit, gen) as dst:
        rel = str(dst.relative_to(ROOT)); rc, j = biome([rel]); pf = per_file(j).get(rel, {"errors": 0, "warnings": 0, "categories": {}})
        llm.append({"unit_id": unit["unit_id"], "technique": tech, "in_place_path": rel, "biome_exit": rc, "summary": j.get("summary"), **pf})
        print(f"{unit['unit_id']:<24} {tech:<5} errors={pf['errors']} warnings={pf['warnings']} cats={pf['categories']}", flush=True)
assert_clean("Phase 7 biome")
dev_dirs = ["packages/zod/src/v4/classic/tests", "packages/zod/src/v4/core/tests", "packages/zod/src/v4/mini/tests"]
rc, j = biome(dev_dirs); pf = per_file(j)
dev_files = sorted(str(p.relative_to(ROOT)) for d in dev_dirs for p in (ROOT / d).rglob("*.test.ts"))
dev = [{"file": f, **pf.get(f, {"errors": 0, "warnings": 0, "categories": {}})} for f in dev_files]
print(f"dev: files={len(dev)} errors={sum(d['errors'] for d in dev)} warnings={sum(d['warnings'] for d in dev)} biome_exit={rc} summary={j.get('summary')}")
(EXP / "results/phase7-biome.json").write_text(json.dumps({"biome_version": "1.9.4", "config": "biome.jsonc (repo)", "llm_files": llm, "dev_files": dev, "dev_summary": j.get("summary")}, indent=2), encoding="utf-8")
