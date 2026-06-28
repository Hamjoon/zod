You are maintaining tests after a production code change.

A targeted Vitest unit test is failing because the production behavior intentionally changed.
Use the failure log and related source context to update the stale test expectation.

Constraints:
- Modify only packages/zod/src/v4/classic/tests/tuple.test.ts.
- Do not modify production source files.
- Preserve the original test signal as much as possible.
- Keep assertions specific enough to detect the changed tuple too_big error detail.
- Return a unified diff only.

Failure log:
<failure_log>
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.
(node:66404) [DEP0205] DeprecationWarning: `module.register()` is deprecated. Use `module.registerHooks()` instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v4.0.10 /Users/garibong/.openclaw/workspace/tmp/zod-gptoss-pr

 ❯ |zod| src/v4/classic/tests/tuple.test.ts (7 tests | 2 failed) 10ms
   × successful validation 7ms
   × async validation 1ms
   ✓ tuple with optional elements 1ms
   ✓ tuple with optional elements followed by required 0ms
   ✓ tuple with all optional elements 0ms
   ✓ tuple with rest schema 0ms
   ✓ sparse array input 0ms
 ✓ |zod|  TS  src/v4/classic/tests/tuple.test.ts (7 tests)

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |zod| src/v4/classic/tests/tuple.test.ts > successful validation
Error: Snapshot `successful validation 2` mismatched

- Expected
+ Received

  [ZodError: [
    {
      "code": "too_big",
      "maximum": 2,
+     "inclusive": true,
      "origin": "array",
      "path": [],
-     "message": "Too big: expected array to have <2 items"
+     "message": "Too big: expected array to have <=2 items"
    }
  ]]

 ❯ src/v4/classic/tests/tuple.test.ts:28:21
     26|   const r2 = testTuple.safeParse(["asdf", 1234, true]);
     27|   expect(r2.success).toEqual(false);
     28|   expect(r2.error!).toMatchInlineSnapshot(`
       |                     ^
     29|     [ZodError: [
     30|       {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  |zod| src/v4/classic/tests/tuple.test.ts > async validation
Error: Snapshot `async validation 2` mismatched

- Expected
+ Received

  [ZodError: [
    {
      "code": "too_big",
      "maximum": 2,
+     "inclusive": true,
      "origin": "array",
      "path": [],
-     "message": "Too big: expected array to have <2 items"
+     "message": "Too big: expected array to have <=2 items"
    }
  ]]

 ❯ src/v4/classic/tests/tuple.test.ts:80:21
     78|   const r2 = await testTuple.safeParseAsync(["asdf", 1234, true]);
     79|   expect(r2.success).toEqual(false);
     80|   expect(r2.error!).toMatchInlineSnapshot(`
       |                     ^
     81|     [ZodError: [
     82|       {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


  Snapshots  2 failed
 Test Files  1 failed | 1 passed (2)
      Tests  2 failed | 12 passed (14)
Type Errors  no errors
   Start at  21:59:48
   Duration  3.15s (transform 228ms, setup 18ms, collect 259ms, tests 10ms, environment 0ms, prepare 3ms, typecheck 2.75s)


</failure_log>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/tuple.test.ts">
import { expect, expectTypeOf, test } from "vitest";
import * as z from "zod/v4";

test("successful validation", () => {
  const testTuple = z.tuple([z.string(), z.number()]);
  expectTypeOf<typeof testTuple._output>().toEqualTypeOf<[string, number]>();

  const val = testTuple.parse(["asdf", 1234]);
  expect(val).toEqual(val);

  const r1 = testTuple.safeParse(["asdf", "asdf"]);
  expect(r1.success).toEqual(false);
  expect(r1.error!).toMatchInlineSnapshot(`
    [ZodError: [
      {
        "expected": "number",
        "code": "invalid_type",
        "path": [
          1
        ],
        "message": "Invalid input: expected number, received string"
      }
    ]]
  `);

  const r2 = testTuple.safeParse(["asdf", 1234, true]);
  expect(r2.success).toEqual(false);
  expect(r2.error!).toMatchInlineSnapshot(`
    [ZodError: [
      {
        "code": "too_big",
        "maximum": 2,
        "origin": "array",
        "path": [],
        "message": "Too big: expected array to have <2 items"
      }
    ]]
  `);

  const r3 = testTuple.safeParse({});
  expect(r3.success).toEqual(false);
  expect(r3.error!).toMatchInlineSnapshot(`
    [ZodError: [
      {
        "expected": "tuple",
        "code": "invalid_type",
        "path": [],
        "message": "Invalid input: expected tuple, received object"
      }
    ]]
  `);
});

test("async validation", async () => {
  const testTuple = z
    .tuple([z.string().refine(async () => true), z.number().refine(async () => true)])
    .refine(async () => true);
  expectTypeOf<typeof testTuple._output>().toEqualTypeOf<[string, number]>();

  const val = await testTuple.parseAsync(["asdf", 1234]);
  expect(val).toEqual(val);

  const r1 = await testTuple.safeParseAsync(["asdf", "asdf"]);
  expect(r1.success).toEqual(false);
  expect(r1.error!).toMatchInlineSnapshot(`
    [ZodError: [
      {
        "expected": "number",
        "code": "invalid_type",
        "path": [
          1
        ],
        "message": "Invalid input: expected number, received string"
      }
    ]]
  `);

  const r2 = await testTuple.safeParseAsync(["asdf", 1234, true]);
  expect(r2.success).toEqual(false);
  expect(r2.error!).toMatchInlineSnapshot(`
    [ZodError: [
      {
        "code": "too_big",
        "maximum": 2,
        "origin": "array",
        "path": [],
        "message": "Too big: expected array to have <2 items"
      }
    ]]
  `);

  const r3 = await testTuple.safeParseAsync({});
  expect(r3.success).toEqual(false);
  expect(r3.error!).toMatchInlineSnapshot(`
    [ZodError: [

</test_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/schemas.ts">
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

    const reversedIndex = [...items].reverse().findIndex((item) => item._zod.optin !== "optional");
    const optStart = reversedIndex === -1 ? 0 : items.length - reversedIndex;

    if (!def.rest) {
      const tooBig = input.length > items.length;
      const tooSmall = input.length < optStart - 1;
      if (tooBig || tooSmall) {
        payload.issues.push({
          ...(tooBig
            ? { code: "too_big", maximum: items.length, inclusive: true }
            : { code: "too_small", minimum: items.length }),

          input,
          inst,
          origin: "array" as const,
        });
        return payload;
      }
    }

    let i = -1;
    for (const item of items) {
      i++;
      if (i >= input.length) if (i >= optStart) continue;
      const result = item._zod.run(
        {
          value: input[i],
          issues: [],

</production_snippet>
