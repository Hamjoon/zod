"""pilot_common.py: shared helpers for Phases 5 to 7 (in-place placement per D6, unit coverage rule)."""
import json, pathlib, shutil, subprocess
ROOT = pathlib.Path.cwd(); EXP = ROOT / "experiments/pilot-2026-09-import"
TECHS = ["COT", "TOT", "GTOT"]

def load_units():
    allu = json.loads((EXP / "results/units-all.json").read_text(encoding="utf-8"))
    by_id = {u["unit_id"]: u for u in allu["units"]}
    sampled = json.loads((EXP / "results/units-sampled.json").read_text(encoding="utf-8"))["sampled"]
    return [by_id[s["unit_id"]] for s in sampled]

def rq1_rows():
    return json.loads((EXP / "results/rq1-extraction.json").read_text(encoding="utf-8"))["rows"]

def structured_files():
    """[(unit, tech, generated_path)] for structured extractions, in sample order."""
    units = {u["unit_id"]: u for u in load_units()}
    return [(units[r["unit_id"]], r["technique"], EXP / r["saved_path"]) for r in rq1_rows() if r["extracted_structured"]]

def in_place_path(unit):
    return ROOT / pathlib.Path(unit["file"]).parent / f"{unit['class_name']}.pilot.test.ts"

class placed:
    """Copy a generated test file to its in-place path (D6) for the duration of a `with` block, then remove it."""
    def __init__(self, unit, src): self.unit = unit; self.src = pathlib.Path(src); self.dst = in_place_path(unit)
    def __enter__(self):
        assert self.dst.name.endswith(".pilot.test.ts")
        shutil.copyfile(self.src, self.dst); return self.dst
    def __exit__(self, *a):
        if self.dst.exists() and self.dst.name.endswith(".pilot.test.ts"): self.dst.unlink()

def assert_clean(phase):
    s = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True, cwd=ROOT).stdout
    left = [l for l in s.splitlines() if "pilot.test.ts" in l]
    tracked = subprocess.run(["git", "status", "--porcelain", "--untracked-files=no"], capture_output=True, text=True, cwd=ROOT).stdout.strip()
    if left or tracked: raise SystemExit(f"{phase}: tree not clean: pilot files {left}, tracked changes {tracked!r}")
    print(f"{phase}: git tree clean of pilot files and tracked changes")

def unit_coverage(cov_final_path, unit):
    """Same rule as dev-coverage-units.py: lines = statementMap entries whose start line lies in the declaring
    statement range (covered if s[id] > 0); branches = branchMap entries whose `line` lies in the range, one
    branch per location (covered if b[id][i] > 0)."""
    cov = json.loads(pathlib.Path(cov_final_path).read_text(encoding="utf-8"))
    prefix = str(ROOT) + "/"
    by_rel = {(k[len(prefix):] if k.startswith(prefix) else k): v for k, v in cov.items()}
    f = by_rel.get(unit["file"])
    lo, hi = unit["declaring_statement"]["code_start_line"], unit["declaring_statement"]["end_line"]
    r = {"range": [lo, hi], "file_in_coverage": f is not None}
    if f is None:
        r.update(executable_lines=0, covered_lines=0, line_pct=None, branches_total=0, branches_covered=0, branch_pct=None); return r
    ex, cv = set(), set()
    for sid, loc in f["statementMap"].items():
        ln = loc["start"]["line"]
        if lo <= ln <= hi:
            ex.add(ln)
            if f["s"][sid] > 0: cv.add(ln)
    bt = bc = 0
    for bid, br in f["branchMap"].items():
        if lo <= br["line"] <= hi:
            counts = f["b"][bid]; bt += len(counts); bc += sum(1 for c in counts if c > 0)
    r.update(executable_lines=len(ex), covered_lines=len(cv), line_pct=(round(100 * len(cv) / len(ex), 2) if ex else None),
             branches_total=bt, branches_covered=bc, branch_pct=(round(100 * bc / bt, 2) if bt else None))
    return r
