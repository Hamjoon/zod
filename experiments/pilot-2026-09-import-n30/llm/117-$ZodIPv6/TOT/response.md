###Test START##
```ts
/**
 * Vitest test suite for the $ZodIPv6 schema implementation.
 *
 * The tests cover:
 * 1. Default pattern assignment (regexes.ipv6) when none is provided.
 * 2. Proper attachment of the `format` bag value (`"ipv6"`).
 * 3. Correct validation of valid IPv6 addresses.
 * 4. Detection of invalid IPv6 strings and generation of the appropriate issue.
 * 5. Behaviour of the `continue` flag based on the `abort` definition option.
 *
 * The $ZodIPv6 class is exported from `./schemas.js` (relative to this test file).
 */

import { describe, it, expect, beforeEach } from "vitest";
import { $ZodIPv6 } from "./schemas.js";

/**
 * Helper to create a minimal payload object that mimics the internal
 * structure expected by `$ZodIPv6._zod.check`.
 */
function createPayload(value: unknown) {
  return {
    value,
    issues: [] as Array<{
      code: string;
      format: string;
      input: unknown;
      inst: unknown;
      continue: boolean;
    }>,
  };
}

/**
 * Helper to simulate the "attach" lifecycle step. The `$ZodIPv6` constructor
 * registers a function in `inst._zod.onattach`.  In the real library this
 * function is called when the schema is attached to a parent schema.
 * For our isolated tests we invoke it manually.
 */
function runOnAttach(schema: any) {
  // The onattach array is guaranteed to exist by the constructor.
  const onAttachFns = schema._zod.onattach as Array<(inst: any) => void>;
  onAttachFns.forEach((fn) => fn(schema));
}

/**
 * A small subset of IPv6 test vectors (both valid and invalid) taken from
 * the RFC 4291 examples and common edge‑cases.
 */
const VALID_IPV6 = [
  "2001:0db8:85a3:0000:0000:8a2e:0370:7334", // full notation
  "2001:db8:85a3::8a2e:370:7334", // compressed zeros
  "::1", // loopback
  "fe80::", // link‑local
  "2001:db8::1234:5678", // mixed compression
];

const INVALID_IPV6 = [
  "2001:db8:85a3::8a2e:37023:7334", // too many digits in a group
  "2001:db8:85a3:::8a2e:370:7334", // triple colon
  "2001:db8:85a3:0:0:8a2e:370:7334:1234", // too many groups
  "2001:db8:85a3:0:0:8a2e:370", // too few groups
  "2001:db8:85a3:0:0:8a2e:370:zzzz", // non‑hex characters
  "just-a-string", // not an IPv6 at all
];

describe("$ZodIPv6 schema", () => {
  let schema: any; // using `any` to avoid pulling in the full Zod type system

  beforeEach(() => {
    // Create a fresh instance before each test.
    // No definition overrides are passed, so defaults are used.
    schema = new $ZodIPv6();
  });

  it("assigns a default IPv6 regex pattern when none is provided", () => {
    // The constructor sets `def.pattern ??= regexes.ipv6`.
    // We verify that a RegExp instance exists after construction.
    const pattern = schema._zod.def.pattern;
    expect(pattern).toBeInstanceOf(RegExp);
    // A quick sanity check: the pattern should match a known valid IPv6 address.
    expect(pattern.test("2001:db8::1")).toBe(true);
  });

  it("sets the bag.format to 'ipv6' during the attach lifecycle", () => {
    // Simulate the attach step.
    runOnAttach(schema);

    // The bag is stored under `_zod.bag` (typed as $ZodStringInternals["bag"]).
    const bag = schema._zod.bag as { format?: string };
    expect(bag.format).toBe("ipv6");
  });

  it("validates correct IPv6 addresses without adding issues", () => {
    for (const addr of VALID_IPV6) {
      const payload = createPayload(addr);
      schema._zod.check(payload);
      expect(payload.issues).toHaveLength(0);
    }
  });

  it("detects invalid IPv6 strings and pushes an issue with correct metadata", () => {
    for (const addr of INVALID_IPV6) {
      const payload = createPayload(addr);
      schema._zod.check(payload);
      expect(payload.issues).toHaveLength(1);
      const issue = payload.issues[0];
      expect(issue).toMatchObject({
        code: "invalid_format",
        format: "ipv6",
        input: addr,
        inst: schema,
        // By default `def.abort` is undefined → `continue` should be true.
        continue: true,
      });
    }
  });

  it("respects the `abort` definition flag when generating the `continue` property", () => {
    // Re‑create the schema with `abort: true`.
    const abortingSchema = new $ZodIPv6({ abort: true });

    const payload = createPayload("not-an-ipv6");
    abortingSchema._zod.check(payload);

    expect(payload.issues).toHaveLength(1);
    const issue = payload.issues[0];
    // When abort is true, `continue` must be false.
    expect(issue.continue).toBe(false);
  });
});
```
###Test END##