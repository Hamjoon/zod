# Overlap comparison: five week-2 units regenerated in n30

Same prompts (byte-identical), same model and settings. One row per run per pair; week-2 values read from `results/week2/`.

| unit | tech | run | provider | compl. tokens | CSR | CSR strict | syntax | tsc ok | tsc errors | tsc codes | loads | cases | passed | line cov | CUT import | CUT calls w/o new | CUT new | biome errors | tests (AST) |
|---|---|---|---|---:|---|---|---|---|---:|---|---|---:|---:|---:|---|---:|---:|---:|---:|
| 086-$ZodCheckUpperCase | COT | week2 | Mancer 2 | 2332 | yes | no | yes | no | 9 | TS2348×9 | no | 0 | 0 | - | given_specifier_resolves | 9 | 0 | 0 | 14 |
| 086-$ZodCheckUpperCase | COT | n30 | DekaLLM | 2377 | no | no | - | - | - | - | - | - | - | - | - | - | - | - | - |
| 086-$ZodCheckUpperCase | TOT | week2 | SiliconFlow | 2184 | yes | no | yes | no | 2 | TS2305×2 | yes | 11 | 0 | 100.0 | given_specifier_resolves | 0 | 0 | 0 | 11 |
| 086-$ZodCheckUpperCase | TOT | n30 | DekaLLM | 2593 | yes | yes | yes | no | 10 | TS2554×8, TS2305×2 | yes | 9 | 0 | 100.0 | given_specifier_resolves | 0 | 9 | 0 | 9 |
| 086-$ZodCheckUpperCase | GTOT | week2 | CoreWeave | 1808 | yes | yes | yes | no | 2 | TS2348×2 | no | 0 | 0 | - | given_specifier_resolves | 2 | 0 | 1 | 14 |
| 086-$ZodCheckUpperCase | GTOT | n30 | CoreWeave | 2566 | yes | yes | yes | no | 19 | TS2339×18, TS2305×1 | yes | 21 | 0 | 57.14 | given_specifier_resolves | 0 | 0 | 1 | 15 |
| 098-$ZodType | COT | week2 | DeepInfra | 3212 | yes | yes | yes | no | 6 | TS2348×6 | yes | 6 | 0 | 8.64 | given_specifier_resolves | 6 | 0 | 0 | 6 |
| 098-$ZodType | COT | n30 | DeepInfra | 3156 | yes | yes | yes | no | 1 | TS2348×1 | yes | 8 | 0 | 8.64 | given_specifier_resolves | 1 | 0 | 0 | 8 |
| 098-$ZodType | TOT | week2 | Google | 3800 | yes | no | yes | no | 4 | TS2835×2, TS2834×1, TS6133×1 | no | 0 | 0 | - | given_specifier_resolves | 0 | 0 | 1 | 8 |
| 098-$ZodType | TOT | n30 | Novita | 3610 | yes | yes | yes | no | 3 | TS2834×2, TS2835×1 | no | 0 | 0 | - | present_unresolved | 6 | 0 | 0 | 6 |
| 098-$ZodType | GTOT | week2 | CoreWeave | 2699 | yes | yes | yes | no | 1 | TS2459×1 | yes | 14 | 0 | 8.64 | given_specifier_resolves | 1 | 0 | 1 | 14 |
| 098-$ZodType | GTOT | n30 | Mancer 2 | 2862 | yes | yes | yes | no | 2 | TS2348×1, TS6133×1 | yes | 6 | 0 | 33.33 | given_specifier_resolves | 1 | 0 | 0 | 6 |
| 053-ZodEnum | COT | week2 | Google | 2239 | yes | yes | yes | no | 2 | TS2578×2 | yes | 13 | 12 | 100.0 | given_specifier_resolves | 0 | 1 | 0 | 13 |
| 053-ZodEnum | COT | n30 | DeepInfra | 2091 | yes | no | yes | no | 2 | TS2578×2 | yes | 14 | 14 | 100.0 | given_specifier_resolves | 0 | 1 | 0 | 14 |
| 053-ZodEnum | TOT | week2 | DeepInfra | 2418 | yes | no | yes | no | 14 | TS2345×12, TS2578×2 | yes | 11 | 11 | 100.0 | given_specifier_resolves | 0 | 11 | 0 | 11 |
| 053-ZodEnum | TOT | n30 | AkashML | 1998 | yes | yes | yes | no | 13 | TS2345×11, TS2578×2 | yes | 11 | 11 | 100.0 | given_specifier_resolves | 0 | 11 | 0 | 11 |
| 053-ZodEnum | GTOT | week2 | DigitalOcean | 1872 | yes | yes | yes | no | 2 | TS2578×2 | yes | 10 | 10 | 100.0 | given_specifier_resolves | 0 | 1 | 0 | 10 |
| 053-ZodEnum | GTOT | n30 | DeepInfra | 2139 | yes | yes | yes | no | 3 | TS2578×2, TS2345×1 | yes | 10 | 10 | 100.0 | given_specifier_resolves | 0 | 1 | 0 | 10 |
| 038-ZodNull | COT | week2 | CoreWeave | 1843 | yes | no | yes | no | 9 | TS2348×9 | yes | 9 | 0 | 100.0 | given_specifier_resolves | 9 | 0 | 2 | 9 |
| 038-ZodNull | COT | n30 | DekaLLM | 2218 | yes | yes | yes | no | 16 | TS2339×16 | yes | 16 | 5 | 25.0 | given_specifier_resolves | 0 | 0 | 1 | 16 |
| 038-ZodNull | TOT | week2 | BaseTen | 1413 | yes | yes | yes | no | 4 | TS1361×2, TS2348×1, TS2339×1 | yes | 19 | 0 | 100.0 | given_specifier_resolves | 1 | 0 | 2 | 6 |
| 038-ZodNull | TOT | n30 | DeepInfra | 1689 | yes | yes | yes | no | 1 | TS2348×1 | no | 0 | 0 | - | given_specifier_resolves | 1 | 0 | 1 | 7 |
| 038-ZodNull | GTOT | week2 | Groq | 2645 | yes | yes | yes | no | 1 | TS2348×1 | yes | 11 | 1 | 100.0 | given_specifier_resolves | 1 | 0 | 2 | 11 |
| 038-ZodNull | GTOT | n30 | CoreWeave | 1963 | yes | yes | yes | no | 2 | TS2348×2 | no | 0 | 0 | - | given_specifier_resolves | 2 | 0 | 5 | 10 |
| 231-ZodMiniLazy | COT | week2 | CoreWeave | 2207 | yes | no | yes | no | 7 | TS2348×7 | yes | 10 | 1 | 100.0 | given_specifier_resolves | 11 | 0 | 2 | 10 |
| 231-ZodMiniLazy | COT | n30 | DigitalOcean | 3541 | yes | yes | yes | no | 22 | TS2339×9, TS2345×8, TS2348×3, TS2558×1, TS7006×1 | yes | 17 | 3 | 100.0 | given_specifier_resolves | 1 | 10 | 0 | 17 |
| 231-ZodMiniLazy | TOT | week2 | Novita | 3210 | yes | yes | yes | no | 6 | TS2348×6 | yes | 5 | 0 | 100.0 | given_specifier_resolves | 7 | 0 | 2 | 5 |
| 231-ZodMiniLazy | TOT | n30 | Crusoe | 1731 | yes | yes | yes | no | 8 | TS2348×6, TS7022×1, TS7024×1 | no | 0 | 0 | - | given_specifier_resolves | 1 | 0 | 1 | 8 |
| 231-ZodMiniLazy | GTOT | week2 | DeepInfra | 2937 | yes | yes | yes | no | 4 | TS2348×4 | no | 0 | 0 | - | given_specifier_resolves | 5 | 0 | 0 | 11 |
| 231-ZodMiniLazy | GTOT | n30 | Crusoe | 2653 | yes | yes | yes | no | 13 | TS2339×13 | yes | 14 | 1 | 57.14 | given_specifier_resolves | 0 | 0 | 0 | 14 |

