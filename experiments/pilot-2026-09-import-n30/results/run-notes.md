# Run notes

Times are KST (UTC+09:00). IDs restart for this run; references prefixed `W2` point to week 2 (`results/week2/run-notes.md`).

## D-01 — 2026-09-25 20:09 KST — temporary coverage provider install

Installed `@vitest/coverage-v8@2.1.9` temporarily at the workspace root with `pnpm add -D -w`, to match Vitest 2.1.9. Then restored `package.json` and `pnpm-lock.yaml` with `git checkout`. `git status --porcelain --untracked-files=no` was empty afterwards, and the package stayed in `node_modules` (version 2.1.9). The probe, `npx vitest run src/v4/classic/tests/nullable.test.ts --coverage --coverage.reporter=json-summary` from `packages/zod` into a scratch directory outside the repository, passed (6/6 cases) and wrote `coverage-summary.json` (104 entries). The scratch directory was then removed.

## D-02 — 2026-09-25 20:14 KST — import line in every prompt, carried over from week 2

Every rendered template contains the week-2 line ``The {class_name} class is exported from `{module_specifier}` (path relative to the test file).`` directly above the line that introduces the source code (W2 D-02). `module_specifier` = `./` + base name of the unit's source file without `.ts` + `.js`. This deviates from the paper, which states that it evaluated full classes without import injection or post-hoc repair (paper §4.3, Relation to Prior Work and Finding 9; also §4.1, Relation to Prior Work). Generated files will not be repaired or post-processed. `results/prompt-import-line-check.txt`: 125/125 prompts of the 25 added units contain the line exactly once, with the unit's `class_name` and `module_specifier` from §1.2, followed by the template's source-introduction line. The 25 prompts of the five week-2 units are byte-identical to week 2 (below), so they carry the same line.

## D-03 — 2026-09-25 20:14 KST — week-2 templates, unit texts, dev baseline and scripts reused and verified

Source: archive commit `39950c5d2c93b99ef274f7f03f7aafdf8eac404b`, extracted with `git archive` to `../zod-week2-archive` (read-only). `git rev-parse origin/experiment/2026-09-week2-pilot-import` on 2026-09-25 = `39950c5d2c93b99ef274f7f03f7aafdf8eac404b`, as expected. Between the experiment commit `2ffee7ec…` and `39950c5…` only `README.md` changes.

Phase 1 verification:
- Dev suite check (`results/dev-check-run.json`), split by `meta.typecheck`: runtime half 81 files and 888 cases, all passed; typecheck half 81 files and 820 cases, all passed (162 JSON entries, 1,708 cases).
- Environment (`results/env.json`): vitest 2.1.9, typescript 5.5.4 and biome 1.9.4 equal week 2. Differences from week 2: Node v24.21.0 (week 2 v25.7.0, week 1 v24.11.0), npx 11.19.0 (week 2 11.10.1), clone path, venv path (`../zod-pilot-import-n30-venv`, Python 3.14.7, tiktoken 0.14.0, the same as week 2).
- Templates: SHA-256 of `prompts/{ZSL,FSL,COT,TOT,GTOT}.txt` equal `W2/manifest.json` `template_sha256` (5/5). `prompts/paper-original/*` byte-identical to week 2. `W2/prompts/week1/` not copied.
- Unit texts: `scripts/inventory-units.ts` re-derived the inventory at t into `results/units-all-recheck.json` (233 units). The SHA-256 of `source_text` matches `results/units-all.json` for all 30 sampled units and the `$ZodRegistry` example (31/31; hashes in `results/unit-text-hashes.json`). All 233 units also match.
- Export check (`results/export-check.json`): 30/30 units have a top-level `export const <class_name>:` (kind b) in their source file. Line numbers recorded.
- Prompt identity (`results/prompt-identity-week2.txt`): 25/25 prompts of the five week-2 units byte-identical to `W2/llm/{unit_id}/{TECH}/prompt.md`.

