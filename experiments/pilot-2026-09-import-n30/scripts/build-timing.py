"""build-timing.py: Phase 8 (D10b). Built only from results/phase-times.jsonl and per-file timing fields already recorded:
latency_s (phase3-runs.json), tsc_seconds (phase5-typecheck.json), seconds (phase5-tests.json), coverage_seconds
(rq5-coverage.json). Reports the wall-clock duration of each phase with review waiting time shown separately; per step
the number of files, total seconds, mean and maximum seconds per file (for steps timed as a whole: total / files, no
maximum); and the total machine time of the run (sum of phase durations, review waits excluded).
Output: results/timing.json and results/timing.md. Run from the zod repo root.
"""
import datetime, json, pathlib, statistics as st
ROOT = pathlib.Path.cwd(); EXP = ROOT / "experiments/pilot-2026-09-import-n30"; R = EXP / "results"
J = lambda p: json.loads(p.read_text(encoding="utf-8"))
ev = [json.loads(l) for l in (R / "phase-times.jsonl").read_text(encoding="utf-8").splitlines() if l.strip()]
T = lambda s: datetime.datetime.fromisoformat(s)

def spans(kind_start, kind_end):
    """(phase, step) -> list of (start, end) pairs, matched in order."""
    open_, out = {}, {}
    for e in ev:
        k = (e["phase"], e["step"])
        if e["event"] == kind_start: open_.setdefault(k, []).append(T(e["time"]))
        elif e["event"] == kind_end and open_.get(k):
            out.setdefault(k, []).append((open_[k].pop(0), T(e["time"])))
    return out

se = spans("start", "end"); waits = spans("stop", "resume")
phases = []
for (ph, step), ss in se.items():
    if step == "phase":
        for a, b in ss: phases.append({"phase": ph, "start": a.isoformat(), "end": b.isoformat(), "seconds": round((b - a).total_seconds(), 1)})
review = [{"after": step, "stop": a.isoformat(), "resume": b.isoformat(), "seconds": round((b - a).total_seconds(), 1)} for (ph, step), ss in waits.items() for a, b in ss]

# per-file timed steps
per_file = {
    ("phase3", "generation"): [r["latency_s"] for r in J(R / "phase3-runs.json") if r.get("latency_s") is not None],
    ("phase5", "typecheck"): [r["tsc_seconds"] for r in J(R / "phase5-typecheck.json") if r.get("tsc_seconds") is not None],
    ("phase5", "tests"): [r["seconds"] for r in J(R / "phase5-tests.json") if r.get("seconds") is not None],
    ("phase6", "coverage"): [r["coverage_seconds"] for r in J(R / "rq5-coverage.json")["rows"] if r.get("coverage_seconds") is not None],
}
# steps timed as a whole: file counts from the recorded outputs
n_structured = sum(1 for r in J(R / "rq1-extraction.json")["rows"] if r["extracted_structured"])
n_dev = len(J(R / "smells-dev.json"))
whole = {
    ("phase4", "extraction"): len(J(R / "rq1-extraction.json")["rows"]),
    ("phase5", "syntax"): len(J(R / "phase5-syntax.json")),
    ("phase5", "import-audit"): len(J(R / "rq2-import-audit.json")["rows"]),
    ("phase7", "biome"): len(J(R / "phase7-biome.json")["llm_files"]) + len(J(R / "phase7-biome.json")["dev_files"]),
    ("phase7", "smells-llm"): len(J(R / "smells-llm.json")),
    ("phase7", "smells-dev"): n_dev,
}
steps = []
for (ph, step), ss in se.items():
    if step == "phase": continue
    wall = round(sum((b - a).total_seconds() for a, b in ss), 1)
    row = {"phase": ph, "step": step, "wall_seconds": wall}
    if (ph, step) in per_file:
        xs = per_file[(ph, step)]
        row.update(files=len(xs), per_file_source="recorded per file", total_file_seconds=round(sum(xs), 1),
                   mean_s=round(st.mean(xs), 2) if xs else None, max_s=round(max(xs), 2) if xs else None)
    elif (ph, step) in whole:
        n = whole[(ph, step)]
        row.update(files=n, per_file_source="step timed as a whole (wall / files)", total_file_seconds=None,
                   mean_s=round(wall / n, 2) if n else None, max_s=None)
    steps.append(row)
machine = round(sum(p["seconds"] for p in phases), 1)
out = {"method": __doc__.strip(), "phases": phases, "review_waits": review, "steps": steps, "machine_seconds_total": machine,
       "review_wait_seconds_total": round(sum(r["seconds"] for r in review), 1),
       "notes": ["phase3 generation ran at concurrency 2, so the sum of per-call latencies exceeds the step's wall time",
                 "per-file seconds for typecheck, tests and coverage include npx/tsc/vitest start-up for each file"]}
(R / "timing.json").write_text(json.dumps(out, indent=2), encoding="utf-8")
hm = lambda s: f"{int(s // 60)} m {s % 60:.0f} s"
L = ["# Timing\n", "Times are KST. Built from `results/phase-times.jsonl` and the per-file fields recorded by the scripts.\n",
     "## Phases (wall clock)\n", "| phase | start | end | duration |", "|---|---|---|---:|"]
L += [f"| {p['phase']} | {p['start'][11:19]} | {p['end'][11:19]} | {hm(p['seconds'])} |" for p in phases]
L += ["", f"Total machine time (phases only): {hm(machine)}. Review waiting, shown separately:\n", "| after | stop | resume | waiting |", "|---|---|---|---:|"]
L += [f"| {r['after']} | {r['stop'][11:19]} | {r['resume'][11:19]} | {hm(r['seconds'])} |" for r in review]
L += ["", "## Steps\n", "| phase | step | wall | files | per-file total (s) | mean s/file | max s/file | basis |", "|---|---|---:|---:|---:|---:|---:|---|"]
for s in steps:
    L.append(f"| {s['phase']} | {s['step']} | {hm(s['wall_seconds'])} | {s.get('files', '-')} | {s.get('total_file_seconds') if s.get('total_file_seconds') is not None else '-'} | {s.get('mean_s') if s.get('mean_s') is not None else '-'} | {s.get('max_s') if s.get('max_s') is not None else '-'} | {s.get('per_file_source', 'no file count (setup or aggregation step)')} |")
L += ["", "Notes: " + " ".join(n[0].upper() + n[1:] + "." for n in out["notes"]), ""]
(R / "timing.md").write_text("\n".join(L), encoding="utf-8")
print("\n".join(L))
