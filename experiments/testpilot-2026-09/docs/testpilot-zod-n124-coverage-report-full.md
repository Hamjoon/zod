# zod × TestPilot, All 124 Functions, with Coverage: Full Report

This is the canonical record of the September 2026 week-4 work on the zod × TestPilot experiment, dated 2026-09-25. The advisor set two tasks:

1. Repeat last week's experiment on the whole population of 124 functions instead of a 60-function sample, with nothing else changed.
2. Measure coverage, which last week could not be measured.

The summary for readers outside the project is `testpilot-zod-n124-coverage-report.md`, and every figure in it is taken from this document. Last week's report (`testpilot-zod-survival-report-full.md`) remains the reference for the design and for deviations D-01 to D-25.

- Repository: `Hamjoon/zod`, branch `experiment/2026-09-week4-testpilot-zod`, head `e299c68a`, everything under `experiments/testpilot-2026-09/`.
- Tool fork: `Hamjoon/testpilot2`, branch `experiment/2026-09-week3-zod`, head `2c0581c`.
- Stage records, written by the executing agent (Claude Code), are under `docs/`: `handover-stage-g-n124.md`, `handover-stage-s-n124.md` and `handover-stage-c.md`, with command logs `log-stage-g-n124.md`, `log-stage-s-n124.md` and `log-stage-c.md`.

## 1. Questions

1. With the population of 124 functions instead of the 60-function sample, and everything else unchanged, what are the generation and survival results? How do they compare with last week's?
2. What statement and branch coverage do the passing generated tests reach, measured as in the TestPilot paper (RQ1)?
3. As context for question 2 and for the survival result, what does zod's own developer suite cover at the same point, and which of the code that later releases change did each corpus execute?

## 2. Materials

### 2.1 Unchanged from last week

Last week's report (section 2) describes everything below, and none of it changed this week:

- **Subject:** zod at t = v4.0.5 (`45afab0f`), later points v4.1.0 to v4.6.0.
- **Execution package:** the CommonJS wrapper `wrappers/zod`.
- **Documentation for snippets:** the same 20 files. The list was verified identical, and the sources are unchanged since `45afab0f`.
- **Docker image:** `testpilot-zod:latest`, Node 22.23.2.
- **Generation settings (`GEN`):** byte-identical to last week. Model `openai/gpt-oss-120b` via OpenRouter, temperature 0, one completion per prompt, `--maxTokens 4000`, `--nrAttempts 3`, `--snippets doc --numSnippets 3 --snippetLength 20`, the template sentence of D-08, and the tool's default 5000 ms test timeout and 5-hour `--timeLimit`.
- **Passing set S:** all tests with status `PASSED` at t, never edited afterwards.
- **Developer corpus:** the 81 test files and 888 runtime cases of v4.0.5, frozen.
- **Survival procedure:** D-11 to D-25. The release trees built last week were reused as they were, and nothing was reinstalled or rebuilt.

### 2.2 What changed

- **Functions:** the whole population P = 124 (`results/population-main.json`: top-level `z.<name>` functions plus `z.coerce.*` and `z.iso.*`, strata S 74, C 35, Q 15), passed to the tool directly. There is no sampling step. Last week's 60 sampled entries are byte-identical to their entries in P. The `zod/mini` entry is still not sampled.
- **testpilot2:** `2c0581c` = last week's `31c0179` plus one change (D-29). If the API returns `message.content: null`, the tool now prints a warning and treats the answer as empty. Before the change it crashed. Runs that never receive `null` behave exactly as before.
- **Generation in two runs** (D-30). The 124-function run stopped at the tool's default 5-hour `--timeLimit` after 109 functions. Last week's 60 functions took 83 minutes; this week the provider was about twice as slow per function (2.75 against 1.39 minutes). The remaining 15 functions were generated in a second run with identical settings. testpilot2 generates each function independently, and the second run's snippets equal those of the full list. The n124 result is the union: `results/gen-n124-run2` (109 functions) and `results/gen-n124-tail` (15 functions), with no overlap. A test is identified by (run, file name), because file names restart in each run.

### 2.3 Coverage setup (new)

