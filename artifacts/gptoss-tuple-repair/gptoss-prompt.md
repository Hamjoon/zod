You are maintaining tests after a production code change.

A targeted Vitest unit test is failing because the production behavior intentionally changed.
Use the failure log and related source context to update the stale test expectation.

Constraints:
- Modify only packages/zod/src/v4/classic/tests/tuple.test.ts.
- Do not modify production source files.
- Preserve the original test signal as much as possible.
- Keep meaningful positive and negative assertions when the new behavior has both.
- Return a unified diff only.

Failure log:
<failure_log>
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.
(node:27144) [DEP0205] DeprecationWarning: `module.register()` is deprecated. Use `module.registerHooks()` instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v4.0.10 /Users/garibong/.openclaw/workspace/tmp/zod-gptoss-pr

 ❯ |zod| src/v4/classic/tests/tuple.test.ts (17 tests | 2 failed) 16ms
   ✓ successful validation 5ms
   ✓ async validation 1ms
   ✓ tuple with optional elements 1ms
   ✓ tuple with optional elements followed by required 0ms
   ✓ tuple with all optional elements 0ms
   ✓ tuple fills defaults for missing trailing elements 1ms
   ✓ tuple fills defaults under async parse 0ms
   ✓ tuple keeps length-1 array for missing `.optional()` elements 1ms
   ✓ tuple result is dense when optional precedes a default 0ms
   × tuple breaks and truncates on first absent-optional rejection 2ms
   × tuple breaks on absent-optional rejection under async parse 0ms
   ✓ tuple preserves explicit undefined inside input even for optional-out schemas 0ms
   ✓ tuple does NOT break when a required slot fails past input length 0ms
   ✓ tuple with rest schema 0ms
   ✓ sparse array input 0ms
   ✓ under-length tuple emits a single too_small with optStart minimum 1ms
   ✓ too_big tuple still surfaces element-wise type errors for present indices 0ms
 ✓ |zod|  TS  src/v4/classic/tests/tuple.test.ts (17 tests)

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |zod| src/v4/classic/tests/tuple.test.ts > tuple breaks and truncates on first absent-optional rejection
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/v4/classic/tests/tuple.test.ts:297:22
    295|   const trailingDefault = z.tuple([z.string(), refusesUndefined, z.str…
    296|   const r1 = trailingDefault.safeParse(["alpha"]);
    297|   expect(r1.success).toBe(true);
       |                      ^
    298|   expect(r1.data).toEqual(["alpha"]);
    299|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  |zod| src/v4/classic/tests/tuple.test.ts > tuple breaks on absent-optional rejection under async parse
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/v4/classic/tests/tuple.test.ts:320:21
    318|   const schema = z.tuple([z.string(), refusesUndefined, z.string().def…
    319|   const r = await schema.safeParseAsync(["alpha"]);
    320|   expect(r.success).toBe(true);
       |                     ^
    321|   expect(r.data).toEqual(["alpha"]);
    322| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  2 failed | 32 passed (34)
Type Errors  no errors
   Start at  19:19:54
   Duration  4.90s (transform 250ms, setup 18ms, collect 286ms, tests 16ms, environment 0ms, prepare 3ms, typecheck 4.46s)


</failure_log>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/tuple.test.ts">
  expect(r.length).toEqual(3);
  expect(1 in r).toEqual(true);
  expect(JSON.stringify(r)).toEqual('["alpha",null,"z"]');

  // Trailing optional after a default is still dropped (no later default
  // forces it to materialize).
  expect(z.tuple([z.string(), z.string().default("d"), z.string().optional()]).parse(["alpha"])).toEqual([
    "alpha",
    "d",
  ]);

  // Multiple interleaved optional/default — every slot up to the last
  // default must be present and dense.
  const interleaved = z.tuple([
    z.string(),
    z.string().optional(),
    z.string().default("d"),
    z.string().optional(),
    z.string().default("e"),
  ]);
  const out = interleaved.parse(["alpha"]);
  expect(out).toEqual(["alpha", undefined, "d", undefined, "e"]);
  expect(1 in out && 3 in out).toEqual(true);
});

test("tuple breaks and truncates on first absent-optional rejection", () => {
  // An `.optional()` slot that rejects `undefined` (e.g. via a refine) past
  // optStart must (a) swallow the issue, (b) truncate the result there, and
  // (c) NOT materialize any later defaults — otherwise the parser would
  // happily fill in slots after a slot it just decided was missing/invalid.
  const refusesUndefined = z
    .string()
    .optional()
    .refine((s) => s !== undefined, "must not be undefined");

  const trailingDefault = z.tuple([z.string(), refusesUndefined, z.string().default("d")]);
  const r1 = trailingDefault.safeParse(["alpha"]);
  expect(r1.success).toBe(true);
  expect(r1.data).toEqual(["alpha"]);

  // Optional slots BEFORE the rejected one collapse away with the truncate
  // (mirrors the trailing-trim behaviour for absent optionals).
  const beforeReject = z.tuple([z.string(), z.string().optional(), refusesUndefined, z.string().default("d")]);
  expect(beforeReject.safeParse(["alpha"]).data).toEqual(["alpha"]);

  // No default after — truncate still applies, no spurious issue surfaces.
  const noTrailingDefault = z.tuple([z.string(), refusesUndefined]);
  const r3 = noTrailingDefault.safeParse(["alpha"]);
  expect(r3.success).toBe(true);
  expect(r3.data).toEqual(["alpha"]);
});

test("tuple breaks on absent-optional rejection under async parse", async () => {
  const refusesUndefined = z
    .string()
    .optional()
    .refine(async (s) => s !== undefined, "must not be undefined");

  const schema = z.tuple([z.string(), refusesUndefined, z.string().default("d")]);
  const r = await schema.safeParseAsync(["alpha"]);
  expect(r.success).toBe(true);
  expect(r.data).toEqual(["alpha"]);
});

test("tuple preserves explicit undefined inside input even for optional-out schemas", () => {
  // The trim only runs for slots PAST `input.length`. An explicit `undefined`
  // value supplied by the caller at index < input.length must survive, even
  // when the schema produces undefined as a valid output (e.g.
  // `z.string().or(z.undefined())`, `z.string().optional()`, `z.undefined()`).
  const orUndefined = z.tuple([z.string(), z.string().or(z.undefined())]);
  const r1 = orUndefined.parse(["alpha", undefined]);
  expect(r1.length).toEqual(2);
  expect(r1[1]).toBeUndefined();
  expect(1 in r1).toEqual(true);
  expect(JSON.stringify(r1)).toEqual('["alpha",null]');


</test_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/schemas.ts">

export const $ZodTuple: core.$constructor<$ZodTuple> = /*@__PURE__*/ core.$constructor("$ZodTuple", (inst, def) => {
  $ZodType.init(inst, def);
  const items = def.items;

  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!Array.isArray(input)) {
      payload.issues.push({
        input,
        inst,
        expected: "tuple",
        code: "invalid_type",
      });
      return payload;
    }

    payload.value = [];
    const proms: Promise<any>[] = [];

    const optinStart = getTupleOptStart(items, "optin");
    const optoutStart = getTupleOptStart(items, "optout");

    if (!def.rest) {
      if (input.length < optinStart) {
        payload.issues.push({
          code: "too_small",
          minimum: optinStart,
          inclusive: true,
          input,
          inst,
          origin: "array" as const,
        });
        return payload;
      }
      if (input.length > items.length) {
        payload.issues.push({
          code: "too_big",
          maximum: items.length,
          inclusive: true,
          input,
          inst,
          origin: "array" as const,
        });
      }
    }

    // Run every item in parallel, collecting results into an indexed
    // array. The post-processing in `handleTupleResults` walks them in
    // order so it can decide whether an absent optional-output error can
    // truncate the tail or must be reported to preserve required output.
    const itemResults: ParsePayload[] = new Array(items.length);
    for (let i = 0; i < items.length; i++) {
      const r = items[i]._zod.run({ value: input[i], issues: [] }, ctx);
      if (r instanceof Promise) {
        proms.push(
          r.then((rr) => {
            itemResults[i] = rr;
          })
        );
      } else {
        itemResults[i] = r;
      }
    }

    if (def.rest) {
      let i = items.length - 1;
      const rest = input.slice(items.length);
      for (const el of rest) {
        i++;
        const result = def.rest._zod.run({ value: el, issues: [] }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((r) => handleTupleResult(r, payload, i)));
        } else {
          handleTupleResult(result, payload, i);
        }
      }
    }

    if (proms.length) {
      return Promise.all(proms).then(() => handleTupleResults(itemResults, payload, items, input, optoutStart));
    }
    return handleTupleResults(itemResults, payload, items, input, optoutStart);
  };
});

function getTupleOptStart(items: readonly $ZodType[], key: "optin" | "optout") {
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i]._zod[key] !== "optional") return i + 1;
  }
  return 0;
}

