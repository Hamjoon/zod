# Stage G handover — complete

## Result and authoritative run

`results/gen-n60` completed successfully (exit 0), uninterrupted, in **5004.856916 seconds / 83.414 minutes**. It is the only full run and the authoritative generation-at-t result. All 60 sampled functions have generated tests; 54 have at least one passing test. **360 prompts, 360 tests after deduplication: 139 passing, 221 failing, 0 pending, 0 other.** No empty completions, no completion containing more than one `it(` (whitespace allowed), and **0 failed-request warnings**. No survival work was started.

The 139-test set S for survival is [gen-n60-passing.json](../results/gen-n60-passing.json), copied without modification as `{testName, api, testFile}` from passing report entries. Resolve each testFile relative to `results/gen-n60/tests/`. [Analysis](../results/gen-n60-analysis.md) includes all 60 per-function rows, the first failing message, failure categories, refiners, and prompt lengths. [CSV](../results/gen-n60-tests.csv) contains one row per test (360). [Examples](../results/gen-examples/) preserve three complete prompt/completion/assembled-test/outcome records: passing S, passing C, and a failing assertion. Two examples concern discriminatedUnion, so the failure example has an `-assertion` filename suffix.

## Revisions and authorized fix

- zod base: `45afab0f846dffd591362b6f770017507eb185b5`, v4.0.5.
- zod experiment branch: `experiment/2026-09-week3-testpilot-zod`; prior stage head `1cb9eacdcd62869a2390ae7fdd47b0035934a186`.
- testpilot2 upstream base: `79c3b626edb541ca9eaf31c6994f40d1c7d5d042`.
- testpilot2 experiment branch: **experiment/2026-09-week3-zod**, pushed to Hamjoon/testpilot2.
- testpilot2 head / Fix A commit: **31c01799811ec1677d1c102074fc8f23f1a861c5**.
- Fix A adds only the authorized require-lines-first / one-it instruction to templates/template-singletest.hb. template.hb and retry-template.hb are unchanged. No rebuild was needed. **Fix B was not applied** because the revised smoke passed.
- Docker: testpilot-zod:latest; Node 22.23.2 / npm 10.9.8 / pnpm 10.12.1. Zod tracked source files remain unchanged; generation uses the CommonJS wrapper.

## Exact settings

Endpoint: `https://openrouter.ai/api/v1/chat/completions`. Credentials supplied by ignored docker/.env through compose env_file, verified by presence only; values never printed or committed. Temperature 0, model openai/gpt-oss-120b, one completion per prompt, max_tokens 4000, top_p 1, nrAttempts 3, no additional rate limit. All Node/model execution occurred in Docker through benchmark/run.js. No ad-hoc model calls.

```text
GEN="--package /work/zod/experiments/testpilot-2026-09/wrappers/zod --model openai/gpt-oss-120b --template /work/testpilot2/templates/template-singletest.hb --retryTemplate /work/testpilot2/templates/retry-template.hb --snippets doc --numSnippets 3 --snippetLength 20 --temperatures 0.0 --numCompletions 1 --maxTokens 4000 --nrAttempts 3"
```

Full command: `node benchmark/run.js --outputDir /work/zod/experiments/testpilot-2026-09/results/gen-n60 --api /work/zod/experiments/testpilot-2026-09/results/api-sample-n60-s20260919.json $GEN`. Output directories did not exist before use. Full-run API has 60 fixed entries (S36/C17/Q7), seed 20260919. Documentation: 19 website files converted to .md plus package README, 20 total. Snippets capped at three, 20 lines each.

Exact full-run metaData:

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

## Smoke history and revised gate

Original `gen-smoke` at unmodified testpilot2: 10 prompts, 16 tests, all Invalid syntax, no request errors; retained unchanged. The addendum establishes import duplication due to leading comments as the cause. Original artifacts remain the evidence; no original output was rewritten.

Fix A smoke `gen-smoke-2`: **11 prompts**, 9 with nonempty provenance, **11 tests: 7 passed / 4 failed**; report wall time **162.209692 seconds**. All revised gate checks passed:

1. Request warnings: **0**.
2. Eligible non-RetryWithError prompts: **8**; require-first **8**, not-require-first **0**.
3. Passing tests: **7**; Invalid syntax: **0**, below half of 11.
4. No Invalid syntax tests required reconstruction; syntaxRecords is empty.

