# Pilot matrix: paper-prompt techniques vs dev tests at t (zod v4.0.5, 5 sampled units)

Rows COT, TOT, GTOT: 5 units each. ZSL and FSL: pending authors' reply (rendered, not sent). DEV: zod's own v4 test suite at t.

| technique | MSR | CSR | syntax ok | tsc ok | pass rate at t | cases per unit (mean) | unit line cov (mean) | unit branch cov (mean) |
|---|---|---|---|---|---|---|---|---|
| ZSL | pending authors' reply | pending | pending | pending | pending | pending | pending | pending |
| FSL | pending authors' reply | pending | pending | pending | pending | pending | pending | pending |
| COT | 100% (5/5) | 100% (5/5) | 100% (5/5) | 0% (0/5) | n/a (0 cases; 0 loaded) | 0.0 (0 total) | 0.0% (no file ran) | 0.0% (no file ran) |
| TOT | 100% (5/5) | 80% (4/5) | 80% (4/5) | 0% (0/5) | n/a (0 cases; 0 loaded) | 0.0 (0 total) | 0.0% (no file ran) | 0.0% (no file ran) |
| GTOT | 100% (5/5) | 100% (5/5) | 100% (5/5) | 0% (0/5) | n/a (0 cases; 0 loaded) | 0.0 (0 total) | 0.0% (no file ran) | 0.0% (no file ran) |
| DEV | n/a (100% by construction) | n/a | n/a | n/a | 100% (888/888 runtime cases, 81 files) | 10.96 per file (suite level; no per-unit mapping) | 100.0% (pool of 228 units: 97.1%) | 93.52% (pool: 97.91%) |

Definitions. MSR: a test block obtained from the response (delimiters or fallback) / 5 units. CSR: the block passes the structure checks (import, test call, expect, balanced braces, no fence lines, no HTML) / 5, with markdown emphasis around the markers accepted (J-02; strict values in `rq1-extraction.json`). syntax ok and tsc ok: structured files passing / 5 (a unit without a structured file counts as not ok). pass rate at t: pooled passed / cases over the technique's files; a file that fails to load contributes 0 cases. cases per unit: total cases / 5. Coverage: line and branch coverage of the unit's declaring statement (same rule as DEV); mean over the 5 units with a missing or non-loading file counted as 0%, and separately the mean over files that ran. Branch mean over units that have branches. DEV coverage: the whole dev suite's coverage of the same 5 units, and of the 228-unit pool.

### tsc error codes in the checked files (all techniques)

| technique | files checked | tsc ok | errors in file | module or path not found | name not found | property does not exist | type mismatch | did you mean | other |
|---|---|---|---|---|---|---|---|---|---|
| COT | 5 | 0 | 15 | 6 | 3 | 0 | 0 | 0 | 6 |
| TOT | 4 | 0 | 29 | 9 | 0 | 10 | 0 | 0 | 10 |
| GTOT | 5 | 0 | 15 | 9 | 3 | 0 | 0 | 0 | 3 |

| code | count | meaning | reporting category |
|---|---|---|---|
| TS2834 | 18 | relative import path needs an explicit file extension (nodenext) | module or path not found |
| TS2339 | 10 | property does not exist | property does not exist |
| TS2304 | 6 | name not found | name not found |
| TS2835 | 6 | relative import path needs an explicit extension; did you mean './x.js' | module or path not found |
| TS6133 | 5 | declared but never read | other |
| TS7006 | 4 | parameter implicitly any | other |
| TS2578 | 4 | unused @ts-expect-error | other |
| TS7053 | 3 | element implicitly any (index) | other |
| TS2683 | 1 | 'this' implicitly any | other |
| TS18046 | 1 | value is of type unknown | other |
| TS2698 | 1 | spread of non-object type | other |

Categories follow the instruction's mapping with TS2834 and TS2835 (same import-path family) folded into 'module or path not found' (Cowork rulings R-02 and R-02b on O-10). The original Phase 5 mapping is kept per row in `rq2-syntax-typecheck-run.json` as `categories_phase5_mapping`.

## Per unit

| unit | technique | structured | syntax | tsc errors (in file) | cases | passed | pass rate | line cov | branch cov | DEV line | DEV branch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 086-$ZodCheckUpperCase | COT | yes | ok | name_not_found=3 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 086-$ZodCheckUpperCase | TOT | no | - | - | - | - | - | - | - | 100.0% | 100.0% |
| 086-$ZodCheckUpperCase | GTOT | yes | ok | module_or_path_not_found=3 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 098-$ZodType | COT | yes | ok | module_or_path_not_found=2, other=2 | 0 | 0 | load error | - | - | 100.0% | 96.15% |
| 098-$ZodType | TOT | yes | ok | other=5, module_or_path_not_found=5, property_does_not_exist=10 | 0 | 0 | load error | - | - | 100.0% | 96.15% |
| 098-$ZodType | GTOT | yes | ok | module_or_path_not_found=3, other=1 | 0 | 0 | load error | - | - | 100.0% | 96.15% |
| 053-ZodEnum | COT | yes | ok | module_or_path_not_found=1, other=2 | 0 | 0 | load error | - | - | 100.0% | 71.43% |
| 053-ZodEnum | TOT | yes | ok | module_or_path_not_found=1, other=2 | 0 | 0 | load error | - | - | 100.0% | 71.43% |
| 053-ZodEnum | GTOT | yes | ok | module_or_path_not_found=1 | 0 | 0 | load error | - | - | 100.0% | 71.43% |
| 038-ZodNull | COT | yes | ok | module_or_path_not_found=1, other=1 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 038-ZodNull | TOT | yes | ok | module_or_path_not_found=1 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 038-ZodNull | GTOT | yes | ok | module_or_path_not_found=1, name_not_found=3, other=1 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 231-ZodMiniLazy | COT | yes | ok | other=1, module_or_path_not_found=2 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 231-ZodMiniLazy | TOT | yes | ok | module_or_path_not_found=2, other=3 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 231-ZodMiniLazy | GTOT | yes | ok | module_or_path_not_found=1, other=1 | 0 | 0 | load error | - | - | 100.0% | 100.0% |

## Static quality (Phase 7)

| technique | files | biome errors | biome warnings | tests (AST) | expect calls | assertion roulette | magic number |
|---|---|---|---|---|---|---|---|
| ZSL | pending | pending | pending | pending | pending | pending | pending |
| FSL | pending | pending | pending | pending | pending | pending | pending |
| COT | 5 | 3 | 4 | 53 | 113 | 38 (71.7%) | 2 (3.8%) |
| TOT | 4 | 5 | 4 | 31 | 73 | 22 (71.0%) | 2 (6.5%) |
| GTOT | 5 | 1 | 2 | 54 | 105 | 31 (57.4%) | 3 (5.6%) |
| DEV | 81 | 0 | 0 | 820 | 2709 | 493 (60.1%) | 213 (26.0%) |

Smell rules: `results/smell-rules.md`. Biome: repo `biome.jsonc`, LLM files linted at their in-place path (the config ignores `experiments/`). Test counts here are static AST counts (dev: 820 = the typecheck-half count; the runtime half registers 888 because some tests are created in loops).
