You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/classic/tests/index.test.ts, packages/zod/src/v4/core/tests/extend.test.ts, packages/zod/src/v4/core/tests/record-constructor.test.ts, packages/zod/src/v4/core/util.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/classic/tests/index.test.ts b/packages/zod/src/v4/classic/tests/index.test.ts
index f730281d..56cf8adb 100644
--- a/packages/zod/src/v4/classic/tests/index.test.ts
+++ b/packages/zod/src/v4/classic/tests/index.test.ts
@@ -786,6 +786,37 @@ test("isPlainObject", () => {
   expect(z.core.util.isPlainObject("string")).toEqual(false);
   expect(z.core.util.isPlainObject(123)).toEqual(false);
   expect(z.core.util.isPlainObject(Symbol())).toEqual(false);
+  expect(z.core.util.isPlainObject({ constructor: "string" })).toEqual(true);
+  expect(z.core.util.isPlainObject({ constructor: 123 })).toEqual(true);
+  expect(z.core.util.isPlainObject({ constructor: null })).toEqual(true);
+  expect(z.core.util.isPlainObject({ constructor: undefined })).toEqual(true);
+  expect(z.core.util.isPlainObject({ constructor: true })).toEqual(true);
+  expect(z.core.util.isPlainObject({ constructor: {} })).toEqual(true);
+  expect(z.core.util.isPlainObject({ constructor: [] })).toEqual(true);
+});
+
+test("shallowClone with constructor field", () => {
+  const objWithConstructor = { constructor: "string", key: "value" };
+  const cloned = z.core.util.shallowClone(objWithConstructor);
+
+  expect(cloned).toEqual(objWithConstructor);
+  expect(cloned).not.toBe(objWithConstructor);
+  expect(cloned.constructor).toBe("string");
+  expect(cloned.key).toBe("value");
+
+  const testCases = [
+    { constructor: 123, data: "test" },
+    { constructor: null, data: "test" },
+    { constructor: true, data: "test" },
+    { constructor: {}, data: "test" },
+    { constructor: [], data: "test" },
+  ];
+
+  for (const testCase of testCases) {
+    const clonedCase = z.core.util.shallowClone(testCase);
+    expect(clonedCase).toEqual(testCase);
+    expect(clonedCase).not.toBe(testCase);
+  }
 });
 
 test("def typing", () => {
diff --git a/packages/zod/src/v4/core/tests/extend.test.ts b/packages/zod/src/v4/core/tests/extend.test.ts
index 101adac1..ce50e053 100644
--- a/packages/zod/src/v4/core/tests/extend.test.ts
+++ b/packages/zod/src/v4/core/tests/extend.test.ts
@@ -1,4 +1,4 @@
-import { test } from "vitest";
+import { expect, test } from "vitest";
 import * as z from "zod/v4";
 
 test("extend chaining preserves and overrides properties", () => {
@@ -16,3 +16,44 @@ test("extend chaining preserves and overrides properties", () => {
 
   schema3.parse({ email: "test@example.com" });
 });
+
+test("extend with constructor field in shape", () => {
+  const baseSchema = z.object({
+    name: z.string(),
+  });
+
+  const extendedSchema = baseSchema.extend({
+    constructor: z.string(),
+    age: z.number(),
+  });
+
+  const result = extendedSchema.parse({
+    name: "John",
+    constructor: "Person",
+    age: 30,
+  });
+
+  expect(result).toEqual({
+    name: "John",
+    constructor: "Person",
+    age: 30,
+  });
+
+  const testCases = [
+    { name: "Test", constructor: 123, age: 25 },
+    { name: "Test", constructor: null, age: 25 },
+    { name: "Test", constructor: true, age: 25 },
+    { name: "Test", constructor: {}, age: 25 },
+  ];
+
+  for (const testCase of testCases) {
+    const anyConstructorSchema = baseSchema.extend({
+      constructor: z.any(),
+      age: z.number(),
+    });
+
+    expect(() => anyConstructorSchema.parse(testCase)).not.toThrow();
+    const parsed = anyConstructorSchema.parse(testCase);
+    expect(parsed).toEqual(testCase);
+  }
+});
diff --git a/packages/zod/src/v4/core/tests/record-constructor.test.ts b/packages/zod/src/v4/core/tests/record-constructor.test.ts
new file mode 100644
index 00000000..66f8af3d
--- /dev/null
+++ b/packages/zod/src/v4/core/tests/record-constructor.test.ts
@@ -0,0 +1,67 @@
+import { expect, test } from "vitest";
+import * as z from "zod/v4";
+
+test("record should parse objects with non-function constructor field", () => {
+  const schema = z.record(z.string(), z.any());
+
+  expect(() => schema.parse({ constructor: "string", key: "value" })).not.toThrow();
+
+  const result1 = schema.parse({ constructor: "string", key: "value" });
+  expect(result1).toEqual({ constructor: "string", key: "value" });
+
+  expect(() => schema.parse({ constructor: 123, key: "value" })).not.toThrow();
+
+  const result2 = schema.parse({ constructor: 123, key: "value" });
+  expect(result2).toEqual({ constructor: 123, key: "value" });
+
+  expect(() => schema.parse({ constructor: null, key: "value" })).not.toThrow();
+
+  const result3 = schema.parse({ constructor: null, key: "value" });
+  expect(result3).toEqual({ constructor: null, key: "value" });
+
+  expect(() => schema.parse({ constructor: {}, key: "value" })).not.toThrow();
+
+  const result4 = schema.parse({ constructor: {}, key: "value" });
+  expect(result4).toEqual({ constructor: {}, key: "value" });
+
+  expect(() => schema.parse({ constructor: [], key: "value" })).not.toThrow();
+
+  const result5 = schema.parse({ constructor: [], key: "value" });
+  expect(result5).toEqual({ constructor: [], key: "value" });
+
+  expect(() => schema.parse({ constructor: true, key: "value" })).not.toThrow();
+
+  const result6 = schema.parse({ constructor: true, key: "value" });
+  expect(result6).toEqual({ constructor: true, key: "value" });
+});
+
+test("record should still work with normal objects", () => {
+  const schema = z.record(z.string(), z.string());
+
+  expect(() => schema.parse({ normalKey: "value" })).not.toThrow();
+
+  const result1 = schema.parse({ normalKey: "value" });
+  expect(result1).toEqual({ normalKey: "value" });
+
+  expect(() => schema.parse({ key1: "value1", key2: "value2" })).not.toThrow();
+
+  const result2 = schema.parse({ key1: "value1", key2: "value2" });
+  expect(result2).toEqual({ key1: "value1", key2: "value2" });
+});
+
+test("record should validate values according to schema even with constructor field", () => {
+  const stringSchema = z.record(z.string(), z.string());
+
+  expect(() => stringSchema.parse({ constructor: "string", key: "value" })).not.toThrow();
+
+  expect(() => stringSchema.parse({ constructor: 123, key: "value" })).toThrow();
+});
+
+test("record should work with different key types and constructor field", () => {
+  const enumSchema = z.record(z.enum(["constructor", "key"]), z.string());
+
+  expect(() => enumSchema.parse({ constructor: "value1", key: "value2" })).not.toThrow();
+
+  const result = enumSchema.parse({ constructor: "value1", key: "value2" });
+  expect(result).toEqual({ constructor: "value1", key: "value2" });
+});

</recent_change_diff>

Current test results:
<test_output>
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v4.0.10 <worktree>/p03-002e01ad

 ❯  zod  src/v4/core/tests/record-constructor.test.ts (4 tests | 3 failed) 6ms
   × record should parse objects with non-function constructor field 4ms
   ✓ record should still work with normal objects 1ms
   × record should validate values according to schema even with constructor field 0ms
   × record should work with different key types and constructor field 0ms
 ❯  zod  src/v4/core/tests/extend.test.ts (2 tests | 1 failed) 7ms
   ✓ extend chaining preserves and overrides properties 2ms
   × extend with constructor field in shape 4ms
 ❯  zod  src/v4/classic/tests/index.test.ts (59 tests | 2 failed) 26ms
   ✓ z.boolean 2ms
   ✓ z.bigint 0ms
   ✓ z.symbol 0ms
   ✓ z.date 0ms
   ✓ z.coerce.string 0ms
   ✓ z.coerce.number 0ms
   ✓ z.coerce.boolean 0ms
   ✓ z.coerce.bigint 0ms
   ✓ z.coerce.date 1ms
   ✓ z.iso.datetime 2ms
   ✓ z.iso.date 1ms
   ✓ z.iso.time 0ms
   ✓ z.iso.duration 0ms
   ✓ z.undefined 0ms
   ✓ z.null 0ms
   ✓ z.any 0ms
   ✓ z.unknown 0ms
   ✓ z.never 0ms
   ✓ z.void 0ms
   ✓ z.array 0ms
   ✓ z.union 0ms
   ✓ z.intersection 1ms
   ✓ z.tuple 1ms
   ✓ z.record 1ms
   ✓ z.map 0ms
   ✓ z.map invalid_element 0ms
   ✓ z.map async 1ms
   ✓ z.set 0ms
   ✓ z.enum 0ms
   ✓ z.enum - native 0ms
   ✓ z.nativeEnum 0ms
   ✓ z.literal 0ms
   ✓ z.file 0ms
   ✓ z.transform 0ms
   ✓ z.transform async 0ms
   ✓ z.preprocess 0ms
   ✓ z.optional 0ms
   ✓ z.nullable 0ms
   ✓ z.default 0ms
   ✓ z.catch 0ms
   ✓ z.nan 0ms
   ✓ z.pipe 0ms
   ✓ z.readonly 0ms
   ✓ z.templateLiteral 1ms
   ✓ z.custom schema 0ms
   ✓ z.custom check 0ms
   ✓ z.check 0ms
   ✓ z.instanceof 0ms
   ✓ z.refine 0ms
   ✓ z.transform 0ms
   ✓ z.$brand() 0ms
   ✓ z.lazy 0ms
   ✓ z.json 1ms
   ✓ z.promise 0ms
   × isPlainObject 3ms
   × shallowClone with constructor field 1ms
   ✓ def typing 1ms
   ✓ runtime type property exists and returns correct values 0ms
   ✓ type narrowing works with type property 0ms
 ✓  zod   TS  src/v4/classic/tests/index.test.ts (59 tests)
 ✓  zod   TS  src/v4/core/tests/record-constructor.test.ts (4 tests)
 ✓  zod   TS  src/v4/core/tests/extend.test.ts (2 tests)

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 6 ⎯⎯⎯⎯⎯⎯⎯

 FAIL   zod  src/v4/core/tests/extend.test.ts > extend with constructor field in shape
Error: Invalid input to extend: expected a plain object
 ❯ Module.extend v4/core/util.js:360:15
    358| export function extend(schema, shape) {
    359|     if (!isPlainObject(shape)) {
    360|         throw new Error("Invalid input to extend: expected a plain obj…
       |               ^
    361|     }
    362|     const checks = schema._zod.def.checks;
 ❯ _.inst.extend v4/classic/schemas.js:535:21
 ❯ src/v4/core/tests/extend.test.ts:25:37

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/6]⎯

 FAIL   zod  src/v4/core/tests/record-constructor.test.ts > record should parse objects with non-function constructor field
AssertionError: expected [Function] to not throw an error but '[\n  {\n    "expected": "record",\n  …' was thrown

- Expected: 
undefined

+ Received: 
"[
  {
    \"expected\": \"record\",
    \"code\": \"invalid_type\",
    \"path\": [],
    \"message\": \"Invalid input: expected record, received object\"
  }
]"

 ❯ src/v4/core/tests/record-constructor.test.ts:7:75
      5|   const schema = z.record(z.string(), z.any());
      6| 
      7|   expect(() => schema.parse({ constructor: "string", key: "value" })).…
       |                                                                           ^
      8| 
      9|   const result1 = schema.parse({ constructor: "string", key: "value" }…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/6]⎯

 FAIL   zod  src/v4/core/tests/record-constructor.test.ts > record should validate values according to schema even with constructor field
AssertionError: expected [Function] to not throw an error but '[\n  {\n    "expected": "record",\n  …' was thrown

- Expected: 
undefined

+ Received: 
"[
  {
    \"expected\": \"record\",
    \"code\": \"invalid_type\",
    \"path\": [],
    \"message\": \"Invalid input: expected record, received object\"
  }
]"

 ❯ src/v4/core/tests/record-constructor.test.ts:55:81
     53|   const stringSchema = z.record(z.string(), z.string());
     54| 
     55|   expect(() => stringSchema.parse({ constructor: "string", key: "value…
       |                                                                                 ^
     56| 
     57|   expect(() => stringSchema.parse({ constructor: 123, key: "value" }))…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/6]⎯

 FAIL   zod  src/v4/core/tests/record-constructor.test.ts > record should work with different key types and constructor field
AssertionError: expected [Function] to not throw an error but '[\n  {\n    "expected": "record",\n  …' was thrown

- Expected: 
undefined

+ Received: 
"[
  {
    \"expected\": \"record\",
    \"code\": \"invalid_type\",
    \"path\": [],
    \"message\": \"Invalid input: expected record, received object\"
  }
]"

 ❯ src/v4/core/tests/record-constructor.test.ts:63:80
     61|   const enumSchema = z.record(z.enum(["constructor", "key"]), z.string…
     62| 
     63|   expect(() => enumSchema.parse({ constructor: "value1", key: "value2"…
       |                                                                                ^
     64| 
     65|   const result = enumSchema.parse({ constructor: "value1", key: "value…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/6]⎯

 FAIL   zod  src/v4/classic/tests/index.test.ts > isPlainObject
AssertionError: expected false to deeply equal true

- Expected
+ Received

- true
+ false

 ❯ src/v4/classic/tests/index.test.ts:789:64
    787|   expect(z.core.util.isPlainObject(123)).toEqual(false);
    788|   expect(z.core.util.isPlainObject(Symbol())).toEqual(false);
    789|   expect(z.core.util.isPlainObject({ constructor: "string" })).toEqual…
       |                                                                ^
    790|   expect(z.core.util.isPlainObject({ constructor: 123 })).toEqual(true…
    791|   expect(z.core.util.isPlainObject({ constructor: null })).toEqual(tru…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/6]⎯

 FAIL   zod  src/v4/classic/tests/index.test.ts > shallowClone with constructor field
AssertionError: expected { constructor: 'string', key: 'value' } not to be { constructor: 'string', key: 'value' } // Object.is equality

Compared values have no visual difference.

 ❯ src/v4/classic/tests/index.test.ts:803:22
    801| 
    802|   expect(cloned).toEqual(objWithConstructor);
    803|   expect(cloned).not.toBe(objWithConstructor);
       |                      ^
    804|   expect(cloned.constructor).toBe("string");
    805|   expect(cloned.key).toBe("value");

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/6]⎯


 Test Files  3 failed | 3 passed (6)
      Tests  6 failed | 124 passed (130)
Type Errors  no errors
   Start at  15:51:39
   Duration  4.44s (transform 545ms, setup 64ms, collect 726ms, tests 38ms, environment 0ms, prepare 10ms, typecheck 4.04s)


</test_output>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/index.test.ts" lines="764-844">
});
// test("type assertions", () => {
//   const schema = z.pipe(
//     z.string(),
//     z.transform((val) => val.length)
//   );
//   schema.assertInput<string>();
//   // @ts-expect-error
//   schema.assertInput<number>();

//   schema.assertOutput<number>();
//   // @ts-expect-error
//   schema.assertOutput<string>();
// });

test("isPlainObject", () => {
  expect(z.core.util.isPlainObject({})).toEqual(true);
  expect(z.core.util.isPlainObject(Object.create(null))).toEqual(true);
  expect(z.core.util.isPlainObject([])).toEqual(false);
  expect(z.core.util.isPlainObject(new Date())).toEqual(false);
  expect(z.core.util.isPlainObject(null)).toEqual(false);
  expect(z.core.util.isPlainObject(undefined)).toEqual(false);
  expect(z.core.util.isPlainObject("string")).toEqual(false);
  expect(z.core.util.isPlainObject(123)).toEqual(false);
  expect(z.core.util.isPlainObject(Symbol())).toEqual(false);
  expect(z.core.util.isPlainObject({ constructor: "string" })).toEqual(true);
  expect(z.core.util.isPlainObject({ constructor: 123 })).toEqual(true);
  expect(z.core.util.isPlainObject({ constructor: null })).toEqual(true);
  expect(z.core.util.isPlainObject({ constructor: undefined })).toEqual(true);
  expect(z.core.util.isPlainObject({ constructor: true })).toEqual(true);
  expect(z.core.util.isPlainObject({ constructor: {} })).toEqual(true);
  expect(z.core.util.isPlainObject({ constructor: [] })).toEqual(true);
});

test("shallowClone with constructor field", () => {
  const objWithConstructor = { constructor: "string", key: "value" };
  const cloned = z.core.util.shallowClone(objWithConstructor);

  expect(cloned).toEqual(objWithConstructor);
  expect(cloned).not.toBe(objWithConstructor);
  expect(cloned.constructor).toBe("string");
  expect(cloned.key).toBe("value");

  const testCases = [
    { constructor: 123, data: "test" },
    { constructor: null, data: "test" },
    { constructor: true, data: "test" },
    { constructor: {}, data: "test" },
    { constructor: [], data: "test" },
  ];

  for (const testCase of testCases) {
    const clonedCase = z.core.util.shallowClone(testCase);
    expect(clonedCase).toEqual(testCase);
    expect(clonedCase).not.toBe(testCase);
  }
});

test("def typing", () => {
  z.string().def.type satisfies "string";
  z.number().def.type satisfies "number";
  z.bigint().def.type satisfies "bigint";
  z.boolean().def.type satisfies "boolean";
  z.date().def.type satisfies "date";
  z.symbol().def.type satisfies "symbol";
  z.undefined().def.type satisfies "undefined";
  z.string().nullable().def.type satisfies "nullable";
  z.null().def.type satisfies "null";
  z.any().def.type satisfies "any";
  z.unknown().def.type satisfies "unknown";
  z.never().def.type satisfies "never";
  z.void().def.type satisfies "void";
  z.array(z.string()).def.type satisfies "array";
  z.object({ key: z.string() }).def.type satisfies "object";
  z.union([z.string(), z.number()]).def.type satisfies "union";
  z.intersection(z.string(), z.number()).def.type satisfies "intersection";
  z.tuple([z.string(), z.number()]).def.type satisfies "tuple";
  z.record(z.string(), z.number()).def.type satisfies "record";
  z.map(z.string(), z.number()).def.type satisfies "map";
  z.set(z.string()).def.type satisfies "set";
  z.literal("example").def.type satisfies "literal";
</test_snippet>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/core/tests/extend.test.ts" lines="1-84">
import { expect, test } from "vitest";
import * as z from "zod/v4";

test("extend chaining preserves and overrides properties", () => {
  const schema1 = z.object({
    email: z.string(),
  });

  const schema2 = schema1.extend({
    email: schema1.shape.email.check(z.email()),
  });

  const schema3 = schema2.extend({
    email: schema2.shape.email.or(z.literal("")),
  });

  schema3.parse({ email: "test@example.com" });
});

test("extend with constructor field in shape", () => {
  const baseSchema = z.object({
    name: z.string(),
  });

  const extendedSchema = baseSchema.extend({
    constructor: z.string(),
    age: z.number(),
  });

  const result = extendedSchema.parse({
    name: "John",
    constructor: "Person",
    age: 30,
  });

  expect(result).toEqual({
    name: "John",
    constructor: "Person",
    age: 30,
  });

  const testCases = [
    { name: "Test", constructor: 123, age: 25 },
    { name: "Test", constructor: null, age: 25 },
    { name: "Test", constructor: true, age: 25 },
    { name: "Test", constructor: {}, age: 25 },
  ];

  for (const testCase of testCases) {
    const anyConstructorSchema = baseSchema.extend({
      constructor: z.any(),
      age: z.number(),
    });

    expect(() => anyConstructorSchema.parse(testCase)).not.toThrow();
    const parsed = anyConstructorSchema.parse(testCase);
    expect(parsed).toEqual(testCase);
  }
});
</test_snippet>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/core/tests/record-constructor.test.ts" lines="1-92">
import { expect, test } from "vitest";
import * as z from "zod/v4";

test("record should parse objects with non-function constructor field", () => {
  const schema = z.record(z.string(), z.any());

  expect(() => schema.parse({ constructor: "string", key: "value" })).not.toThrow();

  const result1 = schema.parse({ constructor: "string", key: "value" });
  expect(result1).toEqual({ constructor: "string", key: "value" });

  expect(() => schema.parse({ constructor: 123, key: "value" })).not.toThrow();

  const result2 = schema.parse({ constructor: 123, key: "value" });
  expect(result2).toEqual({ constructor: 123, key: "value" });

  expect(() => schema.parse({ constructor: null, key: "value" })).not.toThrow();

  const result3 = schema.parse({ constructor: null, key: "value" });
  expect(result3).toEqual({ constructor: null, key: "value" });

  expect(() => schema.parse({ constructor: {}, key: "value" })).not.toThrow();

  const result4 = schema.parse({ constructor: {}, key: "value" });
  expect(result4).toEqual({ constructor: {}, key: "value" });

  expect(() => schema.parse({ constructor: [], key: "value" })).not.toThrow();

  const result5 = schema.parse({ constructor: [], key: "value" });
  expect(result5).toEqual({ constructor: [], key: "value" });

  expect(() => schema.parse({ constructor: true, key: "value" })).not.toThrow();

  const result6 = schema.parse({ constructor: true, key: "value" });
  expect(result6).toEqual({ constructor: true, key: "value" });
});

test("record should still work with normal objects", () => {
  const schema = z.record(z.string(), z.string());

  expect(() => schema.parse({ normalKey: "value" })).not.toThrow();

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
</test_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/util.ts" lines="358-408">
export function isObject(data: any): data is Record<PropertyKey, unknown> {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}

export const allowsEval: { value: boolean } = cached(() => {
  // @ts-ignore
  if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
    return false;
  }

  try {
    const F = Function;
    new F("");
    return true;
  } catch (_) {
    return false;
  }
});

export function isPlainObject(o: any): o is Record<PropertyKey, unknown> {
  if (isObject(o) === false) return false;

  // modified constructor
  const ctor = o.constructor;
  if (ctor === undefined) return true;

  // modified prototype
  const prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // ctor doesn't have static `isPrototypeOf`
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
    return false;
  }

  return true;
}

export function shallowClone(o: any): any {
  if (isPlainObject(o)) return { ...o };
  if (Array.isArray(o)) return [...o];
  return o;
}

export function numKeys(data: any): number {
  let keyCount = 0;
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      keyCount++;
    }
  }
</production_snippet>