Script changes (all others byte-identical to week 2 apart from the path string):
- Path string `experiments/pilot-2026-09-import` → `experiments/pilot-2026-09-import-n30` in: `check-syntax.ts`, `count-tokens.py`, `import-audit.ts`, `inventory-units.ts`, `render-prompts.py`, `build-comparison.py`, `run-generation.py`, `sample-units.py`, `smells.ts`, `dev-coverage-units.py`, `run-coverage.py`, `build-matrix.py`, `run-tests.py`, `pilot_common.py`, `extract.py`. No path string (they import `pilot_common`): `recheck-dev-coverage.py`, `run-biome.py`, `run-typecheck.py`. `grep -rn "pilot-2026-09" scripts/`: every hit ends in `-n30`.
- `import-audit.ts` (§7 step 4, done in Phase 1 because its week-1 path `../zod-week1-archive/experiments/pilot-2026-09` was the only non-`-n30` hit): removed the `W1` constant and the week-1 input loop, and changed the run label from `week2`/`week1` to `n30` (type, input rows, summary loop). All recorded fields are kept.
- `recheck-dev-coverage.py` (§3 step 8): the hard-coded `"v24.11.0"`/`"v25.7.0"` labels were replaced by `BASELINE_NODE = "v24.11.0"` and `CURRENT_NODE` read from `results/env.json`.
- New: `extend-sample.py` (§1.2).
- `build-matrix.py` is not yet adapted (§7 step 5 is done in Phase 5).

The DEV lint and smell comparison is added after Phase 7.

## D-04 — 2026-09-25 20:10 KST — sample extension from 5 to 30 units

`scripts/extend-sample.py` rebuilds the week-2 pool with the week-2 rule. The token filter keeps 232 of 233 units; excluding the four `$constructor` units with an identifier initializer and the units without dev coverage data (none) leaves 228: core 93, classic 68, mini 67. The counts and exclusion lists equal `results/week2/units-sampled.json`; the script stops otherwise. Over the token limit: `165-JSONSchemaGenerator`. Identifier initializer: `001-ZodError`, `002-ZodRealError`, `095-$ZodError`, `096-$ZodRealError`.

Method: the five week-2 units in their week-2 order (`origin: "week2"`, originally `random.Random(20260904)`; each rebuilt row checked equal to the week-2 row), then one `random.Random(20260925)`. For core, classic and mini in that order, `rng.sample(sorted(stratum ids minus the five), k)` with k = 10, 7, 8, appended in draw order (`origin: "added"`). Totals: core 12, classic 9, mini 9. The five week-2 units were drawn at random within their strata; drawing the rest at random from the remaining units of each stratum gives the same distribution as drawing 12/9/9 at random in one step.

Result: identical to the table in §1.2 of the instructions in all 30 rows (unit_id, origin, dir, class_name, source file, module_specifier). All 30 are `$constructor` units, and no two share a class name in the same directory.

| # | unit_id | origin | dir | module_specifier |
|---|---|---|---|---|
| 1 | 086-$ZodCheckUpperCase | week2 | core | ./checks.js |
| 2 | 098-$ZodType | week2 | core | ./schemas.js |
| 3 | 053-ZodEnum | week2 | classic | ./schemas.js |
| 4 | 038-ZodNull | week2 | classic | ./schemas.js |
| 5 | 231-ZodMiniLazy | week2 | mini | ./schemas.js |
| 6 | 117-$ZodIPv6 | added | core | ./schemas.js |
| 7 | 088-$ZodCheckStartsWith | added | core | ./checks.js |
| 8 | 140-$ZodUnion | added | core | ./schemas.js |
| 9 | 087-$ZodCheckIncludes | added | core | ./checks.js |
| 10 | 130-$ZodSymbol | added | core | ./schemas.js |
| 11 | 147-$ZodEnum | added | core | ./schemas.js |
| 12 | 159-$ZodPipe | added | core | ./schemas.js |
| 13 | 153-$ZodDefault | added | core | ./schemas.js |
| 14 | 105-$ZodEmoji | added | core | ./schemas.js |
| 15 | 137-$ZodDate | added | core | ./schemas.js |
| 16 | 055-ZodFile | added | classic | ./schemas.js |
| 17 | 013-ZodUUID | added | classic | ./schemas.js |
| 18 | 036-ZodSymbol | added | classic | ./schemas.js |
| 19 | 062-ZodSuccess | added | classic | ./schemas.js |
| 20 | 003-ZodISODateTime | added | classic | ./iso.js |
| 21 | 021-ZodKSUID | added | classic | ./schemas.js |
| 22 | 058-ZodNullable | added | classic | ./schemas.js |
| 23 | 168-ZodMiniISODate | added | mini | ./iso.js |
| 24 | 210-ZodMiniDiscriminatedUnion | added | mini | ./schemas.js |
| 25 | 197-ZodMiniBigInt | added | mini | ./schemas.js |
| 26 | 206-ZodMiniDate | added | mini | ./schemas.js |
| 27 | 205-ZodMiniVoid | added | mini | ./schemas.js |
| 28 | 232-ZodMiniPromise | added | mini | ./schemas.js |
| 29 | 211-ZodMiniIntersection | added | mini | ./schemas.js |
| 30 | 181-ZodMiniCUID2 | added | mini | ./schemas.js |