## Per pair

| unit | tech | extracted file identical | unified diff lines (+/-) | load status (week2 → n30) | passed (week2 → n30) | `new` use changed |
|---|---|---|---|---|---|---|
| 086-$ZodCheckUpperCase | COT | - | - | load error → no file (changed) | 0/0 → 0/0 | no |
| 086-$ZodCheckUpperCase | TOT | no | 298 (+118/-141) | loads → loads | 0/11 → 0/9 | yes |
| 086-$ZodCheckUpperCase | GTOT | no | 355 (+225/-123) | load error → loads (changed) | 0/0 → 0/21 | no |
| 098-$ZodType | COT | no | 420 (+196/-207) | loads → loads | 0/6 → 0/8 | no |
| 098-$ZodType | TOT | no | 664 (+278/-344) | load error → load error | 0/0 → 0/0 | no |
| 098-$ZodType | GTOT | no | 479 (+240/-220) | loads → loads | 0/14 → 0/6 | no |
| 053-ZodEnum | COT | no | 372 (+184/-166) | loads → loads | 12/13 → 14/14 (changed) | no |
| 053-ZodEnum | TOT | no | 253 (+143/-79) | loads → loads | 11/11 → 11/11 | no |
| 053-ZodEnum | GTOT | no | 244 (+145/-71) | loads → loads | 10/10 → 10/10 | no |
| 038-ZodNull | COT | no | 292 (+143/-108) | loads → loads | 0/9 → 5/16 (changed) | no |
| 038-ZodNull | TOT | no | 191 (+87/-83) | loads → load error (changed) | 0/19 → 0/0 | no |
| 038-ZodNull | GTOT | no | 278 (+134/-118) | loads → load error (changed) | 1/11 → 0/0 (changed) | no |
| 231-ZodMiniLazy | COT | no | 382 (+160/-184) | loads → loads | 1/10 → 3/17 (changed) | yes |
| 231-ZodMiniLazy | TOT | no | 389 (+113/-246) | loads → load error (changed) | 0/5 → 0/0 | no |
| 231-ZodMiniLazy | GTOT | no | 416 (+158/-218) | load error → loads (changed) | 0/0 → 1/14 (changed) | no |

## Summary

- Pairs with byte-identical extracted files: 0 of 15 (pairs without a structured file in at least one run: 1).
- Pairs whose load status changed: 6.
- Pairs whose passed count changed: 5.
- Pairs whose use of `new` on the class changed: 2 (presence of calls without `new` changed: 5).
- Pooled over the 15 pairs, week 2: 35/119 cases passed, 11 files loaded, 0 tsc ok; n30: 44/126 cases passed, 10 files loaded, 0 tsc ok.
