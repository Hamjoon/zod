###Test START##
```ts
/**
 * Vitest test suite for the $ZodDate class.
 *
 * The $ZodDate schema is created via the exported `$ZodDate` constructor
 * (imported from `./schemas.js`).  The only public behaviour we need to test
 * is the internal `parse` method that validates/coerces a payload.
 *
 * The tests cover:
 *   • Normal validation of a proper `Date` instance.
 *   • Detection of an *invalid* `Date` (e.g. `new Date('invalid')`).
 *   • Rejection of non‑date values when coercion is disabled.
 *   • Successful coercion of strings, numbers and existing `Date`s when
 *     `coerce: true`.
 *   • Correct issue objects being pushed for each failure mode.
 *
 * The test file follows the “three‑expert” narrative: each expert contributes
 * one test case per method (here only `parse`).  The final suite aggregates
 * all cases into a single, comprehensive file.
 */

import { describe, it, expect } from "vitest";
import { $ZodDate } from "./schemas.js";

/**
 * Helper to build a minimal payload object expected by `$ZodDate._zod.parse`.
 *
 * The parser mutates the `payload.value` (when coercion occurs) and pushes
 * any validation issues onto `payload.issues`.  It returns the same payload,
 * which we can inspect after the call.
 */
function makePayload(initialValue: unknown) {
  return {
    value: initialValue,
    issues: [] as Array<{
      expected: string;
      code: string;
      input: unknown;
      received?: string;
      inst: unknown;
    }>,
  };
}

/**
 * Utility to create a `$ZodDate` schema with the desired `coerce` flag.
 *
 * The underlying `core.$constructor` expects a definition object that at
 * minimum contains `{ type: "date", coerce?: boolean }`.  For the purpose of
 * these tests we only need to supply `coerce`.
 */
function createSchema(coerce = false) {
  // The definition matches `$ZodDateDef`.
  const def = { type: "date", coerce } as const;
  // `$ZodDate` is a constructor function that returns an instance with
  // the internal `_zod` object.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore – the exact signature of `$ZodDate` is not exported,
  // but calling it with the definition works in the library.
  return $ZodDate(def);
}

/* -------------------------------------------------------------------------- */
/*  Expert 1 – Valid Date (no coercion)                                        */
/* -------------------------------------------------------------------------- */
describe("$ZodDate.parse – valid Date handling", () => {
  it("accepts a proper Date instance when coercion is disabled", () => {
    const schema = createSchema(false);
    const now = new Date();
    const payload = makePayload(now);

    const result = schema._zod.parse(payload, {} as any);

    // The parser should return the original payload unchanged.
    expect(result).toBe(payload);
    // No issues should be recorded.
    expect(payload.issues).toHaveLength(0);
    // The value should still be the original Date.
    expect(payload.value).toBe(now);
  });
});

/* -------------------------------------------------------------------------- */
/*  Expert 2 – Invalid Date detection                                         */
/* -------------------------------------------------------------------------- */
describe("$ZodDate.parse – invalid Date detection", () => {
  it("flags an Invalid Date instance (e.g., new Date('invalid'))", () => {
    const schema = createSchema(false);
    const invalid = new Date("invalid"); // NaN time
    const payload = makePayload(invalid);

    const result = schema._zod.parse(payload, {} as any);

    expect(result).toBe(payload);
    // One issue should be added.
    expect(payload.issues).toHaveLength(1);
    const issue = payload.issues[0];
    expect(issue).toMatchObject({
      expected: "date",
      code: "invalid_type",
      input: invalid,
      received: "Invalid Date",
    });
    // The instance reference should be the schema itself.
    expect(issue.inst).toBe(schema);
  });
});

/* -------------------------------------------------------------------------- */
/*  Expert 3 – Non‑date rejection (no coercion)                               */
/* -------------------------------------------------------------------------- */
describe("$ZodDate.parse – non‑date values without coercion", () => {
  it("rejects a plain string when coercion is disabled", () => {
    const schema = createSchema(false);
    const payload = makePayload("2023-01-01");

    const result = schema._zod.parse(payload, {} as any);

    expect(result).toBe(payload);
    expect(payload.issues).toHaveLength(1);
    const issue = payload.issues[0];
    expect(issue).toMatchObject({
      expected: "date",
      code: "invalid_type",
      input: "2023-01-01",
    });
    // No `received` field because the input is not a Date at all.
    expect(issue).not.toHaveProperty("received");
  });
});

/* -------------------------------------------------------------------------- */
/*  Expert 4 – Coercion from string to Date                                    */
/* -------------------------------------------------------------------------- */
describe("$ZodDate.parse – coercion enabled", () => {
  it("coerces a valid ISO‑8601 string into a Date", () => {
    const schema = createSchema(true);
    const isoString = "2023-07-15T12:34:56.789Z";
    const payload = makePayload(isoString);

    const result = schema._zod.parse(payload, {} as any);

    expect(result).toBe(payload);
    // No issues after successful coercion.
    expect(payload.issues).toHaveLength(0);
    // The value should now be a Date instance representing the same moment.
    expect(payload.value).toBeInstanceOf(Date);
    expect((payload.value as Date).toISOString()).toBe(isoString);
  });

  it("coerces a numeric timestamp (milliseconds) into a Date", () => {
    const schema = createSchema(true);
    const timestamp = 1_692_000_000_000; // corresponds to 2023‑08‑20T...
    const payload = makePayload(timestamp);

    const result = schema._zod.parse(payload, {} as any);

    expect(result).toBe(payload);
    expect(payload.issues).toHaveLength(0);
    expect(payload.value).toBeInstanceOf(Date);
    expect((payload.value as Date).getTime()).toBe(timestamp);
  });

  it("coerces an existing Date (should remain unchanged)", () => {
    const schema = createSchema(true);
    const now = new Date();
    const payload = makePayload(now);

    const result = schema._zod.parse(payload, {} as any);

    expect(result).toBe(payload);
    expect(payload.issues).toHaveLength(0);
    // The reference should stay the same (no new Date created).
    expect(payload.value).toBe(now);
  });

  it("adds an issue when coercion yields an Invalid Date", () => {
    const schema = createSchema(true);
    const badString = "not-a-date";
    const payload = makePayload(badString);

    const result = schema._zod.parse(payload, {} as any);

    expect(result).toBe(payload);
    // Coercion runs, turning the string into `new Date('not-a-date')`
    // which is an Invalid Date, so an issue must be reported.
    expect(payload.issues).toHaveLength(1);
    const issue = payload.issues[0];
    expect(issue).toMatchObject({
      expected: "date",
      code: "invalid_type",
      input: new Date(badString), // the coerced value (Invalid Date)
      received: "Invalid Date",
    });
  });
});
```
###Test END##