# Run notes: zod pilot 2026-09 week 1

Every deviation, judgment call and observation, in the order encountered. Instruction document: `pilot-cc-instructions-2026-09-week1.md` (header "Issued 2026-09-05"). Times are local (KST, UTC+9) unless marked.

## D-02 Fresh clone; earlier session's `zod-pilot` clone absent (2026-09-05 18:08)

**What.** §3 says to reuse an earlier session's `zod-pilot` clone if it holds `dev-baseline/` with `dev-run.json`, `dev-counts.json`, `results/env.json` and `coverage/`. No `zod-pilot` directory existed anywhere under `~/_projects` (also checked `~/.Trash` and Spotlight). The `zod/` directory in the working directory is a different clone at `3c9ca1d9` with no `experiments/` tree.
**Why.** The earlier clone and its Phase 1/1b artifacts are gone from disk; cause unknown to this session.
**Action.** Ran Phase 1 in full in a fresh clone `zod-week1-sep-pilot/zod-pilot` (`git clone https://github.com/Hamjoon/zod.git zod-pilot`), checked out `45afab0f846dffd591362b6f770017507eb185b5` by hash (verified equal to upstream `refs/tags/v4.0.5` via `git ls-remote colinhacks/zod`), `pnpm install --frozen-lockfile` (pnpm switched itself to 10.12.1 from the `packageManager` field; CLI on PATH is 10.20.0). Phase 1b is reproduced from scratch; any earlier sample is superseded by this run's `units-sampled.json`.

## D-01 Temporary coverage provider install (pre-registered; executed 2026-09-05 18:15)

**What.** `@vitest/coverage-v8` is not a dependency of the repo at t. Ran `pnpm add -D -w @vitest/coverage-v8@2.1.9` (matches vitest 2.1.9), ran the dev suite with `--coverage --coverage.reporter=json --coverage.reporter=json-summary --coverage.reportsDirectory=../../experiments/pilot-2026-09/dev-baseline/coverage`, then `git checkout -- package.json pnpm-lock.yaml`.
**Why.** Per-line v8 coverage of the dev suite is needed for the DEV row and for D3's coverage-data filter.
**Result.** `git status --porcelain --untracked-files=no` is empty after the restore. The provider stays in `node_modules` (2.1.9) for later phases. Log: `dev-baseline/coverage-run.stdout.log`. The coverage run also re-executed the suite: 162/162 file entries, 1708/1708 cases passed, same as the baseline run.

## O-02 Static `test(`/`it(` count is 869, instruction expected 868 (2026-09-05 18:13)

**What.** `grep -rhoE '\b(test|it)\(' --include='*.test.ts' packages/zod/src/v4` over the 81 v4 test files gives 869 occurrences (861 `test(` + 8 `it(`). The instruction's expected value is 868. Method variants are recorded in `dev-baseline/dev-counts.json` (`static_counts`): anchored at line start gives 823; 45 occurrences are commented-out `// test(` lines.
**Why.** A one-count difference is method dependent (comment handling, regex anchoring); the earlier session's exact regex is not on disk.
**Action.** No action. Reported as an observation. The instruction's remark that the runtime-vs-static gap is `test.each` expansion does not hold at t: there is no `test.each`, `it.each` or `describe.each` in the v4 tests. The gap (888 runtime cases vs 869 static, plus 45 commented-out) comes from tests registered inside loops or helper functions.

## O-03 `OPENROUTER_API_KEY` is unset in the CC shell (2026-09-05 18:11)

**What.** The environment variable is not set in the shell that runs this session. It is only needed in Phase 3, which starts after the Phase 2 stop point.
**Action.** Flagged in the Phase 1b report; Gary must export it before approving Phase 3.

## O-01 FSL is the only technique whose prompt shows an import statement (pre-registered)

**What.** The FSL example test file (`classic/tests/registries.test.ts`) contains `import` lines, so FSL is the only technique whose prompt exposes an import statement. This mirrors the paper's design, where only the FSL example exposed JUnit imports. Reported as an observation, not corrected (D1: no import line is added).

