# Stage S (n124) handover: complete

## Corpus and result

**Authoritative generation result.** Per [handover-stage-g-n124.md](handover-stage-g-n124.md) this is not one run but the union of `results/gen-n124-run2` (109 functions) and `results/gen-n124-tail` (15 functions). The instruction expected a single run (RUN) and a passing list `gen-n124-run2-passing.json`; it also says to use the names the handover gives. **S124 = `results/gen-n124-passing.json`, |S124| = 266**: 241 from run2 and 25 from the tail. A test is identified by `(run, testFile)`, and its file is `results/<run>/tests/<testFile>`. Every file exists. Basenames are distinct within each run, but 7 repeat across the two runs (`test_27/44/47/50/55/63/84.js`), so they are not unique across the whole list (D-31). In the outputs of this stage an LLM test is written `<run>/<testName>`.

S124 ran unchanged at seven releases, next to the developer corpus frozen at v4.0.5, reusing last week's release trees as they were. No model calls.

| Release | LLM survivors | Developer passed |
| --- | ---: | ---: |
| v4.0.5 (control) | 266/266 (100.00%) | 888/888 |
| v4.1.0 | 265/266 (99.62%) | 871/888 |
| v4.2.0 | 266/266 (100.00%) | 868/888 |
| v4.3.0 | 263/266 (98.87%) | 864/888 |
| v4.4.0 | 263/266 (98.87%) | 853/888 |
| v4.5.0 | 261/266 (98.12%) | 838/888 |
| v4.6.0 | 258/266 (96.99%) | 834/888 |

The figures come from [survival-n124-summary.md](../results/survival-n124-summary.md), computed by `analyze-survival.py`. Per stratum at v4.6.0: S 166/172, C 56/57, Q 36/37. Never broke in any release: 257 LLM tests and 832 developer cases. One LLM test and 3 developer cases failed and later passed again.

## Revisions and environment

- zod branch `experiment/2026-09-week4-testpilot-zod`, starting at `cbcb8588` (Stage G n124 head), in sync with origin; hooksPath `/dev/null`.
- testpilot2 `2c0581c` (the D-29 null-completion patch), in sync with origin. It is not used in this stage apart from the Mocha binary under `/work/testpilot2/node_modules`.
- Release trees `$ROOT/zod-versions/{v4.0.5 … v4.6.0, frozen-v4.0.5-tests}` reused as they were; nothing reinstalled or rebuilt. Docker service `tp` (image `testpilot-zod:latest`, Node v22.23.2).

## Release-tree integrity (Step 0)

[source-integrity.json](../results/survival-n124/source-integrity.json), from the new `scripts/check-release-trees-n124.py` (host, read only):

| Release | Source files checked | Changed | Missing | Extra | index.cjs sha256 | Test files = frozen |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| v4.0.5 | 101 | 0 | 0 | 0 | `2a3455ce…88a9c2` | 81, yes |
| v4.1.0 | 104 | 0 | 0 | 0 | `2a3455ce…88a9c2` | 81, yes |
| v4.2.0 | 111 | 0 | 0 | 0 | `2a3455ce…88a9c2` | 81, yes |
| v4.3.0 | 113 | 0 | 0 | 0 | `2a3455ce…88a9c2` | 81, yes |
| v4.4.0 | 116 | 0 | 0 | 0 | `2a3455ce…88a9c2` | 81, yes |
| v4.5.0 | 133 | 0 | 0 | 0 | `9215109e…3d8e85` | 81, yes |
| v4.6.0 | 133 | 0 | 0 | 0 | `d93a8730…4096e` | 81, yes |

Full hashes are in the JSON. "Checked" counts the files under `packages/zod/src/` outside `tests/` directories, compared with the tag through git blob ids. Last week's check also covered the vitest config, root `package.json` and `pnpm-lock.yaml`, hence its larger counts (107 … 142). The check was repeated after all runs: still `INTEGRITY_OK`.

Release metadata copied byte for byte from `results/survival/` (they describe the reused trees; they are not results of this stage): `tags.json` and, per tag, `build-status.json`, `build.log`, `env.txt`, `devtest-diff.txt`. No `llm-*` or `dev-*` file was copied. The copied `build-status.json` files were left unchanged; each release's probe output of this stage is in `llm-probe.txt`. Wrapper at start: symlink `../../../../../packages/zod`; holds only `index.js`, `package.json` and `node_modules/`.

## Script options and regression check (Step 1)

