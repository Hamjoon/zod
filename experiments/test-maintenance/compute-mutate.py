#!/usr/bin/env python3
"""Compute focused Stryker mutate scopes for a v2 case.

Scope = post-image hunk ranges of the net production change present in the
validated worktree (git diff -U0 <base_sha> over production .ts files, working
tree included). This equals the upstream production diff for S/N cases where the
model only touched tests, the model's own patch for P cases, and their
combination when a repair modified production on top of the fixture.

Usage: compute-mutate.py <case-id> [--before-repair]
  --before-repair  diff the fixture commit instead of the working tree
                   (for N-case before/after survived-set comparison)
Prints one line per production file: <prod_path>\t<file:range,file:range,...>
"""
import json
import re
import subprocess
import sys
from pathlib import Path

import os
import subprocess

def _repo_root() -> str:
    return os.environ.get("ZOD_THESIS_ROOT") or subprocess.check_output(
        ["git", "rev-parse", "--show-toplevel"], text=True
    ).strip()

ROOT = Path(_repo_root())
EXP = ROOT / "experiments/test-maintenance"
TEST_RE = re.compile(r"\.test\.ts$|/tests/")

case_id = sys.argv[1]
before_repair = "--before-repair" in sys.argv
case = next(c for c in json.loads((EXP / "cases.json").read_text()) if c["id"] == case_id)
wt = ROOT / ".worktrees" / case_id

# production .ts files: case metadata plus anything the model repair touched
prod_files = {p for p in case["prod_paths"] if p.startswith("packages/zod/") and p.endswith(".ts")}
repair_diff = EXP / "cases" / case_id / "applied-repair.diff"
if repair_diff.exists():
    for line in repair_diff.read_text().splitlines():
        if line.startswith("+++ b/"):
            path = line[6:].strip()
            if path.startswith("packages/zod/") and path.endswith(".ts") and not TEST_RE.search(path):
                prod_files.add(path)
prod_files = sorted(prod_files)
if not prod_files:
    sys.exit(0)

cmd = ["git", "-C", str(wt), "diff", "--no-renames", "--unified=0", case["base_sha"]]
if before_repair:
    cmd.append("HEAD")  # fixture commit
diff = subprocess.check_output([*cmd, "--", *prod_files], text=True)

ranges: dict[str, list[tuple[int, int]]] = {}
current = None
for line in diff.splitlines():
    if line.startswith("+++ "):
        current = re.sub(r"^\+\+\+ [ab]/", "", line).strip()
        if current == "/dev/null":
            current = None
    elif line.startswith("@@ ") and current:
        m = re.match(r"@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@", line)
        start = int(m.group(1))
        count = int(m.group(2)) if m.group(2) is not None else 1
        if count == 0:
            start, count = max(1, start), 1  # pure deletion: cover the adjacent line
        ranges.setdefault(current, []).append((start, start + count - 1))

for path in prod_files:
    if path not in ranges:
        continue
    merged: list[tuple[int, int]] = []
    for s, e in sorted(ranges[path]):
        if merged and s <= merged[-1][1] + 1:
            merged[-1] = (merged[-1][0], max(merged[-1][1], e))
        else:
            merged.append((s, e))
    mutate = ",".join(f"{path}:{s}-{e}" for s, e in merged)
    print(f"{path}\t{mutate}")
