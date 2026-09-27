# Stage G (n124) handover: complete

## Result

The n124 generation result is the union of two runs over disjoint parts of `population-main.json`:

- `results/gen-n124-run2`: population positions 0-108 (109 functions). Exit 0, 18065 s. testpilot2's default 5-hour `--timeLimit` stopped it before the last 15 functions (D-30).
- `results/gen-n124-tail`: positions 109-123 (15 functions, `results/api-n124-tail.json`). Exit 0, 1234 s.

Together they cover all 124 access paths with no overlap. Totals: **763 prompts, 757 tests, 266 passing (35.14%), 491 failing**, 0 pending or other. All 124 functions have tests; 112 have at least one passing test. Request failures: 0. Null completions: 7 (all `finish_reason=length`). Their total of 7 is within the Step 5.1 limit of 10.

The first attempt `results/gen-n124` is a **failed attempt** and not part of the result. It crashed with exit 1 after 3860 s on a `null` completion (see D-29), and only `stdout.txt` exists. No survival work was started.

## Locating files for later stages

`results/gen-n124-passing.json` is the passing set S for survival: 266 entries `{run, testName, api, testFile}` (241 from `gen-n124-run2`, 25 from `gen-n124-tail`). Test file names repeat across the two runs (both have a `test_0.js`, and so on), so **a test is identified by `(run, testFile)`, never by `testFile` alone**. Its file is `experiments/testpilot-2026-09/results/<run>/tests/<testFile>`, for example `results/gen-n124-tail/tests/test_3.js`. Verified: every entry resolves to an existing file, the pairs are unique, and the manifest equals the `PASSED` entries of the two `report.json` files in order (run2 first).

The same convention holds in `results/gen-n124-tests.csv` (757 rows, leading `run` column) and in the analysis, where prompt IDs are written `<run>:<id>` and a prompt file is `results/<run>/prompts/prompt_<id>.js`. For comparison, last week's `gen-n60-passing.json` has no `run` field; its files are under `results/gen-n60/tests/`.

## Revisions and exact settings

- zod: branch `experiment/2026-09-week4-testpilot-zod` from `8851c31c` (week-3 head); `packages/zod` is the v4.0.5 build (`packages/zod/src` equal to tag `v4.0.5`, version `4.0.5`, `index.cjs` present). Base `45afab0f`.
- testpilot2: branch `experiment/2026-09-week3-zod`. The runs gen-smoke-3 and the failed gen-n124 used `31c0179` (upstream `79c3b626` + template sentence, D-08). gen-smoke-4, gen-n124-run2 and gen-n124-tail used **`2c0581c54251d47be17ce593ad3ea9f8ba6807bd`** (`31c0179` + the D-29 null-completion patch). `git diff --stat 79c3b626 2c0581c`: `src/chatmodel.ts` (+6), `templates/template-singletest.hb` (+1).
- Docker image `testpilot-zod:latest` = `sha256:68f92e010216d7da79f89ccb2ae6c45a3b78c4ec2e57cf86e89a8a0972db3f58`; Node `v22.23.2`; root mocha `10.8.2` (D-01).
- Endpoint `https://openrouter.ai/api/v1/chat/completions`, model `openai/gpt-oss-120b`, temperature 0, one completion per prompt, max tokens 4000, 3 attempts, doc snippets (3 per function, 20 lines), 20 documentation files, the tool's default 5000 ms test timeout, and the default 5 h `--timeLimit`. Key supplied through ignored `docker/.env`; checked by presence only, never printed.

`GEN` (byte-identical to last week; verified with `git diff` after every script edit):

```text
GEN=(--package "$W" --model openai/gpt-oss-120b --template "$TP/templates/template-singletest.hb" --retryTemplate "$TP/templates/retry-template.hb" --snippets doc --numSnippets 3 --snippetLength 20 --temperatures 0.0 --numCompletions 1 --maxTokens 4000 --nrAttempts 3)
```

with `W=/work/zod/experiments/testpilot-2026-09/wrappers/zod` and `TP=/work/testpilot2`. Commands: `node benchmark/run.js --outputDir $EXP/results/<condition> --api <API> "${GEN[@]}"`. API is `population-main.json` for gen-n124 and gen-n124-run2, `api-n124-tail.json` for gen-n124-tail, and `api-smoke-2.json` for the smokes.