## J-01 Reading of "units without dev coverage data" in D3 (2026-09-05 18:32; earlier session's J-03)

**What.** D3 excludes "units without dev coverage data". Two readings: (line) a unit has data if its declaring-statement range contains at least one source-mapped executable line in `coverage-final.json`; (branch) a unit has data only if it also has at least one branch. Under the line reading every one of the 233 units has data (0 excluded). Under the branch reading 13 kept units have zero branches and would be excluded, changing the pool and forcing a redraw.
**Action.** Used the line reading (the same reading the earlier session used, per the session memory); `results/units-sampled.json` records `excluded_no_coverage_data: []`. Units with zero branches get `branch_pct: null` and are left out of the branch-coverage mean. Open for the Cowork session to confirm.

## O-04 Call count: §1 says 15 calls, §5 and §6 say 25 (pre-existing in the document)

**What.** §1 ("Calls = 5 units × 3 = 15") and the scope note agree on COT/TOT/GTOT only. §5's heading says "25 calls", §6 says "pooled over all 25", §5 and §7 say "5 × 5 table". Read as leftovers from the five-technique version; this run makes 15 calls and reports 5 × 3 tables, with ZSL/FSL rows marked pending. Open for confirmation.

## O-05 Scope of `llm/` rendering in Phase 2 (question)

**What.** §4 says "for each kept unit × technique, render the full prompt into `llm/{unit_id}/{TECH}/prompt.md`", which would be 232 × 5 = 1,160 files, of which 15 are used. Proposal: write `llm/` prompt files for the five sampled units only (25 files, ZSL/FSL included and archived unsent); the per-unit token counts of all five prompts for all 232 kept units are already archived in `results/units-selected.json`. `render-prompts.py write` accepts `--units` so the full set can be rendered later if wanted. Open for the Cowork session.

## O-06 Unit index labels differ by one in `mini/` from the earlier session (2026-09-05 18:32)

**What.** The sample drawn here (seed 20260904) contains the same five classes the earlier session reported, but the mini unit is labelled `231-ZodMiniLazy` here and `230-ZodMiniLazy` in the session memory; the core and classic labels (086, 098, 053, 038) match. The earlier inventory is not on disk, so the cause cannot be checked. Pool sizes match (core 93, classic 68, mini 67; total 228). This run's `units-all.json` is the record; the label is a name, not data.

## O-07 Meaning of "executable line" in per-unit coverage (2026-09-05 18:32)

**What.** `@vitest/coverage-v8` maps V8 ranges back to the TypeScript source through source maps, so `statementMap` holds one entry per source line that has emitted JavaScript. Type-only lines (interfaces, type aliases, annotations) have no entry and are not counted; e.g. `core/schemas.ts` has 3,307 non-blank lines and 1,710 statement entries. This matches the instruction's intent (type-only statements have no executable lines). LLM-test coverage in Phase 6 will be computed with the same rule.

## R-01 Rulings from the Cowork session after the Phase 1b stop (relayed by Gary, 2026-09-05)

- J-01: line reading accepted; no redraw. `units-sampled.json` stands.
- O-04: 15 calls (5 units × COT/TOT/GTOT); tables are 5 × 3; ZSL and FSL rows are marked "pending authors' reply".
- O-05: `llm/` prompt files are rendered for the five sampled units only (ZSL and FSL rendered and archived, not sent).
- O-03: `OPENROUTER_API_KEY` will be present in the process environment when Phase 3 is approved (set by Gary outside this session). Rule for all scripts and logs: never print the key's value; check presence only with `test -n "$OPENROUTER_API_KEY"`. `request.json` holds the request body only, never HTTP headers.

## J-02 Delimiters wrapped in markdown emphasis (Phase 4, 2026-09-05 19:05)

