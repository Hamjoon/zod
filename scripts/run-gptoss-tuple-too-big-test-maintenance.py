#!/usr/bin/env python3
import json
import os
import subprocess
import sys
import urllib.request
from pathlib import Path


REPO_TEST_PATH = "packages/zod/src/v4/classic/tests/tuple.test.ts"
REPO_PROD_PATH = "packages/zod/src/v4/core/schemas.ts"
ARTIFACT_DIR = Path(os.environ.get("GPTOSS_ARTIFACT_DIR", "artifacts/gptoss-tuple-too-big-repair"))
FAILURE_LOG = Path(os.environ.get("ZOD_FAILURE_LOG", "/tmp/zod-tuple-too-big-stale-failure.log"))
RESPONSE_OUT = Path(os.environ.get("GPTOSS_RESPONSE_OUT", ARTIFACT_DIR / "gptoss-response.md"))
PROMPT_OUT = Path(os.environ.get("GPTOSS_PROMPT_OUT", ARTIFACT_DIR / "gptoss-prompt.md"))
USAGE_OUT = Path(os.environ.get("GPTOSS_USAGE_OUT", ARTIFACT_DIR / "gptoss-usage.json"))
MODEL = os.environ.get("OPENROUTER_MODEL", "openai/gpt-oss-120b")


def read_cmd(args: list[str]) -> str:
    return subprocess.check_output(args, text=True)


def require_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise SystemExit(f"missing required env var: {name}")
    return value


def main() -> int:
    api_key = require_env("OPENROUTER_API_KEY")
    if not FAILURE_LOG.exists():
        raise SystemExit(f"failure log not found: {FAILURE_LOG}")

    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    failure = FAILURE_LOG.read_text()
    tuple_test = read_cmd(["sed", "-n", "1,95p", REPO_TEST_PATH])
    tuple_impl = read_cmd(["sed", "-n", "2510,2555p", REPO_PROD_PATH])

    prompt = f"""You are maintaining tests after a production code change.

A targeted Vitest unit test is failing because the production behavior intentionally changed.
Use the failure log and related source context to update the stale test expectation.

Constraints:
- Modify only {REPO_TEST_PATH}.
- Do not modify production source files.
- Preserve the original test signal as much as possible.
- Keep assertions specific enough to detect the changed tuple too_big error detail.
- Return a unified diff only.

Failure log:
<failure_log>
{failure}
</failure_log>

Relevant test snippet:
<test_snippet path="{REPO_TEST_PATH}">
{tuple_test}
</test_snippet>

Relevant production snippet:
<production_snippet path="{REPO_PROD_PATH}">
{tuple_impl}
</production_snippet>
"""

    PROMPT_OUT.write_text(prompt)

    payload = {
        "model": MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0,
    }
    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://local-thesis-experiment",
            "X-Title": "zod tuple too_big test-maintenance experiment",
        },
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=120) as response:
        data = json.loads(response.read())

    content = data["choices"][0]["message"]["content"]
    usage = data.get("usage", {})
    RESPONSE_OUT.write_text(content)
    USAGE_OUT.write_text(json.dumps(usage, indent=2) + "\n")

    print(content)
    print("\n--- usage ---")
    print(json.dumps(usage, indent=2))
    print(f"\n--- wrote prompt: {PROMPT_OUT} ---")
    print(f"--- wrote response: {RESPONSE_OUT} ---")
    print(f"--- wrote usage: {USAGE_OUT} ---")
    return 0


if __name__ == "__main__":
    sys.exit(main())