`metaData`, identical in gen-smoke-3, gen-smoke-4, gen-n124-run2 and gen-n124-tail:

```json
{"packageName": "zod", "useDocSnippets": true, "useCodeSnippets": false, "numSnippets": 3, "snippetLength": 20, "numCompletions": 1}
```

## Fixed inputs and checks (Steps 0 and 1)

| File | sha256 |
|---|---|
| `results/population-main.json` | `530b39f52feedc65cf7a7ebb97520fc037e6d0b89386263691a90b7a8a664500` (matches expected) |
| `results/api-n124-tail.json` (new) | `93e4f76c7c6a144160473bb33af0aa3d9e5aa6de8b95d651097dc86b30eb1367` |
| `testpilot2/templates/template-singletest.hb` | `efe0c1c0d84c419a7ba897aca7fc5cb4bc6fd70469ec28940f3b1aceeefbbbb6` |
| `testpilot2/templates/retry-template.hb` | `873dde74d0a0165c8705e4ad4c849457d05de4bc07ad35154e131a1db287dd3e` |
| `wrappers/zod/index.js` | `175b7f1be5238349d04ea0045dfada6ed3013d362e456d2497db3f41ef735317` |
| `wrappers/zod/package.json` | `6d30d98841c3034e829bd1e1b959e4fc5b6ee444832710c5ed5343dd696fe789` |

- Preconditions: branch in sync with origin at `8851c31c`, hooksPath `/dev/null`, only `Claude outputs/` untracked; testpilot2 clean at `31c0179`, diff from `79c3b626` only the template; `.env` present; container printed `KEY_PRESENT`, `v22.23.2`, `TOOL_BUILT`.
- Wrapper `node_modules/zod` → `../../../../../packages/zod` (symlink). Wrapper held only `index.js`, `package.json`, `node_modules/` at the start.
- `population-main.json`: 124 entries; all 60 entries of `api-sample-n60-s20260919.json` occur in it verbatim.
- Step 1: 20 documentation copies. `results/gen-docs-files-n124.txt` is identical to last week's `gen-docs-files.txt`, and the doc sources are unchanged since `45afab0f`. sha256 of all 20 copies in the log.
- `api-n124-tail.json`: the 15 population entries with no generated prompt in run2, in population order. Each entry's text is byte-identical to its text in `population-main.json`. run2 (109) + tail (15): overlap 0, union = the 124 access paths.

## Smokes (Step 3)

| Smoke | testpilot2 | Wall s | Prompts | Tests | Passing | Invalid syntax | Request failures | Null completions | Gate |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| gen-smoke-3 | `31c0179` | 319 | 13 | 13 | 4 | 1 | 0 | n/a | failed gate 4 as written; passed under D-26 |
| gen-smoke-4 | `2c0581c` | 573 | 14 | 14 | 7 | 0 | 0 | 0 | passed (gates of smoke-3 after D-26) |

Last week's gen-smoke-2: 7/11. In the smokes, the non-retry prompt texts and `snippetMap.json` were byte-identical to gen-smoke-2, but the base-prompt completions differed. The model/provider is not reproducible at temperature 0 across weeks.

## Full runs (Step 4)

| Run | Functions | Started (UTC) | Wall s | Exit | Prompts | Tests | Passing | Request failures | Null completions |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|
| gen-n124 (failed attempt) | 33 reached | 2026-09-24T12:20:49Z | 3860 | 1 | n/a | 192 validated (stdout only) | 75 (stdout) | 0 | crashed on the first |
| gen-n124-run2 | 109 | 2026-09-24T14:05:48Z | 18065 | 0 | 677 | 671 | 241 | 0 | 7 |
| gen-n124-tail | 15 | 2026-09-25T01:38:27Z | 1234 | 0 | 86 | 86 | 25 | 0 | 0 |

All runs used background `nohup caffeinate -dims docker compose run --rm -T ...` (D-27). They were monitored every 10 to 12 minutes, read only, without interruption.

