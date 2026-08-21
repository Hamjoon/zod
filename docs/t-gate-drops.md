# t gate drops — 2026-08 week4 main run

t = v4.0.5 (`45afab0f`). 105 generated cases were run at t; 86 passed and 19 were dropped.
A drop means the case did not hold at t, so it never entered survival tracking. None of
these are attributable to code evolution.

## Summary

| file | passed | dropped | total |
|---|---|---|---|
| util-main | 21 | 2 | 23 |
| checks-main | 21 | 1 | 22 |
| core-schemas-main | 18 | 0 | 18 |
| errors-main | 11 | 2 | 13 |
| classic-schemas-main | 10 | 1 | 11 |
| mini-schemas-main | 5 | 5 | 10 |
| to-json-schema-main | 0 | 8 | 8 |
| **total** | **86** | **19** | **105** |

Drop rate 18.1%.

## Cause categories

| category | count | description |
|---|---|---|
| A. non-existent import | 8 | imported a name the module does not export at t |
| B. wrong internal shape | 4 | asserted an internal structure the value does not have |
| C. wrong expected value | 5 | called the real API but predicted the wrong result |
| D. wrong API name | 1 | called a function under a name that is not exported |
| E. wrong runtime assumption | 1 | assumed a property was writable when it is not |

All 19 are model comprehension errors. No case was dropped because of a harness or
environment problem.

## Case by case

### A. Non-existent import (8) — to-json-schema-main.test.ts

All eight cases in this file share one cause. The file added a third import that the prompt
did not permit:

```ts
import { z } from "../../packages/zod/src/v4/core/index.js";
```

At t, `core/index.ts` has 239 exports but `z` is not one of them; it is a flat namespace of
`export *` lines, and the `z` bundle object is assembled on the classic side. The module
loads, `z` is `undefined`, and every case fails on first use.

| # | case | error |
|---|---|---|
| 1 | string schema with min, max and format | `Cannot read properties of undefined (reading 'string')` |
| 2 | number schema with constraints and integer type | `... (reading 'number')` |
| 3 | object schema required vs optional properties | `... (reading 'object')` |
| 4 | union schema produces anyOf | `... (reading 'union')` |
| 5 | nullable schema creates anyOf with null | `... (reading 'string')` |
| 6 | default schema adds default value | `... (reading 'string')` |
| 7 | bigint schema throws when unrepresentable | `... (reading 'bigint')` |
| 8 | recursive (lazy) schema is emitted with $defs and $ref | `... (reading 'object')` |

This is both a protocol violation (the prompt allowed only the given relative import and
`vitest`) and a comprehension error. The proximate cause is the comprehension error: the
name does not exist, so the case could not have held at t under any import rule.

### B. Wrong internal shape (4) — mini-schemas-main.test.ts

Four cases assert that a wrapper's `innerType` is the inner schema's `_zod` object:

```ts
const opt = schemas.optional(str);
expect(opt._zod.def.innerType).toBe(str._zod);   // holds the schema, not schema._zod
```

`innerType` holds the schema instance itself. The assertion compares a `ZodMiniString`
against its `_zod` internals, so all four fail identically with
`expected ZodMiniString{...} to be { traits: Set{...}, ...}`.

| # | case | line |
|---|---|---|
| 9 | optional, nullable and nullish schemas compose correctly | 25 |
| 10 | array and tuple schemas retain element definitions | 64 |
| 11 | pipe and transform schemas store functions | 103 |
| 12 | readonly and template literal schemas | 114 |

### C. Wrong expected value (5)

| # | file | case | expected vs actual |
|---|---|---|---|
| 13 | checks-main | `$ZodCheckLowerCase` – fails on uppercase | expected issue code `invalid_type`, actual `invalid_format` |
| 14 | classic-schemas-main | pipe transformation from string to number | expected `success` false, actual true |
| 15 | errors-main | formatError produces formatted object with `_errors` | asserted a string property that is `undefined` |
| 16 | errors-main | prettifyError sorts by path length and formats lines | expected line `  → at b`, actual `✖ Second` |
| 17 | util-main | getEnumValues extracts string values | expected `["a","b"]`, actual `["zero","one","a","b"]` |

Case 17 is worth noting. The input was `{ A: "a", B: "b", 0: "zero", 1: "one" }`, and the
model expected the numeric-keyed entries to be filtered out. `getEnumValues` filters
reverse-mapping entries of numeric TypeScript enums, which is a different rule; string
values under numeric keys are kept.

### D. Wrong API name (1) — mini-schemas-main.test.ts

| # | case | error |
|---|---|---|
| 18 | lazy and json schemas resolve correctly | `__vite_ssr_import_1__._lazy is not a function` |

At t, `mini/schemas.ts` defines `_lazy` internally and re-exports it under the public name
`lazy` (`export { _lazy as lazy }`). The case called `schemas._lazy(...)`, which is not on
the module surface.

### E. Wrong runtime assumption (1) — util-main.test.ts

| # | case | error |
|---|---|---|
| 19 | defineLazy defines property lazily and allows overwrite | `Cannot assign to read only property 'lazy'` |

`defineLazy` installs a getter whose setter redefines the property with a plain value and no
`writable` flag, so the property becomes read-only after the first assignment. The case
assumed a second assignment would succeed.

## Observations

1. **Drops cluster by file, not by case.** Two files account for 13 of the 19 drops
   (to-json-schema 8, mini-schemas 5), and within each file the drops share a single root
   cause. core-schemas had none at all. A per-case drop rate averages over a distribution
   that is closer to per-file all-or-nothing.

2. **The two files with the worst drop rates are the two whose module surface is indirect.**
   `to-json-schema.ts` takes schemas built elsewhere as input, so the model had to reach for
   a constructor the prompt did not give it. `mini/schemas.ts` is a thin delegation layer
   over core, so its observable behaviour is mostly the internal shape of objects that core
   builds. In both cases the file alone does not carry enough information to write a test
   against it, and the model filled the gap incorrectly.

3. **No drop was caused by the harness.** All 19 are model errors evaluated against the
   code at t.
