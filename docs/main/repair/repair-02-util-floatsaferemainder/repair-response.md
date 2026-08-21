```ts
import { test, expect } from "vitest";
import * as util from "../../packages/zod/src/v4/core/util.js";

test("floatSafeRemainder works with decimals", () => {
  // 5.5 % 0.1 = 0.0 (due to floating point)
  const rem = util.floatSafeRemainder(5.5, 0.1);
  expect(rem).toBeCloseTo(0);
  // 5.7 % 0.2 = 0.1, the function now returns the fractional part of the ratio
  const rem2 = util.floatSafeRemainder(5.7, 0.2);
  expect(rem2).toBeCloseTo(0.5);
});
```