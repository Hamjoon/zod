#!/usr/bin/env python3
import json
import os
import subprocess
import sys
import urllib.request
from pathlib import Path


REPO_TEST_PATH = "packages/zod/src/v4/classic/tests/object.test.ts"
REPO_PROD_PATH = "packages/zod/src/v4/core/util.ts"
FAILURE_LOG = Path(os.environ.get("ZOD_FAILURE_LOG", "/tmp/zod-object-stale-failure.log"))
RESPONSE_OUT = Path(os.environ.get("GPTOSS_RESPONSE_OUT", "/tmp/gptoss-response.md"))
PROMPT_OUT = Path(os.environ.get("GPTOSS_PROMPT_OUT", "/tmp/gptoss-prompt.md"))
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

    failure = FAILURE_LOG.read_text()
    object_test = read_cmd(["sed", "-n", "590,640p", REPO_TEST_PATH])
    util = read_cmd(["sed", "-n", "640,690p", REPO_PROD_PATH])

    prompt = f"""You are maintaining tests after a production code change.

A targeted test is failing. Use the failure log and related source context to update the stale test expectation.

Constraints:
- Modify only {REPO_TEST_PATH}.
- Do not modify production source files.
- Return a unified diff only.

Failure log:
<failure_log>
{failure}
</failure_log>

Relevant test snippet:
<test_snippet path="{REPO_TEST_PATH}">
{object_test}
</test_snippet>

Relevant production snippet:
<production_snippet path="{REPO_PROD_PATH}">
{util}
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
            "X-Title": "zod test-maintenance experiment",
        },
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=120) as response:
        data = json.loads(response.read())

    content = data["choices"][0]["message"]["content"]
    RESPONSE_OUT.write_text(content)

    print(content)
    print("\n--- usage ---")
    print(json.dumps(data.get("usage", {}), indent=2))
    print(f"\n--- wrote prompt: {PROMPT_OUT} ---")
    print(f"--- wrote response: {RESPONSE_OUT} ---")
    return 0


if __name__ == "__main__":
    sys.exit(main())