[smoke-check.json](../results/gen-smoke-2/smoke-check.json) records the exact gate, stats and metadata. Fix B was neither indicated nor applied. No smoke-3 was run.

## Full-run strata

| Stratum | Functions | Tests | Passing | Test pass rate |
| --- | ---: | ---: | ---: | ---: |
| S | 36 | 208 | 88 | 42.31% |
| C | 17 | 109 | 36 | 33.03% |
| Q | 7 | 43 | 15 | 34.88% |

Overall test pass rate: 38.61%. Functions without a passing test: `zod.z.ksuid`, `zod.z.maxSize`, `zod.z.number`, `zod.z.property`, `zod.z.size`, `zod.z.templateLiteral`.

## Failure categories and refiners

Ordered categories over the 221 failed tests: **assertion 156; file-system 0; correctness 54; timeout 2; other 9**. Correctness includes 25 tests whose message is `Invalid syntax`; the template improvement is not a guarantee that every full-run completion parses. No tool/source change was made mid-run. The first three other messages (full text in analysis) are missing-module errors: zod-to-json-schema, nanoid, nanoid.

| Recorded provenance combination | Prompts | Passing tests tracing here |
| --- | ---: | ---: |
| Base | 60 | 23 |
| FunctionBodyIncluder | 60 | 27 |
| FunctionBodyIncluder+SnippetIncluder | 58 | 29 |
| RetryWithError | 124 | 27 |
| SnippetIncluder | 58 | 33 |

Combinations use distinct refiner labels directly recorded in each prompt's provenance. Tests are counted once per combination they trace to; this grouping does not infer a causal treatment effect. The per-test CSV retains prompt IDs and recorded labels. All 360 completions contain at most one `it(`; none is empty.

## Cleanup, verification, and files

Removed temporary wrapper README and .snippet-docs. Listed and removed the smoke/full runner test directories (test-Jbf1Rn, test-wHXaMd) and residual `.nyc_output`; no test-* directory, nyc_output, or .nyc_output remains. Claude outputs/ is left untracked as previously authorized; all task changes are under experiments/ in zod. The only testpilot2 change is the committed template sentence.

Verified report counts against test status totals, all 360 test files exist, CSV has 360 rows, and the 139-entry passing manifest exactly matches passing report fields. All three example files are present. Raw gen-smoke, gen-smoke-2 and gen-n60 artifacts are retained; coverageData/ and credentials are excluded from Git. No re-execution or edits of generated tests were performed during analysis. Both experiment branches are pushed at completion, with final status checked for synchronization.

## Deviations and limitations

- D-01 through D-03 retained from Stage 0: mocha installation with restored manifests; clone-local hooks disabled; main CommonJS wrapper avoids ESM scope.
- D-04: one completion per prompt is the tool's effective behavior; numCompletions 1 records it.
- D-05: maxTokens 4000 as prescribed; not increased.
- D-06: numSnippets 3 as prescribed.
- D-07: original smoke gate failure retained historically, resolved by the addendum's authorized Fix A and revised gate.
- D-08: require-first / one-it template instruction, commit 31c01799811ec1677d1c102074fc8f23f1a861c5.
- D-09 not applicable: completeTest was not patched.
- Full run took 83.4 minutes, longer than the rough under-one-hour estimate; it was not interrupted. stats.codexQueryTime remains 0 despite live calls, so use totalTime for wall time.
- L-01: wrapper-only statement coverage; zod implementation coverage is not measured.
- L-02: OpenRouter provider routing is not pinned by the tool and is not recorded in output.
- Read-only progress polling occasionally raced successful container removal, returning No such container; final process exit and artifacts confirmed successful completion. No run restart was needed.

## Open questions / next stage

1. Which later zod versions and developer-test baseline should the survival stage replay, and under what installation/timeout controls?
2. How should dependency-related failures and inherently brittle assertions be interpreted in the survival results? Preserve the generated tests unchanged.
3. Should the remaining 64 main population functions or mini-specific functions be studied later?

The next stage should consume the recorded 139-test passing set and the fixed tool/template revision. No survival commands have been run.
