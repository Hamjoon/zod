###Test START##
```ts
/**
 * Vitest test suite for the ZodMiniISODate schema.
 *
 * The ZodMiniISODate is a Zod‑like constructor that validates ISO‑8601
 * date strings (e.g. "2023-01-31").  The underlying implementation is
 * provided by the `core.$constructor` helper, which yields a schema
 * instance exposing the standard Zod public API:
 *
 *   - parse(value):   throws on validation failure, returns the parsed value otherwise
 *   - safeParse(value): returns { success: true, data } or { success: false, error }
 *   - refine(...), superRefine(...), etc. (not exercised here)
 *
 * The tests below:
 *   1. List the public methods we rely on.
 *   2. Verify normal (happy‑path) behaviour with a valid ISO date.
 *   3. Exercise edge‑cases and error handling:
 *        • malformed strings,
 *        • out‑of‑range month / day,
 *        • leap‑year handling,
 *        • non‑string inputs,
 *        • empty string,
 *        • date‑time strings (should be rejected because only a date is allowed).
 *
 * The test file imports the schema from `./iso.js` (relative to this file)
 * and uses Vitest's `describe`, `it`, and `expect` APIs.
 */

import { describe, it, expect } from "vitest";
import { ZodMiniISODate } from "./iso.js";

/**
 * Public methods of a Zod schema instance that we will test.
 *
 * - parse(value: unknown): T
 * - safeParse(value: unknown): { success: true; data: T } | { success: false; error: ZodError }
 *
 * (Other methods such as `refine`, `superRefine`, `optional`, etc. exist,
 * but they are not part of the core validation logic for this schema.)
 */
type ZodMiniISODateMethods = {
  parse: (value: unknown) => string;
  safeParse: (value: unknown) => { success: true; data: string } | { success: false; error: any };
};

describe("ZodMiniISODate – public API surface", () => {
  it("should expose parse and safeParse methods", () => {
    const schema = ZodMiniISODate;
    // Type‑assert that the methods exist and have the expected signatures.
    const methods: ZodMiniISODateMethods = {
      parse: schema.parse,
      safeParse: schema.safeParse,
    };
    expect(typeof methods.parse).toBe("function");
    expect(typeof methods.safeParse).toBe("function");
  });
});

describe("ZodMiniISODate – happy path", () => {
  it("should successfully parse a valid ISO date string", () => {
    const validDate = "2023-07-15";
    const result = ZodMiniISODate.parse(validDate);
    expect(result).toBe(validDate);
  });

  it("safeParse should return success for a valid ISO date", () => {
    const validDate = "1999-12-31";
    const outcome = ZodMiniISODate.safeParse(validDate);
    expect(outcome.success).toBe(true);
    if (outcome.success) {
      expect(outcome.data).toBe(validDate);
    }
  });
});

describe("ZodMiniISODate – edge cases & error handling", () => {
  // Helper to assert that parse throws a Zod‑like error.
  const expectParseToThrow = (value: unknown, messagePart: string) => {
    expect(() => ZodMiniISODate.parse(value as any)).toThrowError(messagePart);
  };

  // 1. Completely malformed strings
  it("should reject strings that are not in YYYY‑MM‑DD format", () => {
    const malformed = [
      "20230715",          // missing dashes
      "15-07-2023",        // wrong order
      "2023/07/15",        // wrong separator
      "2023-7-5",          // single‑digit month/day
      "2023-07-015",       // extra digit
      "2023-07",           // missing day
      "2023",              // missing month & day
    ];
    malformed.forEach((val) => {
      expectParseToThrow(val, "Invalid date format");
    });
  });

  // 2. Out‑of‑range month / day values
  it("should reject dates with invalid month or day numbers", () => {
    const invalid = [
      "2023-00-10", // month 0
      "2023-13-10", // month > 12
      "2023-01-00", // day 0
      "2023-01-32", // day > 31
      "2023-04-31", // April has 30 days
      "2023-02-30", // February never has 30 days
    ];
    invalid.forEach((val) => {
      expectParseToThrow(val, "Invalid date");
    });
  });

  // 3. Leap‑year handling
  it("should correctly handle February 29 on leap years and reject otherwise", () => {
    // Valid leap year
    expect(() => ZodMiniISODate.parse("2020-02-29")).not.toThrow();

    // Non‑leap year – should throw
    expectParseToThrow("2021-02-29", "Invalid date");
  });

  // 4. Non‑string inputs
  it("should reject non‑string values", () => {
    const nonStrings = [
      20230715,
      null,
      undefined,
      {},
      [],
      new Date(),
      true,
    ];
    nonStrings.forEach((val) => {
      expectParseToThrow(val, "Expected string");
    });
  });

  // 5. Empty string
  it("should reject an empty string", () => {
    expectParseToThrow("", "Invalid date format");
  });

  // 6. Date‑time strings (ISO date‑time) – should be rejected because only a date is allowed
  it("should reject ISO date‑time strings", () => {
    const dateTimes = [
      "2023-07-15T00:00:00Z",
      "2023-07-15T12:34:56+02:00",
      "2023-07-15 10:20:30",
    ];
    dateTimes.forEach((val) => {
      expectParseToThrow(val, "Invalid date format");
    });
  });

  // 7. Whitespace handling – leading/trailing spaces should be considered invalid
  it("should reject strings with surrounding whitespace", () => {
    expectParseToThrow(" 2023-07-15", "Invalid date format");
    expectParseToThrow("2023-07-15 ", "Invalid date format");
    expectParseToThrow("\t2023-07-15\n", "Invalid date format");
  });
});

describe("ZodMiniISODate – safeParse error objects", () => {
  it("should return a failure object with an error for an invalid date", () => {
    const outcome = ZodMiniISODate.safeParse("2023-02-30");
    expect(outcome.success).toBe(false);
    if (!outcome.success) {
      // The exact shape of the error object depends on the Zod implementation,
      // but we can assert that it contains a `issues` array with at least one entry.
      expect(outcome.error).toBeDefined();
      expect(Array.isArray(outcome.error.issues)).toBe(true);
      expect(outcome.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("should return a failure object for non‑string input", () => {
    const outcome = ZodMiniISODate.safeParse(12345);
    expect(outcome.success).toBe(false);
    if (!outcome.success) {
      expect(outcome.error).toBeDefined();
      expect(Array.isArray(outcome.error.issues)).toBe(true);
    }
  });
});
```
###Test END##