- `run-survival-llm.py`: `--passing` (default `results/gen-n60-passing.json`) and `--tests` (default `results/gen-n60/tests`). An entry with a `run` field is read from `results/<run>/tests/`, and its raw files are named `<run>__<testName>.*` (D-31). The hard-wired 278 was not in this script but in `replay-survival.py`, which is unchanged; the new driver checks 2 × |S124| = 532.
- `run-survival-dev.py`: `--out-root` (default `results/survival`) and `--log` (default `docs/log-stage-s.md`). It passes `--out-root` on to `summarize-dev-run.py`. The `tags.json` lookup still reads `results/survival/tags.json`. The v4.1.0 `dev-attempt1` comparison runs only with the default root.
- `summarize-dev-run.py`: `--out-root` (baseline `<root>/v4.0.5/dev-cases.json`). No `--log` was added, because the script writes no log.
- `analyze-survival.py`: `--survival-root`, `--passing`, `--api` and `--out-prefix` (outputs `<prefix>-summary.md`, `-llm-matrix.csv`, `-dev-matrix.csv`, `-pairs.csv`; the pair map is `results/pair-map.json` for the default prefix, `<prefix>-pair-map.json` otherwise). Also `--handover` and `--log` (D-32), the run-aware test key (D-31), and `len(S)` in place of the hard-wired 139. The 54-function assertion is replaced by what it checked (every function of the passing list is in the API list). Its import of `analyze-gen.py` gets an empty argument list (D-32).
- **Regression check: passed.** All result inputs and outputs at their defaults, and `--handover`/`--log` pointed at scratch copies of last week's handover and log. `git diff --exit-code results/` shows no change. The regenerated handover is byte-identical to `docs/handover-stage-s.md`, and the appended table is character-identical to the last computed table in `docs/log-stage-s.md`. Last week's `test-survival-analysis.py` passes all 4 tests. Last week's `pair-map.json` equals the automatic filename matching, so the n124 pair map (automatic, 112 functions) uses the same method.

## Control (Step 2)

- LLM at v4.0.5: 266 pass, 0 fail, 0 load-error, 0 timeout, 0 other. The allowance was ceil(1% × 266) = 3; **flaky at t: none**. Each release: probe `<version> object function`; `test-s` gone afterwards; `llm-raw/` holds 532 files. After the loop the wrapper symlink was restored and probed `4.0.5 object function`.
- Developer at v4.0.5: 81 files, 888 cases, 888 passed (gate passed).
- For information: the 133 S124 tests of the 60 shared functions (55 of them have passing tests) pass at **every** release. All LLM failures below are in functions outside last week's sample.

## LLM failures

9 of 266 tests fail at some release (all in `gen-n124-run2` except the last). Failure categories, as classified by `analyze-gen.py`: v4.6.0 has 7 assertion and 1 correctness failure. Per-release categories are in the summary.

| Test | Function | Failing at | First error line |
| --- | --- | --- | --- |
| `gen-n124-run2/test_366.js` | zod.z.partialRecord | v4.1.0 only (passes again from v4.2.0) | Cannot read properties of undefined (reading 'has') |
| `gen-n124-run2/test_518.js` | zod.z.instanceof | v4.3.0 onward | Should throw default error when input is not an instance of MyClass |
| `gen-n124-run2/test_521.js` | zod.z.instanceof | v4.3.0 onward | The input did not match the regular expression /Input not instance of Test/. |
| `gen-n124-run2/test_522.js` | zod.z.instanceof | v4.3.0 onward | Expected a ZodError with the default message for non‑instance input |
| `gen-n124-run2/test_370.js` | zod.z.partialRecord | v4.5.0 onward | The input did not match the regular expression /Invalid key/. |
| `gen-n124-run2/test_371.js` | zod.z.partialRecord | v4.5.0 onward | The input did not match the regular expression /Invalid/. |
| `gen-n124-run2/test_10.js` | zod.z.iso.date | v4.6.0 | Result should be a Date object |
| `gen-n124-run2/test_117.js` | zod.z.emoji | v4.6.0 | Cannot read properties of undefined (reading 'some') |
| `gen-n124-tail/test_50.js` | zod.z.toUpperCase | v4.6.0 | Expected values to be strictly equal: |

Full messages are in `results/survival-n124/<tag>/llm-results.json` and `llm-raw/`. The tests were not edited, retried or skipped.

## Developer corpus: determinism check (Step 3)

For each release, `run-survival-dev.py` first tries the same command as last week (same cwd `/work/zod-versions/<tag>`, identical apart from the JSON output path). It succeeded at every release (`fallbackUsed` 0), so no fallback deviation. [dev-compare-week3.json](../results/survival-n124/dev-compare-week3.json) (new `scripts/compare-dev-week3.py`): **identical to last week at all seven releases.** The case identities are the same, 0 case statuses differ, and 0 first message lines differ. The developer results are deterministic in this environment. Failure categories (snapshot/load/assertion/other) from v4.1.0 to v4.6.0: 12/0/5/0, 13/0/6/0, 14/0/7/2, 20/0/10/4, 34/0/12/3, 34/0/16/3.

