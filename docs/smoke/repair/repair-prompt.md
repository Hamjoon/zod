A vitest test written against the Zod repository file `packages/zod/src/v4/core/util.ts` (as of v4.0.5) now fails after the production code changed. Your task is to repair the test.

The test file imports the module under test like this (do not change this import):

```ts
import { test, expect, vi } from "vitest";
import * as util from "../../packages/zod/src/v4/core/util.js";
```

The failing test case, in full:

```ts
test("floatSafeRemainder handles decimal steps", () => {
  // 5.55 % 0.1 = 0.05
  const rem = util.floatSafeRemainder(5.55, 0.1);
  expect(rem).toBeCloseTo(0.05);
  // exact division should give 0
  expect(util.floatSafeRemainder(5.5, 0.1)).toBeCloseTo(0);
});
```

The production change at the commit where this test first fails:

```
commit 5b7ed214526cb5a7cc508aec236603ff79ae9579
Author: Rayan Salhab
Date: 2026-04-27

    fix: correct multipleOf float validation using tolerance-based comparison (#5793)


diff --git a/packages/zod/src/v4/core/util.ts b/packages/zod/src/v4/core/util.ts
index 75b32f8a..05987af6 100644
--- a/packages/zod/src/v4/core/util.ts
+++ b/packages/zod/src/v4/core/util.ts
@@ -245,20 +245,12 @@ export function cleanRegex(source: string): string {
 }
 
 export function floatSafeRemainder(val: number, step: number): number {
-  const valDecCount = (val.toString().split(".")[1] || "").length;
-  const stepString = step.toString();
-  let stepDecCount = (stepString.split(".")[1] || "").length;
-  if (stepDecCount === 0 && /\d?e-\d+/.test(stepString)) {
-    const match = stepString.match(/\d?e-(\d+)/);
-    if (match?.[1]) {
-      stepDecCount = Number.parseInt(match[1]);
-    }
-  }
-
-  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
-  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
-  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
-  return (valInt % stepInt) / 10 ** decCount;
+  const ratio = val / step;
+  const roundedRatio = Math.round(ratio);
+  // Use a relative epsilon scaled to the magnitude of the result
+  const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
+  if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
+  return ratio - roundedRatio;
 }
 
 const EVALUATING = Symbol("evaluating");
```

The test execution output at that commit:

```
FAIL  experiments/generated-tests/util-main.test.ts > floatSafeRemainder handles decimal steps
AssertionError: expected 0.4999999999999929 to be close to 0.05, received difference is 0.4499999999999929, but expected 0.005

  53| test("floatSafeRemainder handles decimal steps", () => {
  54|   // 5.55 % 0.1 = 0.05
  55|   const rem = util.floatSafeRemainder(5.55, 0.1);
    |               ^ expect(rem).toBeCloseTo(0.05) failed
```

Instructions:
- Modify the test so that it keeps verifying the same intent while matching the new code. The production code is not to be modified.
- Output the complete repaired test case inside a single ```ts code fence. Do not output any text outside the code fence.
