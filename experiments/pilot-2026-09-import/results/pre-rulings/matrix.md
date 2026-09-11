# Pilot matrix: paper-prompt techniques vs dev tests at t (zod v4.0.5, 5 sampled units)

Rows COT, TOT, GTOT: 5 units each. ZSL and FSL: pending authors' reply (rendered, not sent). DEV: zod's own v4 test suite at t.

| technique | MSR | CSR | syntax ok | tsc ok | pass rate at t | cases per unit (mean) | unit line cov (mean) | unit branch cov (mean) |
|---|---|---|---|---|---|---|---|---|
| ZSL | pending authors' reply | pending | pending | pending | pending | pending | pending | pending |
| FSL | pending authors' reply | pending | pending | pending | pending | pending | pending | pending |
| COT | 100% (5/5) | 100% (5/5) | 80% (4/5) | 0% (0/5) | 34% (13/38; 4 of 5 files loaded) | 7.6 (38 total) | 0.0% (no file ran) | 0.0% (no file ran) |
| TOT | 100% (5/5) | 100% (5/5) | 100% (5/5) | 0% (0/5) | 24% (11/46; 4 of 5 files loaded) | 9.2 (46 total) | 20.0% (files ran: 100.0%, n=1) | 20.0% (files ran: 100.0%) |
| GTOT | 100% (5/5) | 100% (5/5) | 100% (5/5) | 0% (0/5) | 31% (11/35; 3 of 5 files loaded) | 7.0 (35 total) | 20.0% (files ran: 100.0%, n=1) | 20.0% (files ran: 100.0%) |
| DEV | n/a (100% by construction) | n/a | n/a | n/a | 100% (888/888 runtime cases, 81 files) | 10.96 per file (suite level; no per-unit mapping) | 100.0% (pool of 228 units: 97.1%) | 93.52% (pool: 97.91%) |

Definitions. MSR: a test block obtained from the response (delimiters or fallback) / 5 units. CSR: the block passes the structure checks (import, test call, expect, balanced braces, no fence lines, no HTML) / 5, with markdown emphasis around the markers accepted (J-02; strict values in `rq1-extraction.json`). syntax ok and tsc ok: structured files passing / 5 (a unit without a structured file counts as not ok). pass rate at t: pooled passed / cases over the technique's files; a file that fails to load contributes 0 cases. cases per unit: total cases / 5. Coverage: line and branch coverage of the unit's declaring statement (same rule as DEV); mean over the 5 units with a missing or non-loading file counted as 0%, and separately the mean over files that ran. Branch mean over units that have branches. DEV coverage: the whole dev suite's coverage of the same 5 units, and of the 228-unit pool.

### Coverage restricted to files that also pass tsc

| technique | compilable files with coverage | unit line cov (mean) | unit branch cov (mean) |
|---|---:|---:|---:|
| COT | 0 | n/a | n/a |
| TOT | 0 | n/a | n/a |
| GTOT | 0 | n/a | n/a |

### tsc error codes in the checked files (all techniques)

| technique | files checked | tsc ok | errors in file | module or path not found | name not found | property does not exist | type mismatch | did you mean | other |
|---|---|---|---|---|---|---|---|---|---|
| COT | 5 | 0 | 29 | 0 | 0 | 0 | 0 | 0 | 29 |
| TOT | 5 | 0 | 30 | 5 | 0 | 1 | 12 | 0 | 12 |
| GTOT | 5 | 0 | 10 | 0 | 0 | 0 | 0 | 0 | 10 |

| code | count | meaning | reporting category |
|---|---|---|---|
| TS2348 | 36 |  | other |
| TS2345 | 12 |  | type mismatch |
| TS2578 | 6 | unused @ts-expect-error | other |
| TS1005 | 3 |  | other |
| TS2305 | 2 |  | module or path not found |
| TS2835 | 2 | relative import path needs an explicit extension; did you mean './x.js' | module or path not found |
| TS1361 | 2 |  | other |
| TS1109 | 1 |  | other |
| TS1161 | 1 |  | other |
| TS2834 | 1 | relative import path needs an explicit file extension (nodenext) | module or path not found |
| TS6133 | 1 | declared but never read | other |
| TS2459 | 1 |  | other |
| TS2339 | 1 | property does not exist | property does not exist |

