#!/usr/bin/env python3
"""
Zod main experiment (2026-08 week4) - Phase 3: test case generation

What this does:
  1. Extract the source of the 7 target files at t = v4.0.5 (45afab0f) from git
  2. Assemble a request by inserting each source into the prompt template
  3. Call OpenRouter (openai/gpt-oss-120b, temperature 0)
  4. Extract the test file from the response and save the full evidence bundle

Usage:
  export OPENROUTER_API_KEY=...
  python3 run-generation.py --repo <path to zod clone> --out <output path>

  Pass --dry-run to build prompts and requests without calling the API.
"""

import argparse
import json
import os
import re
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

MODEL = "openai/gpt-oss-120b"
TEMPERATURE = 0
T_COMMIT = "45afab0f846dffd591362b6f770017507eb185b5"
T_LABEL = "v4.0.5"
ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"

# (run id, path in repo, import namespace, generated test file name)
TARGETS = [
    ("01-core-util",           "packages/zod/src/v4/core/util.ts",           "util",    "util-main.test.ts"),
    ("02-core-schemas",        "packages/zod/src/v4/core/schemas.ts",        "schemas", "core-schemas-main.test.ts"),
    ("03-classic-schemas",     "packages/zod/src/v4/classic/schemas.ts",     "schemas", "classic-schemas-main.test.ts"),
    ("04-core-checks",         "packages/zod/src/v4/core/checks.ts",         "checks",  "checks-main.test.ts"),
    ("05-core-to-json-schema", "packages/zod/src/v4/core/to-json-schema.ts", "toJSONSchema", "to-json-schema-main.test.ts"),
    ("06-core-errors",         "packages/zod/src/v4/core/errors.ts",         "errors",  "errors-main.test.ts"),
    ("07-mini-schemas",        "packages/zod/src/v4/mini/schemas.ts",        "schemas", "mini-schemas-main.test.ts"),
]

# Prompt template. Do not alter the wording.
PROMPT_TEMPLATE = """Below is the full source of `{path}` from the Zod repository (at tag {t_label}).

```ts
{source}```

Task: Write a vitest test file covering the main logic of this file.

Requirements:
- Follow standard unit testing practice: write one test case per behavior you want to verify. Do not artificially limit the number of test cases — use your own judgment about what the main logic is rather than targeting an exact count.
- Produce exactly one test file.
- Import the module under test using exactly this import statement. The test file will be placed at `experiments/generated-tests/` under the repository root, so this relative path is already correct — use it verbatim and do not change it:

import * as {ns} from "{import_path}";

- Do not import from any public entry point such as "zod", "zod/v4", "zod/v4/core", "zod/v4/mini", or "@zod/core". The only allowed imports are the relative import above and "vitest".
- Import everything you use from "vitest" explicitly, for example: import {{ test, expect }} from "vitest";
- Output the complete test file inside a single ```ts code fence. Do not output any text outside the code fence.
"""


def git_show(repo: Path, commit: str, path: str) -> str:
    r = subprocess.run(
        ["git", "-C", str(repo), "show", f"{commit}:{path}"],
        capture_output=True, text=True,
    )
    if r.returncode != 0:
        raise SystemExit(f"[error] git show failed: {commit}:{path}\n{r.stderr.strip()}")
    return r.stdout


def build_prompt(repo: Path, path: str, ns: str) -> str:
    source = git_show(repo, T_COMMIT, path)
    import_path = "../../" + path.replace(".ts", ".js")
    return PROMPT_TEMPLATE.format(
        path=path, t_label=T_LABEL, source=source, ns=ns, import_path=import_path
    )


def extract_test_file(response_text: str) -> str | None:
    """Pull the contents of the single ```ts code fence out of the response."""
    m = re.search(r"```ts\n(.*?)```", response_text, re.DOTALL)
    if m:
        return m.group(1)
    m = re.search(r"```(?:typescript)?\n(.*?)```", response_text, re.DOTALL)
    return m.group(1) if m else None