- **Coverage build:** `$ROOT/zod-versions/v4.0.5-cov` is a copy of the v4.0.5 tree, rebuilt with `"sourceMap": true` added to `packages/zod/tsconfig.build.json` and last week's build command. 360 of 360 built files (`.cjs`, `.js`, `.d.ts`, `.d.cts`) are byte-identical to the original once the source-map comment line is removed. `src/` is byte-identical.
- **zshy map comments (D-33):** zod's build tool (zshy) writes a correct `.cjs.map` for each CommonJS file, but the `.cjs` file's comment points to the ESM map (`<name>.js.map`). In the coverage copy only, the comment of the 90 `.cjs` files was changed to point to their own map. The code is untouched. A remap check on seven functions in `classic`, `core`, `util` and a locale confirmed that nyc places each declaration and first statement on the right TypeScript line.
- **LLM corpora:** each passing test is run as testpilot2's validator runs it (`nyc … mocha …`, same arguments). The only change is nyc's `--cwd`, set to the coverage build's package directory instead of the wrapper, so that zod's files are instrumented (D-34). This is what made last week's measurement cover only the wrapper's one-line `index.js`. nyc remaps the coverage of the built `.cjs` to `packages/zod/src/**/*.ts`. Both sets were measured: S124 (266 tests) and last week's S60 (139 tests).
- **Developer corpus:** last week's exact vitest command with the Istanbul coverage provider (`@vitest/coverage-istanbul` 2.1.9, installed in the coverage copy only), on the TypeScript source.
- **Denominator D:** the 63 `src/**/*.ts` files loaded by `require('zod')`, from testpilot2's own loading-coverage measurement (`benchmark/package_stats.ts`). D contains `src/index.ts`, 8 files in `v4/classic/`, 14 in `v4/core/`, and all 40 files in `v4/locales/`. The locales index that the main entry loads imports every locale. D has no test file.
- **Measurement routes:** the two corpora are measured by different routes (nyc on built JavaScript remapped to source, and vitest-istanbul on source), so their statement, branch and function counts are not interchangeable. The cross-corpus comparison is at line level: a line is executable if a statement starts on it in either map, and covered by a corpus if one of that corpus's covered statements starts on it.

## 3. Protocol

- **Stage G:** smoke run (2 functions), then the full run, then the tail run. The checks were request failures (0), null completions (7, limit 10), wrapper hygiene, API identity, and prompt identity against last week on the 60 shared functions.
- **Stage S:** S124 at v4.0.5 (control) and v4.1.0 to v4.6.0, one Mocha process per test, as last week. The developer corpus was re-run at all seven points and compared case by case with last week's results.
- **Stage C:** the coverage build and its gates; loading coverage and D; LLM coverage for S124 and S60 (all tests must still pass under nyc); developer coverage (888/888 and identical case statuses); analysis by `scripts/analyze-coverage.py`.

Every figure below was computed by the stage scripts and is in `results/gen-n124-analysis.md`, `results/gen-n124-vs-n60.md`, `results/survival-n124-summary.md`, `results/survival-n124-vs-n60.md` and `results/coverage-summary.md`, with CSVs alongside.

## 4. Results

### 4.1 Generation at t

| | Last week, 60 functions | This week, 124 functions |
|---|---:|---:|
| Prompts | 360 | 763 |
| Tests | 360 | 757 |
| Passing tests | 139 (38.61%) | 266 (35.14%) |
| Functions with at least one passing test | 54 of 60 | 112 of 124 |

| Stratum | Functions | Tests | Passing | Pass rate |
|---|---:|---:|---:|---:|
| S | 74 | 438 | 172 | 39.27% |
| C | 35 | 231 | 57 | 24.68% |
| Q | 15 | 88 | 37 | 42.05% |

- **Functions with no passing test (12):** `file`, `json`, `keyof`, `lt`, `mime`, `minLength`, `nonnegative`, `pipe`, `property`, `startsWith`, `union`, `xid`.
- **Failures (491):** assertion 331, correctness 140, timeout 3, other 17.
- **`Invalid syntax` (51 of the correctness failures):** 40 come from retry prompts. The model begins the retried test with a comment line, so the tool adds its import lines a second time; last week all 25 such tests came from this cause. The other 11 come from non-retry prompts. Node accepts 9 of those 11 files, so the tool's syntax check is stricter than Node. The remaining 2 contain TypeScript syntax.
- **Null completions (7):** all had `finish_reason=length`, meaning the model used the 4000-token limit before writing any text. The tool merges identical tests, so the 7 empty answers became one failing test (`gen-n124-run2/test_110.js`, recorded under `z.url`).

Passing tests by the prompt they trace to (a test counts once for each distinct provenance combination it traces to):

