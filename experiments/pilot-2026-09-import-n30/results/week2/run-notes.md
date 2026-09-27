# Run notes

Times are KST (UTC+09:00). IDs restart for this run; references prefixed `W1` point to week 1.

## D-01 — 2026-09-10 18:50 KST — temporary coverage provider install

Installed `@vitest/coverage-v8@2.1.9` temporarily at the workspace root to match Vitest 2.1.9, then restored `package.json` and `pnpm-lock.yaml`. The tracked tree was clean afterward and the package remained available in `node_modules`. The required probe of `src/v4/classic/tests/nullable.test.ts` passed and wrote `/private/tmp/zod-week2-coverage-probe/coverage-summary.json`; the scratch directory was then removed.

## D-02 — 2026-09-10 18:56 KST — import information added inside each target prompt

Added exactly one line, ``The {class_name} class is exported from `{module_specifier}` (path relative to the test file).``, directly above the source-introduction line in every target template. This is a pre-generation prompt change and a deviation from the paper's full-class setup without import injection or post-hoc repair (paper §4.3, Relation to Prior Work and Finding 9; also §4.1, Relation to Prior Work). Generated files will not be repaired or otherwise post-processed.

## D-03 — 2026-09-10 19:00 KST — week-1 artifacts reused and verified

Reused the week-1 sample, unit texts, dev baseline, and scripts from archive commit `c922ec9f2773f6a0eb6a38ef1623e161bc83ae45`. The branch tip matched that commit. The developer check reproduced 81 runtime files and 888 runtime cases, all passing. The five sampled unit texts and `$ZodRegistry` example text were re-derived at anchor `45afab0f846dffd591362b6f770017507eb185b5` and all six SHA-256 hashes matched. The coverage provider probe passed. Phase 7 reproduced the week-1 DEV static results exactly: Biome 0 errors and 0 warnings over 81 files; 820 AST tests, assertion roulette 493, magic number 213.

Copied scripts with the archive path changed from `experiments/pilot-2026-09` to `experiments/pilot-2026-09-import`: `build-matrix.py`, `check-syntax.ts`, `count-tokens.py`, `dev-coverage-units.py`, `extract.py`, `inventory-units.ts`, `pilot_common.py`, `render-prompts.py`, `run-coverage.py`, `run-generation.py`, `run-tests.py`, `sample-units.py`, and `smells.ts`. Additional required changes: `inventory-units.ts` writes `units-all-recheck.json`; `render-prompts.py` recognizes and derives `module_specifier`; `run-tests.py` uses a 300 s timeout and records failed-case `error_name`; `run-coverage.py` uses and records a 300 s timeout; `run-typecheck.py` includes TS2834/TS2835 in the inherited module category; `build-matrix.py` adds paper layers, failed-case details, and compilable-only coverage; new `import-audit.ts`, `recheck-dev-coverage.py`, and `build-comparison.py` implement the required new checks and hand-off comparison.

Environment differences from week 1: Darwin kernel 25.5.0 → 25.6.0, Node v24.11.0 → v25.7.0, npx 11.6.1 → 11.10.1, Python 3.14.1 → 3.14.7, clone path, and virtual-environment path. pnpm 10.12.1, Vitest 2.1.9, TypeScript 5.5.4, Biome 1.9.4, and tiktoken 0.14.0 are unchanged.

## O-01 — 2026-09-10 18:56 KST — FSL example imports unchanged

FSL is the only technique whose prompt shows import statements through the example test file. The example receives no D1 line, unchanged from week 1, and FSL remains rendered only rather than sent.

## O-02 — 2026-09-10 19:40 KST — `.js` extension carry-over

All 15 week-2 files imported the class under test from the supplied resolving specifier. Among non-CUT relative imports, week 2 used four `.js` specifiers and three without `.js`; week 1 used zero with `.js` and ten without `.js`. Thus the model sometimes carried the supplied extension style to other relative imports, but not consistently. Week 2 had one unresolved non-CUT import versus four in week 1.

## O-03 — 2026-09-10 19:41 KST — generation completed without flags

All 15 requests returned HTTP 200 with `finish_reason: stop`, non-empty content, and no recorded API or transport error. No retry was made.

## O-04 — 2026-09-10 19:42 KST — extraction and strict markers

All 15 responses yielded delimiter-based structured files (MSR 15/15, CSR 15/15). Strict CSR was 9/15 because six responses decorated at least one marker. The original observation about the embedded delimiter mentions in `086-$ZodCheckUpperCase` COT is superseded by R-01 below, which makes markers standalone-line-only and removes the resulting parse failure without repairing generated content.

## O-05 — 2026-09-10 19:44 KST — import injection fixed the CUT path but not compilation

The compiler-API audit classified every week-2 CUT import as `given_specifier_resolves` (15/15), compared with week 1's 13 `present_unresolved` and one `absent` among 14 structured files. Nevertheless, no week-2 file passed tsc: 69 in-file errors remained, comprising 3 PDNE-like, 3 CFS-like, 12 type/argument mismatch, and 51 other errors. TS2305 remains in the week-1 category's module/path bucket and is CFS-like in the paper-layer view.

