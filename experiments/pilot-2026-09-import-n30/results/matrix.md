# Pilot matrix: paper-prompt techniques vs dev tests at t (zod v4.0.5, 30 sampled units)

Rows COT, TOT, GTOT: 30 units each. ZSL and FSL: pending authors' reply (rendered, not sent). DEV: zod's own v4 test suite at t.

| technique | MSR | CSR | syntax ok | tsc ok | pass rate at t | cases per unit (mean) | unit line cov (mean) | unit branch cov (mean) |
|---|---|---|---|---|---|---|---|---|
| ZSL | pending authors' reply | pending | pending | pending | pending | pending | pending | pending |
| FSL | pending authors' reply | pending | pending | pending | pending | pending | pending | pending |
| COT | 97% (29/30) | 93% (28/30) | 93% (28/30) | 10% (3/30) | 37% (105/286; 22 of 28 files loaded) | 9.53 (286 total) | 51.6% (files ran: 70.36%, n=22) | 46.17% (files ran: 95.93%) |
| TOT | 100% (30/30) | 97% (29/30) | 97% (29/30) | 7% (2/30) | 32% (93/287; 23 of 29 files loaded) | 9.57 (287 total) | 63.23% (files ran: 82.48%, n=23) | 61.07% (files ran: 98.39%) |
| GTOT | 100% (30/30) | 100% (30/30) | 97% (29/30) | 3% (1/30) | 28% (98/347; 24 of 30 files loaded) | 11.57 (347 total) | 56.06% (files ran: 70.07%, n=24) | 47.13% (files ran: 91.67%) |
| DEV | n/a (100% by construction) | n/a | n/a | n/a | 100% (888/888 runtime cases, 81 files) | 10.96 per file (suite level; no per-unit mapping) | 97.64% (pool of 228 units: 97.1%) | 98.02% (pool: 97.91%) |

Definitions. MSR: a test block obtained from the response (delimiters or fallback) / 30 units. CSR: the block passes the structure checks (import, test call, expect, balanced braces, no fence lines, no HTML) / 30, with markdown emphasis around the markers accepted (W1 J-02; strict values in `rq1-extraction.json`); markers count only when they stand alone on their line (W2 R-01). syntax ok and tsc ok: structured files passing / 30 (a unit without a structured file counts as not ok). pass rate at t: pooled passed / cases over the technique's files; a file that fails to load contributes 0 cases. cases per unit: total cases / 30. Coverage: line and branch coverage of the unit's declaring statement (same rule as DEV), measured with --coverage.reportOnFailure=true (W2 R-02); mean over the 30 units with a missing or non-loading file counted as 0%, and separately the mean over files that ran. Branch mean over units that have branches. DEV coverage: the whole dev suite's coverage of the same 30 units, and of the 228-unit pool (week-1 baseline dev-baseline/dev-coverage-units.json, Node v24.11.0; D-06).

### Coverage restricted to files that also pass tsc

| technique | compilable files with coverage | unit line cov (mean) | unit branch cov (mean) |
|---|---:|---:|---:|
| COT | 3 | 66.67% | 100.0% |
| TOT | 2 | 78.84% | 94.44% |
| GTOT | 0 | n/a | n/a |

### tsc error codes in the checked files (all techniques)

| technique | files checked | tsc ok | errors in file | module or path not found | name not found | property does not exist | type mismatch | did you mean | constructor called without new | other |
|---|---|---|---|---|---|---|---|---|---|---|
| COT | 28 | 3 | 372 | 3 | 1 | 139 | 58 | 0 | 105 | 66 |
| TOT | 29 | 2 | 225 | 12 | 0 | 54 | 43 | 0 | 77 | 39 |
| GTOT | 30 | 1 | 299 | 2 | 1 | 148 | 10 | 0 | 100 | 38 |