| Prompt kind | Prompts | Passing tests |
|---|---:|---:|
| Base (signature only) | 124 | 49 |
| Function body | 124 | 47 |
| Snippets | 115 | 42 |
| Body + snippets | 115 | 50 |
| Retry with error | 285 | 78 |

### 4.2 Repeatability against last week (60 shared functions)

- **Prompts:** 232 of 236 non-retry prompts are byte-identical to last week's. The 4 that differ belong to `z.nullish` and `z.uppercase`. testpilot2's snippet mining trims snippets inside a loop over all requested functions, so the snippets a function gets depend on which functions are in the list. This was confirmed offline with the tool's own code and no model calls: the recomputation reproduces both weeks' snippet maps exactly.
- **Tests:** 373 tests this week against 360 last week, and 133 passing against 139. 41 of the 60 functions have a different number of passing tests. **Only 1 generated test file is byte-identical between the two weeks.** The inputs are nearly identical, yet the model's answers at temperature 0 differ from week to week. The OpenRouter provider behind each request is not recorded (L-02).

### 4.3 Survival

Control at v4.0.5: LLM 266/266, developer 888/888.

| Release | Date | LLM tests passing (of 266) | Developer cases passing (of 888) |
|---|---|---:|---:|
| v4.1.0 | 2025-08-23 | 265 (99.62%) | 871 (98.09%) |
| v4.2.0 | 2025-12-14 | 266 (100.00%) | 868 (97.75%) |
| v4.3.0 | 2025-12-30 | 263 (98.87%) | 864 (97.30%) |
| v4.4.0 | 2026-04-29 | 263 (98.87%) | 853 (96.06%) |
| v4.5.0 | 2026-08-28 | 261 (98.12%) | 838 (94.37%) |
| v4.6.0 | 2026-09-09 | 258 (96.99%) | 834 (93.92%) |

- At v4.6.0 by stratum: S 166/172, C 56/57, Q 36/37.
- Never broke in any release: 257 LLM tests and 832 developer cases. One LLM test and 3 developer cases failed and later passed again.
- **The developer results are identical to last week's** at all seven releases: the same case identities, statuses and first message lines. This shows that the reused release trees and the environment did not drift.
- **On the 60 shared functions,** this week's 133 passing tests pass at every release. Last week's single break (`z.parse`, a test that exercised `z.iso.datetime`: commit `036b39f4` made datetimes with a `Z` or offset but no seconds invalid) has no counterpart this week: this week's two `z.parse` tests never break.
- **All 9 LLM tests that fail at some release belong to the 64 functions that last week's sample did not include:**

| Test | Function | Failing at | First error line |
|---|---|---|---|
| run2 `test_366.js` | `partialRecord` | v4.1.0 only | `Cannot read properties of undefined (reading 'has')` |
| run2 `test_518.js` | `instanceof` | v4.3.0 on | `Should throw default error when input is not an instance of MyClass` |
| run2 `test_521.js` | `instanceof` | v4.3.0 on | regular expression `/Input not instance of Test/` did not match |
| run2 `test_522.js` | `instanceof` | v4.3.0 on | `Expected a ZodError with the default message for non-instance input` |
| run2 `test_370.js` | `partialRecord` | v4.5.0 on | regular expression `/Invalid key/` did not match |
| run2 `test_371.js` | `partialRecord` | v4.5.0 on | regular expression `/Invalid/` did not match |
| run2 `test_10.js` | `iso.date` | v4.6.0 | `Result should be a Date object` |
| run2 `test_117.js` | `emoji` | v4.6.0 | `Cannot read properties of undefined (reading 'some')` |
| tail `test_50.js` | `toUpperCase` | v4.6.0 | strict equality: a `$ZodCheckOverwrite` object instead of `'Z'` |

No manual classification has been done. From the messages alone, 5 look like changes in error-message text (the three `instanceof` tests and two `partialRecord` tests), and 4 look like behaviour changes:

- `toUpperCase` now returns a check object instead of the transformed string;
- `iso.date` no longer gives a Date;
- `emoji` hits an internal `TypeError`;
- one `partialRecord` test hits a `TypeError` at v4.1.0 only.

The last looks like a v4.1.0 defect fixed in v4.2.0, but the cause has not been checked.

### 4.4 Coverage: the paper's metrics (LLM corpora)

Over D, passing tests only. Under nyc, all 266 S124 tests and all 139 S60 tests still pass, so no test is excluded.