## O-06 — 2026-09-10 19:45 KST — execution and LLM coverage

Eleven of 15 files loaded. They registered 119 cases, of which 35 passed (29.4%). Failed cases comprised 79 `TypeError` and five `AssertionError`; four files had load errors. The original 13.33% pooled line/branch coverage result was caused by Vitest's default `coverage.reportOnFailure=false` and is superseded by R-02 below.

## O-07 — 2026-09-10 19:46 KST — current-Node DEV coverage recheck

Per Gary's Phase 6 addition, ran the complete v4 developer suite with V8 coverage on Node v25.7.0 and recomputed the five sampled units with `unit_coverage`. All five exactly matched the Node v24.11.0 week-1 baseline in executable lines, covered lines, line percentage, total branches, covered branches, and branch percentage. The comparison is in `results/dev-coverage-recheck-units.json`; the matrix retains the week-1 DEV figures. The tracked tree was clean after the recheck.

## R-01 — 2026-09-10 20:20 KST — standalone extraction markers

Changed stage 1 so START/END markers count only as the sole non-whitespace content on a line, with the previously accepted `**`, `__`, or backtick decoration. The fallback and pairing rules are unchanged. A scratch re-extraction of all 15 week-1 responses produced zero changed files, so the downstream gate passed. In week 2 exactly one extraction changed: `086-$ZodCheckUpperCase.COT.test.ts`, from 7,443 characters/184 lines to 8,240 characters/201 lines. It now retains the complete leading block comment rather than treating marker mentions inside that comment as delimiters.

Targeted reruns were limited to syntax, typecheck, execution, Biome, and smells for that file. Pooled syntax improved from 14/15 to 15/15. Files loading stayed 11/15; cases stayed 119; passed stayed 35; pooled pass rate stayed 29.4%. Before R-02, pooled line and branch means remained 13.33%/13.33%. The tsc code count changed from 69 to 73 because five parse codes (`TS1109`×1, `TS1005`×3, `TS1161`×1) were replaced by `TS2348`×9. Under the pre-R-03 category mapping this changed pooled categories from module/path 5, property 1, type mismatch 12, other 51 to module/path 5, property 1, type mismatch 12, other 55. The file still produced a load error with zero registered cases. Its Biome errors fell from five to zero; pooled Biome errors fell from 18 to 13. Smell counts were unchanged.

## R-02 — 2026-09-10 20:27 KST — coverage reported on failing cases

Added `--coverage.reportOnFailure=true` and reran Phase 6 for every week-2 file that loaded: `086-$ZodCheckUpperCase.TOT`; `098-$ZodType.COT`, `.GTOT`; `053-ZodEnum.COT`, `.TOT`, `.GTOT`; `038-ZodNull.COT`, `.TOT`, `.GTOT`; and `231-ZodMiniLazy.COT`, `.TOT`. All 11 now produced unit coverage even when cases failed. Syntax stayed 15/15, files loading 11/15, cases 119, passed 35, and pass rate 29.4%; the tsc code multiset and categories were unchanged by this ruling.

Coverage means changed as follows: COT line 0.00% → 61.73% and branch 0.00% → 70.00%; TOT line 20.00% → 80.00% and branch 20.00% → 80.00%; GTOT line 20.00% → 41.73% and branch 20.00% → 50.00%. Pooled line coverage changed 13.33% → 61.15%, and pooled branch coverage changed 13.33% → 66.67%. DEV coverage was not rerun because every DEV case passes and the ruling states it is unaffected.

## R-03 — 2026-09-10 20:31 KST — constructor-call category and CUT constructor usage

Recomputed both category views for both weeks from recorded tsc codes. `TS2348` is now `constructor_called_without_new` in both views; `TS2459` joins the module/path category in the week-1 view and CFS-like in the paper-layer view. This reporting-only recategorization left syntax at 15/15, files loading at 11/15, cases at 119, passed at 35, pass rate at 29.4%, pooled line coverage at 61.15%, and pooled branch coverage at 66.67%.

For week 2, the week-1 category view changed from module/path 5, property 1, type mismatch 12, other 55 to module/path 6, property 1, type mismatch 12, constructor-called-without-new 45, other 9. The paper-layer view changed from PDNE-like 3, CFS-like 3, type/argument mismatch 12, other 55 to PDNE-like 3, CFS-like 4, type/argument mismatch 12, constructor-called-without-new 45, other 9. The affected `TS2348` files were `086-$ZodCheckUpperCase.COT` and `.GTOT`, `098-$ZodType.COT`, all three `038-ZodNull` files, and all three `231-ZodMiniLazy` files; `TS2459` affected `098-$ZodType.GTOT`.

The new AST audit found CUT calls without `new` in 6/14 week-1 structured files (44 calls) and 10/15 week-2 files (52 calls). Two week-1 files and three week-2 files used `new` on the CUT. Comments and strings are excluded by the TypeScript AST traversal. The detailed per-file values are in `rq2-import-audit.json` and `.md` and the aggregate fields are in `comparison-week1.md`.
