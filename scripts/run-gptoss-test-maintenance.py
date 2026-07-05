#!/usr/bin/env python3
import argparse
import json
import os
import subprocess
import sys
import urllib.request
from pathlib import Path


DEFAULT_TEST_PATH = "packages/zod/src/v4/classic/tests/tuple.test.ts"
DEFAULT_PROD_PATH = "packages/zod/src/v4/core/schemas.ts"
DEFAULT_ARTIFACT_DIR = "artifacts/gptoss-tuple-too-big-repair"
DEFAULT_FAILURE_LOG = "/tmp/zod-tuple-too-big-stale-failure.log"
DEFAULT_MODEL = "openai/gpt-oss-120b"


def read_cmd(args: list[str]) -> str:
    return subprocess.check_output(args, text=True)


def read_range(path: str, line_range: str) -> str:
    return read_cmd(["sed", "-n", line_range, path])


def require_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise SystemExit(f"missing required env var: {name}")
    return value


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run a GPT-OSS Zod repair prompt through OpenRouter and save artifacts.",
    )
    parser.add_argument(
        "--mode",
        choices=["test-maintenance", "repair-classification"],
        default=os.environ.get("GPTOSS_MODE", "test-maintenance"),
        help=(
            "Prompt mode. test-maintenance preserves the historical test-only flow; "
            "repair-classification asks the model to choose between test and production repair."
        ),
    )
    parser.add_argument(
        "--case",
        default=os.environ.get("GPTOSS_CASE", "zod tuple too_big test-maintenance experiment"),
        help="Human-readable case name for the prompt and OpenRouter title.",
    )
    parser.add_argument(
        "--test-path",
        default=os.environ.get("GPTOSS_TEST_PATH", DEFAULT_TEST_PATH),
        help="Repository-relative test file shown as context.",
    )
    parser.add_argument(
        "--prod-path",
        default=os.environ.get("GPTOSS_PROD_PATH", DEFAULT_PROD_PATH),
        help="Repository-relative production file shown as context.",
    )
    parser.add_argument(
        "--test-snippet",
        default=os.environ.get("GPTOSS_TEST_SNIPPET", "1,95p"),
        help="sed -n range for the relevant test snippet.",
    )
    parser.add_argument(
        "--prod-snippet",
        default=os.environ.get("GPTOSS_PROD_SNIPPET", "2510,2555p"),
        help="sed -n range for the relevant production snippet.",
    )
    parser.add_argument(
        "--failure-log",
        default=os.environ.get("ZOD_FAILURE_LOG", DEFAULT_FAILURE_LOG),
        help="Path to the targeted test failure log.",
    )
    parser.add_argument(
        "--artifact-dir",
        default=os.environ.get("GPTOSS_ARTIFACT_DIR", DEFAULT_ARTIFACT_DIR),
        help="Directory where prompt, response, and usage artifacts are written.",
    )
    parser.add_argument(
        "--model",
        default=os.environ.get("OPENROUTER_MODEL", DEFAULT_MODEL),
        help="OpenRouter model id.",
    )
    parser.add_argument(
        "--constraint",
        action="append",
        default=[],
        help="Additional prompt constraint. May be repeated.",
    )
    return parser.parse_args()


def build_prompt(args: argparse.Namespace, failure: str, test_snippet: str, prod_snippet: str) -> str:
    if args.mode == "repair-classification":
        constraints = [
            "Decide from the failure log and source context whether this is a stale-test case or a production regression.",
            f"Allowed files: {args.test_path} and {args.prod_path}.",
            "Modify production code if the tests describe the intended behavior and the implementation is wrong.",
            "Modify tests only if the failure is caused by stale expectations after an intentional production behavior change.",
            "Do not weaken, delete, or skip the failing assertions.",
            "Preserve nearby behavior that is still expected to pass.",
            "Return a unified diff only.",
            *args.constraint,
        ]
        intro = """You are maintaining a TypeScript library after a targeted unit test failure.

Your task is to decide whether this failure should be fixed by updating stale tests or by changing production code.
Then return the minimal unified diff for the correct fix."""
    else:
        constraints = [
            f"Modify only {args.test_path}.",
            "Do not modify production source files.",
            "Preserve the original test signal as much as possible.",
            "Return a unified diff only.",
            *args.constraint,
        ]
        intro = """You are maintaining tests after a production code change.

A targeted unit test is failing because the production behavior intentionally changed.
Use the failure log and related source context to update the stale test expectation."""

    constraint_text = "\n".join(f"- {constraint}" for constraint in constraints)

    return f"""{intro}

Case:
{args.case}

Constraints:
{constraint_text}

Failure log:
<failure_log>
{failure}
</failure_log>

Relevant test snippet:
<test_snippet path="{args.test_path}">
{test_snippet}
</test_snippet>

Relevant production snippet:
<production_snippet path="{args.prod_path}">
{prod_snippet}
</production_snippet>
"""


def main() -> int:
    args = parse_args()
    api_key = require_env("OPENROUTER_API_KEY")

    artifact_dir = Path(args.artifact_dir)
    failure_log = Path(args.failure_log)
    response_out = Path(os.environ.get("GPTOSS_RESPONSE_OUT", artifact_dir / "gptoss-response.md"))
    prompt_out = Path(os.environ.get("GPTOSS_PROMPT_OUT", artifact_dir / "gptoss-prompt.md"))
    usage_out = Path(os.environ.get("GPTOSS_USAGE_OUT", artifact_dir / "gptoss-usage.json"))

    if not failure_log.exists():
        raise SystemExit(f"failure log not found: {failure_log}")

    artifact_dir.mkdir(parents=True, exist_ok=True)
    failure = failure_log.read_text()
    test_snippet = read_range(args.test_path, args.test_snippet)
    prod_snippet = read_range(args.prod_path, args.prod_snippet)
    prompt = build_prompt(args, failure, test_snippet, prod_snippet)
    prompt_out.write_text(prompt)

    payload = {
        "model": args.model,
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
            "X-Title": args.case,
        },
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=120) as response:
        data = json.loads(response.read())

    content = data["choices"][0]["message"]["content"]
    usage = data.get("usage", {})
    response_out.write_text(content)
    usage_out.write_text(json.dumps(usage, indent=2) + "\n")

    print(content)
    print("\n--- usage ---")
    print(json.dumps(usage, indent=2))
    print(f"\n--- wrote prompt: {prompt_out} ---")
    print(f"--- wrote response: {response_out} ---")
    print(f"--- wrote usage: {usage_out} ---")
    return 0


if __name__ == "__main__":
    sys.exit(main())
