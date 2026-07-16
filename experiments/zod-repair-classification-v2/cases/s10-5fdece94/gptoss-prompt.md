You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/classic/tests/array.test.ts, packages/zod/src/v4/classic/tests/error.test.ts, packages/zod/src/v4/classic/tests/nested-refine.test.ts, packages/zod/src/v4/classic/tests/preprocess.test.ts, packages/zod/src/v4/classic/tests/validations.test.ts, packages/zod/src/v4/core/checks.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/core/checks.ts b/packages/zod/src/v4/core/checks.ts
index 8184ac32..c0708c0f 100644
--- a/packages/zod/src/v4/core/checks.ts
+++ b/packages/zod/src/v4/core/checks.ts
@@ -622,6 +622,7 @@ export const $ZodCheckMaxLength: core.$constructor<$ZodCheckMaxLength> = /*@__PU
         origin,
         code: "too_big",
         maximum: def.maximum,
+        inclusive: true,
         input,
         inst,
         continue: !def.abort,
@@ -672,6 +673,7 @@ export const $ZodCheckMinLength: core.$constructor<$ZodCheckMinLength> = /*@__PU
         origin,
         code: "too_small",
         minimum: def.minimum,
+        inclusive: true,
         input,
         inst,
         continue: !def.abort,

</recent_change_diff>

Current test results:
<test_output>
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v2.1.9 /Users/donggi/_projects/etc-projects/zod-thesis/.worktrees/s10-5fdece94/packages/zod

 ❯ src/v4/classic/tests/array.test.ts (9 tests | 2 failed) 14ms
   × array min/max 9ms
     → Snapshot `array min/max 1` mismatched
   × continue parsing despite array size error 1ms
     → Snapshot `continue parsing despite array size error 1` mismatched
 ❯ src/v4/classic/tests/nested-refine.test.ts (1 test | 1 failed) 20ms
   × nested refinements 20ms
     → Snapshot `nested refinements 1` mismatched
 ❯ src/v4/classic/tests/preprocess.test.ts (11 tests | 1 failed) 23ms
   × preprocess as the second property of object 6ms
     → Snapshot `preprocess as the second property of object 1` mismatched
 ❯ src/v4/classic/tests/validations.test.ts (13 tests | 2 failed) 26ms
   × string min/max 3ms
     → Snapshot `string min/max 1` mismatched
   × string max 1ms
     → Snapshot `string max 1` mismatched
 ❯ src/v4/classic/tests/error.test.ts (27 tests | 4 failed) 32ms
   × array minimum 7ms
     → Snapshot `array minimum 1` mismatched
   × z.config customError  0ms
     → Snapshot `z.config customError  1` mismatched
   × dont short circuit on continuable errors 1ms
     → Snapshot `dont short circuit on continuable errors 1` mismatched
   × error serialization 0ms
     → Snapshot `error serialization 1` mismatched
 ✓  TS  src/v4/classic/tests/error.test.ts (27 tests)
 ✓  TS  src/v4/classic/tests/array.test.ts (9 tests)
 ✓  TS  src/v4/classic/tests/preprocess.test.ts (11 tests)
 ✓  TS  src/v4/classic/tests/validations.test.ts (13 tests)
 ✓  TS  src/v4/classic/tests/nested-refine.test.ts (1 test)

⎯⎯⎯⎯⎯⎯ Failed Tests 10 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/v4/classic/tests/array.test.ts > array min/max
Error: Snapshot `array min/max 1` mismatched

- Expected
+ Received

  [
    {
      "code": "too_small",
-     "message": "Too small: expected array to have >2 items",
+     "inclusive": true,
+     "message": "Too small: expected array to have >=2 items",
      "minimum": 2,
      "origin": "array",
      "path": [],
    },
  ]

 ❯ src/v4/classic/tests/array.test.ts:13:28
     11|   const r1 = await schema.safeParse(["asdf"]);
     12|   expect(r1.success).toEqual(false);
     13|   expect(r1.error!.issues).toMatchInlineSnapshot(`
       |                            ^
     14|     [
     15|       {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/10]⎯

 FAIL  src/v4/classic/tests/array.test.ts > continue parsing despite array size error
Error: Snapshot `continue parsing despite array size error 1` mismatched

- Expected
+ Received

@@ -11,13 +11,14 @@
    },
    {
      "origin": "array",
      "code": "too_small",
      "minimum": 2,
+     "inclusive": true,
      "path": [
        "people"
      ],
-     "message": "Too small: expected array to have >2 items"
+     "message": "Too small: expected array to have >=2 items"
    }
  ]],
    "success": false,
  }

 ❯ src/v4/classic/tests/array.test.ts:109:18
    107|     people: [123],
    108|   });
    109|   expect(result).toMatchInlineSnapshot(`
       |                  ^
    110|     {
    111|       "error": [ZodError: [

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/10]⎯

 FAIL  src/v4/classic/tests/error.test.ts > array minimum
Error: Snapshot `array minimum 1` mismatched

- Expected
+ Received

  [ZodError: [
    {
      "origin": "array",
      "code": "too_small",
      "minimum": 3,
+     "inclusive": true,
      "path": [],
-     "message": "Too small: expected array to have >3 items"
+     "message": "Too small: expected array to have >=3 items"
    }
  ]]

 ❯ src/v4/classic/tests/error.test.ts:173:24
    171|   expect(result.success).toBe(false);
    172|   expect(result.error!.issues[0].code).toEqual("too_small");
    173|   expect(result.error).toMatchInlineSnapshot(`
       |                        ^
    174|     [ZodError: [
    175|       {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/10]⎯

 FAIL  src/v4/classic/tests/error.test.ts > z.config customError 
Error: Snapshot `z.config customError  1` mismatched

- Expected
+ Received

  [ZodError: [
    {
      "origin": "string",
      "code": "too_small",
      "minimum": 10,
+     "inclusive": true,
      "path": [],
      "message": "override"
    }
  ]]

 ❯ src/v4/classic/tests/error.test.ts:527:24
    525|   const result = stringWithCustomError.min(10).safeParse("tooshort");
    526|   expect(result.success).toBe(false);
    527|   expect(result.error).toMatchInlineSnapshot(`
       |                        ^
    528|     [ZodError: [
    529|       {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/10]⎯

 FAIL  src/v4/classic/tests/error.test.ts > dont short circuit on continuable errors
Error: Snapshot `dont short circuit on continuable errors 1` mismatched

- Expected
+ Received

@@ -1,14 +1,15 @@
  [ZodError: [
    {
      "origin": "string",
      "code": "too_small",
      "minimum": 6,
+     "inclusive": true,
      "path": [
        "password"
      ],
-     "message": "Too small: expected string to have >6 characters"
+     "message": "override"
    },
    {
      "code": "custom",
      "path": [
        "confirm"

 ❯ src/v4/classic/tests/error.test.ts:611:24
    609|   const result = user.safeParse({ password: "asdf", confirm: "qwer" });
    610|   expect(result.success).toBe(false);
    611|   expect(result.error).toMatchInlineSnapshot(`
       |                        ^
    612|     [ZodError: [
    613|       {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/10]⎯

 FAIL  src/v4/classic/tests/error.test.ts > error serialization
Error: Snapshot `error serialization 1` mismatched

- Expected
+ Received

  [ZodError: [
    {
      "expected": "string",
      "code": "invalid_type",
      "path": [],
-     "message": "Invalid input: expected string, received number"
+     "message": "override"
    }
  ]]

 ❯ src/v4/classic/tests/error.test.ts:687:15
    685|     z.string().parse(123);
    686|   } catch (e) {
    687|     expect(e).toMatchInlineSnapshot(`
       |               ^
    688|       [ZodError: [
    689|         {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/10]⎯

 FAIL  src/v4/classic/tests/nested-refine.test.ts > nested refinements
Error: Snapshot `nested refinements 1` mismatched

- Expected
+ Received

@@ -2,15 +2,16 @@
    "error": [ZodError: [
    {
      "origin": "string",
      "code": "too_small",
      "minimum": 1,
+     "inclusive": true,
      "path": [
        "nested",
        "confirm"
      ],
-     "message": "Too small: expected string to have >1 characters"
+     "message": "Too small: expected string to have >=1 characters"
    },
    {
      "code": "custom",
      "path": [
        "nested",

 ❯ src/v4/classic/tests/nested-refine.test.ts:41:37
     39|     nested: { confirm: "" },
     40|   };
     41|   expect(zodSchema.safeParse(DATA)).toMatchInlineSnapshot(`
       |                                     ^
     42|     {
     43|       "error": [ZodError: [

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/10]⎯

 FAIL  src/v4/classic/tests/preprocess.test.ts > preprocess as the second property of object
Error: Snapshot `preprocess as the second property of object 1` mismatched

- Expected
+ Received

@@ -2,14 +2,15 @@
    "error": [ZodError: [
    {
      "origin": "string",
      "code": "too_small",
      "minimum": 1,
+     "inclusive": true,
      "path": [
        "nonEmptyStr"
      ],
-     "message": "Too small: expected string to have >1 characters"
+     "message": "Too small: expected string to have >=1 characters"
    },
    {
      "origin": "number",
      "code": "too_small",
      "minimum": 0,

 ❯ src/v4/classic/tests/preprocess.test.ts:210:18
    208| 
    209|   expect(result.error!.issues).toHaveLength(2);
    210|   expect(result).toMatchInlineSnapshot(`
       |                  ^
    211|     {
    212|       "error": [ZodError: [

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/10]⎯

 FAIL  src/v4/classic/tests/validations.test.ts > string min/max
Error: Snapshot `string min/max 1` mismatched

- Expected
+ Received

  [
    {
      "code": "too_small",
-     "message": "Too small: expected string to have >4 characters",
+     "inclusive": true,
+     "message": "Too small: expected string to have >=4 characters",
      "minimum": 4,
      "origin": "string",
      "path": [],
    },
  ]

 ❯ src/v4/classic/tests/validations.test.ts:46:40
     44|   } catch (err) {
     45|     // ("String must contain at least 4 character(s)");
     46|     expect((err as z.ZodError).issues).toMatchInlineSnapshot(`
       |                                        ^
     47|       [
     48|         {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/10]⎯

 FAIL  src/v4/classic/tests/validations.test.ts > string max
Error: Snapshot `string max 1` mismatched

- Expected
+ Received

  [
    {
      "code": "too_big",
+     "inclusive": true,
      "maximum": 4,
-     "message": "Too big: expected string to have <4 characters",
+     "message": "Too big: expected string to have <=4 characters",
      "origin": "string",
      "path": [],
    },
  ]

 ❯ src/v4/classic/tests/validations.test.ts:65:40
     63|   } catch (err) {
     64|     // ("String must contain at most 4 character(s)");
     65|     expect((err as z.ZodError).issues).toMatchInlineSnapshot(`
       |                                        ^
     66|       [
     67|         {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/10]⎯

  Snapshots  10 failed
 Test Files  5 failed | 5 passed (10)
      Tests  10 failed | 112 passed (122)
Type Errors  no errors
   Start at  15:53:01
   Duration  5.13s (transform 598ms, setup 0ms, collect 5.00s, tests 115ms, environment 0ms, prepare 1.04s, typecheck 4.80s)


</test_output>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/array.test.ts" lines="1-57">
import { expect, expectTypeOf, test } from "vitest";
import * as z from "zod/v4";

test("type inference", () => {
  const schema = z.string().array();
  expectTypeOf<z.infer<typeof schema>>().toEqualTypeOf<string[]>();
});

test("array min/max", async () => {
  const schema = z.array(z.string()).min(2).max(2);
  const r1 = await schema.safeParse(["asdf"]);
  expect(r1.success).toEqual(false);
  expect(r1.error!.issues).toMatchInlineSnapshot(`
    [
      {
        "code": "too_small",
        "message": "Too small: expected array to have >2 items",
        "minimum": 2,
        "origin": "array",
        "path": [],
      },
    ]
  `);

  const r2 = await schema.safeParse(["asdf", "asdf", "asdf"]);
  expect(r2.success).toEqual(false);
  expect(r2.error!.issues).toMatchInlineSnapshot(`
    [
      {
        "code": "too_big",
        "maximum": 2,
        "message": "Too big: expected array to have <2 items",
        "origin": "array",
        "path": [],
      },
    ]
  `);
});

test("array length", async () => {
  const schema = z.array(z.string()).length(2);
  schema.parse(["asdf", "asdf"]);

  const r1 = await schema.safeParse(["asdf"]);
  expect(r1.success).toEqual(false);
  expect(r1.error!.issues).toMatchInlineSnapshot(`
    [
      {
        "code": "too_small",
        "message": "Too small: expected array to have >2 items",
        "minimum": 2,
        "origin": "array",
        "path": [],
      },
    ]
  `);

</test_snippet>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/array.test.ts" lines="99-153">
});

test("continue parsing despite array size error", () => {
  const schema = z.object({
    people: z.string().array().min(2),
  });

  const result = schema.safeParse({
    people: [123],
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "error": [ZodError: [
      {
        "expected": "string",
        "code": "invalid_type",
        "path": [
          "people",
          0
        ],
        "message": "Invalid input: expected string, received number"
      },
      {
        "origin": "array",
        "code": "too_small",
        "minimum": 2,
        "path": [
          "people"
        ],
        "message": "Too small: expected array to have >2 items"
      }
    ]],
      "success": false,
    }
  `);
});

test("parse should fail given sparse array", () => {
  const schema = z.array(z.string()).nonempty().min(1).max(3);
  const result = schema.safeParse(new Array(3));
  expect(result.success).toEqual(false);
  expect(result).toMatchInlineSnapshot(`
    {
      "error": [ZodError: [
      {
        "expected": "string",
        "code": "invalid_type",
        "path": [
          0
        ],
        "message": "Invalid input: expected string, received undefined"
      },
      {
        "expected": "string",
        "code": "invalid_type",
</test_snippet>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/error.test.ts" lines="153-205">
  expect(result.error).toMatchInlineSnapshot(`
    [ZodError: [
      {
        "code": "custom",
        "path": [],
        "message": "override"
      }
    ]]
  `);
});

test("array minimum", () => {
  let result = z.array(z.string()).min(3, "tooshort").safeParse(["asdf", "qwer"]);
  expect(result.success).toBe(false);
  expect(result.error!.issues[0].code).toEqual("too_small");
  expect(result.error!.issues[0].message).toEqual("tooshort");

  result = z.array(z.string()).min(3).safeParse(["asdf", "qwer"]);
  expect(result.success).toBe(false);
  expect(result.error!.issues[0].code).toEqual("too_small");
  expect(result.error).toMatchInlineSnapshot(`
    [ZodError: [
      {
        "origin": "array",
        "code": "too_small",
        "minimum": 3,
        "path": [],
        "message": "Too small: expected array to have >3 items"
      }
    ]]
  `);
});

test("literal bigint default error message", () => {
  const result = z.literal(BigInt(12)).safeParse(BigInt(13));
  expect(result.success).toBe(false);
  expect(result.error!.issues.length).toEqual(1);
  expect(result.error).toMatchInlineSnapshot(`
    [ZodError: [
      {
        "code": "invalid_value",
        "values": [
          "12"
        ],
        "path": [],
        "message": "Invalid input: expected 12n"
      }
    ]]
  `);
});

test("custom path in custom error map", () => {
  const schema = z.object({
</test_snippet>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/error.test.ts" lines="507-557">
  const result = stringWithCustomError.safeParse(1234);
  expect(result.success).toBe(false);
  expect(result.error!.issues[0].message).toEqual("bound");
});

test("bound error map overrides contextual", () => {
  // support contextual override
  const result = stringWithCustomError.safeParse(undefined, {
    error: () => ({ message: "override" }),
  });
  expect(result.success).toBe(false);
  expect(result.error!.issues[0].message).toEqual("bound");
});

test("z.config customError ", () => {
  // support overrideErrorMap

  z.config({ customError: () => ({ message: "override" }) });
  const result = stringWithCustomError.min(10).safeParse("tooshort");
  expect(result.success).toBe(false);
  expect(result.error).toMatchInlineSnapshot(`
    [ZodError: [
      {
        "origin": "string",
        "code": "too_small",
        "minimum": 10,
        "path": [],
        "message": "override"
      }
    ]]
  `);
  expect(result.error!.issues[0].message).toEqual("override");
  z.config({ customError: undefined });
});

// test("invalid and required", () => {
//   const str = z.string({
//     invalid_type_error: "Invalid name",
//     required_error: "Name is required",
//   });
//   const result1 = str.safeParse(1234);
//   expect(result1.success).toBe(false);
//   if (!result1.success) {
//     expect(result1.error.issues[0].message).toEqual("Invalid name");
//   }
//   const result2 = str.safeParse(undefined);
//   expect(result2.success).toBe(false);
//   if (!result2.success) {
//     expect(result2.error.issues[0].message).toEqual("Name is required");
//   }
// });
</test_snippet>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/error.test.ts" lines="591-645">

test("empty string error message", () => {
  const schema = z.string().max(1, { message: "" });
  const result = schema.safeParse("asdf");
  expect(result.success).toBe(false);
  expect(result.error!.issues[0].message).toEqual("");
});

test("dont short circuit on continuable errors", () => {
  const user = z
    .object({
      password: z.string().min(6),
      confirm: z.string(),
    })
    .refine((data) => data.password === data.confirm, {
      message: "Passwords don't match",
      path: ["confirm"],
    });
  const result = user.safeParse({ password: "asdf", confirm: "qwer" });
  expect(result.success).toBe(false);
  expect(result.error).toMatchInlineSnapshot(`
    [ZodError: [
      {
        "origin": "string",
        "code": "too_small",
        "minimum": 6,
        "path": [
          "password"
        ],
        "message": "Too small: expected string to have >6 characters"
      },
      {
        "code": "custom",
        "path": [
          "confirm"
        ],
        "message": "Passwords don't match"
      }
    ]]
  `);
  // expect(result.error!.issues.length).toEqual(2);
});

test("string error params", () => {
  const a = z.string("Bad!");
  expect(a.safeParse(123).error!.issues[0].message).toBe("Bad!");

  const b = z.string().min(5, "Too short!");
  expect(b.safeParse("abc").error!.issues[0].message).toBe("Too short!");

  const c = z.uuid("Bad UUID!");
  expect(c.safeParse("not-a-uuid").error!.issues[0].message).toBe("Bad UUID!");

  const d = z.string().datetime({ message: "Bad date!" });
  expect(d.safeParse("not-a-date").error!.issues[0].message).toBe("Bad date!");
</test_snippet>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/nested-refine.test.ts" lines="22-155">
            path: ["confirm"],
            error: 'Value must be "bar"',
          }
        ),
    })
    .refine(
      (data) => {
        return data.nested.confirm === data.password;
      },
      {
        path: ["nested", "confirm"],
        error: "Password and confirm must match",
      }
    );

  const DATA = {
    password: "bar",
    nested: { confirm: "" },
  };
  expect(zodSchema.safeParse(DATA)).toMatchInlineSnapshot(`
    {
      "error": [ZodError: [
      {
        "origin": "string",
        "code": "too_small",
        "minimum": 1,
        "path": [
          "nested",
          "confirm"
        ],
        "message": "Too small: expected string to have >1 characters"
      },
      {
        "code": "custom",
        "path": [
          "nested",
          "confirm"
        ],
        "message": "Confirm length should be > 2"
      },
      {
        "code": "custom",
        "path": [
          "nested",
          "confirm"
        ],
        "message": "Value must be \\"bar\\""
      },
      {
        "code": "custom",
        "path": [
          "nested",
          "confirm"
        ],
        "message": "Password and confirm must match"
      }
    ]],
      "success": false,
    }
  `);

  expect(zodSchema.safeParse(DATA, { jitless: true })).toMatchInlineSnapshot(`
    {
      "error": [ZodError: [
      {
        "origin": "string",
        "code": "too_small",
        "minimum": 1,
        "path": [
          "nested",
          "confirm"
        ],
        "message": "Too small: expected string to have >1 characters"
      },
      {
        "code": "custom",
        "path": [
          "nested",
          "confirm"
        ],
        "message": "Confirm length should be > 2"
      },
      {
        "code": "custom",
        "path": [
          "nested",
          "confirm"
        ],
        "message": "Value must be \\"bar\\""
      },
      {
        "code": "custom",
        "path": [
          "nested",
          "confirm"
        ],
        "message": "Password and confirm must match"
      }
    ]],
      "success": false,
    }
  `);

  expect(zodSchema["~standard"].validate(DATA)).toMatchInlineSnapshot(`
    {
      "issues": [
        {
          "code": "too_small",
          "message": "Too small: expected string to have >1 characters",
          "minimum": 1,
          "origin": "string",
          "path": [
            "nested",
            "confirm",
          ],
        },
        {
          "code": "custom",
          "message": "Confirm length should be > 2",
          "path": [
            "nested",
            "confirm",
          ],
        },
        {
          "code": "custom",
          "message": "Value must be "bar"",
          "path": [
            "nested",
            "confirm",
          ],
        },
        {
          "code": "custom",
</test_snippet>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/preprocess.test.ts" lines="191-245">
        "message": "Invalid input: expected number, received object"
      }
    ]],
      "success": false,
    }
  `);
});

test("preprocess as the second property of object", () => {
  const schema = z.object({
    nonEmptyStr: z.string().min(1),
    positiveNum: z.preprocess((v) => Number(v), z.number().positive()),
  });
  const result = schema.safeParse({
    nonEmptyStr: "",
    positiveNum: "",
  });

  expect(result.error!.issues).toHaveLength(2);
  expect(result).toMatchInlineSnapshot(`
    {
      "error": [ZodError: [
      {
        "origin": "string",
        "code": "too_small",
        "minimum": 1,
        "path": [
          "nonEmptyStr"
        ],
        "message": "Too small: expected string to have >1 characters"
      },
      {
        "origin": "number",
        "code": "too_small",
        "minimum": 0,
        "inclusive": false,
        "path": [
          "positiveNum"
        ],
        "message": "Too small: expected number to be >0"
      }
    ]],
      "success": false,
    }
  `);
});

test("preprocess validates with sibling errors", () => {
  const schema = z.object({
    missing: z.string().refine(() => false),
    preprocess: z.preprocess((data: any) => data?.trim(), z.string().regex(/ asdf/)),
  });

  const result = schema.safeParse({ preprocess: " asdf" });

</test_snippet>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/validations.test.ts" lines="25-95">
  } catch (err) {
    // ("String must contain exactly 4 character(s)");
    expect((err as z.ZodError).issues).toMatchInlineSnapshot(`
      [
        {
          "code": "too_big",
          "maximum": 4,
          "message": "Too big: expected string to have <4 characters",
          "origin": "string",
          "path": [],
        },
      ]
    `);
  }
});

test("string min/max", async () => {
  try {
    await z.string().min(4).parseAsync("asd");
  } catch (err) {
    // ("String must contain at least 4 character(s)");
    expect((err as z.ZodError).issues).toMatchInlineSnapshot(`
      [
        {
          "code": "too_small",
          "message": "Too small: expected string to have >4 characters",
          "minimum": 4,
          "origin": "string",
          "path": [],
        },
      ]
    `);
  }
});

test("string max", async () => {
  try {
    await z.string().max(4).parseAsync("aasdfsdfsd");
  } catch (err) {
    // ("String must contain at most 4 character(s)");
    expect((err as z.ZodError).issues).toMatchInlineSnapshot(`
      [
        {
          "code": "too_big",
          "maximum": 4,
          "message": "Too big: expected string to have <4 characters",
          "origin": "string",
          "path": [],
        },
      ]
    `);
  }
});

test("number min", async () => {
  try {
    await z.number().min(3).parseAsync(2);
  } catch (err) {
    // ("Number must be greater than or equal to 3");
    expect((err as z.ZodError).issues).toMatchInlineSnapshot(`
      [
        {
          "code": "too_small",
          "inclusive": true,
          "message": "Too small: expected number to be >=3",
          "minimum": 3,
          "origin": "number",
          "path": [],
        },
      ]
    `);
</test_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/checks.ts" lines="600-701">
export const $ZodCheckMaxLength: core.$constructor<$ZodCheckMaxLength> = /*@__PURE__*/ core.$constructor(
  "$ZodCheckMaxLength",
  (inst, def) => {
    $ZodCheck.init(inst, def);

    inst._zod.when = (payload) => {
      const val = payload.value;
      return !util.nullish(val) && (val as any).length !== undefined;
    };

    inst._zod.onattach.push((inst) => {
      const curr = (inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY) as number;
      if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
    });

    inst._zod.check = (payload) => {
      const input = payload.value;
      const length = input.length;

      if (length <= def.maximum) return;
      const origin = util.getLengthableOrigin(input);
      payload.issues.push({
        origin,
        code: "too_big",
        maximum: def.maximum,
        inclusive: true,
        input,
        inst,
        continue: !def.abort,
      });
    };
  }
);

