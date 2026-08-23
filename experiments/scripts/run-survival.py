#!/usr/bin/env python3
"""
Zod main experiment (2026-08 week4) - Phase 5: survival tracking

Walks the window t..HEAD commit by commit, running the generated tests at each
commit and recording, per case, the first commit at which it stops passing.

Rules:
  - Only cases that passed the t gate are tracked. Cases dropped at t are carried
    in the files but excluded from the survival record.
  - Dependencies are reinstalled whenever pnpm-lock.yaml changes between commits.
  - A case is "broken" at the first commit where it does not pass. Its later
    results are still recorded but it no longer counts as alive.
  - A case still passing at the final commit is "censored" (survived the window).

Usage:
  python3 run-survival.py --repo <zod clone> --commits <file> --out <dir> [--limit N]
"""

import argparse
import json
import os
import subprocess
import time
from pathlib import Path

CONFIG = "experiments/vitest.gate.mts"
LOCKFILE = "pnpm-lock.yaml"


def sh(cmd, cwd=None, timeout=1800, check=False):
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=timeout)
    if check and r.returncode != 0:
        raise RuntimeError(f"{' '.join(cmd)}\n{r.stderr[-2000:]}")
    return r


def lock_hash(repo: Path, commit: str) -> str:
    r = sh(["git", "-C", str(repo), "rev-parse", f"{commit}:{LOCKFILE}"])
    return r.stdout.strip() if r.returncode == 0 else "missing"


def run_tests(repo: Path, out_json: Path) -> dict:
    """Run vitest and return {case_key: status}. case_key = 'file::fullName'."""
    r = sh(["npx", "vitest", "run", "--config", CONFIG,
            "--reporter=json", f"--outputFile={out_json}"],
           cwd=str(repo), timeout=1800)
    if not out_json.exists():
        return {"__harness_error__": (r.stderr or r.stdout)[-1500:]}
    try:
        d = json.loads(out_json.read_text())
    except Exception as e:
        return {"__harness_error__": f"json parse: {e}"}
    res = {}
    for t in d.get("testResults", []):
        f = os.path.basename(t.get("name", ""))
        for a in t.get("assertionResults", []):
            key = f"{f}::{a.get('fullName') or a.get('title')}"
            res[key] = a.get("status")
    return res


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", required=True)
    ap.add_argument("--commits", required=True, help="one commit sha per line, oldest first")
    ap.add_argument("--out", required=True)
    ap.add_argument("--limit", type=int, default=None, help="only the first N commits (timing probe)")
    ap.add_argument("--baseline", default=None, help="t-gate result json, to fix the tracked set")
    args = ap.parse_args()

    repo = Path(args.repo).resolve()
    out = Path(args.out).resolve()
    out.mkdir(parents=True, exist_ok=True)
    commits = [c.strip() for c in Path(args.commits).read_text().split() if c.strip()]
    if args.limit:
        commits = commits[: args.limit]

    # Cases tracked = those that passed at t
    tracked = None
    if args.baseline:
        d = json.load(open(args.baseline))
        tracked = set()
        for t in d.get("testResults", []):
            f = os.path.basename(t.get("name", ""))
            for a in t.get("assertionResults", []):
                if a.get("status") == "passed":
                    tracked.add(f"{f}::{a.get('fullName') or a.get('title')}")
        print(f"[info] tracking {len(tracked)} cases that passed at t", flush=True)

    log_path = out / "survival-log.jsonl"

    # Resume: replay the existing log to restore state and skip finished commits
    broken = {}          # case -> {commit, index}
    alive = set(tracked) if tracked else None
    done_upto = 0
    if log_path.exists():
        for line in log_path.read_text().splitlines():
            if not line.strip():
                continue
            r = json.loads(line)
            done_upto = max(done_upto, r["index"])
            for case in r.get("newly_broken", []):
                broken[case] = {"commit": r["commit"], "index": r["index"], "status": "failed"}
                if alive is not None:
                    alive.discard(case)
        if done_upto:
            print(f"[resume] {done_upto} commits already logged; "
                  f"{len(broken)} broken, {len(alive) if alive is not None else '-'} alive",
                  flush=True)

    log = log_path.open("a")
    prev_lock = None     # force an install on the first commit after a resume
    installs = 0
    t_start = time.time()

    for i, commit in enumerate(commits, 1):
        if i <= done_upto:
            continue
        c0 = time.time()
        sh(["git", "-C", str(repo), "checkout", "-q", commit], check=True)

        lh = lock_hash(repo, commit)
        did_install = False
        if lh != prev_lock:
            r = sh(["pnpm", "install", "--frozen-lockfile", "--reporter=silent"],
                   cwd=str(repo), timeout=1800)
            did_install = True
            installs += 1
            prev_lock = lh

        res = run_tests(repo, out / "_run.json")
        harness_err = res.get("__harness_error__")

        newly = []
        if alive is not None and not harness_err:
            for case in sorted(alive):
                if res.get(case) != "passed":
                    broken[case] = {"commit": commit, "index": i,
                                    "status": res.get(case, "absent")}
                    newly.append(case)
            alive -= set(newly)

        rec = {
            "index": i, "commit": commit,
            "elapsed_s": round(time.time() - c0, 1),
            "installed": did_install,
            "alive": len(alive) if alive is not None else None,
            "newly_broken": newly,
        }
        if harness_err:
            rec["harness_error"] = harness_err
        log.write(json.dumps(rec) + "\n")
        log.flush()

        flag = " INSTALL" if did_install else ""
        note = f"  BROKE {len(newly)}: {newly[0][:70]}" if newly else ""
        if harness_err:
            note = "  HARNESS ERROR"
        print(f"[{i:3d}/{len(commits)}] {commit[:8]} {rec['elapsed_s']:6.1f}s "
              f"alive={rec['alive']}{flag}{note}", flush=True)

    log.close()
    summary = {
        "commits_run": len(commits),
        "tracked": len(tracked) if tracked else None,
        "broken": broken,
        "censored": sorted(alive) if alive is not None else None,
        "installs": installs,
        "total_minutes": round((time.time() - t_start) / 60, 1),
    }
    (out / "survival-summary.json").write_text(json.dumps(summary, indent=2))
    print(f"\n=== done in {summary['total_minutes']} min, {installs} installs ===")
    print(f"broken {len(broken)} / censored {len(alive) if alive is not None else '-'}")


if __name__ == "__main__":
    main()