**Null completions.** gen-n124-run2 printed `Null completion (finish_reason=length)` 7 times; the finish_reason values are `length` ×7. The API returned a choice with `message.content: null` after the model reached the 4000-token cap without producing text. Under D-29 each became `""` and took the empty-completion path. The prompts are run2 110, 131, 284, 350, 490, 565 and 611, for `zod.z.url`, `cuid`, `never`, `intersection`, `lazy`, `gte` and `minSize`. The tool merges identical tests, so all seven empty completions form **one** test, `gen-n124-run2/tests/test_110.js` (`Empty test`, FAILED). It is recorded under `zod.z.url`, with `promptIds [110, 131, 284, 350, 490, 565, 611]`. The six other functions therefore have no test of their own for those prompts. The per-function test counts follow the tool's `api` field.

## Checks (Step 5)

1. Request failures (per run): 0 and 0. Null completions (counted with request failures per the advisor): 7 and 0. Total 7 ≤ 10.
2. Wrapper hygiene: runner directories `test-yU66DA` (smoke-3), `test-ReRdVb` (failed gen-n124), `test-nqSOlZ` (smoke-4), `test-Jz7fsY` (run2), `test-HfeMhg` (tail) and `.nyc_output/` were listed and removed; no `test-*`, `nyc_output` or `.nyc_output` remains.
3. API identity: run2 `api.json` = the 124 population entries (same order, equal content). The tail `api.json` = the 15 entries of `api-n124-tail.json`. Functions actually generated: 109 + 15, overlap 0, union = population.
4. Prompt identity ([gen-n124-prompt-identity.md](../results/gen-n124-prompt-identity.md)), n124 vs gen-n60 on the 60 shared functions: **236 vs 236 non-retry prompts, 232 identical; 58 of 60 functions identical.** The mismatches are `zod.z.nullish` and `zod.z.uppercase`, and their `snippetMap.json` entries are the only differing ones (56 of 58 keys identical). Cause, confirmed offline with the tool's own code and no model calls: `getDocSnippets` reassigns the trimmed snippet inside its per-method loop, so the snippets a function gets depend on which functions are in the `--api` list and in what order. Recomputation reproduces both recorded snippet maps exactly, and the n60 and n124 lists differ exactly on `nullish` and `uppercase`. The D-30 split does not affect this: mining with only the 15 tail names gives the same snippets as the full population list. **Finding:** "same prompts for the same function" holds only up to this population-dependent snippet selection.
   - Mapping method: each prompt is assigned to the function whose generation block contains it. testpilot2 processes functions in `api.json` order, and each block starts with a Base prompt. This agrees with the tool's `tests[].api` on the first prompt of every test in every run (asserted in `scripts/genruns.py`). `tests[].api` alone would misattribute the merged `test_110.js` prompts, and text matching is ambiguous.

## Analysis (Step 6)

[gen-n124-analysis.md](../results/gen-n124-analysis.md) / `.json`, [gen-n124-tests.csv](../results/gen-n124-tests.csv), [gen-n124-passing.json](../results/gen-n124-passing.json), over all 124 functions. Strata from `population-main.txt`. No new `gen-examples`.

| Stratum | Functions | Tests | Passing | Test pass rate |
| --- | ---: | ---: | ---: | ---: |
| S | 74 | 438 | 172 | 39.27% |
| C | 35 | 231 | 57 | 24.68% |
| Q | 15 | 88 | 37 | 42.05% |

Functions without a passing test (12): `zod.z.file`, `json`, `keyof`, `lt`, `mime`, `minLength`, `nonnegative`, `pipe`, `property`, `startsWith`, `union`, `xid`.

Failure categories over 491 failures, classified as last week: **assertion 331, file-system 0, correctness 140, timeout 3, other 17**. Correctness includes 51 `Invalid syntax` tests: 40 from `RetryWithError` prompts (the import-duplication mechanism of D-26) and 11 from non-retry prompts. The 11 non-retry ones start with the require lines. `node --check` accepts 9 of those 11 files, and the other 2 contain TypeScript syntax, so testpilot2's own syntax check is stricter than Node 22. This is recorded only. "Other" includes missing-module errors (e.g. `uuid`) and raw ZodError arrays. One completion contained more than one `it(` (run2 prompt 24, a retry for `zod.z.iso.duration`). The 7 empty completions are the null completions above.

| Recorded provenance combination | Prompts | Passing tests tracing here |
| --- | ---: | ---: |
| Base | 124 | 49 |
| FunctionBodyIncluder | 124 | 47 |
| SnippetIncluder | 115 | 42 |
| FunctionBodyIncluder+SnippetIncluder | 115 | 50 |
| RetryWithError | 285 | 78 |

(Counted as last week: a test counts once per distinct combination it traces to.)