| Metric | Loading only | S124 (266 tests) | S124 − loading | S60 (139 tests) | S60 − loading |
|---|---:|---:|---:|---:|---:|
| Statements | 15.19% (857/5640) | 46.38% (2616/5640) | +31.19 pp | 39.23% (2213/5640) | +24.04 pp |
| Branches | 0.19% (7/3623) | 20.03% (726/3623) | +19.84 pp | 15.37% (557/3623) | +15.18 pp |
| Functions | 1.10% (13/1174) | 52.12% (612/1174) | +51.02 pp | 38.16% (448/1174) | +37.06 pp |
| Lines | 15.74% (796/5054) | 47.40% (2396/5054) | +31.66 pp | 40.24% (2034/5054) | +24.50 pp |

For reference, the paper reports (25 npm packages, gpt-3.5-turbo, original TestPilot):

- statement coverage per package 33.9% to 93.1%, median 70.2%;
- branch coverage median 52.8%;
- median gain over loading coverage 53.7 pp;
- median share of uniquely contributing tests 10.5%;
- median of per-function statement coverage 77.1%.

The tool variant, the model, the prompts and the package all differ, so these are context, not a comparison.

**Per-function statement coverage.** All 124 functions were located in the source: 91 through the coverage map's function table, 28 through their re-export in `classic/checks.ts` to the definition in `core/api.ts` (D-36), and 5 as exported constants.

| Set | Functions | Median | At 0% | At 100% | Body size in statements (min / median / max) |
|---|---:|---:|---:|---:|---|
| S124 | 124 | 100% | 17 | 106 | 1 / 1 / 14 |
| S60 | 60 | 100% | 10 | 50 | 1 / 1 / 4 |

Most public zod functions are one-statement wrappers around `core` (for example, `z.email` is `return core._email(ZodEmail, params)`), so this metric is close to "called or not". Several functions at 0% do have passing tests, but those tests never call the top-level function:

- tests for `positive` and `nullish` use the method form (`.positive()`, `.nullish()`);
- `gen-n124-run2/test_601.js` (for `maxSize`) defines its own stand-in object;
- `gen-n124-run2/test_84.js` (for `guid`) never loads zod and tests `crypto.randomUUID`.

**Uniquely contributing tests** (a test that covers at least one statement no other passing test of its set covers): S124 43 of 266 (16.17%); S60 28 of 139 (20.14%).

### 4.5 Coverage: the developer suite and the line-level comparison

Developer suite over D, in its own measurement route: statements 59.65% (3033/5084), branches 35.40% (1234/3485), functions 73.33% (795/1084), lines 59.76% (2721/4553). This is context. The LLM corpora target 124 (or 60) public functions of one entry point, while the developer suite targets the whole package, so a gap at package level is expected.

Line level (5070 executable lines):

| | LLM | Developer | Both | LLM only | Developer only | Neither |
|---|---:|---:|---:|---:|---:|---:|
| S124 vs developer | 2396 (47.26%) | 2721 (53.67%) | 1868 | 528 | 853 | 1821 |
| S60 vs developer | 2034 (40.12%) | 2721 (53.67%) | 1510 | 524 | 1211 | 1825 |

87 of the "LLM only" lines are in four files that only re-export (`index.ts`, `classic/checks.ts`, `core/index.ts`, `locales/index.ts`). In the TypeScript source these files have no statements. The CommonJS build turns them into getter code, which only the LLM measurement sees. Without those files, S124 covers 441 lines that the developer suite does not, and S60 covers 437.

By source area (S124 against the developer suite; lines from `coverage-lines-s124-vs-dev.csv`):

| Area | Executable lines | S124 | Developer | Both | S124 only | Developer only |
|---|---:|---:|---:|---:|---:|---:|
| `v4/classic` (public API layer) | 740 | 682 (92.2%) | 557 (75.3%) | 504 | 178 | 53 |
| `v4/core` (schemas, checks, parsing) | 2462 | 1511 (61.4%) | 1999 (81.2%) | 1282 | 229 | 717 |
| `v4/locales` (40 message tables) | 1864 | 199 (10.7%) | 165 (8.9%) | 82 | 117 | 83 |

- The locale files are 37% of the executable lines. Each test normally reaches only the English messages, which keeps every package-level figure low.
- Leaving out the locales, S124 covers 68.5% of lines (2197/3206) and the developer suite 79.7% (2556/3206).
- In `classic`, the 178 "S124 only" lines include the 29 re-export lines of `checks.ts`. Some of the rest may come from the different measurement routes, which have not been separated line by line.

### 4.6 Coverage of code changed by later releases

