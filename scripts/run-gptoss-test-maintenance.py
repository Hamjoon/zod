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
        choices=["test-maintenance", "repair-classification", "v2-unified"],
        default=os.environ.get("GPTOSS_MODE", "test-maintenance"),
        help=(
            "Prompt mode. test-maintenance preserves the historical test-only flow; "
            "repair-classification asks the model to choose between test and production repair; "
            "v2-unified shows a recent change plus current test results and asks for a "
            "DECISION (no_change | fix_tests | fix_production) with an optional diff."
        ),
    )
    parser.add_argument(
        "--cases-file",
        default=os.environ.get("GPTOSS_CASES_FILE", "experiments/zod-repair-classification-v2/cases.json"),
        help="v2-unified: JSON file with case metadata (id, category, shas, test/prod paths).",
    )
    parser.add_argument(
        "--repo",
        default=os.environ.get("GPTOSS_REPO", "."),
        help="v2-unified: fixture worktree used to read snippets and compute diff hunk ranges.",
    )
    parser.add_argument(
        "--recent-change-diff",
        default=os.environ.get("GPTOSS_RECENT_CHANGE_DIFF", ""),
        help="v2-unified: path to the diff applied to the fixture (recent_change_diff input).",
    )
    parser.add_argument(
        "--test-output",
        default=os.environ.get("GPTOSS_TEST_OUTPUT", ""),
        help="v2-unified: path to the current test output (test_output input).",
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


SNIPPET_PAD_LINES = 25
SNIPPET_MAX_LINES_PER_FILE = 220

V2_INTRO = """You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all."""


def load_case(cases_file: str, case_id: str) -> dict:
    cases = json.loads(Path(cases_file).read_text())
    for case in cases:
        if case["id"] == case_id:
            return case
    raise SystemExit(f"case not found in {cases_file}: {case_id}")


def git_diff_hunk_ranges(repo: str, sha: str, paths: list[str], side: str) -> dict[str, list[tuple[int, int]]]:
    """Ranges touched by <sha> per file: side='old' uses pre-image lines, 'new' post-image."""
    if not paths:
        return {}
    out = read_cmd(
        ["git", "-C", repo, "diff", "--no-renames", "--unified=0", f"{sha}^", sha, "--", *paths]
    )
    ranges: dict[str, list[tuple[int, int]]] = {}
    current = None
    for line in out.splitlines():
        if line.startswith("+++ b/"):
            current = line[6:]
        elif line.startswith("@@ ") and current:
            old_part, new_part = line.split(" ")[1:3]
            spec = old_part[1:] if side == "old" else new_part[1:]
            start, _, count = spec.partition(",")
            start = int(start)
            count = int(count) if count else 1
            if count == 0:
                count = 1
            ranges.setdefault(current, []).append((start, start + count - 1))
    return ranges


def merge_padded_ranges(ranges: list[tuple[int, int]], pad: int = SNIPPET_PAD_LINES) -> list[tuple[int, int]]:
    padded = sorted((max(1, start - pad), end + pad) for start, end in ranges)
    merged: list[tuple[int, int]] = []
    for start, end in padded:
        if merged and start <= merged[-1][1] + 1:
            merged[-1] = (merged[-1][0], max(merged[-1][1], end))
        else:
            merged.append((start, end))
    return merged


def extract_snippets(repo: str, sha: str, paths: list[str], side: str) -> list[tuple[str, str, str]]:
    """Returns (path, range_label, text) per snippet; only packages/zod TypeScript files."""
    snippet_paths = [p for p in paths if p.startswith("packages/zod/") and p.endswith(".ts")]
    per_file = git_diff_hunk_ranges(repo, sha, snippet_paths, side)
    snippets = []
    for path in snippet_paths:
        if path not in per_file or not Path(repo, path).exists():
            continue
        budget = SNIPPET_MAX_LINES_PER_FILE
        for start, end in merge_padded_ranges(per_file[path]):
            if budget <= 0:
                break
            end = min(end, start + budget - 1)
            budget -= end - start + 1
            text = read_cmd(["sed", "-n", f"{start},{end}p", str(Path(repo, path))])
            snippets.append((path, f"{start}-{end}", text))
    return snippets


def build_prompt_v2(case: dict, recent_change: str, test_output: str, repo: str) -> str:
    category = case["category"]
    test_paths = case.get("test_paths", [])
    prod_paths = case.get("prod_paths", [])
    sha = case["upstream_sha"]
    # Snippets reflect the fixture state: applied sides use post-image line numbers,
    # untouched (base) sides use pre-image line numbers.
    test_side = {"S": "old", "P": "new", "N": None}[category]
    prod_side = {"S": "new", "P": "old", "N": "new"}[category]
    test_snippets = extract_snippets(repo, sha, test_paths, test_side) if test_side else []
    prod_snippets = extract_snippets(repo, sha, prod_paths, prod_side)

    constraints = [
        "The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.",
        "If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.",
        f"Allowed files: {', '.join(test_paths + prod_paths)}.",
        "Do not weaken, delete, or skip assertions.",
        "Preserve nearby behavior that is still expected to pass.",
    ]
    constraint_text = "\n".join(f"- {constraint}" for constraint in constraints)

    sections = [
        V2_INTRO,
        f"Constraints:\n{constraint_text}",
        f"Recent change applied to the repository:\n<recent_change_diff>\n{recent_change}\n</recent_change_diff>",
        f"Current test results:\n<test_output>\n{test_output}\n</test_output>",
    ]
    for path, lines, text in test_snippets:
        sections.append(f'Relevant test snippet:\n<test_snippet path="{path}" lines="{lines}">\n{text}</test_snippet>')
    for path, lines, text in prod_snippets:
        sections.append(
            f'Relevant production snippet:\n<production_snippet path="{path}" lines="{lines}">\n{text}</production_snippet>'
        )
    return "\n\n".join(sections) + "\n"


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

    artifact_dir.mkdir(parents=True, exist_ok=True)
    if args.mode == "v2-unified":
        case = load_case(args.cases_file, args.case)
        recent_change_path = Path(args.recent_change_diff or artifact_dir / "fixture.patch")
        test_output_path = Path(args.test_output or artifact_dir / "test-output.txt")
        for path in (recent_change_path, test_output_path):
            if not path.exists():
                raise SystemExit(f"v2-unified input not found: {path}")
        prompt = build_prompt_v2(
            case,
            recent_change_path.read_text(),
            test_output_path.read_text(),
            args.repo,
        )
        title = "zod-maintenance-v2"
    else:
        if not failure_log.exists():
            raise SystemExit(f"failure log not found: {failure_log}")
        failure = failure_log.read_text()
        test_snippet = read_range(args.test_path, args.test_snippet)
        prod_snippet = read_range(args.prod_path, args.prod_snippet)
        prompt = build_prompt(args, failure, test_snippet, prod_snippet)
        title = args.case
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
            "X-Title": title,
        },
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=600) as response:
        raw = response.read()
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        # long-poll responses may carry keep-alive comment lines around the JSON body
        text = raw.decode("utf-8", errors="replace")
        stripped = "\n".join(line for line in text.splitlines() if not line.startswith(":")).strip()
        try:
            data = json.loads(stripped)
        except json.JSONDecodeError:
            (artifact_dir / "raw-response.txt").write_text(text)
            raise SystemExit(f"unparseable API response; raw body saved to {artifact_dir / 'raw-response.txt'}")

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
