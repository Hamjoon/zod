#!/usr/bin/env python3
"""Aggregate cases/<id>/result.json + usage + signal summaries into a results table (markdown + JSON)."""
import json
from pathlib import Path

import os
import subprocess

def _repo_root() -> str:
    return os.environ.get("ZOD_THESIS_ROOT") or subprocess.check_output(
        ["git", "rev-parse", "--show-toplevel"], text=True
    ).strip()

ROOT = Path(_repo_root())
EXP = ROOT / "experiments/zod-repair-classification-v2"

rows = []
for case in json.loads((EXP / "cases.json").read_text()):
    cid = case["id"]
    casedir = EXP / "cases" / cid
    result = json.loads((casedir / "result.json").read_text()) if (casedir / "result.json").exists() else {}
    usage = json.loads((casedir / "gptoss-usage.json").read_text()) if (casedir / "gptoss-usage.json").exists() else {}
    signals = sorted(casedir.glob("signal*/**/signal-summary.json")) + sorted(casedir.glob("signal*/signal-summary.json"))
    seen = set()
    sig = []
    for s in signals:
        if s in seen:
            continue
        seen.add(s)
        data = json.loads(s.read_text())
        totals = data.get("mutation", {}).get("summary", {}).get("totals", {}) or {}
        sig.append({
            "path": str(s.relative_to(casedir)),
            "verdict": data.get("verdict"),
            "killed": totals.get("Killed", 0),
            "survived": totals.get("Survived", 0),
            "timeout": totals.get("Timeout", 0),
            "no_coverage": totals.get("NoCoverage", 0),
        })
    rows.append({
        "id": cid,
        "category": case["category"],
        "upstream_sha": case["upstream_sha"],
        "base_sha": case["base_sha"],
        "dist_mode": case["dist_mode"],
        "expected": result.get("expected"),
        "decision": result.get("decision"),
        "decision_match": result.get("decision_match"),
        "has_diff": result.get("has_diff"),
        "validation": result.get("validation"),
        "completeness": result.get("completeness"),
        "preservation": result.get("preservation"),
        "preservation_note": result.get("preservation_note"),
        "apply_method": result.get("apply_method"),
        "note": result.get("note"),
        "prompt_tokens": usage.get("prompt_tokens"),
        "completion_tokens": usage.get("completion_tokens"),
        "cost": usage.get("cost"),
        "signal": sig,
    })

(EXP / "results-summary.json").write_text(json.dumps(rows, indent=2) + "\n")

def sigcell(row):
    if not row["signal"]:
        return "-"
    parts = []
    for s in row["signal"]:
        parts.append(f'{s["verdict"]} (K{s["killed"]}/S{s["survived"]}/T{s["timeout"]}/N{s["no_coverage"]})')
    return "; ".join(parts)

lines = ["| id | cat | expected | decision | match | validation | apply | signal | cost |", "|---|---|---|---|---|---|---|---|---|"]
for r in rows:
    lines.append(
        f'| {r["id"]} | {r["category"]} | {r["expected"]} | {r["decision"]} | '
        f'{"✅" if r["decision_match"] else "❌"} | {r["validation"]} | {r["apply_method"]} | {sigcell(r)} | {r["cost"]} |'
    )
print("\n".join(lines))