def call_openrouter(request_path: Path, raw_out: Path) -> dict:
    """Call via curl. Records http_code and curl_exit."""
    api_key = os.environ.get("OPENROUTER_API_KEY", "")
    if not api_key:
        raise SystemExit("[error] OPENROUTER_API_KEY is not set.")

    start = time.time()
    start_utc = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    proc = subprocess.run(
        [
            "curl", "-sS", "-w", "%{http_code}", "-o", str(raw_out),
            "-X", "POST", ENDPOINT,
            "-H", f"Authorization: Bearer {api_key}",
            "-H", "Content-Type: application/json",
            "--data-binary", f"@{request_path}",
        ],
        capture_output=True, text=True,
    )
    duration = int(time.time() - start)
    http_code = proc.stdout.strip()[-3:] if proc.stdout.strip() else "000"
    return {
        "start_utc": start_utc,
        "duration_seconds": duration,
        "http_code": http_code,
        "curl_exit": proc.returncode,
        "curl_stderr": proc.stderr.strip()[:500],
        "endpoint": ENDPOINT,
        "request_file": request_path.name,
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", required=True, help="path to the zod clone (must contain 45afab0f)")
    ap.add_argument("--out", required=True, help="output directory")
    ap.add_argument("--dry-run", action="store_true", help="build prompts and requests without calling the API")
    ap.add_argument("--only", default=None, help="run a single id (e.g. 02-core-schemas)")
    args = ap.parse_args()

    repo = Path(args.repo).expanduser().resolve()
    out = Path(args.out).expanduser().resolve()
    out.mkdir(parents=True, exist_ok=True)
    (out / "generated-tests").mkdir(exist_ok=True)

    # Clone the repository if it is not there yet
    if not (repo / ".git").exists():
        print(f"[info] No repository at {repo}; cloning. This takes a few minutes.", flush=True)
        repo.parent.mkdir(parents=True, exist_ok=True)
        r = subprocess.run(["git", "clone", "https://github.com/Hamjoon/zod.git", str(repo)])
        if r.returncode != 0:
            raise SystemExit("[error] Clone failed. Check the network.")

    # Confirm the t commit is present
    if subprocess.run(["git", "-C", str(repo), "cat-file", "-e", f"{T_COMMIT}^{{commit}}"],
                      capture_output=True).returncode != 0:
        raise SystemExit(f"[error] t commit {T_COMMIT[:8]} is not present in {repo}.")

    targets = [t for t in TARGETS if args.only is None or t[0] == args.only]
    if not targets:
        raise SystemExit(f"[error] --only {args.only} matches no target.")

    manifest = []
    for run_id, path, ns, test_name in targets:
        d = out / run_id
        d.mkdir(exist_ok=True)
        print(f"\n=== {run_id}  ({path}) ===", flush=True)

        prompt = build_prompt(repo, path, ns)
        (d / "llm-prompt.md").write_text(prompt)

        request = {
            "model": MODEL,
            "temperature": TEMPERATURE,
            "messages": [{"role": "user", "content": prompt}],
        }
        (d / "llm-request.json").write_text(json.dumps(request, indent=2))
        print(f"  prompt {len(prompt):,} chars", flush=True)

        if args.dry_run:
            manifest.append({"id": run_id, "path": path, "ns": ns,
                             "test_file": test_name, "prompt_chars": len(prompt),
                             "status": "dry-run"})
            continue

        if (d / "llm-response.md").exists():
            print("  already done; skipping.", flush=True)
            manifest.append({"id": run_id, "path": path, "ns": ns,
                             "test_file": test_name, "status": "skipped"})
            continue

        run_meta = call_openrouter(d / "llm-request.json", d / "llm-raw-response.json")

        try:
            raw = json.loads((d / "llm-raw-response.json").read_text())
        except Exception as e:
            run_meta["error"] = f"failed to parse response JSON: {e}"
            (d / "llm-run.json").write_text(json.dumps(run_meta, indent=2))
            print(f"  [failed] {run_meta['error']}  http={run_meta['http_code']}", flush=True)
            manifest.append({"id": run_id, "status": "failed"})
            continue

        if "error" in raw or "choices" not in raw:
            run_meta["error"] = json.dumps(raw.get("error", raw))[:500]
            (d / "llm-run.json").write_text(json.dumps(run_meta, indent=2))
            print(f"  [failed] API error: {run_meta['error'][:200]}", flush=True)
            manifest.append({"id": run_id, "status": "failed"})
            continue

        choice = raw["choices"][0]
        text = choice["message"]["content"]
        run_meta.update({
            "model_reported": raw.get("model"),
            "finish_reason": choice.get("finish_reason"),
            "response_id": raw.get("id"),
        })
        (d / "llm-run.json").write_text(json.dumps(run_meta, indent=2))
        (d / "llm-usage.json").write_text(json.dumps(raw.get("usage", {}), indent=2))
        (d / "llm-response.md").write_text(text)

        test_src = extract_test_file(text)
        if test_src is None:
            print("  [warning] No code fence found. Check llm-response.md.", flush=True)
            status = "no-code-fence"
        else:
            (out / "generated-tests" / test_name).write_text(test_src)
            status = "ok"

        usage = raw.get("usage", {})
        n_test = len(re.findall(r"^\s*(test|it)\s*\(", test_src or "", re.M))
        print(f"  finish_reason={run_meta['finish_reason']}  "
              f"prompt={usage.get('prompt_tokens')}  completion={usage.get('completion_tokens')}  "
              f"cost=${usage.get('cost', 0):.5f}  {run_meta['duration_seconds']}s", flush=True)
        print(f"  {n_test} test blocks -> generated-tests/{test_name}", flush=True)

        manifest.append({
            "id": run_id, "path": path, "ns": ns, "test_file": test_name,
            "status": status, "finish_reason": run_meta["finish_reason"],
            "prompt_tokens": usage.get("prompt_tokens"),
            "completion_tokens": usage.get("completion_tokens"),
            "cost": usage.get("cost"),
            "duration_seconds": run_meta["duration_seconds"],
            "test_blocks": n_test,
        })

    (out / "manifest.json").write_text(json.dumps({
        "model": MODEL, "temperature": TEMPERATURE,
        "t_commit": T_COMMIT, "t_label": T_LABEL,
        "runs": manifest,
    }, indent=2))

    print("\n=== Summary ===")
    for m in manifest:
        print(f"  {m.get('id'):24s} {m.get('status'):14s} "
              f"finish={m.get('finish_reason', '-')!s:10s} "
              f"tests={m.get('test_blocks', '-')}")
    print(f"\nOutput: {out}")


if __name__ == "__main__":
    main()
