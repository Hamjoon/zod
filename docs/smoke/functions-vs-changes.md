# Model-chosen functions vs post-t changes (deliverable 5)

The model chose 18 functions (one test case each). Comparison of each function's source at t
(v4.0.5) vs window end (`3c9ca1d9`), verified by extracting and diffing the function bodies:

| case | function | changed in window? | change commits (from selection analysis) | outcome in loop |
|---|---|---|---|---|
| case1 | getEnumValues | no | — | dropped at t (model comprehension error) |
| case2 | joinValues | no | — | censored 316/316 |
| case3 | jsonStringifyReplacer | no | — | censored 316/316 |
| case4 | cached | no | — | censored 316/316 |
| case5 | nullish | no | — | censored 316/316 |
| case6 | cleanRegex | no | — | censored 316/316 |
| case7 | floatSafeRemainder | **yes — semantic** | `3a818de1` (2026-02-08, multi-digit exponents), `5b7ed214` (2026-04-27, tolerance-based rewrite; return contract changed) | **red at `5b7ed214` → stale → repaired** |
| case8 | defineLazy | **yes — semantic** | `9bdbc2f1` (2025-07-30, EVALUATING sentinel; re-get throw removed; circular → undefined), `9f0a3d81` (2026-08-16, semantics restore) | censored — its assertions cover only the common path, which both implementations preserve |
| case9 | assignProp | no | — | censored 316/316 |
| case10 | getElementAtPath | no | — | censored 316/316 |
| case11 | promiseAllObject | no | — | censored 316/316 |
| case12 | randomString | no | — | censored 316/316 |
| case13 | esc | no | — | censored 316/316 |
| case14 | isObject | no | — | censored 316/316 |
| case15 | isPlainObject | **yes — semantic** | `002e01ad` (2025-11-17, non-function `constructor` → plain) | dropped at t, so the change was never exercised |
| case16 | numKeys | no | — | censored 316/316 |
| case17 | getParsedType | textual only | `// @ts-ignore` comment added — no behavior change | censored 316/316 |
| case18 | escapeRegex | no | — | censored 316/316 |

Summary: of 18 chosen functions, 3 had semantic changes in the window (floatSafeRemainder,
defineLazy, isPlainObject) and 1 a comment-only change. Exactly one of those intersected an
assertion the model wrote (case7) — the other two either survived on the unchanged common
path (case8) or had been dropped at t (case15). This quantifies how much survival depends on
assertions happening to cover the changed region, not just on choosing a changed function.