//////////////////////////////////
/////    $ZodCheckMinLength    /////
//////////////////////////////////
export interface $ZodCheckMinLengthDef extends $ZodCheckDef {
  check: "min_length";
  minimum: number;
}

export interface $ZodCheckMinLengthInternals<T extends util.HasLength = util.HasLength> extends $ZodCheckInternals<T> {
  def: $ZodCheckMinLengthDef;
  issc: errors.$ZodIssueTooSmall<T>;
}

export interface $ZodCheckMinLength<T extends util.HasLength = util.HasLength> extends $ZodCheck<T> {
  _zod: $ZodCheckMinLengthInternals<T>;
}

export const $ZodCheckMinLength: core.$constructor<$ZodCheckMinLength> = /*@__PURE__*/ core.$constructor(
  "$ZodCheckMinLength",
  (inst, def) => {
    $ZodCheck.init(inst, def);

    inst._zod.when = (payload) => {
      const val = payload.value;
      return !util.nullish(val) && (val as any).length !== undefined;
    };

    inst._zod.onattach.push((inst) => {
      const curr = (inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY) as number;
      if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
    });

    inst._zod.check = (payload) => {
      const input = payload.value;
      const length = input.length;

      if (length >= def.minimum) return;
      const origin = util.getLengthableOrigin(input);
      payload.issues.push({
        origin,
        code: "too_small",
        minimum: def.minimum,
        inclusive: true,
        input,
        inst,
        continue: !def.abort,
      });
    };
  }
);

/////////////////////////////////////
/////    $ZodCheckLengthEquals    /////
/////////////////////////////////////
export interface $ZodCheckLengthEqualsDef extends $ZodCheckDef {
  check: "length_equals";
  length: number;
}

export interface $ZodCheckLengthEqualsInternals<T extends util.HasLength = util.HasLength>
  extends $ZodCheckInternals<T> {
  def: $ZodCheckLengthEqualsDef;
  issc: errors.$ZodIssueTooBig<T> | errors.$ZodIssueTooSmall<T>;
}

export interface $ZodCheckLengthEquals<T extends util.HasLength = util.HasLength> extends $ZodCheck<T> {
  _zod: $ZodCheckLengthEqualsInternals<T>;
}
</production_snippet>
