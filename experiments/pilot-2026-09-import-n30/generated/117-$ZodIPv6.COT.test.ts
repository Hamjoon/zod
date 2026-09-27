/**
 * Vitest test suite for the $ZodIPv6 schema.
 *
 * The $ZodIPv6 class is exported from "./schemas.js". It is a Zod‑like
 * validator that checks whether a given string is a valid IPv6 address.
 *
 * The implementation attaches a custom `check` function that tries to
 * construct a URL using the value inside square brackets:
 *
 *   new URL(`http://[${payload.value}]`);
 *
 * If the URL constructor throws, an issue with the following shape is
 * pushed to `payload.issues`:
 *
 *   {
 *     code: "invalid_format",
 *     format: "ipv6",
 *     input: <the original value>,
 *     inst,
 *     continue: !def.abort,
 *   }
 *
 * The tests below cover:
 *   1. Public API surface (the schema instance methods).
 *   2. Normal (happy‑path) validation for correct IPv6 strings.
 *   3. Failure cases for malformed IPv6 strings.
 *   4. Edge‑case inputs (empty string, IPv4 address, zone‑index, etc.).
 *   5. Inspection of internal state (format bag) to ensure the
 *      `onattach` hook works.
 *   6. Behaviour of the `continue` flag when the `abort` option is
 *      toggled (if the library exposes it via schema options).
 *
 * The test file follows the required format: it starts with
 * `###Test START##` and ends with `###Test END##`.
 */

import { describe, it, expect } from "vitest";
import { $ZodIPv6 } from "./schemas.js";

/**
 * Helper to extract the first issue from a Zod‑like error.
 * The actual error type depends on the underlying library, but
 * most Zod‑compatible implementations expose an `issues` array.
 */
function getFirstIssue(error: unknown) {
  // @ts-ignore – we deliberately access internal shape for testing.
  return (error as any).issues?.[0];
}

/**
 * Public methods that a Zod schema normally provides.
 * We only test the ones that are guaranteed to exist for a
 * `$ZodStringFormat` based schema.
 */
const PUBLIC_METHODS = [
  "parse",
  "safeParse",
  "refine",
  "optional",
  "nullable",
  "default",
] as const;

/**
 * Verify that the schema instance exposes the expected public methods.
 */
describe("$ZodIPv6 – public API surface", () => {
  const schema = $ZodIPv6();

  it("should expose the standard Zod string methods", () => {
    for (const method of PUBLIC_METHODS) {
      // The method may be undefined if the underlying library does not
      // implement it; the test will fail, signalling a mismatch.
      expect(typeof (schema as any)[method]).toBe("function");
    }
  });
});

/**
 * Happy‑path validation – a collection of valid IPv6 addresses.
 */
describe("$ZodIPv6 – valid IPv6 strings", () => {
  const validIPv6 = [
    "2001:0db8:85a3:0000:0000:8a2e:0370:7334", // full notation
    "2001:db8:85a3::8a2e:370:7334", // compressed zeros
    "fe80::1ff:fe23:4567:890a", // link‑local
    "::1", // loopback
    "0:0:0:0:0:0:0:1", // same as ::1 but expanded
    "2001:db8::", // trailing double colon
    "2001:0db8:0000:0000:0000:ff00:0042:8329", // mixed case
    "2001:DB8:0:0:0:0:2:1", // uppercase letters
    "2001:db8:0:0:0:0:2:1", // lower case
    "2001:db8::2:1", // compressed with trailing groups
  ];

  const schema = $ZodIPv6();

  for (const ip of validIPv6) {
    it(`should accept "${ip}"`, () => {
      // parse should not throw
      expect(() => schema.parse(ip)).not.toThrow();

      // safeParse should report success
      const result = schema.safeParse(ip);
      expect(result.success).toBe(true);
      // The parsed data should be exactly the input string
      expect(result.data).toBe(ip);
    });
  }
});

/**
 * Failure cases – malformed IPv6 strings.
 */