**n124 vs n60 on the 60 shared functions** ([gen-n124-vs-n60.md](../results/gen-n124-vs-n60.md), descriptive only):

| Measure | gen-n60 | n124 (run2 + tail) |
| --- | ---: | ---: |
| Prompts | 360 | 375 |
| Tests | 360 | 373 |
| Passing tests | 139 | 133 |
| Pass rate | 38.61% | 35.66% |
| Functions with ≥ 1 passing test | 54 | 55 |

Passing tests by provenance, n60 → n124: base 23 → 20, body 27 → 26, snippets 33 → 24, body + snippets 29 → 27, retry 27 → 36 (retry prompts 124 → 139). **41 of 60 functions have a different passing count. Only 1 generated test file is byte-identical between the runs.** Almost identical prompts led to largely different tests, consistent with the non-reproducible temperature-0 completions seen in the smokes (L-02).

## Cleanup (Step 7)

The documentation copies (`.snippet-docs/`, `README.md`) were removed. The wrapper again holds only `index.js`, `package.json` and `node_modules/`. `git status --porcelain` listed only paths under `experiments/testpilot-2026-09/` plus the untracked `Claude outputs/`. No result or doc from last week was changed; the `analyze-gen.py` regression check (defaults) leaves the gen-n60 outputs and `gen-examples/` unchanged. `coverageData/` directories are gitignored and not committed. New result files were scanned for `sk-or-v1-` credential strings before committing.

## Deviations (continuing D-01 to D-25, which still apply)

- **D-26** (advisor): Step 3 gate 4 replaced by last week's rule, fewer than half of the smoke tests `Invalid syntax`. Reason: all 25 `Invalid syntax` tests of gen-n60 came from retry prompts (verified: 25/25 retry, first line without `require`), the same mechanism as gen-smoke-3 `test_12.js`. Retry template untouched; gen-smoke-3 kept as is.
- **D-27**: `-T` on the background `docker compose run` (no pseudo-terminal). It does not change what runs in the container.
- **D-28**: `scripts/analyze-gen.py` options: `--condition` (one run, or several joined by commas; multi-run mode adds a `run` field and `<run>:<id>` prompt IDs), `--api`, `--prefix` (output file prefix) and `--no-examples`. Defaults reproduce last week's outputs exactly. New `scripts/genruns.py`, `scripts/check-prompt-identity.py` and `scripts/compare-gen-runs.py`.
- **D-29** (advisor): testpilot2 `src/chatmodel.ts` `query` handles `message.content === null` by printing `Null completion (finish_reason=<value>)` and adding `""` (the existing "Empty test" path). Nothing else changed. Rebuilt in the container with `npx tsc -p src && npx tsc -p benchmark` (the build script without its `npm i` prebuild); only `dist/chatmodel.js(.map)` changed. Commit `2c0581c`. Runs that never receive a null content behave as before.
- **D-30** (advisor): the n124 result is split into gen-n124-run2 (109 functions) and gen-n124-tail (15 functions). run2 stopped at testpilot2's default 5-hour `--timeLimit` (`benchmark/run.ts`, checked before each function). The same limit was in force last week but never reached (83 min). This week's throughput was about 2.75 min per function (last week 1.39). The tail used identical settings and no new smoke. Functions are generated independently, and the tail's snippets equal those of the full list. The only cross-function interaction in the tool, the merging of identical tests, did not occur between the two parts.

Limitations: L-01 (wrapper-only statement coverage) and **L-02 (the OpenRouter provider is not pinned or recorded by the tool)** remain. L-02 is the likely source of the week-to-week difference at temperature 0; the tool does not record the finish reason, except for null completions via D-29.

## Open questions

1. The survival stage should use `gen-n124-passing.json` with the `(run, testFile)` convention above. Should gen-n60 survival results be reused for comparison, given that only 1 test file is shared?
2. How should the 7 null completions be treated when interpreting per-function results? They became one merged failing test under `zod.z.url`, not six missing tests elsewhere.
3. Is the population-dependent snippet selection (the `getDocSnippets` trimming side effect) acceptable as tool behaviour, or should it be documented as a limitation of the n60/n124 comparison? It changed the prompts of 2 of the 60 shared functions.
4. Should `--timeLimit` be set explicitly in future runs, so that a slower provider cannot truncate a run silently?
