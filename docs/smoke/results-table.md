# Results table — Zod smoke v3 (2026-08-week3-smoke-v3)

t = v4.0.5 (`45afab0f`); window = v4.0.5..`3c9ca1d9` (316 commits touching packages/zod); generated file: `experiments/generated-tests/util-main.test.ts` (18 cases, one function each).

| case_id | file | t_green | first_red_commit | first_red_date | commits_survived (필터 / 전체) | red_type | stale_or_bug | repair_requested | repair_green | repair_scope_ok |
|---|---|---|---|---|---|---|---|---|---|---|
| case1 | core/util.ts | no (red at generation: getEnumValues) | n/a | n/a | n/a | n/a | n/a | no | n/a | n/a |
| case2 | core/util.ts | yes | - | - | 316 / 316 (censored) | - | - | no | - | - |
| case3 | core/util.ts | yes | - | - | 316 / 316 (censored) | - | - | no | - | - |
| case4 | core/util.ts | yes | - | - | 316 / 316 (censored) | - | - | no | - | - |
| case5 | core/util.ts | yes | - | - | 316 / 316 (censored) | - | - | no | - | - |
| case6 | core/util.ts | yes | - | - | 316 / 316 (censored) | - | - | no | - | - |
| case7 | core/util.ts | yes | 5b7ed214 | 2026-04-27 | 199 / 316 | assertion fail | stale | yes | yes | yes |
| case8 | core/util.ts | yes | - | - | 316 / 316 (censored) | - | - | no | - | - |
| case9 | core/util.ts | yes | - | - | 316 / 316 (censored) | - | - | no | - | - |
| case10 | core/util.ts | yes | - | - | 316 / 316 (censored) | - | - | no | - | - |
| case11 | core/util.ts | yes | - | - | 316 / 316 (censored) | - | - | no | - | - |
| case12 | core/util.ts | yes | - | - | 316 / 316 (censored) | - | - | no | - | - |
| case13 | core/util.ts | yes | - | - | 316 / 316 (censored) | - | - | no | - | - |
| case14 | core/util.ts | yes | - | - | 316 / 316 (censored) | - | - | no | - | - |
| case15 | core/util.ts | no (red at generation: isPlainObject) | n/a | n/a | n/a | n/a | n/a | no | n/a | n/a |
| case16 | core/util.ts | yes | - | - | 316 / 316 (censored) | - | - | no | - | - |
| case17 | core/util.ts | yes | - | - | 316 / 316 (censored) | - | - | no | - | - |
| case18 | core/util.ts | yes | - | - | 316 / 316 (censored) | - | - | no | - | - |

Notes:
- case1/case15 failed at t (generation-time red) and were dropped without modification per protocol; they never entered the survival loop.
- case7 first went red at commit index 200/316 (`5b7ed214`, 2026-04-27), judged stale (human-confirmed), repaired by the model, repair verified green at the red commit with scope confined to the case7 block.
- 15 cases survived the whole window (censored, 316/316).
