# Phase 6 — stale vs production bug: judgment brief

Window t = v4.0.5 (`45afab0f`) .. HEAD (`3c9ca1d9`), 316 commits touching `packages/zod`.
86 cases passed the t gate and entered survival tracking. 3 broke.

---

## Case 1 — classic-schemas :: object schema with shape, partial and required

**Broke at** `#9/316` `7dd74848` (2025-07-23, "v4.0.6 (#4941)") after 8 commits
**Recovered at** `#12/316` `3048d14b` (2025-07-23, "Fix #4961") — 3 commits later
**Status at HEAD** passing

The test:

```ts
const Obj = schemas.object({ a: schemas.string(), b: schemas.number() });
const PartialObj = Obj.partial();
const RequiredObj = PartialObj.required();      // <- threw here
const rResult = RequiredObj.safeParse({});
expect(rResult.success).toBe(false);
```

Failure is not an assertion mismatch. The library throws:

```
TypeError: Cannot redefine property: checks
  at Module.required packages/zod/src/v4/core/util.ts:701
      const def = cloneDef(schema);
      Object.defineProperties(def, {
```

Probe across three points, on the same call:

| commit | `Obj.partial().required()` | `Obj.required()` |
|---|---|---|
| `45afab0f` (t) | OK | OK |
| `7dd74848` (#9) | **throws** | OK |
| `3c9ca1d9` (HEAD) | OK, `safeParse({}).success === false` | OK |

Only the chained `partial().required()` path throws, and only inside that 3-commit
stretch. `cloneDef` built a `def` object by copying property descriptors, and the
descriptors it copied were non-configurable, so the following `defineProperties` on the
same key threw. `3048d14b` replaced `cloneDef` with `mergeDefs`, which builds a fresh
object from merged descriptors, and the call works again.

**Assessment: production bug, not stale.** The test asserted behaviour that held at t,
holds at HEAD, and was correct throughout. The library was briefly broken. Under the
protocol this is recorded and not repaired.

---

## Case 2 — mini-schemas :: object schema shape and keyof utility

**Broke at** `#32/316` `d589186c` (2025-08-05, "fix: ensure keyof returns enum (#5045)")
after 31 commits
**Status at HEAD** still failing — `expected 'enum' to be 'literal'`

The test:

```ts
const keys = schemas.keyof(obj);
expect(keys._zod.def.type).toBe("literal");
expect(keys._zod.def.values).toContain("a");
```

The commit, applied identically to `classic/schemas.ts` and `mini/schemas.ts`:

```diff
-export function keyof<T>(schema: T): ZodMiniLiteral<...> {
-  return literal(Object.keys(shape)) as any;
+export function keyof<T>(schema: T): ZodMiniEnum<util.KeysEnum<...>> {
+  return _enum(Object.keys(shape)) as any;
```

`keyof` deliberately changed its return schema from literal to enum. The commit title
states the intent and it ships with its own new tests. `_zod.def.values` still contains
the keys, so only the `type` assertion broke.

**Assessment: stale.** Intentional contract change; the test encodes the old contract.

---

## Case 3 — util :: floatSafeRemainder works with decimals

**Broke at** `#200/316` `5b7ed214` (2026-04-28,
"fix: correct multipleOf float validation using tolerance-based comparison (#5793)")
after 199 commits
**Status at HEAD** still failing — `expected -0.5 to be close to 0.1`

The test:

```ts
expect(util.floatSafeRemainder(5.5, 0.1)).toBeCloseTo(0);
expect(util.floatSafeRemainder(5.7, 0.2)).toBeCloseTo(0.1);   // <- broke
```

The commit replaced the implementation:

```diff
-  const decCount = ...                                  // decimal-string counting
-  return (valInt % stepInt) / 10 ** decCount;           // remainder in input units
+  const ratio = val / step;
+  const roundedRatio = Math.round(ratio);
+  if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
+  return ratio - roundedRatio;                          // residual of the ratio
```

The return contract changed. It used to return a remainder in the units of the input;
it now returns the residual of `val / step`. For `(5.7, 0.2)` the old value was `0.1`,
the new value is `-0.5`. The commit message states the motivation (scientific-notation
inputs) and ships new tests.

**Assessment: stale.** Intentional contract change; the test encodes the old contract.

---

## Summary for judgment

| # | case | commit | survived | assessment | action |
|---|---|---|---|---|---|
| 1 | classic-schemas :: partial and required | `7dd74848` | 8 | **production bug** (fixed at `3048d14b`) | record, do not repair |
| 2 | mini-schemas :: keyof | `d589186c` | 31 | **stale** | repair |
| 3 | util :: floatSafeRemainder | `5b7ed214` | 199 | **stale** | repair |

## A tracking limitation this exposed

Case 1 broke and recovered inside the window. The survival runner records the first
failure and drops the case from the tracked set, so nothing after that point was
evaluated for it. The recovery was found only by probing HEAD and then bisecting.

Two consequences:

1. Any other case that broke and recovered would have been recorded the same way — as
   broken at its first failure, with the recovery invisible. Only 3 cases broke here, and
   all 3 were examined individually, so this run is not affected. At larger scale a
   first-failure-only record would understate survival.
2. "Survived N commits" is well defined, but "broken at the end of the window" is not the
   same claim, and the current log cannot distinguish the two without a follow-up probe.

Recording the full pass/fail series per case, rather than only the first transition,
would remove the ambiguity.
