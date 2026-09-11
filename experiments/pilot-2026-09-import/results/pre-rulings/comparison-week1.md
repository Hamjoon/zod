# Week 1 vs week 2 comparison

All numbers are read from the archived week-1 and current-run result files.

| technique | run | MSR | CSR | CSR strict | syntax ok | tsc ok | files load | cases | passed | pass rate | line cov mean | branch cov mean | tsc errors | week-1 categories | paper layers | CUT imports | non-CUT unresolved | biome E/W | tests AST | assertion roulette | magic number |
|---|---|---|---|---|---|---|---|---:|---:|---:|---:|---:|---:|---|---|---|---:|---:|---:|---:|---:|
| COT | week1 | 100.0% (5/5) | 100.0% (5/5) | 20.0% (1/5) | 100.0% (5/5) | 0.0% (0/5) | 0.0% (0/5) | 0 | 0 | n/a | 0.0% | 0.0% | 15 | module_or_path_not_found=6, name_not_found=3, other=6 | CFS_like=3, PDNE_like=6, other=6 | absent=1, present_unresolved=4 | 1 | 3/4 | 53 | 38 | 2 |
| COT | week2 | 100.0% (5/5) | 100.0% (5/5) | 40.0% (2/5) | 80.0% (4/5) | 0.0% (0/5) | 80.0% (4/5) | 38 | 13 | 34.2% | 0.0% | 0.0% | 29 | other=29 | other=29 | given_specifier_resolves=5 | 0 | 9/0 | 52 | 34 | 3 |
| TOT | week1 | 100.0% (5/5) | 80.0% (4/5) | 80.0% (4/5) | 80.0% (4/5) | 0.0% (0/5) | 0.0% (0/5) | 0 | 0 | n/a | 0.0% | 0.0% | 29 | module_or_path_not_found=9, other=10, property_does_not_exist=10 | CFS_like=10, PDNE_like=9, other=10 | present_unresolved=4 | 2 | 5/4 | 31 | 22 | 2 |
| TOT | week2 | 100.0% (5/5) | 100.0% (5/5) | 40.0% (2/5) | 100.0% (5/5) | 0.0% (0/5) | 80.0% (4/5) | 46 | 11 | 23.9% | 20.0% | 20.0% | 30 | module_or_path_not_found=5, other=12, property_does_not_exist=1, type_mismatch=12 | CFS_like=3, PDNE_like=3, other=12, type_or_argument_mismatch=12 | given_specifier_resolves=5 | 1 | 5/1 | 41 | 24 | 3 |
| GTOT | week1 | 100.0% (5/5) | 100.0% (5/5) | 80.0% (4/5) | 100.0% (5/5) | 0.0% (0/5) | 0.0% (0/5) | 0 | 0 | n/a | 0.0% | 0.0% | 15 | module_or_path_not_found=9, name_not_found=3, other=3 | CFS_like=3, PDNE_like=9, other=3 | present_unresolved=5 | 1 | 1/2 | 54 | 31 | 3 |
| GTOT | week2 | 100.0% (5/5) | 100.0% (5/5) | 100.0% (5/5) | 100.0% (5/5) | 0.0% (0/5) | 60.0% (3/5) | 35 | 11 | 31.4% | 20.0% | 20.0% | 10 | other=10 | other=10 | given_specifier_resolves=5 | 0 | 4/0 | 60 | 29 | 3 |
| POOLED | week1 | 100.0% (15/15) | 93.3% (14/15) | 60.0% (9/15) | 93.3% (14/15) | 0.0% (0/15) | 0.0% (0/15) | 0 | 0 | n/a | 0.0% | 0.0% | 59 | module_or_path_not_found=24, name_not_found=6, other=19, property_does_not_exist=10 | CFS_like=16, PDNE_like=24, other=19 | absent=1, present_unresolved=13 | 4 | 9/10 | 138 | 91 | 7 |
| POOLED | week2 | 100.0% (15/15) | 100.0% (15/15) | 60.0% (9/15) | 93.3% (14/15) | 0.0% (0/15) | 73.3% (11/15) | 119 | 35 | 29.4% | 13.33% | 13.33% | 69 | module_or_path_not_found=5, other=51, property_does_not_exist=1, type_mismatch=12 | CFS_like=3, PDNE_like=3, other=51, type_or_argument_mismatch=12 | given_specifier_resolves=15 | 1 | 18/1 | 153 | 87 | 9 |

Notes: coverage means use the matrix definition (missing/non-running files count as 0; branch denominator is sampled units with branches). `TS2305` is module/path-not-found in the week-1 category view and CFS-like in the paper-layer view.