Changed lines are the old-side lines of `git diff -U0 v4.0.5 <tag> -- packages/zod/src` (lines of v4.0.5 modified or deleted by that release) in files of D, test files excluded, restricted to executable lines. Coverage is at t.

| Release | Changed executable lines | S124 | Developer | Both | S124 only | Developer only | Neither | S60 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| v4.1.0 | 239 | 133 | 208 | 118 | 15 | 90 | 16 | 117 |
| v4.2.0 | 829 | 211 | 611 | 184 | 27 | 427 | 191 | 162 |
| v4.3.0 | 1311 | 230 | 644 | 203 | 27 | 441 | 640 | 180 |
| v4.4.0 | 1475 | 353 | 796 | 326 | 27 | 470 | 652 | 295 |
| v4.5.0 | 1829 | 634 | 1110 | 596 | 38 | 514 | 681 | 561 |
| v4.6.0 | 1946 | 727 | 1221 | 689 | 38 | 532 | 687 | 633 |

Per S124 test, whether it executed at least one line changed by v4.6.0, crossed with its status at v4.6.0:

| Set | Executed changed code, survived | Executed changed code, broke | Did not, survived | Did not, broke |
|---|---:|---:|---:|---:|
| S124 | 257 | 8 | 1 | 0 |
| S60 | 138 | 1 | 0 | 0 |

The one S124 test that executed no changed line is `test_84.js`, which never loads zod.

**This cross-tabulation does not separate the tests.** By v4.6.0, 1946 of the 5070 executable lines (38%) had been modified or deleted, including much of the parsing path in `core`. So almost any test that parses executes changed lines. The median S124 test executes 219 of them, and 265 of the 266 tests execute at least 50. A modified line is also not necessarily a behaviour change: refactoring, renaming and moved code count too. The table therefore cannot say whether a surviving test reached a behaviour change and missed it. That needs the lines that actually changed behaviour, for example the lines changed by the commits that broke a developer case. Finding those commits needs bisection (section 8).

## 5. Deviations and defects this week

Deviations D-01 to D-25 from last week still apply.

**Stage G**

- **D-26:** the smoke gate "no `Invalid syntax`" was replaced by last week's rule (fewer than half), because this failure comes from retry prompts, as all 25 last week did.
- **D-27:** `docker compose run -T` for background runs. What runs in the container is unchanged.
- **D-28:** the analysis scripts gained options for the run name, the API file and the output prefix. With the defaults they reproduce last week's outputs exactly.
- **D-29:** the null-completion patch (section 2.2). The first 124-function attempt crashed on a `null` answer after 64 minutes and is kept as a failed attempt (`results/gen-n124`).
- **D-30:** generation split into run2 (109 functions) and tail (15 functions) after the 5-hour time limit.

**Stage S**

- **D-31:** tests are identified by (run, file name).
- **D-32:** output-path options on `analyze-survival.py`, so that last week's handover and log are not rewritten.

**Stage C**

- **D-33:** the `.cjs` source-map comments in the coverage copy (section 2.3).
- **D-34:** nyc `--cwd` set to the coverage build.
- **D-35:** vitest's raw coverage output is kept outside the repository.
- **D-36:** the function locator follows re-exports from `classic/checks.ts` to `core/api.ts`.
- **Other notes:** `results/coverage/` was committed with `git add -f`, because zod's root `.gitignore` ignores `coverage`.

**Tool defect found.** zshy's CommonJS output references the ESM source map. Anyone measuring coverage on zod's CommonJS build with a source-map-aware tool gets wrong source lines unless this is corrected.

## 6. Observations

1. **More functions, similar pass rate, more coverage.** Going from 60 to 124 functions changed the test pass rate little (38.6% to 35.1%) and raised statement coverage from 39.2% to 46.4% over the same files.
2. **The near-zero LLM breakage of last week depended partly on the sample.** With 124 functions, 8 of 266 LLM tests fail at v4.6.0 (3.0%), against 53 of 888 developer cases (6.0%). All 9 LLM tests that break at some release belong to functions last week did not sample. The LLM tests still break less often than the developer tests, but the gap is smaller than the 60-function sample suggested.
3. **The LLM tests also break on message text.** Five of the nine breaks appear to be error-message wording (regular expressions or default messages), the kind of non-contract assertion that makes up most of the developer failures (snapshots). The other four appear to be behaviour changes, one of them transient (v4.1.0 only). The manual classification planned last week now has cases on both sides.
4. **Generation is not repeatable across weeks.** The same prompts, at temperature 0, gave almost entirely different tests (1 identical file of 373). A single generation run is one draw. Survival and coverage figures for a single run should be read as such, and stable estimates need repeated runs.
5. **The LLM tests cover the API layer more and the core less.** S124 covers 92% of the `classic` lines against the developer suite's 75%, and 61% of the `core` lines against 81%. This fits last week's reading of the tests (short, basic parse behaviour through the public functions). They reach the public surface broadly but not the internal paths the developers test directly.
6. **Coverage of changed lines does not explain survival at this granularity** (section 4.6). Almost every test executes changed code, because 38% of the executable lines changed. Separating "reached a behaviour change and missed it" from "never reached it" needs behaviour-level change sets.