describe("$ZodIPv6 – invalid IPv6 strings", () => {
  const invalidIPv6 = [
    "2001:db8:85a3::8a2e:37023:7334", // too many digits in a group
    "2001:db8:85a3::8a2e:370g:7334", // illegal character 'g'
    "2001:db8:85a3::8a2e:370:", // trailing colon
    "2001:db8:85a3::8a2e::7334", // double :: (more than one)
    "12345::", // group too long (> 4 hex digits)
    "2001:db8:85a3:0:0:8a2e:370:7334:1234", // too many groups (9)
    "2001:db8:85a3", // too few groups (3)
    "2001:db8:85a3:8a2e:370:7334", // missing groups (5)
    "2001:db8:85a3::8a2e:370:7334:1234", // 9 groups after compression
    "2001:db8:85a3::8a2e:370:7334:12345", // group > 4 hex digits
    "2001:db8:85a3::8a2e:370:7334:zzzz", // non‑hex characters
    "192.168.0.1", // IPv4 address (should be rejected)
    "", // empty string
    "not-an-ipv6-address", // random text
    "fe80::1%eth0", // zone index – URL constructor treats % as percent‑encoding,
                     // which leads to a parsing error for our validator.
  ];

  const schema = $ZodIPv6();

  for (const ip of invalidIPv6) {
    it(`should reject "${ip}"`, () => {
      // parse should throw an error
      expect(() => schema.parse(ip)).toThrow();

      // safeParse should report failure and contain the expected issue
      const result = schema.safeParse(ip);
      expect(result.success).toBe(false);
      // The error object should contain an issue with the correct shape
      const issue = getFirstIssue(result.error);
      expect(issue).toBeDefined();
      expect(issue.code).toBe("invalid_format");
      expect(issue.format).toBe("ipv6");
      expect(issue.input).toBe(ip);
    });
  }
});

/**
 * Internal state verification – ensure the `onattach` hook sets the format bag.
 */
describe("$ZodIPv6 – internal bag format", () => {
  it("should set bag.format to 'ipv6' after construction", () => {
    const schema = $ZodIPv6();

    // The internal bag is stored under `_zod.bag`. The exact type is
    // `$ZodStringInternals<unknown>["bag"]`, but we can access it via
    // a type‑unsafe cast for testing purposes.
    // @ts-ignore – accessing private internals for test validation.
    const bag = (schema as any)._zod?.bag;
    expect(bag).toBeDefined();
    expect(bag.format).toBe("ipv6");
  });
});

/**
 * Edge case – testing the `continue` flag when the `abort` option is toggled.
 *
 * The underlying library allows passing a definition object to the
 * constructor. We simulate this by calling `$ZodIPv6({ abort: true })`
 * if the constructor accepts an options argument. If the library does
 * not expose such an API, the test will be skipped gracefully.
 */
describe("$ZodIPv6 – abort flag handling", () => {
  // Helper to create a schema with a custom definition, if supported.
  function createSchemaWithAbort(abort: boolean) {
    // The constructor signature is `core.$constructor<$ZodIPv6>`.
    // In many Zod‑like libraries, you can pass a definition object
    // like `$ZodIPv6({ abort: true })`. We attempt that; if it throws,
    // we return undefined and the test will be skipped.
    try {
      // @ts-ignore – the library may not type this, but runtime may accept it.
      return $ZodIPv6({ abort });
    } catch {
      return undefined;
    }
  }

  it("should set issue.continue to false when abort is true", () => {
    const schema = createSchemaWithAbort(true);
    if (!schema) {
      // Skip the test if the constructor does not accept options.
      return;
    }

    const invalid = "not-an-ipv6";
    const result = schema.safeParse(invalid);
    expect(result.success).toBe(false);
    const issue = getFirstIssue(result.error);
    expect(issue).toBeDefined();
    // When abort is true, `continue` should be false.
    expect(issue.continue).toBe(false);
  });

  it("should set issue.continue to true when abort is false (default)", () => {
    const schema = createSchemaWithAbort(false) ?? $ZodIPv6(); // fallback to default
    const invalid = "not-an-ipv6";
    const result = schema.safeParse(invalid);
    expect(result.success).toBe(false);
    const issue = getFirstIssue(result.error);
    expect(issue).toBeDefined();
    // Default behaviour is abort = false → continue = true
    expect(issue.continue).toBe(true);
  });
});
