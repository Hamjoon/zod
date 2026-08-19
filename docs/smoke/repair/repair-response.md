```ts
import { test, expect } from "vitest";
import * as util from "../../packages/zod/src/v4/core/util.js";

test("floatSafeRemainder handles decimal steps", () => {
  // 5.55 / 0.1 = 55.5. The new implementation returns the fractional part of the
  // division relative to the nearest integer, which is -0.5 (Math.round(55.5) = 56).
  const rem = util.floatSafeRemainder(5.55, 0.1);
  expect(Math.abs(rem)).toBeCloseTo(0.5);
  // Exact division should give 0.
  expect(util.floatSafeRemainder(5.5, 0.1)).toBeCloseTo(0);
});
```