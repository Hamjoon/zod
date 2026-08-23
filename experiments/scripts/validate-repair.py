#!/usr/bin/env python3
"""
Phase 7 - validate the repaired cases.

For each repair:
  1. splice the repaired case back into its test file
  2. run at the commit where the case broke
  3. record pass/fail
  4. confirm production sources are untouched
  5. compare assertion counts before and after
"""

import json
import re
import subprocess
from pathlib import Path

REPO = Path("/home/claude/zod")
CONFIG = "experiments/vitest.gate.mts"
REPAIR = Path("/home/claude/work/repair-out")
GEN = REPO / "experiments/generated-tests"

CASES = [
    ("repair-01-mini-keyof", "mini-schemas-main.test.ts",
     "object schema shape and keyof utility",
     "d589186c20c3dc112f5a5fda23cccd4d1f74420e"),
    ("repair-02-util-floatsaferemainder", "util-main.test.ts",
     "floatSafeRemainder works with decimals",
     "5b7ed214526cb5a7cc508aec236603ff79ae9579"),
]


def sh(cmd, cwd=None):
    return subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=1800)


def find_case(src: str, name: str):
    m = re.search(r'^([ \t]*)(?:test|it)\(\s*"' + re.escape(name) + r'"', src, re.M)
    if not m:
        raise SystemExit(f"[error] case not found: {name}")
    start = m.start()
    i = src.index("(", m.start())
    depth = 0
    for j in range(i, len(src)):
        if src[j] == "(":
            depth += 1
        elif src[j] == ")":
            depth -= 1
            if depth == 0:
                end = src.index(";", j) + 1
                return start, end, m.group(1)
    raise SystemExit("[error] unbalanced parens")


def strip_to_case(text: str, name: str) -> str:
    """The model sometimes emits imports too; keep only the test block."""
    s, e, _ = find_case(text, name)
    return text[s:e]


def count_assertions(block: str) -> int:
    return len(re.findall(r"\bexpect\s*\(", block))


def main() -> None:
    results = []
    for rid, tfile, tname, commit in CASES:
        print(f"\n=== {rid} ===", flush=True)
        path = GEN / tfile
        original = path.read_text()
        s, e, indent = find_case(original, tname)
        before = original[s:e]

        repaired_raw = (REPAIR / rid / "repaired-case.ts").read_text()
        repaired = strip_to_case(repaired_raw, tname)
        if indent:
            repaired = "\n".join((indent + l) if l.strip() else l
                                 for l in repaired.split("\n"))

        patched = original[:s] + repaired + original[e:]
        path.write_text(patched)

        sh(["git", "-C", str(REPO), "checkout", "-q", commit])
        sh(["pnpm", "install", "--frozen-lockfile", "--reporter=silent"], cwd=str(REPO))
        rj = Path("/tmp/val.json")
        sh(["npx", "vitest", "run", "--config", CONFIG,
            f"experiments/generated-tests/{tfile}",
            "--reporter=json", f"--outputFile={rj}"], cwd=str(REPO))
        d = json.loads(rj.read_text())
        status, msg = None, ""
        for t in d.get("testResults", []):
            for a in t.get("assertionResults", []):
                if a.get("title") == tname:
                    status = a.get("status")
                    if status != "passed":
                        msg = (a.get("failureMessages") or [""])[0].split("\n")[0][:180]

        dirty = sh(["git", "-C", str(REPO), "status", "--porcelain",
                    "packages/"], ).stdout.strip()

        r = {
            "id": rid, "test_file": tfile, "case": tname, "commit": commit[:8],
            "result": status,
            "failure": msg,
            "production_untouched": dirty == "",
            "assertions_before": count_assertions(before),
            "assertions_after": count_assertions(repaired),
        }
        results.append(r)
        print(f"  result              : {status}")
        if msg:
            print(f"  failure             : {msg}")
        print(f"  production untouched: {r['production_untouched']}")
        print(f"  assertions          : {r['assertions_before']} -> {r['assertions_after']}")

        # restore the original file; repairs are recorded, not committed
        path.write_text(original)

    Path("/home/claude/work/repair-validation.json").write_text(json.dumps(results, indent=2))
    sh(["git", "-C", str(REPO), "checkout", "-q", "3c9ca1d9"])
    print("\n=== Summary ===")
    for r in results:
        ok = "PASS" if r["result"] == "passed" else "FAIL"
        print(f"  {r['id']:36s} {ok}")


if __name__ == "__main__":
    main()