## D-05 — 2026-09-25 20:14 KST — week-2 rulings applied as fixed rules from the start

W2 R-01 (standalone extraction marker, decoration allowed), W2 R-02 (`--coverage.reportOnFailure=true`) and W2 R-03 (TS2348 its own category `constructor called without new`; TS2459 with TS2305; AST count of calls to the class under test with and without `new`) are part of the procedure from the start. They are implemented in the copied week-2 scripts and recorded in `manifest.json` (`d5_rules`). No new ruling so far.

## O-01 — 2026-09-25 20:14 KST — FSL still the only technique whose prompt shows import statements

The FSL prompt includes the `$ZodRegistry` example test file, whose import statements the other techniques do not show. FSL is rendered but not sent in this run.

## O-03 — 2026-09-25 20:12 KST — DEV coverage recheck for the 30 units on the current Node

Ran the complete v4 dev suite with v8 coverage on Node v24.21.0: `npx vitest run src/v4 --coverage --coverage.reporter=json --coverage.reporter=json-summary --coverage.reportsDirectory=../../experiments/pilot-2026-09-import-n30/results/dev-coverage-recheck` from `packages/zod`. 162 files, 1,708 cases passed. Stdout is in `results/dev-coverage-recheck/run.stdout.log`. A first attempt redirected stdout into the not-yet-existing reports directory and failed before vitest ran; it was rerun with the log written elsewhere and copied in afterwards. `scripts/recheck-dev-coverage.py` recomputed the 30 sampled units with `unit_coverage`: all 30 match the week-1 baseline (Node v24.11.0) exactly in executable lines, covered lines, line %, total branches, covered branches and branch % (`results/dev-coverage-recheck-units.json`, `all_match: true`). The tracked tree was clean afterwards.

Beyond the 30 (for the Phase 2 decision on the pool figure): over all 233 units, one unit outside the sample differs. `139-$ZodObject`, which is in the 228-unit pool, has branches 57/53 (92.98%) in the baseline and 58/54 (93.10%) on Node v24.21.0; its lines are identical (152/146). The week-2 recheck on Node v25.7.0 gives 57/53 for this unit, the same as the baseline. The means are unchanged to two decimals under either set of values: sample of 30, line 97.64% and branch 98.02%; pool of 228, line 97.10% and branch 97.91%.

## O-04 — 2026-09-25 20:15 KST — one sampled unit whose `$constructor` name string differs from its export name

`168-ZodMiniISODate` is exported as `ZodMiniISODate` but calls `core.$constructor("$ZodISODate", …)` (`ctor_name_matches: false` in `units-all.json`); it is the only such unit among the 30. The prompt shows this source text unchanged; the import line names `ZodMiniISODate` from `./iso.js`, which is the correct export. Recorded here for reading its Phase 5 results; no action taken.

## D-06 — 2026-09-25 20:18 KST — Phase 2 approval and the DEV coverage values

The Claude Cowork session approved Phase 2 (relayed by Gary; the review wait was 20:15:45 → 20:18:37). For O-03 it decided that the report uses the week-1 baseline, `dev-baseline/dev-coverage-units.json` (Node v24.11.0), for DEV coverage of the 30 sampled units and of the 228-unit pool, as in week 2. The Node v24.21.0 recheck stays in `results/dev-coverage-recheck-units.json` for reference only. `OPENROUTER_API_KEY` was confirmed present (`test -n`, value never printed) before the first call.

