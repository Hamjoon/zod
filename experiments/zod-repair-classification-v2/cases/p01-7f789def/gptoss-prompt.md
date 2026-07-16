You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/core/tests/record-constructor.test.ts, packages/zod/src/v4/core/schemas.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/core/tests/record-constructor.test.ts b/packages/zod/src/v4/core/tests/record-constructor.test.ts
index 66f8af3d..91b5d5c0 100644
--- a/packages/zod/src/v4/core/tests/record-constructor.test.ts
+++ b/packages/zod/src/v4/core/tests/record-constructor.test.ts
@@ -65,3 +65,61 @@ test("record should work with different key types and constructor field", () =>
   const result = enumSchema.parse({ constructor: "value1", key: "value2" });
   expect(result).toEqual({ constructor: "value1", key: "value2" });
 });
+
+test("record should skip non-enumerable own properties", () => {
+  const schema = z.record(z.string(), z.string());
+
+  const input = { key: "value" };
+  Object.defineProperty(input, "~standard", {
+    value: { validate: () => {}, vendor: "zod", version: 1 },
+    enumerable: false,
+    writable: false,
+    configurable: false,
+  });
+
+  const result = schema.safeParse(input);
+  expect(result.success).toBe(true);
+  if (result.success) {
+    expect(result.data).toEqual({ key: "value" });
+    expect("~standard" in result.data).toBe(false);
+  }
+});
+
+test("record fails on enumerable invalid values even when non-enumerable properties are present", () => {
+  const schema = z.record(z.string(), z.string());
+
+  const input = { key: "value", bad: 123 };
+  Object.defineProperty(input, "hidden", {
+    value: "should be ignored",
+    enumerable: false,
+  });
+
+  const result = schema.safeParse(input);
+  expect(result.success).toBe(false);
+});
+
+test("record validates enumerable Symbol keys and skips non-enumerable Symbol keys", () => {
+  const enumerableSym = Symbol.for("included");
+  const nonEnumerableSym = Symbol.for("hidden");
+  const schema = z.record(z.symbol(), z.string());
+
+  const input: Record<symbol, unknown> = { [enumerableSym]: "value" };
+  Object.defineProperty(input, nonEnumerableSym, {
+    value: 123,
+    enumerable: false,
+  });
+
+  const result = schema.safeParse(input);
+  expect(result.success).toBe(true);
+  if (result.success) {
+    expect(result.data[enumerableSym]).toBe("value");
+    expect(Object.prototype.hasOwnProperty.call(result.data, nonEnumerableSym)).toBe(false);
+  }
+});
+
+test("z.json() accepts z.toJSONSchema() output (issue #5714)", () => {
+  const schema = z.object({ name: z.string() });
+  const jsonSchema = z.toJSONSchema(schema);
+
+  expect(z.json().safeParse(jsonSchema).success).toBe(true);
+});

</recent_change_diff>

Current test results:
<test_output>
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v4.0.10 /Users/donggi/_projects/etc-projects/zod-thesis/.worktrees/p01-7f789def

 ❯  zod  src/v4/core/tests/record-constructor.test.ts (8 tests | 3 failed) 14ms
   ✓ record should parse objects with non-function constructor field 2ms
   ✓ record should still work with normal objects 0ms
   ✓ record should validate values according to schema even with constructor field 0ms
   ✓ record should work with different key types and constructor field 0ms
   × record should skip non-enumerable own properties 3ms
   ✓ record fails on enumerable invalid values even when non-enumerable properties are present 1ms
   × record validates enumerable Symbol keys and skips non-enumerable Symbol keys 1ms
   × z.json() accepts z.toJSONSchema() output (issue #5714) 5ms
 ✓  zod   TS  src/v4/core/tests/record-constructor.test.ts (8 tests)

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯

 FAIL   zod  src/v4/core/tests/record-constructor.test.ts > record should skip non-enumerable own properties
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/v4/core/tests/record-constructor.test.ts:81:26
     79| 
     80|   const result = schema.safeParse(input);
     81|   expect(result.success).toBe(true);
       |                          ^
     82|   if (result.success) {
     83|     expect(result.data).toEqual({ key: "value" });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯

 FAIL   zod  src/v4/core/tests/record-constructor.test.ts > record validates enumerable Symbol keys and skips non-enumerable Symbol keys
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/v4/core/tests/record-constructor.test.ts:113:26
    111| 
    112|   const result = schema.safeParse(input);
    113|   expect(result.success).toBe(true);
       |                          ^
    114|   if (result.success) {
    115|     expect(result.data[enumerableSym]).toBe("value");

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯

 FAIL   zod  src/v4/core/tests/record-constructor.test.ts > z.json() accepts z.toJSONSchema() output (issue #5714)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/v4/core/tests/record-constructor.test.ts:124:50
    122|   const jsonSchema = z.toJSONSchema(schema);
    123| 
    124|   expect(z.json().safeParse(jsonSchema).success).toBe(true);
       |                                                  ^
    125| });
    126| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  3 failed | 13 passed (16)
Type Errors  no errors
   Start at  15:50:51
   Duration  7.68s (transform 1.16s, setup 23ms, collect 1.47s, tests 14ms, environment 0ms, prepare 4ms, typecheck 6.06s)


</test_output>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/core/tests/record-constructor.test.ts" lines="43-150">
  const result1 = schema.parse({ normalKey: "value" });
  expect(result1).toEqual({ normalKey: "value" });

  expect(() => schema.parse({ key1: "value1", key2: "value2" })).not.toThrow();

  const result2 = schema.parse({ key1: "value1", key2: "value2" });
  expect(result2).toEqual({ key1: "value1", key2: "value2" });
});

