# Stage G handover — smoke gate failed; full run not started

## Outcome

The live smoke run completed with exit 0, but failed mandatory Step 3 check 3. Prompt ID 2 has a nonempty 203-character response with zero code fences. Only if checks 1–3 pass may the full run start, so `gen-n60` was not run. No settings were changed and no additional model calls were made after the smoke. Survival work has not started.

## Settings actually used

Input revision: `c1b9193fec6256a4a1a3dc1dc31db6f12617669c`; zod base `45afab0f846dffd591362b6f770017507eb185b5`; testpilot2 `79c3b626edb541ca9eaf31c6994f40d1c7d5d042`. Docker Node 22.23.2 / npm 10.9.8 / pnpm 10.12.1. Main CommonJS wrapper used. API input `results/api-smoke-2.json`: zod.z.discriminatedUnion (S) and zod.z.check (C).

Endpoint: https://openrouter.ai/api/v1/chat/completions. Authorization supplied from the ignored Docker .env via env_file, verified only by presence checks. No key or .env content printed or committed.

Exact GEN settings:

```text
--package /work/zod/experiments/testpilot-2026-09/wrappers/zod --model openai/gpt-oss-120b --template /work/testpilot2/templates/template-singletest.hb --retryTemplate /work/testpilot2/templates/retry-template.hb --snippets doc --numSnippets 3 --snippetLength 20 --temperatures 0.0 --numCompletions 1 --maxTokens 4000 --nrAttempts 3
```

Runner: `node benchmark/run.js --outputDir /work/zod/experiments/testpilot-2026-09/results/gen-smoke --api /work/zod/experiments/testpilot-2026-09/results/api-smoke-2.json $GEN`. Output directory did not exist beforehand. No --responses for this authorized live stage. 20 docs files (19 website + README) were copied for mining.

Exact metaData:

```json
{
  "packageName": "zod",
  "useDocSnippets": true,
  "useCodeSnippets": false,
  "numSnippets": 3,
  "snippetLength": 20,
  "numCompletions": 1
}
```

## Smoke results

- Failed request warnings: **0**. No auth/model-id/rate-limit error and no rate-limit retry.
- Prompts: **10**, including **8** with nonempty provenance.
- Tests after tool deduplication: **16**; **0 passed / 16 failed / 0 pending / 0 other**.
- Every failure message is `Invalid syntax`: correctness category 16; assertion/filesystem/timeout/other 0.
- Report stats.totalTime: **152318.815653 ms** (152.319 seconds); shell timing 152 seconds. stats.codexQueryTime is 0 despite live requests, so it is not a reliable latency total here.
- 9 completions have closed fences; prompt 2 has no fence. This is not evidence of universal token truncation. Its entire response is:

> It looks like the code snippet you want to fix didn’t come through. Could you please paste the code that’s causing the “Invalid syntax” error? Once I have the code, I can modify it to make the test pass.

Prompt 2 has RetryWithError provenance. Full provenance, prompts, completions, reports, test files, and stdout are preserved under `results/gen-smoke/`. `smoke-check.json` records the gate outcome. The first generated test was copied verbatim into log-stage-g.md; the saved test ends after its first `it` block without closing the outer describe. This is an observation of the artifact, not a confirmed root-cause diagnosis. No tool/template fix was attempted.

## Full-run results

Not run. Full-run totals, per-stratum statistics, request failures, refiner effects, survival passing set, and three full-run examples are unavailable. `scripts/analyze-gen.py` and full-run analysis files were not created because the smoke gate disallows proceeding.

## Cleanup and deviations

- Removed wrapper .snippet-docs and README after stopping.
- Listed and removed runner leftovers test-K644JN and test-wzgGn0. No test-* or nyc_output remains in wrapper.
- Upstream zod tracked files unchanged; testpilot2 clean. Experiment compose.yml and .gitignore are the only pre-existing tracked files changed by this stage. New artifacts stay under experiments/.
- User-owned Claude outputs/ remains untracked as previously authorized.
- coverageData/ excluded from Git; raw smoke results otherwise retained.
- D-04: tool sends one completion per prompt (no request n field); numCompletions 1 records the effective behavior.
- D-05: maxTokens 4000 as instructed; not increased.
- D-06: numSnippets 3 as instructed.
- D-07: smoke completion fence gate failed; stopped without full run.
- Sandbox Docker socket denials were retried with required escalation. One progress read raced container removal after successful completion and returned `No such container`; run artifacts were intact. A local report inspection initially looked for test_0.js at run root and got FileNotFoundError; corrected to tests/test_0.js, with no experiment rerun.
- L-01 retained: wrapper-only statement coverage.
- L-02: OpenRouter provider routing is neither pinned nor recorded by the tool.

## Open questions

1. What authorized change should address the retry prompt's missing-code response and all-Invalid-syntax generated artifacts? Inspect prompt assembly/test extraction before authorizing another live run.
2. Should a revised smoke gate or tool/template adaptation be used? No exception is assumed.
3. After resolution, which fresh smoke output directory should be authoritative? Existing outputs must not be overwritten.

Preservation commit and push include smoke artifacts and this handover. Do not begin full generation or survival without follow-up instructions resolving the gate.
