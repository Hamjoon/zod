#!/usr/bin/env python3
"""
Phase 7 - build repair requests for the stale cases.

For each stale case this assembles the repair prompt from:
  - the test file's import block
  - the failing test case in full
  - the production diff for the target file at the breaking commit
  - the test execution output captured at that commit

and writes an OpenRouter request JSON ready to POST.
"""

import json
import re
import subprocess
import sys
from pathlib import Path

REPO = Path("/home/claude/zod")
CONFIG = "experiments/vitest.gate.mts"
MODEL = "openai/gpt-oss-120b"
TEMPERATURE = 0
T_LABEL = "v4.0.5"

CASES = [
    {
        "id": "repair-01-mini-keyof",
        "test_file": "mini-schemas-main.test.ts",
        "target": "packages/zod/src/v4/mini/schemas.ts",
        "commit": "d589186c20c3dc112f5a5fda23cccd4d1f74420e",
        "test_name": "object schema shape and keyof utility",
    },
    {
        "id": "repair-02-util-floatsaferemainder",
        "test_file": "util-main.test.ts",
        "target": "packages/zod/src/v4/core/util.ts",
        "commit": "5b7ed214526cb5a7cc508aec236603ff79ae9579",
        "test_name": "floatSafeRemainder works with decimals",
    },
]

PROMPT = """A vitest test written against the Zod repository file `{target}` (as of {t_label}) now fails after the production code changed. Your task is to repair the test.

The test file imports the module under test like this (do not change this import):

```ts
{imports}
```

The failing test case, in full:

```ts
{case_src}
```

The production change at the commit where this test first fails:

```
{diff}
```

The test execution output at that commit:

```
{output}
```

Instructions:
- Modify the test so that it keeps verifying the same intent while matching the new code. The production code is not to be modified.
- Output the complete repaired test case inside a single ```ts code fence. Do not output any text outside the code fence.
"""


def sh(cmd, cwd=None, timeout=1800):
    return subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=timeout)


def extract_case(path: Path, name: str) -> str:
    """Pull one test(...) block out of the file by brace matching."""
    src = path.read_text()
    m = re.search(r'^([ \t]*)(?:test|it)\(\s*"' + re.escape(name) + r'"', src, re.M)
    if not m:
        raise SystemExit(f"[error] test case not found: {name}")
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
                break
    block = src[start:end]
    indent = m.group(1)
    if indent:
        block = "\n".join(l[len(indent):] if l.startswith(indent) else l
                          for l in block.split("\n"))
    return block


def main() -> None:
    out = Path("/home/claude/work/repair")
    out.mkdir(parents=True, exist_ok=True)

    for c in CASES:
        d = out / c["id"]
        d.mkdir(exist_ok=True)
        tf = REPO / "experiments/generated-tests" / c["test_file"]

        imports = "\n".join(l for l in tf.read_text().split("\n") if l.startswith("import "))
        case_src = extract_case(tf, c["test_name"])

        # production diff, restricted to the target file
        meta = sh(["git", "-C", str(REPO), "log", "-1",
                   "--format=commit %H%nAuthor: %an%nDate: %ad%n%n    %s", "--date=short",
                   c["commit"]]).stdout.rstrip()
        diff = sh(["git", "-C", str(REPO), "show", "--format=", c["commit"],
                   "--", c["target"]]).stdout.rstrip()
        diff_block = meta + "\n\n" + diff

        # failure output at the breaking commit
        sh(["git", "-C", str(REPO), "checkout", "-q", c["commit"]])
        sh(["pnpm", "install", "--frozen-lockfile", "--reporter=silent"], cwd=str(REPO))
        rj = Path("/tmp/repair-run.json")
        sh(["npx", "vitest", "run", "--config", CONFIG,
            f"experiments/generated-tests/{c['test_file']}",
            "--reporter=json", f"--outputFile={rj}"], cwd=str(REPO))
        res = json.loads(rj.read_text())
        output = None
        for t in res.get("testResults", []):
            for a in t.get("assertionResults", []):
                if a.get("title") != c["test_name"]:
                    continue
                full = a.get("fullName") or a.get("title")
                msg = (a.get("failureMessages") or [""])[0]
                # keep the error line plus the frame inside the test file; drop
                # runner internals and absolute paths
                kept = []
                for line in msg.split("\n"):
                    if "node_modules" in line or "node:internal" in line:
                        continue
                    kept.append(line.replace(str(REPO) + "/", ""))
                    if len(kept) >= 12:
                        break
                output = (f"FAIL  experiments/generated-tests/{c['test_file']} > {full}\n"
                          + "\n".join(kept).rstrip())
        if output is None:
            raise SystemExit(f"[error] no failure captured for {c['test_name']}")

        prompt = PROMPT.format(target=c["target"], t_label=T_LABEL, imports=imports,
                               case_src=case_src, diff=diff_block, output=output)
        (d / "repair-prompt.md").write_text(prompt)
        (d / "repair-request.json").write_text(json.dumps(
            {"model": MODEL, "temperature": TEMPERATURE,
             "messages": [{"role": "user", "content": prompt}]}, indent=2))
        (d / "meta.json").write_text(json.dumps(c, indent=2))
        print(f"{c['id']}: prompt {len(prompt):,} chars")

    sh(["git", "-C", str(REPO), "checkout", "-q", "3c9ca1d9"])
    print("\nwrote to", out)


if __name__ == "__main__":
    main()