test("record should validate values according to schema even with constructor field", () => {
  const stringSchema = z.record(z.string(), z.string());

  expect(() => stringSchema.parse({ constructor: "string", key: "value" })).not.toThrow();

  expect(() => stringSchema.parse({ constructor: 123, key: "value" })).toThrow();
});

test("record should work with different key types and constructor field", () => {
  const enumSchema = z.record(z.enum(["constructor", "key"]), z.string());

  expect(() => enumSchema.parse({ constructor: "value1", key: "value2" })).not.toThrow();

  const result = enumSchema.parse({ constructor: "value1", key: "value2" });
  expect(result).toEqual({ constructor: "value1", key: "value2" });
});

test("record should skip non-enumerable own properties", () => {
  const schema = z.record(z.string(), z.string());

  const input = { key: "value" };
  Object.defineProperty(input, "~standard", {
    value: { validate: () => {}, vendor: "zod", version: 1 },
    enumerable: false,
    writable: false,
    configurable: false,
  });

  const result = schema.safeParse(input);
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data).toEqual({ key: "value" });
    expect("~standard" in result.data).toBe(false);
  }
});

test("record fails on enumerable invalid values even when non-enumerable properties are present", () => {
  const schema = z.record(z.string(), z.string());

  const input = { key: "value", bad: 123 };
  Object.defineProperty(input, "hidden", {
    value: "should be ignored",
    enumerable: false,
  });

  const result = schema.safeParse(input);
  expect(result.success).toBe(false);
});

test("record validates enumerable Symbol keys and skips non-enumerable Symbol keys", () => {
  const enumerableSym = Symbol.for("included");
  const nonEnumerableSym = Symbol.for("hidden");
  const schema = z.record(z.symbol(), z.string());

  const input: Record<symbol, unknown> = { [enumerableSym]: "value" };
  Object.defineProperty(input, nonEnumerableSym, {
    value: 123,
    enumerable: false,
  });

  const result = schema.safeParse(input);
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data[enumerableSym]).toBe("value");
    expect(Object.prototype.hasOwnProperty.call(result.data, nonEnumerableSym)).toBe(false);
  }
});

test("z.json() accepts z.toJSONSchema() output (issue #5714)", () => {
  const schema = z.object({ name: z.string() });
  const jsonSchema = z.toJSONSchema(schema);

  expect(z.json().safeParse(jsonSchema).success).toBe(true);
});
</test_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/schemas.ts" lines="2792-2844">
            if (result.issues.length) {
              payload.issues.push(...util.prefixIssues(key, result.issues));
            }
            payload.value[key] = result.value;
          }
        }
      }

      let unrecognized!: string[];
      for (const key in input) {
        if (!recordKeys.has(key)) {
          unrecognized = unrecognized ?? [];
          unrecognized.push(key);
        }
      }
      if (unrecognized && unrecognized.length > 0) {
        payload.issues.push({
          code: "unrecognized_keys",

          input,
          inst,
          keys: unrecognized,
        });
      }
    } else {
      payload.value = {};
      for (const key of Reflect.ownKeys(input)) {
        if (key === "__proto__") continue;
        let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
        if (keyResult instanceof Promise) {
          throw new Error("Async schemas not supported in object keys currently");
        }

        // Numeric string fallback: if key is a numeric string and failed, retry with Number(key)
        // This handles z.number(), z.literal([1, 2, 3]), and unions containing numeric literals
        const checkNumericKey = typeof key === "string" && regexes.number.test(key) && keyResult.issues.length;
        if (checkNumericKey) {
          const retryResult = def.keyType._zod.run({ value: Number(key), issues: [] }, ctx);
          if (retryResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (retryResult.issues.length === 0) {
            keyResult = retryResult;
          }
        }

        if (keyResult.issues.length) {
          if (def.mode === "loose") {
            // Pass through unchanged
            payload.value[key] = input[key];
          } else {
            // Default "strict" behavior: error on invalid key
            payload.issues.push({
</production_snippet>