Categories follow the instruction's mapping with TS2834 and TS2835 (same import-path family) folded into 'module or path not found' (Cowork rulings R-02 and R-02b on O-10). The original Phase 5 mapping is kept per row in `rq2-syntax-typecheck-run.json` as `categories_phase5_mapping`.

### Paper compilation-error layers (both runs)

| run | technique | PDNE-like | CFS-like | type or argument mismatch | other |
|---|---|---:|---:|---:|---:|
| week1 | COT | 6 | 3 | 0 | 6 |
| week1 | TOT | 9 | 10 | 0 | 10 |
| week1 | GTOT | 9 | 3 | 0 | 3 |
| week2 | COT | 0 | 0 | 0 | 29 |
| week2 | TOT | 3 | 3 | 12 | 12 |
| week2 | GTOT | 0 | 0 | 0 | 10 |

PDNE-like: TS2307, TS2834, TS2835. CFS-like: TS2305, TS2724, TS2304, TS2552, TS2339, TS2551. Type or argument mismatch: TS2322, TS2345, TS2554, TS2555. TS2305 remains in the week-1 module category above but is CFS-like here.

## Per unit

| unit | technique | structured | syntax | tsc errors (in file) | cases | passed | pass rate | line cov | branch cov | DEV line | DEV branch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 086-$ZodCheckUpperCase | COT | yes | error | other=5 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 086-$ZodCheckUpperCase | TOT | yes | ok | module_or_path_not_found=2 | 11 | 0 | 0% | - | - | 100.0% | 100.0% |
| 086-$ZodCheckUpperCase | GTOT | yes | ok | other=2 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 098-$ZodType | COT | yes | ok | other=6 | 6 | 0 | 0% | - | - | 100.0% | 96.15% |
| 098-$ZodType | TOT | yes | ok | module_or_path_not_found=3, other=1 | 0 | 0 | load error | - | - | 100.0% | 96.15% |
| 098-$ZodType | GTOT | yes | ok | other=1 | 14 | 0 | 0% | - | - | 100.0% | 96.15% |
| 053-ZodEnum | COT | yes | ok | other=2 | 13 | 12 | 92% | - | - | 100.0% | 71.43% |
| 053-ZodEnum | TOT | yes | ok | type_mismatch=12, other=2 | 11 | 11 | 100% | 100.0% (35/35) | 100.0% (9/9) | 100.0% | 71.43% |
| 053-ZodEnum | GTOT | yes | ok | other=2 | 10 | 10 | 100% | 100.0% (35/35) | 100.0% (10/10) | 100.0% | 71.43% |
| 038-ZodNull | COT | yes | ok | other=9 | 9 | 0 | 0% | - | - | 100.0% | 100.0% |
| 038-ZodNull | TOT | yes | ok | other=3, property_does_not_exist=1 | 19 | 0 | 0% | - | - | 100.0% | 100.0% |
| 038-ZodNull | GTOT | yes | ok | other=1 | 11 | 1 | 9% | - | - | 100.0% | 100.0% |
| 231-ZodMiniLazy | COT | yes | ok | other=7 | 10 | 1 | 10% | - | - | 100.0% | 100.0% |
| 231-ZodMiniLazy | TOT | yes | ok | other=6 | 5 | 0 | 0% | - | - | 100.0% | 100.0% |
| 231-ZodMiniLazy | GTOT | yes | ok | other=4 | 0 | 0 | load error | - | - | 100.0% | 100.0% |

## Static quality (Phase 7)

| technique | files | biome errors | biome warnings | tests (AST) | expect calls | assertion roulette | magic number |
|---|---|---|---|---|---|---|---|
| ZSL | pending | pending | pending | pending | pending | pending | pending |
| FSL | pending | pending | pending | pending | pending | pending | pending |
| COT | 5 | 9 | 0 | 52 | 112 | 34 (65.4%) | 3 (5.8%) |
| TOT | 5 | 5 | 1 | 41 | 91 | 24 (58.5%) | 3 (7.3%) |
| GTOT | 5 | 4 | 0 | 60 | 94 | 29 (48.3%) | 3 (5.0%) |
| DEV | 81 | 0 | 0 | 820 | 2709 | 493 (60.1%) | 213 (26.0%) |

Smell rules: `results/smell-rules.md`. Biome: repo `biome.jsonc`, LLM files linted at their in-place path (the config ignores `experiments/`). Test counts here are static AST counts (dev: 820 = the typecheck-half count; the runtime half registers 888 because some tests are created in loops).