**What.** In 6 of 15 responses the model wrote the markers as `**###Test START##**` and `**###Test END##**` (bold), with the test file in a ```` ```ts ```` fence between them. Taking the block strictly between the marker strings leaves the stray `**` fragments around the fence, so the "no fence lines inside" check failed for all six although each block is a single fenced file.
**Why.** The `**` is decoration of the marker, not content of the file; the paper's rule already strips a fence that wraps the block. Treating the emphasis wrapper as part of the marker is the smallest extension that keeps the two-stage rule intact.
**Action.** `extract.py` accepts an optional `**`, `__` or backtick wrapper on either side of each marker, records it per row as `stage1.marker_decoration`, and reports both `CSR_structured` (wrapper accepted) and `CSR_structured_strict_no_marker_decoration` (wrapper not accepted) in `results/rq1-extraction.json`. Result: CSR 14/15 with the wrapper accepted, 9/15 strict. The one remaining failure (`086-$ZodCheckUpperCase` TOT) has explanatory prose between the closing fence and the END marker, so its delimiter block is not a single file; it stays unstructured and is not sent to Phase 5. The fallback stage is not applied when a delimiter pair exists, as specified. The Cowork session may reverse this and use the strict count.

## O-08 Pilot vitest config and the root workspace file (Phase 5 setup, 2026-09-05 18:58)

**What.** The repo has `vitest.workspace.ts` (`["packages/*"]`) at the root. A probe with a throwaway in-place file (removed immediately; tree verified clean) showed that `npx vitest run --config experiments/pilot-2026-09/vitest.pilot.mts <file>` from the repo root runs only the pilot file with typecheck disabled, so the root workspace is not picked up and no extra workspace file is needed. The pilot config is the one printed in §7, unchanged.

## O-09 Phase 3 outcome (2026-09-05 18:49 to 18:57)

**What.** 15/15 calls returned HTTP 200, `finish_reason` `stop`, non-empty content; no repeated calls. OpenRouter routed the calls to six different upstream providers (recorded per call in `run.json`, field `provider`); `model` reported is `openai/gpt-oss-120b` for all. Reported prompt tokens (OpenRouter) exceed the tiktoken o200k_base counts by 50 to 70 tokens per prompt (chat template overhead). Reasoning tokens are included in `completion_tokens`; the assistant `content` is saved verbatim in `response.md`, the `reasoning` field stays in `raw-response.json` only.

## O-10 tsc error codes outside the instruction's category list (Phase 5, 2026-09-05 19:12)

**What.** The instruction maps TS2307/TS2305, TS2304, TS2339, TS2345/TS2322, TS2551 to categories and everything else to "other". In the 14 checked files the most frequent code is TS2834 (18) with TS2835 (6): "relative import paths need explicit file extensions" under `moduleResolution: nodenext`, raised by imports such as `from './ZodNull'`. These are import-path errors of the same family as TS2307 but distinct codes, so they are counted as "other" per the mapping; the full code breakdown is in `results/rq2-syntax-typecheck-run.json` (`codes`) and in `results/matrix.md`. No file typechecks cleanly (0/14). The Cowork session may merge TS2834/TS2835 into the module category when reporting.

## O-11 All 14 structured files fail to load at t (Phase 5, 2026-09-05 19:12)

**What.** Execution with the pilot vitest config in place (D6) ends in a load error for every file, so 0 test cases ran. Kinds: 12 files import the class under test from a sibling module named after the class (`./ZodNull`, `./ZodEnum`, `./$ZodType`, `./$ZodCheckUpperCase`, `./ZodMiniLazy`), which does not exist in zod (the classes live in `schemas.ts` / `checks.ts`); 1 file (`086-$ZodCheckUpperCase` COT) has no import for the class at all (`$ZodCheckUpperCase is not defined`); 1 file (`231-ZodMiniLazy` TOT) fails inside a hoisted `vi.mock` factory that references top-level variables. Several files carry a comment such as `// adjust the import path as needed`. This is the D1 outcome (paper verbatim, no import line added): the prompt shows the class source without its file name or package, and the model guesses a module path. Recorded as data; nothing was corrected.