| code | count | meaning | reporting category |
|---|---|---|---|
| TS2339 | 341 | property does not exist | property does not exist |
| TS2348 | 282 | value is not callable; use new | constructor called without new |
| TS2345 | 107 |  | type mismatch |
| TS7006 | 38 | parameter implicitly any | other |
| TS1361 | 30 |  | other |
| TS2578 | 27 | unused @ts-expect-error | other |
| TS2554 | 16 |  | other |
| TS6133 | 8 | declared but never read | other |
| TS2724 | 8 |  | other |
| TS2834 | 7 | relative import path needs an explicit file extension (nodenext) | module or path not found |
| TS2305 | 6 |  | module or path not found |
| TS2322 | 4 |  | type mismatch |
| TS18046 | 3 | value is of type unknown | other |
| TS2835 | 2 | relative import path needs an explicit extension; did you mean './x.js' | module or path not found |
| TS2304 | 2 | name not found | name not found |
| TS2459 | 2 | module declares symbol locally but does not export it | module or path not found |
| TS2558 | 1 |  | other |
| TS7022 | 1 |  | other |
| TS7024 | 1 |  | other |
| TS2375 | 1 |  | other |
| TS2552 | 1 |  | other |
| TS2353 | 1 |  | other |
| TS2379 | 1 |  | other |
| TS2344 | 1 |  | other |
| TS2698 | 1 | spread of non-object type | other |
| TS2739 | 1 |  | other |
| TS2352 | 1 |  | other |
| TS17006 | 1 |  | other |
| TS2503 | 1 |  | other |

Categories follow the instruction's mapping with TS2834 and TS2835 (same import-path family) folded into 'module or path not found' (week-1 Cowork rulings W1 R-02 and W1 R-02b on W1 O-10); TS2348 is its own category (W2 R-03). The original Phase 5 mapping is kept per row in `rq2-syntax-typecheck-run.json` as `categories_phase5_mapping`.

### Week-1 category view (this run, recomputed from codes)

| run | technique | module or path not found | name not found | property does not exist | type mismatch | did you mean | constructor called without new | other |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| n30 | COT | 3 | 1 | 139 | 58 | 0 | 105 | 66 |
| n30 | TOT | 12 | 0 | 54 | 43 | 0 | 77 | 39 |
| n30 | GTOT | 2 | 1 | 148 | 10 | 0 | 100 | 38 |

### Paper compilation-error layers (this run)

| run | technique | PDNE-like | CFS-like | type or argument mismatch | constructor called without new | other |
|---|---|---:|---:|---:|---:|---:|
| n30 | COT | 3 | 140 | 65 | 105 | 59 |
| n30 | TOT | 5 | 65 | 52 | 77 | 26 |
| n30 | GTOT | 1 | 155 | 10 | 100 | 33 |

PDNE-like: TS2307, TS2834, TS2835. CFS-like: TS2305, TS2459, TS2724, TS2304, TS2552, TS2339, TS2551. Type or argument mismatch: TS2322, TS2345, TS2554, TS2555. Constructor called without new: TS2348. TS2305 and TS2459 remain in the week-1 module category above but are CFS-like here.

## Per stratum

Per technique and stratum. Line coverage: mean over the stratum's units, a missing or non-loading file counted as 0% (same definition as the main table).

| stratum | technique | units | structured files | tsc ok | files that load | cases | passed | pass rate (pooled) | unit line cov (mean) |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| core | COT | 12 | 11 | 1 | 7 | 78 | 47 | 60.3% | 38.22% |
| core | TOT | 12 | 12 | 2 | 11 | 91 | 42 | 46.2% | 81.89% |
| core | GTOT | 12 | 12 | 0 | 11 | 121 | 41 | 33.9% | 55.03% |
| classic | COT | 9 | 9 | 2 | 8 | 115 | 39 | 33.9% | 52.78% |
| classic | TOT | 9 | 9 | 0 | 8 | 96 | 15 | 15.6% | 66.67% |
| classic | GTOT | 9 | 9 | 0 | 7 | 94 | 39 | 41.5% | 56.35% |
| mini | COT | 9 | 8 | 0 | 7 | 93 | 19 | 20.4% | 68.25% |
| mini | TOT | 9 | 8 | 0 | 4 | 100 | 36 | 36.0% | 34.92% |
| mini | GTOT | 9 | 9 | 1 | 6 | 132 | 18 | 13.6% | 57.14% |