## O-05 — 2026-09-25 21:25 KST — one generation call ended at the length limit

`181-ZodMiniCUID2` COT (upstream SiliconFlow) returned HTTP 200 with `finish_reason: length` (native `length`) after 1,640 s and 40,951 completion tokens (cost $0.0246291). The response opens with `###Test START##` and a ```ts fence, then degenerates into a repeated `c8c8…` string until it is cut off. It has no END marker. Per §5 it is flagged, not retried; the response is kept as data and goes through Phase 4 like the others. While the call was open (20:57:43 to 21:25:06 KST) the TCP connection stayed established. The script's 900 s urllib timeout is a socket idle timeout and never fired, presumably because tokens (or keep-alive bytes) kept arriving. No intervention was made.

## O-06 — 2026-09-25 21:25 KST — Phase 3 summary: providers and finish reasons

90/90 calls: HTTP 200, no empty content, no transport or API error. Finish reasons: 87 `stop`/`stop`, 2 `stop`/native `end_turn` (both Amazon Bedrock, `206-ZodMiniDate` COT and `205-ZodMiniVoid` TOT; `end_turn` is that provider's name for a normal stop), and 1 `length` (O-05). OpenRouter routed the 90 calls to 14 upstream providers: DeepInfra 17, DekaLLM 13, AkashML 13, CoreWeave 12, Crusoe 10, Novita 9, Mancer 2 4, BaseTen 4, DigitalOcean 2, Amazon Bedrock 2, Cerebras 1, Groq 1, SiliconFlow 1, SambaNova 1. The provider is not pinned (unchanged from week 2), so run-to-run differences on the repeated units may come from provider routing as well as sampling. Total cost from `usage.json`: $0.0872. Completion tokens: median 2,430, sum 273,258. Latency: median 35.8 s, max 1,640 s; wall time for the step 66 min at concurrency 2. The long wall time is due mainly to the O-05 call; the other 89 had finished by 20:58:40 KST.

## O-07 — 2026-09-25 21:26 KST — Phase 4 extraction; two HTML-check false positives flagged for a ruling

`extract.py` (unchanged apart from the path string): MSR 89/90 (COT 29, TOT 30, GTOT 30), CSR 85/90 (COT 27, TOT 29, GTOT 29), strict CSR 67/90 (COT 14, TOT 26, GTOT 27). Every detection came from the delimiter stage; no fallback was used. 85 structured files are in `generated/`; 4 detected but unstructured blocks are in `generated/_unstructured/`.
- `181-ZodMiniCUID2` COT: not detected (one START marker, no END marker; the length-truncated response of O-05). The fallback found no fenced block that qualifies.
- `086-$ZodCheckUpperCase` COT and `210-ZodMiniDiscriminatedUnion` TOT: `no_fence_lines` false. Inside the markers the code is closed by a fence, then followed by a prose "Explanation" section and a markdown table. The existing rule applies as intended.
- `038-ZodNull` COT and `231-ZodMiniLazy` GTOT: `no_html` false, but in both the only match is a TypeScript generic in a code comment (`//   - brand<B extends string>(brand: B): …`). `HTML_TAG` is case-insensitive and matches `<B extends string>` as a `<b …>` tag. Every other check passes. **Proposed ruling for the Claude Cowork session (not applied):** make the HTML check case-sensitive, or require the tag name to be followed by whitespace plus an attribute pattern (`name=`) or by `>`. Under either version these two files would count as structured, CSR would rise to 87/90, and both files would go through Phases 5 to 7. Per D5 no new rule was applied at the time.

**2026-09-27: adopted as Ruling A (see D-08).** Both files are now structured, CSR is 87/90, and the outputs were overwritten. As the ruling instructed, no pre-ruling results were kept.

## O-08 — 2026-09-25 21:30 KST — a generated test wrote a vitest snapshot during execution

