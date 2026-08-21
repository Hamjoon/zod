A vitest test written against the Zod repository file `packages/zod/src/v4/mini/schemas.ts` (as of v4.0.5) now fails after the production code changed. Your task is to repair the test.

The test file imports the module under test like this (do not change this import):

```ts
import { test, expect, describe } from "vitest";
import * as schemas from "../../packages/zod/src/v4/mini/schemas.js";
```

The failing test case, in full:

```ts
test("object schema shape and keyof utility", () => {
  const obj = schemas.object({ a: schemas.string(), b: schemas.number() });
  expect(obj._zod.def.type).toBe("object");
  // shape is lazily defined; accessing triggers getter
  expect(obj.shape).toHaveProperty("a");
  expect(obj.shape).toHaveProperty("b");

  const keys = schemas.keyof(obj);
  expect(keys._zod.def.type).toBe("literal");
  // keys should contain both property names
  expect(keys._zod.def.values).toContain("a");
  expect(keys._zod.def.values).toContain("b");
});
```

The production change at the commit where this test first fails:

```
commit d589186c20c3dc112f5a5fda23cccd4d1f74420e
Author: Colin McDonnell
Date: 2025-08-05

    fix: ensure keyof returns enum (#5045)

diff --git a/packages/zod/src/v4/mini/schemas.ts b/packages/zod/src/v4/mini/schemas.ts
index d559db39..b34adb25 100644
--- a/packages/zod/src/v4/mini/schemas.ts
+++ b/packages/zod/src/v4/mini/schemas.ts
@@ -712,9 +712,9 @@ export function array<T extends SomeType>(element: SomeType, params?: any): ZodM
 }
 
 // .keyof
-export function keyof<T extends ZodMiniObject>(schema: T): ZodMiniLiteral<Exclude<keyof T["shape"], symbol>> {
+export function keyof<T extends ZodMiniObject>(schema: T): ZodMiniEnum<util.KeysEnum<T["shape"]>> {
   const shape = schema._zod.def.shape;
-  return literal(Object.keys(shape)) as any;
+  return _enum(Object.keys(shape)) as any;
 }
 
 // ZodMiniObject
```

The test execution output at that commit:

```
FAIL  experiments/generated-tests/mini-schemas-main.test.ts > ZodMini schema constructors and core behaviours object schema shape and keyof utility
AssertionError: expected 'enum' to be 'literal' // Object.is equality
    at experiments/generated-tests/mini-schemas-main.test.ts:80:32
```

Instructions:
- Modify the test so that it keeps verifying the same intent while matching the new code. The production code is not to be modified.
- Output the complete repaired test case inside a single ```ts code fence. Do not output any text outside the code fence.