## Per unit, compact (30 units x 3 techniques)

Each cell: load status; passed/cases; tsc errors in file; unit line coverage. Load status: `loads`, `load error`, `runner error`, or `no file` (not extracted as a structured file).

| # | unit | stratum | COT | TOT | GTOT |
|---|---|---|---|---|---|
| 1 | 086-$ZodCheckUpperCase | core | no file | loads; 0/9; tsc 10; 100.0% | loads; 0/21; tsc 19; 57.14% |
| 2 | 098-$ZodType | core | loads; 0/8; tsc 1; 8.64% | load error; 0/0; tsc 3; - | loads; 0/6; tsc 2; 33.33% |
| 3 | 053-ZodEnum | classic | loads; 14/14; tsc 2; 100.0% | loads; 11/11; tsc 13; 100.0% | loads; 10/10; tsc 3; 100.0% |
| 4 | 038-ZodNull | classic | loads; 5/16; tsc 16; 25.0% | load error; 0/0; tsc 1; - | load error; 0/0; tsc 2; - |
| 5 | 231-ZodMiniLazy | mini | loads; 3/17; tsc 22; 100.0% | load error; 0/0; tsc 8; - | loads; 1/14; tsc 13; 57.14% |
| 6 | 117-$ZodIPv6 | core | load error; 0/0; tsc 5; - | loads; 0/5; tsc 3; 33.33% | loads; 0/8; tsc 10; 33.33% |
| 7 | 088-$ZodCheckStartsWith | core | loads; 7/8; tsc 0; 100.0% | loads; 6/6; tsc 10; 100.0% | loads; 10/11; tsc 3; 100.0% |
| 8 | 140-$ZodUnion | core | loads; 9/13; tsc 13; 100.0% | loads; 10/12; tsc 17; 100.0% | loads; 0/13; tsc 2; 26.09% |
| 9 | 087-$ZodCheckIncludes | core | loads; 8/9; tsc 17; 100.0% | loads; 0/8; tsc 0; 57.69% | loads; 0/10; tsc 2; 46.15% |
| 10 | 130-$ZodSymbol | core | load error; 0/0; tsc 3; - | loads; 5/5; tsc 4; 100.0% | load error; 0/0; tsc 5; - |
| 11 | 147-$ZodEnum | core | loads; 3/18; tsc 27; 50.0% | loads; 2/15; tsc 4; 91.67% | loads; 7/8; tsc 9; 100.0% |
| 12 | 159-$ZodPipe | core | load error; 0/0; tsc 18; - | loads; 3/5; tsc 9; 100.0% | loads; 0/9; tsc 10; 7.14% |
| 13 | 153-$ZodDefault | core | loads; 7/8; tsc 21; 0.0% | loads; 3/6; tsc 1; 100.0% | loads; 9/9; tsc 13; 100.0% |
| 14 | 105-$ZodEmoji | core | load error; 0/0; tsc 4; - | loads; 7/13; tsc 1; 100.0% | loads; 5/13; tsc 12; 57.14% |
| 15 | 137-$ZodDate | core | loads; 13/14; tsc 32; 100.0% | loads; 6/7; tsc 0; 100.0% | loads; 10/13; tsc 36; 100.0% |
| 16 | 055-ZodFile | classic | loads; 0/17; tsc 0; 100.0% | loads; 0/17; tsc 20; 100.0% | loads; 4/12; tsc 18; 100.0% |
| 17 | 013-ZodUUID | classic | loads; 4/13; tsc 14; 25.0% | loads; 0/8; tsc 14; 25.0% | loads; 2/16; tsc 18; 25.0% |
| 18 | 036-ZodSymbol | classic | loads; 0/15; tsc 19; 100.0% | loads; 0/8; tsc 9; 100.0% | load error; 0/0; tsc 10; - |
| 19 | 062-ZodSuccess | classic | loads; 9/10; tsc 1; 100.0% | loads; 4/6; tsc 8; 100.0% | loads; 13/13; tsc 2; 100.0% |
| 20 | 003-ZodISODateTime | classic | load error; 0/0; tsc 19; - | loads; 0/31; tsc 8; 100.0% | loads; 1/23; tsc 25; 57.14% |
| 21 | 021-ZodKSUID | classic | loads; 0/22; tsc 39; 25.0% | loads; 0/8; tsc 6; 25.0% | loads; 9/15; tsc 16; 25.0% |
| 22 | 058-ZodNullable | classic | loads; 7/8; tsc 0; 0.0% | loads; 0/7; tsc 10; 50.0% | loads; 0/5; tsc 5; 100.0% |
| 23 | 168-ZodMiniISODate | mini | loads; 0/12; tsc 8; 57.14% | loads; 11/15; tsc 16; 57.14% | loads; 9/14; tsc 1; 57.14% |
| 24 | 210-ZodMiniDiscriminatedUnion | mini | loads; 3/6; tsc 7; 100.0% | no file | loads; 5/14; tsc 1; 100.0% |
| 25 | 197-ZodMiniBigInt | mini | loads; 1/24; tsc 24; 100.0% | load error; 0/0; tsc 4; - | load error; 0/0; tsc 1; - |
| 26 | 206-ZodMiniDate | mini | loads; 7/14; tsc 23; 57.14% | loads; 0/14; tsc 1; 100.0% | loads; 0/25; tsc 28; 100.0% |
| 27 | 205-ZodMiniVoid | mini | loads; 0/10; tsc 9; 100.0% | loads; 24/62; tsc 7; 100.0% | load error; 0/0; tsc 0; - |
| 28 | 232-ZodMiniPromise | mini | load error; 0/0; tsc 27; - | load error; 0/0; tsc 16; - | loads; 3/15; tsc 7; 100.0% |
| 29 | 211-ZodMiniIntersection | mini | loads; 5/10; tsc 1; 100.0% | load error; 0/0; tsc 12; - | load error; 0/0; tsc 10; - |
| 30 | 181-ZodMiniCUID2 | mini | no file | loads; 1/9; tsc 10; 57.14% | loads; 0/50; tsc 16; 100.0% |