`105-$ZodEmoji` TOT uses `toThrowErrorMatchingSnapshot()` (7 cases). On its Phase 5 run vitest wrote a new snapshot file, `packages/zod/src/v4/core/__snapshots__/$ZodEmoji.pilot.test.ts.snap` (untracked; `assert_clean` checks only `.pilot.test.ts` files and tracked changes, so it passed). The report shows `snapshot.added: 7, filesAdded: 1`, and all 7 of the file's passed cases (of 13) are these first-run snapshot writes. Each stored value is `[TypeError: Cannot read properties of undefined (reading 'pattern')]`. The next file at the same in-place path, `105-$ZodEmoji` GTOT, ran with the snapshot present and reported 7 unchecked (obsolete) keys, with no effect on its pass/fail (`snapshot.failure: false`). No other generated file uses snapshot matchers. The COT file of this unit, which ran before TOT, had a load error.

Action: moved the `.snap` file to `results/tests/snapshots-phase5/` and removed the empty `__snapshots__` directory, so later phases start from the same state as Phase 5. The same cleanup is repeated after any later step that writes it. **For the Claude Cowork session:** whether first-run snapshot writes count as passes. Under the current rule they do (vitest reports them as passed); counting them as not passed would give `105-$ZodEmoji` TOT 0/13 and lower TOT from 93 to 86 passed. No change applied.

**2026-09-27, Ruling B (Claude Cowork session): no change.** The vitest count stands: the 7 first-run snapshot writes in `105-$ZodEmoji` TOT stay counted as passed (TOT 93/287). No script change.
Phase 6 repeat (21:32 KST): the coverage run of `105-$ZodEmoji` TOT wrote the same snapshot again (byte-identical to the Phase 5 file); moved to `results/coverage/snapshots-phase6/` and the directory removed. Phases 7 and later do not execute tests. The D-08 coverage rerun (2026-09-27 18:55 KST) wrote it once more, byte-identical again; it was moved to the same place and the directory removed.

## D-07 — 2026-09-25 21:33 KST — build-matrix.py adapted (§7 step 5), plus one crash fix

Changes to `scripts/build-matrix.py`: (a) every "5 units" text and denominator uses N from `units-sampled.json` (N = 30), including the definitions text and the `denominators` field of `rq2-syntax-typecheck-run.json`; the definitions text also cites W2 R-01, W2 R-02 and D-06, and the category note cites W1 R-02/R-02b and W2 R-03 with their prefixes. (b) The week-1 input (`results/week1/rq2-syntax-typecheck-run.json`) and the week-1/week-2 loops are removed; `paper_layer_view` holds this run only (key `n30`), and the week-1 category view and paper-layer tables show this run only. (c) New per-stratum table (core, classic, mini × technique): structured files, tsc ok, files that load, cases, passed, pooled pass rate, and unit line coverage mean over the stratum's units with a missing or non-loading file counted as 0%. The same figures are stored as `per_stratum` in `rq2-syntax-typecheck-run.json`. (d) New compact per-unit table (30 rows × 3 techniques) with load status, passed/cases, tsc errors in file and unit line coverage. The long per-unit table is kept. All other week-2 definitions are unchanged.

Crash fix: `covsum()` indexed `tc[(u, t)]` without a guard, so it raised `KeyError` for a unit without a structured file. That case never arose in week 2, where all 15 extractions were structured. The lookup is now `tc.get((u, t), {}).get("tsc_ok")`. A missing file does not pass tsc, so no definition changes.

As in week 2, `build-matrix.py` reads the Phase 6 and 7 outputs as well, so `rq2-syntax-typecheck-run.json`, `rq7-static-quality.json` and `matrix.md` were written once, after Phase 7 (21:33 KST).

## O-09 — 2026-09-25 21:33 KST — two files pass most cases against stand-ins for the class

`058-ZodNullable` COT (tsc ok, 7/8 passed) and `153-$ZodDefault` COT (7/8 passed) have 0% unit line coverage. The first builds a hand-made mock object that mimics `ZodNullable` and tests that object. The second replaces `./schemas.js` with `vi.mock` and a re-implementation of `$ZodDefault`. In both, the passing cases do not execute the class under test. Nothing was changed; recorded for reading pass rates next to coverage.

## O-10 — 2026-09-25 21:33 KST — Phase 5 to 7 results in brief