## n124 vs n60 (Step 4)

[survival-n124-vs-n60.md](../results/survival-n124-vs-n60.md) (new `scripts/compare-survival-runs.py`, descriptive only):

- LLM survivors, n60 vs n124: v4.0.5 139/139 vs 266/266; v4.4.0 139/139 vs 263/266; v4.5.0 138/139 vs 261/266; v4.6.0 138/139 (99.28%) vs 258/266 (96.99%). Developer counts are identical in both runs at every release.
- LLM tests failing at some release: n60 1 (`gen-n60/tests/test_353.js`, `zod.z.parse`, v4.5.0, "Got unwanted exception."); n124 9 (above).
- Among the 60 shared functions, 10 have a different first-break release. Nine of these differ only because one run has no passing test for the function: n124 has none for `file`, `keyof`, `lt`, `minLength`; n60 has none for `ksuid`, `maxSize`, `number`, `size`, `templateLiteral`. The only substantive difference is **`zod.z.parse`**: n60's one test breaks at v4.5.0, while n124's two parse tests never break.

## Wall times

| Release | LLM s | Developer s |
| --- | ---: | ---: |
| v4.0.5 | 55.2 | 8.4 |
| v4.1.0 | 61.2 | 10.1 |
| v4.2.0 | 67.9 | 8.8 |
| v4.3.0 | 68.7 | 8.9 |
| v4.4.0 | 57.9 | 8.7 |
| v4.5.0 | 53.3 | 7.1 |
| v4.6.0 | 58.7 | 9.7 |

The LLM driver took 424.0 s end to end; the developer loop took about 62 s in total. The "Measured wall times" table of the summary adds the install/build seconds from the copied `build-status.json`. Those belong to last week's builds; nothing was built this week.

## Cleanup

Wrapper symlink restored (`../../../../../packages/zod`) and probed `4.0.5 object function` in the container; no `test-s`; the wrapper holds only `index.js`, `package.json`, `node_modules/`. `$ROOT/zod-versions/` left as it is for the coverage stage (its test directories were replaced from the frozen snapshot, which was a hash-checked no-op). `git status --porcelain` lists only paths under `experiments/testpilot-2026-09/` plus the untracked `Claude outputs/`. None of the read-only paths (`results/survival/`, `results/survival-*.md|csv`, `results/pair-map.json`, `docs/log-stage-s.md`, `docs/handover-stage-s.md`) changed.

## Deviations (continuing after D-30)

- **D-31**: S124 spans two run directories, so a test's identity is `(run, testFile)`, not the basename. The Step 0 check "basenames distinct" is replaced by: every file exists under `results/<run>/tests/`, and the `(run, basename)` pairs are distinct. `run-survival-llm.py` resolves entries with a `run` field under `results/<run>/tests/` (the `--tests` value passed by the driver, `results/gen-n124-run2/tests`, is not used for such entries) and names their raw files `<run>__<testName>`. `analyze-survival.py` keys them as `<run>/<testName>`. Entries without `run` (last week's list) behave exactly as before; the regression check shows this. Inside the scratch directory the test keeps its basename, as the validator had it.
- **D-32**: `analyze-survival.py` with plain defaults rewrites `docs/handover-stage-s.md` and appends to `docs/log-stage-s.md`, both read-only under ground rule 4. Options `--handover` (empty string skips) and `--log` were added with the old paths as defaults. The regression check pointed them at scratch copies; the n124 run skipped the handover section (last week's Continuation 4) and logged to `log-stage-s-n124.md`. Also, `analyze-gen.py` has parsed `sys.argv` since Stage G, so `analyze-survival.py` gives it an empty argument list while importing it.

## Open questions

1. `gen-n124-run2/test_366.js` (`zod.z.partialRecord`) fails only at v4.1.0 and passes again from v4.2.0. Is that a v4.1.0 regression later fixed upstream, or something else? It is recorded, not interpreted.
2. The three `instanceof` tests break at v4.3.0 on default error-message wording. Should message-text assertions be separated from behavioural breaks when interpreting survival, as the snapshot categories are for the developer corpus?
3. The comparison at the level of shared functions is limited: which functions have passing tests differs between n60 and n124 (9 of 60 functions), because generation at temperature 0 does not repeat week to week (Stage G).
4. Coverage stage: the release trees are still in place, and S124's location convention is `(run, testFile)` as above.