function handleTupleResult(result: ParsePayload, final: ParsePayload<any[]>, index: number) {
  if (result.issues.length) {
    final.issues.push(...util.prefixIssues(index, result.issues));
  }
  final.value[index] = result.value;
}

function handleTupleResults(
  itemResults: ParsePayload[],
  final: ParsePayload<any[]>,
  items: readonly $ZodType[],
  input: unknown[],
  optoutStart: number
) {
  // Walk results in order. Mirror $ZodObject's swallow-on-absent-optional
  // rule, but only after `optoutStart`: the first index where the output
  // tuple tail can be absent.
  for (let i = 0; i < items.length; i++) {
    const r = itemResults[i];
    const isPresent = i < input.length;
    if (r.issues.length) {
      if (!isPresent && i >= optoutStart) {
        final.value.length = i;
        break;
      }
      final.issues.push(...util.prefixIssues(i, r.issues));
    }
    final.value[i] = r.value;
  }

  // Drop trailing slots that produced `undefined` for absent input
  // (the array analog of an absent optional key on an object). The
  // `i >= input.length` floor is critical: an explicit `undefined`
  // *inside* the input must be preserved even when the schema is
  // optional-out (e.g. `z.string().or(z.undefined())` accepting an
  // explicit undefined value).
  for (let i = final.value.length - 1; i >= input.length; i--) {
    if (items[i]._zod.optout === "optional" && final.value[i] === undefined) {
      final.value.length = i;
    } else {
      break;
    }
  }

</production_snippet>