Figures updated 2026-09-27 after Ruling A (D-08). Phase 5 (87 structured files): syntax ok 86 (`197-ZodMiniBigInt` GTOT: TS17006, `-x ** y`); tsc ok 6 (COT 3, TOT 2, GTOT 1), 896 errors in the checked files, none elsewhere; most frequent codes TS2339 341, TS2348 282, TS2345 107. Execution at t: 69 files load, 18 load errors, no runner error or timeout; 296/920 cases passed (COT 105/286, TOT 93/287, GTOT 98/347). `205-ZodMiniVoid` GTOT passes tsc but fails to load (`Cannot read properties of undefined (reading 'checks')`). Import audit: the CUT import resolves through the given specifier in 85/87 files. `098-$ZodType` TOT imports `./$ZodType` (unresolved) and `168-ZodMiniISODate` GTOT imports `./iso` (resolves). CUT called without `new` 296 times in 39 files; `new` on the CUT 142 times in 22 files. Phase 6: coverage for all 69 loaded files, no timeout. Phase 7: LLM files 54 biome errors and 19 warnings. The DEV figures equal week 2 exactly (next entry).

## O-02 — 2026-09-25 21:30 KST — `.js` carry-over to non-CUT relative imports

This run (87 files, after Ruling A): 6 non-CUT relative imports with `.js` and 5 without (`results/rq2-import-audit.json`, `summary.n30`); the two files added by D-08 bring no relative non-CUT import. Week 2 (15 files): 4 with, 3 without. There are 111 non-CUT imports in total, 4 of them unresolved, and 8 named imports that are not exported.

## D-03 addendum — 2026-09-25 21:33 KST — DEV lint and smells reproduce week 2

Biome over the 81 dev test files: 0 errors, 0 warnings, and `dev_files` identical to `results/week2/phase7-biome.json`. Smells over the same 81 files (the list is identical in content and order to week 2): 820 tests, assertion roulette 493, magic number 213; `smells-dev.json` is identical to week 2 byte for byte in its JSON content.

## O-11 — 2026-09-25 21:35 KST — timing notes and Phase 8 scripts

`results/timing.{json,md}` come from `phase-times.jsonl` and the per-file fields. Phase 7's end event (21:33:07) was logged after the first `build-matrix.py` run, which crashed (D-07). The successful rerun (21:33:18) falls after it, so Phase 7's wall time is about 11 s short; both build-matrix runs are summed in the step table. Phase 3's 66 min wall time is dominated by the O-05 call (1,640 s): the other 89 calls had finished by 20:58:40 KST, 40 min after the start at concurrency 2. The one step whose per-file times differ widely is generation: median 35.8 s, and the other 89 calls took at most 189.4 s. Per file, typecheck, execution and coverage took about 1 s each.

`scripts/build-overlap-comparison.py` reads the week-2 figures from `results/week2/` and the week-2 extracted files from `results/week2-generated/` (the 15 `generated/*.test.ts` of archive commit `39950c5…`, copied read-only for the byte comparison; not in the §3 copy list). Definitions used, stated in the JSON: load status has three states (loads, load error, no file); a side without a structured file counts as 0 passed; "`new` use changed" = whether the file has at least one `new <CUT>` expression differs. Result (updated 2026-09-27 after Ruling A): 0/15 extracted files byte-identical; load status changed in 6 pairs, passed count in 5, `new` use in 2; pooled over the 15 pairs, week 2 35/119 passed with 11 files loaded, n30 44/126 with 10 loaded. The one remaining n30 "no file" pair is `086-$ZodCheckUpperCase` COT (fence and prose inside the markers, O-07). Before Ruling A the figures were 7, 3, 2, and 38/96 with 8 loaded; the difference comes from `038-ZodNull` COT and `231-ZodMiniLazy` GTOT.

## D-08 — 2026-09-27 18:56 KST — Ruling A: HTML check in extraction (adopted; resolves O-07)

Ruling by the Claude Cowork session, relayed by Gary. In `scripts/extract.py`, `HTML_TAG` was replaced so that a tag counts only when the tag name is followed by `>`, `/>`, or whitespace plus an attribute (`name=`):

    HTML_TAG = re.compile(r"</?(html|body|div|p|br|span|pre|code|b|i|ul|ol|li|h[1-6]|table|tr|td)(?:\s*/?>|\s+[A-Za-z_:][-\w:.]*\s*=[^>]*>)", re.I)