## 7. Limitations

- **L-02:** the OpenRouter provider is not pinned or recorded, and is the likely source of the week-to-week difference at temperature 0.
- Generation ran in two parts after the tool's default time limit (D-30), with identical settings.
- testpilot2's snippet selection depends on the list of requested functions, which changed the prompts of 2 of the 60 shared functions.
- The generated tests prompt on built JavaScript without doc comments. The paper's doc-comment prompt kind could not occur (as last week).
- **Coverage figures and the paper:**
  - Coverage is measured at t only.
  - D includes all 40 locale files, which the main entry loads.
  - The LLM and developer corpora are measured by different routes and compared at line level.
  - Per-function coverage is nearly binary, because the public functions are one-statement wrappers.
  - The paper's non-trivial-assertion coverage (RQ3) was not measured: it needs CodeQL backward slicing.
  - The paper's per-refiner ablation (RQ5) was not run: it needs one generation run per configuration.
- **Classification and other scope limits:**
  - The failure categories are automatic. The contract or non-contract classification of the 9 LLM and 53 developer failures has not been done.
  - The v4.6.0 developer environment is last week's fresh dependency resolution (last week's report, section 5.3).
  - The `zod/mini` entry point is not included.

## 8. Next steps (for discussion)

1. Manual classification of the 9 LLM and 53 developer failures (contract change or non-contract assertion), using the rule in last week's report, section 6.
2. Bisection of the breaking cases to their causing commits. Then redo section 4.6 on the lines those commits changed, which would show whether surviving tests reached behaviour changes.
3. Repeated generation runs (k runs of the same configuration) to measure run-to-run variation in pass rate, survival and coverage, with `--timeLimit` set explicitly.
4. Case-level pairing of LLM tests with developer cases per function (deferred from last week).
5. Per-function coverage that follows the call into `core`, and attribution by what a test calls rather than by the function label.

## 9. Files

Under `experiments/testpilot-2026-09/`:

- **Generation:**
  - `results/gen-n124-run2/`, `results/gen-n124-tail/`, and `results/gen-n124/` (the failed attempt)
  - `results/gen-n124-passing.json` (S124: `{run, testName, api, testFile}`)
  - `results/gen-n124-analysis.md|json`, `results/gen-n124-tests.csv`
  - `results/gen-n124-prompt-identity.md`, `results/gen-n124-vs-n60.md`
  - `results/api-n124-tail.json`, `results/gen-smoke-3/`, `results/gen-smoke-4/`
- **Survival:**
  - `results/survival-n124/<tag>/`
  - `results/survival-n124-summary.md`, `results/survival-n124-llm-matrix.csv`, `results/survival-n124-dev-matrix.csv`, `results/survival-n124-pairs.csv`, `results/survival-n124-pair-map.json`
  - `results/survival-n124-vs-n60.md`, `results/survival-n124/dev-compare-week3.json`
- **Coverage:**
  - `results/coverage/`: build check, loading coverage, `file-set-D.txt`, merged maps and summaries per corpus, per-test covered lines (`per-test-lines.json.gz`)
  - `results/coverage-summary.md`, `results/coverage-per-function-<set>.csv`, `results/coverage-lines-<set>-vs-dev.csv`, `results/coverage-changed-lines.csv`, `results/coverage-changed-by-test-<set>.csv`
- **Scripts:** `scripts/` (generation analysis, survival drivers and analysis, coverage runners, merge and analysis, release-tree and remap checks)
- **Records:** `docs/` (handovers, command logs, this report)

Outside the repository and not committed: `$ROOT/zod-versions/v4.0.5-cov` (1.0 GB) and `$ROOT/coverage-raw/` (424 MB of per-test raw coverage).