## Per unit

| unit | technique | structured | syntax | tsc errors (in file) | cases | passed | pass rate | line cov | branch cov | DEV line | DEV branch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 086-$ZodCheckUpperCase | COT | no | - | - | - | - | - | - | - | 100.0% | 100.0% |
| 086-$ZodCheckUpperCase | TOT | yes | ok | module_or_path_not_found=2, other=8 | 9 | 0 | 0% | 100.0% (7/7) | 100.0% (1/1) | 100.0% | 100.0% |
| 086-$ZodCheckUpperCase | GTOT | yes | ok | module_or_path_not_found=1, property_does_not_exist=18 | 21 | 0 | 0% | 57.14% (4/7) | n/a (0 branches) | 100.0% | 100.0% |
| 098-$ZodType | COT | yes | ok | constructor_called_without_new=1 | 8 | 0 | 0% | 8.64% (7/81) | 50.0% (2/4) | 100.0% | 96.15% |
| 098-$ZodType | TOT | yes | ok | module_or_path_not_found=3 | 0 | 0 | load error | - | - | 100.0% | 96.15% |
| 098-$ZodType | GTOT | yes | ok | constructor_called_without_new=1, other=1 | 6 | 0 | 0% | 33.33% (27/81) | 44.44% (4/9) | 100.0% | 96.15% |
| 053-ZodEnum | COT | yes | ok | other=2 | 14 | 14 | 100% | 100.0% (35/35) | 100.0% (10/10) | 100.0% | 71.43% |
| 053-ZodEnum | TOT | yes | ok | type_mismatch=11, other=2 | 11 | 11 | 100% | 100.0% (35/35) | 100.0% (9/9) | 100.0% | 71.43% |
| 053-ZodEnum | GTOT | yes | ok | type_mismatch=1, other=2 | 10 | 10 | 100% | 100.0% (35/35) | 100.0% (11/11) | 100.0% | 71.43% |
| 038-ZodNull | COT | yes | ok | property_does_not_exist=16 | 16 | 5 | 31% | 25.0% (1/4) | n/a (0 branches) | 100.0% | 100.0% |
| 038-ZodNull | TOT | yes | ok | constructor_called_without_new=1 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 038-ZodNull | GTOT | yes | ok | constructor_called_without_new=2 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 231-ZodMiniLazy | COT | yes | ok | constructor_called_without_new=3, type_mismatch=8, property_does_not_exist=9, other=2 | 17 | 3 | 18% | 100.0% (7/7) | 100.0% (1/1) | 100.0% | 100.0% |
| 231-ZodMiniLazy | TOT | yes | ok | constructor_called_without_new=6, other=2 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 231-ZodMiniLazy | GTOT | yes | ok | property_does_not_exist=13 | 14 | 1 | 7% | 57.14% (4/7) | n/a (0 branches) | 100.0% | 100.0% |
| 117-$ZodIPv6 | COT | yes | ok | constructor_called_without_new=5 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 117-$ZodIPv6 | TOT | yes | ok | other=1, type_mismatch=2 | 5 | 0 | 0% | 33.33% (7/21) | 100.0% (1/1) | 100.0% | 100.0% |
| 117-$ZodIPv6 | GTOT | yes | ok | constructor_called_without_new=9, other=1 | 8 | 0 | 0% | 33.33% (7/21) | 100.0% (1/1) | 100.0% | 100.0% |
| 088-$ZodCheckStartsWith | COT | yes | ok | ok | 8 | 7 | 88% | 100.0% (25/25) | 100.0% (5/5) | 100.0% | 100.0% |
| 088-$ZodCheckStartsWith | TOT | yes | ok | type_mismatch=10 | 6 | 6 | 100% | 100.0% (25/25) | 100.0% (5/5) | 100.0% | 100.0% |
| 088-$ZodCheckStartsWith | GTOT | yes | ok | other=2, name_not_found=1 | 11 | 10 | 91% | 100.0% (25/25) | 100.0% (5/5) | 100.0% | 100.0% |
| 140-$ZodUnion | COT | yes | ok | constructor_called_without_new=13 | 13 | 9 | 69% | 100.0% (46/46) | 100.0% (28/28) | 82.61% | 87.5% |
| 140-$ZodUnion | TOT | yes | ok | other=1, constructor_called_without_new=12, type_mismatch=2, property_does_not_exist=2 | 12 | 10 | 83% | 100.0% (46/46) | 96.43% (27/28) | 82.61% | 87.5% |
| 140-$ZodUnion | GTOT | yes | ok | other=1, constructor_called_without_new=1 | 13 | 0 | 0% | 26.09% (12/46) | 100.0% (1/1) | 82.61% | 87.5% |
| 087-$ZodCheckIncludes | COT | yes | ok | type_mismatch=13, property_does_not_exist=2, other=2 | 9 | 8 | 89% | 100.0% (26/26) | 100.0% (7/7) | 100.0% | 100.0% |
| 087-$ZodCheckIncludes | TOT | yes | ok | ok | 8 | 0 | 0% | 57.69% (15/26) | 100.0% (4/4) | 100.0% | 100.0% |
| 087-$ZodCheckIncludes | GTOT | yes | ok | other=1, constructor_called_without_new=1 | 10 | 0 | 0% | 46.15% (12/26) | 33.33% (1/3) | 100.0% | 100.0% |
| 130-$ZodSymbol | COT | yes | ok | constructor_called_without_new=3 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 130-$ZodSymbol | TOT | yes | ok | property_does_not_exist=4 | 5 | 5 | 100% | 100.0% (14/14) | 100.0% (4/4) | 100.0% | 100.0% |
| 130-$ZodSymbol | GTOT | yes | ok | constructor_called_without_new=3, property_does_not_exist=2 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 147-$ZodEnum | COT | yes | ok | constructor_called_without_new=18, other=9 | 18 | 3 | 17% | 50.0% (12/24) | 100.0% (5/5) | 100.0% | 100.0% |
| 147-$ZodEnum | TOT | yes | ok | constructor_called_without_new=4 | 15 | 2 | 13% | 91.67% (22/24) | 85.71% (6/7) | 100.0% | 100.0% |
| 147-$ZodEnum | GTOT | yes | ok | other=1, constructor_called_without_new=8 | 8 | 7 | 88% | 100.0% (24/24) | 100.0% (7/7) | 100.0% | 100.0% |
| 159-$ZodPipe | COT | yes | ok | module_or_path_not_found=1, name_not_found=1, other=9, type_mismatch=7 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 159-$ZodPipe | TOT | yes | ok | module_or_path_not_found=1, constructor_called_without_new=2, other=6 | 5 | 3 | 60% | 100.0% (14/14) | 100.0% (9/9) | 100.0% | 100.0% |
| 159-$ZodPipe | GTOT | yes | ok | property_does_not_exist=1, constructor_called_without_new=9 | 9 | 0 | 0% | 7.14% (1/14) | n/a (0 branches) | 100.0% | 100.0% |
| 153-$ZodDefault | COT | yes | ok | other=2, type_mismatch=15, property_does_not_exist=4 | 8 | 7 | 88% | 0.0% (0/19) | n/a (0 branches) | 89.47% | 87.5% |
| 153-$ZodDefault | TOT | yes | ok | other=1 | 6 | 3 | 50% | 100.0% (19/19) | 100.0% (6/6) | 89.47% | 87.5% |
| 153-$ZodDefault | GTOT | yes | ok | type_mismatch=8, property_does_not_exist=5 | 9 | 9 | 100% | 100.0% (19/19) | 100.0% (7/7) | 89.47% | 87.5% |
| 105-$ZodEmoji | COT | yes | ok | constructor_called_without_new=1, other=3 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 105-$ZodEmoji | TOT | yes | ok | constructor_called_without_new=1 | 13 | 7 | 54% | 100.0% (7/7) | 100.0% (1/1) | 100.0% | 100.0% |
| 105-$ZodEmoji | GTOT | yes | ok | property_does_not_exist=12 | 13 | 5 | 38% | 57.14% (4/7) | n/a (0 branches) | 100.0% | 100.0% |
| 137-$ZodDate | COT | yes | ok | other=1, type_mismatch=9, property_does_not_exist=22 | 14 | 13 | 93% | 100.0% (22/22) | 88.89% (8/9) | 100.0% | 100.0% |
| 137-$ZodDate | TOT | yes | ok | ok | 7 | 6 | 86% | 100.0% (22/22) | 88.89% (8/9) | 100.0% | 100.0% |
| 137-$ZodDate | GTOT | yes | ok | property_does_not_exist=35, type_mismatch=1 | 13 | 10 | 77% | 100.0% (22/22) | 88.89% (8/9) | 100.0% | 100.0% |
| 055-ZodFile | COT | yes | ok | ok | 17 | 0 | 0% | 100.0% (7/7) | 100.0% (1/1) | 100.0% | 100.0% |
| 055-ZodFile | TOT | yes | ok | other=2, property_does_not_exist=1, constructor_called_without_new=17 | 17 | 0 | 0% | 100.0% (7/7) | 100.0% (1/1) | 100.0% | 100.0% |
| 055-ZodFile | GTOT | yes | ok | constructor_called_without_new=12, other=6 | 12 | 4 | 33% | 100.0% (7/7) | 100.0% (1/1) | 100.0% | 100.0% |
| 013-ZodUUID | COT | yes | ok | property_does_not_exist=13, other=1 | 13 | 4 | 31% | 25.0% (1/4) | n/a (0 branches) | 100.0% | 100.0% |
| 013-ZodUUID | TOT | yes | ok | property_does_not_exist=10, other=4 | 8 | 0 | 0% | 25.0% (1/4) | n/a (0 branches) | 100.0% | 100.0% |
| 013-ZodUUID | GTOT | yes | ok | property_does_not_exist=16, other=2 | 16 | 2 | 12% | 25.0% (1/4) | n/a (0 branches) | 100.0% | 100.0% |
| 036-ZodSymbol | COT | yes | ok | constructor_called_without_new=15, other=3, property_does_not_exist=1 | 15 | 0 | 0% | 100.0% (4/4) | 100.0% (1/1) | 100.0% | 100.0% |
| 036-ZodSymbol | TOT | yes | ok | constructor_called_without_new=8, other=1 | 8 | 0 | 0% | 100.0% (4/4) | 100.0% (1/1) | 100.0% | 100.0% |
| 036-ZodSymbol | GTOT | yes | ok | constructor_called_without_new=9, other=1 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 062-ZodSuccess | COT | yes | ok | other=1 | 10 | 9 | 90% | 100.0% (5/5) | 100.0% (2/2) | 100.0% | 100.0% |
| 062-ZodSuccess | TOT | yes | ok | other=1, module_or_path_not_found=2, type_mismatch=5 | 6 | 4 | 67% | 100.0% (5/5) | 100.0% (2/2) | 100.0% | 100.0% |
| 062-ZodSuccess | GTOT | yes | ok | other=2 | 13 | 13 | 100% | 100.0% (5/5) | 100.0% (2/2) | 100.0% | 100.0% |
| 003-ZodISODateTime | COT | yes | ok | property_does_not_exist=15, other=4 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 003-ZodISODateTime | TOT | yes | ok | constructor_called_without_new=7, other=1 | 31 | 0 | 0% | 100.0% (7/7) | 100.0% (1/1) | 100.0% | 100.0% |
| 003-ZodISODateTime | GTOT | yes | ok | property_does_not_exist=23, other=2 | 23 | 1 | 4% | 57.14% (4/7) | n/a (0 branches) | 100.0% | 100.0% |
| 021-ZodKSUID | COT | yes | ok | property_does_not_exist=23, other=16 | 22 | 0 | 0% | 25.0% (1/4) | n/a (0 branches) | 100.0% | 100.0% |
| 021-ZodKSUID | TOT | yes | ok | property_does_not_exist=6 | 8 | 0 | 0% | 25.0% (1/4) | n/a (0 branches) | 100.0% | 100.0% |
| 021-ZodKSUID | GTOT | yes | ok | property_does_not_exist=16 | 15 | 9 | 60% | 25.0% (1/4) | n/a (0 branches) | 100.0% | 100.0% |
| 058-ZodNullable | COT | yes | ok | ok | 8 | 7 | 88% | 0.0% (0/8) | n/a (0 branches) | 100.0% | 100.0% |
| 058-ZodNullable | TOT | yes | ok | type_mismatch=7, other=1, property_does_not_exist=2 | 7 | 0 | 0% | 50.0% (4/8) | n/a (0 branches) | 100.0% | 100.0% |
| 058-ZodNullable | GTOT | yes | ok | constructor_called_without_new=5 | 5 | 0 | 0% | 100.0% (8/8) | 100.0% (1/1) | 100.0% | 100.0% |
| 168-ZodMiniISODate | COT | yes | ok | property_does_not_exist=8 | 12 | 0 | 0% | 57.14% (4/7) | n/a (0 branches) | 100.0% | 100.0% |
| 168-ZodMiniISODate | TOT | yes | ok | property_does_not_exist=14, other=2 | 15 | 11 | 73% | 57.14% (4/7) | n/a (0 branches) | 100.0% | 100.0% |
| 168-ZodMiniISODate | GTOT | yes | ok | module_or_path_not_found=1 | 14 | 9 | 64% | 57.14% (4/7) | n/a (0 branches) | 100.0% | 100.0% |
| 210-ZodMiniDiscriminatedUnion | COT | yes | ok | other=1, module_or_path_not_found=2, type_mismatch=4 | 6 | 3 | 50% | 100.0% (7/7) | 100.0% (1/1) | 57.14% | n/a% |
| 210-ZodMiniDiscriminatedUnion | TOT | no | - | - | - | - | - | - | - | 57.14% | n/a% |
| 210-ZodMiniDiscriminatedUnion | GTOT | yes | ok | other=1 | 14 | 5 | 36% | 100.0% (7/7) | 100.0% (1/1) | 57.14% | n/a% |
| 197-ZodMiniBigInt | COT | yes | ok | constructor_called_without_new=24 | 24 | 1 | 4% | 100.0% (7/7) | 100.0% (1/1) | 100.0% | 100.0% |
| 197-ZodMiniBigInt | TOT | yes | ok | constructor_called_without_new=3, other=1 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 197-ZodMiniBigInt | GTOT | yes | error | other=1 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 206-ZodMiniDate | COT | yes | ok | property_does_not_exist=23 | 14 | 7 | 50% | 57.14% (4/7) | n/a (0 branches) | 100.0% | 100.0% |
| 206-ZodMiniDate | TOT | yes | ok | constructor_called_without_new=1 | 14 | 0 | 0% | 100.0% (7/7) | 100.0% (1/1) | 100.0% | 100.0% |
| 206-ZodMiniDate | GTOT | yes | ok | constructor_called_without_new=25, other=3 | 25 | 0 | 0% | 100.0% (7/7) | 100.0% (1/1) | 100.0% | 100.0% |
| 205-ZodMiniVoid | COT | yes | ok | other=4, property_does_not_exist=3, type_mismatch=2 | 10 | 0 | 0% | 100.0% (7/7) | 100.0% (1/1) | 100.0% | 100.0% |
| 205-ZodMiniVoid | TOT | yes | ok | type_mismatch=6, other=1 | 62 | 24 | 39% | 100.0% (7/7) | 100.0% (1/1) | 100.0% | 100.0% |
| 205-ZodMiniVoid | GTOT | yes | ok | ok | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 232-ZodMiniPromise | COT | yes | ok | constructor_called_without_new=22, other=5 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 232-ZodMiniPromise | TOT | yes | ok | module_or_path_not_found=1, constructor_called_without_new=15 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 232-ZodMiniPromise | GTOT | yes | ok | property_does_not_exist=7 | 15 | 3 | 20% | 100.0% (7/7) | 100.0% (1/1) | 100.0% | 100.0% |
| 211-ZodMiniIntersection | COT | yes | ok | other=1 | 10 | 5 | 50% | 100.0% (7/7) | 100.0% (1/1) | 100.0% | 100.0% |
| 211-ZodMiniIntersection | TOT | yes | ok | other=4, module_or_path_not_found=3, property_does_not_exist=5 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 211-ZodMiniIntersection | GTOT | yes | ok | other=5, constructor_called_without_new=5 | 0 | 0 | load error | - | - | 100.0% | 100.0% |
| 181-ZodMiniCUID2 | COT | no | - | - | - | - | - | - | - | 100.0% | 100.0% |
| 181-ZodMiniCUID2 | TOT | yes | ok | property_does_not_exist=10 | 9 | 1 | 11% | 57.14% (4/7) | n/a (0 branches) | 100.0% | 100.0% |
| 181-ZodMiniCUID2 | GTOT | yes | ok | constructor_called_without_new=10, other=6 | 50 | 0 | 0% | 100.0% (7/7) | 100.0% (1/1) | 100.0% | 100.0% |

## Static quality (Phase 7)

| technique | files | biome errors | biome warnings | tests (AST) | expect calls | assertion roulette | magic number |
|---|---|---|---|---|---|---|---|
| ZSL | pending | pending | pending | pending | pending | pending | pending |
| FSL | pending | pending | pending | pending | pending | pending | pending |
| COT | 28 | 20 | 3 | 369 | 610 | 155 (42.0%) | 45 (12.2%) |
| TOT | 29 | 11 | 5 | 281 | 519 | 136 (48.4%) | 26 (9.2%) |
| GTOT | 30 | 23 | 11 | 373 | 606 | 171 (45.8%) | 41 (11.0%) |
| DEV | 81 | 0 | 0 | 820 | 2709 | 493 (60.1%) | 213 (26.0%) |

Smell rules: `results/smell-rules.md`. Biome: repo `biome.jsonc`, LLM files linted at their in-place path (the config ignores `experiments/`). Test counts here are static AST counts (dev: 820 = the typecheck-half count; the runtime half registers 888 because some tests are created in loops).