Test strings, checked before use. Not matched: `<B extends string>`, `brand<B extends string>(brand: B): ZodBranded<this, B>`, `<I extends X>`, `<P extends object>`, `<B extends string = string>`, `<T>`. Matched: `<b>`, `</b>`, `<br/>`, `<br />`, `<p class="x">`, `<div>`, `</div>`, `<P>`, `<TD>`, `<span id=a>`. `<P = {}>` is not matched (acceptable either way). Known limit: a bare single-letter generic whose name is also a listed tag, such as `<B>` or `<I>`, still matches, because with `re.I` it cannot be told apart from the HTML tag `<b>`/`<i>`. It changes nothing here, because the new pattern can only accept more (next paragraph).

Subset argument (why weeks 1 and 2 are not re-extracted): every match of the new pattern is also a match of the old pattern at the same position. After the tag name the new pattern requires whitespace, `/` or `>`, so the old `\b` holds. The rest (`\s*/?>` or `\s+attr\s*=[^>]*>`) has no `>` before its final `>`, so the old `[^>]*>` matches it too. The new check therefore rejects a subset of what the old one rejected. It can only turn a rejection into an acceptance, and weeks 1 and 2 had no rejection by the HTML check, so their extractions cannot change.

Re-extraction of all 90 responses (18:53:55 KST): only `038-ZodNull` COT and `231-ZodMiniLazy` GTOT changed, from unstructured to structured, including strict (both have no marker decoration). The other 85 saved files are byte-identical (SHA-256 compared) and every other row of `rq1-extraction.json` is unchanged. The two new `generated/*.test.ts` files are byte-identical to their former `_unstructured/` copies, which were removed. New RQ1: MSR 89/90; CSR 87/90 (COT 28, TOT 29, GTOT 30); strict CSR 69/90 (COT 15, TOT 26, GTOT 28).

Phases 5 to 7 for the two files. Syntax was rerun over all 87 files (`check-syntax.ts` has no `--only`); typecheck, execution and biome ran with `--only`. The import audit, coverage (`run-coverage.py` has no `--only`) and smells were rerun over all files. Every pre-existing row of `phase5-typecheck.json`, `phase5-tests.json`, `rq2-import-audit.json`, `rq5-coverage.json` (apart from the re-timed `coverage_seconds`), `phase7-biome.json` and `smells-llm.json` is unchanged; a rerun of `smells.ts` on the dev files reproduced `smells-dev.json` byte for byte.

| file | syntax | tsc | tsc codes | loads | passed/cases | unit line cov | CUT import | CUT calls w/o `new` / `new` | biome | tests (AST) / AR / MN |
|---|---|---|---|---|---|---|---|---|---|---|
| `038-ZodNull` COT | ok | not ok, 16 errors | TS2339×16 | yes | 5/16 (11 runtime errors) | 25.0% (1/4) | given specifier resolves | 0 / 0 | 1 error (`useNumberNamespace`) | 16 / 7 / 2 |
| `231-ZodMiniLazy` GTOT | ok | not ok, 13 errors | TS2339×13 | yes | 1/14 (13 runtime errors) | 57.14% (4/7) | given specifier resolves | 0 / 0 | 1 warning (`noUnusedVariables`) | 14 / 7 / 2 |

Rebuilt: `matrix.md`, `rq2-syntax-typecheck-run.json` and `rq7-static-quality.json` (`build-matrix.py`), and `comparison-week2-overlap.{json,md}` (`build-overlap-comparison.py`; its summary line was reworded to "pairs without a structured file in at least one run: N"). `timing.{json,md}` were left as they were, apart from one added line. The rerun took 2 m 28 s wall time (18:53:55 to 18:56:23 KST, phase `rulingA` in `phase-times.jsonl`). `git status` afterwards: no tracked changes, and no `.pilot.test.ts` or snapshot file in `packages/`.

## D-09 — 2026-09-27 18:56 KST — Ruling B: first-run snapshot passes (O-08), no change

The vitest count is kept: the 7 first-run snapshot writes in `105-$ZodEmoji` TOT stay counted as passed. No script change. Recorded in O-08.