## O-12 Phase 6 coverage not measurable (2026-09-05 19:14)

**What.** §8 measures coverage only for files that load without error; none did, so `results/rq5-coverage.json` records the skip reason for all 14 rows and the size measures only (file LOC, `expect(` calls, static test calls). In `matrix.md` the LLM coverage means are 0% by the "missing or non-loading file counts as 0%" convention, with "no file ran" stated. The DEV row's per-unit coverage stands as measured in Phase 1b.

## O-13 Phase 7 summary (2026-09-05 19:15)

**What.** biome 1.9.4 with the repo `biome.jsonc` on the 14 LLM files at their in-place paths: 9 errors and 10 warnings in total (categories: `noUnusedVariables`, `noUnusedImports`, `noForEach`, `noAssignInExpressions`, `useNumberNamespace`); the 81 dev test files: 0 errors, 0 warnings. Test smells (rules in `results/smell-rules.md`, AST based): LLM files 138 tests, assertion roulette 91 (65.9%), magic number 7 (5.1%); dev files 820 tests, assertion roulette 493 (60.1%), magic number 213 (26.0%). No expect call in either corpus carries an assertion message, so assertion roulette reduces to "2 or more expect calls in one test". The first biome run counted 77 dev files because the glob was not recursive; fixed to a recursive glob and re-run before the hand-off (81 files, same zero counts).

## Phase 8 hand-off (2026-09-05 19:16)

Delivered under `experiments/pilot-2026-09/`: `manifest.json`, `vitest.pilot.mts`, `prompts/`, `llm/` (25 prompts, 15 calls with six evidence files each), `generated/` (14 structured files, 1 unstructured under `_unstructured/`), `dev-baseline/`, `results/` (env, units-all, units-selected, units-sampled, prompt-tokens, rq1-extraction, rq2-syntax-typecheck-run, rq5-coverage, rq7-static-quality, matrix.md, smell-rules.md, run-notes.md, phase logs and per-file typecheck/test/coverage outputs), `scripts/`. Nothing is committed; the tracked tree is unchanged; no `.pilot.test.ts` file remains in `packages/`. Branch `experiment/2026-09-week1-pilot` (D5) is not created until Gary says so.

## R-02 Rulings from the Cowork session on the hand-off (relayed by Gary, 2026-09-05)

- J-02 accepted: report CSR 14/15 with the strict count 9/15 alongside (both are in `rq1-extraction.json` and `matrix.md`).
- O-10: TS2834 is folded into the "module or path not found" category when reporting. Applied in `build-matrix.py` by recomputing categories from the recorded tsc codes; `rq2-syntax-typecheck-run.json` keeps the original Phase 5 mapping per row as `categories_phase5_mapping`. TS2835 (6 occurrences, same family) is left in "other" because the ruling names TS2834 only; folding it too would raise the category from 18 to 24. Per technique after the fold: COT 6, TOT 6, GTOT 6 module-or-path errors.
- No further runs this week. No commit yet; the Cowork session writes the reports first. Only `results/matrix.md` and `results/rq2-syntax-typecheck-run.json` (and `rq7-static-quality.json`, unchanged in content) were regenerated from existing outputs; no model call, no in-place copy, no tracked change.

## R-02b Ruling: TS2835 folded into "module or path not found" too (relayed by Gary, 2026-09-05)

**What.** Same family as TS2834. Applied in `build-matrix.py` (`CAT_MAP`), `results/matrix.md` and `results/rq2-syntax-typecheck-run.json` regenerated from existing outputs; `categories_phase5_mapping` keeps the original mapping per row. Per technique after the fold (files checked / errors in file / module or path / name / property / type mismatch / other): COT 5 / 15 / 6 / 3 / 0 / 0 / 6; TOT 4 / 29 / 9 / 0 / 10 / 0 / 10; GTOT 5 / 15 / 9 / 3 / 0 / 0 / 3. Total module-or-path errors 24 (TS2834 18 + TS2835 6). No run, no tracked change.
