import { describe, it, expect } from "vitest";
import { $ZodDate } from "./schemas.js";

/**
 * Helper to create the payload object expected by `$ZodDate.parse`.
 */
function payload(value: any) {
  return { value, issues: [] as any[] };
}

describe("$ZodDate – parse()", () => {
  // -------------------------------------------------------------------------
  // 1️⃣  Basic happy‑path tests
  // -------------------------------------------------------------------------
  it("accepts a valid Date instance unchanged (coerce = false)", () => {
    const schema = new $ZodDate({ type: "date", coerce: false });
    const now = new Date();
    const result = schema._zod.parse(payload(now), {} as any);
    expect(result.issues).toHaveLength(0);
    expect(result.value).toBe(now);
  });

  it("accepts a valid Date instance unchanged (coerce = true)", () => {
    const schema = new $ZodDate({ type: "date", coerce: true });
    const now = new Date();
    const result = schema._zod.parse(payload(now), {} as any);
    expect(result.issues).toHaveLength(0);
    expect(result.value).toBe(now);
  });

  // -------------------------------------------------------------------------
  // 2️⃣  Simple failure cases (no coercion)
  // -------------------------------------------------------------------------
  it("rejects null", () => {
    const schema = new $ZodDate({ type: "date", coerce: false });
    const result = schema._zod.parse(payload(null), {} as any);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].code).toBe("invalid_type");
    expect(result.issues[0].expected).toBe("date");
    expect(result.issues[0].input).toBeNull();
  });

  it("rejects undefined", () => {
    const schema = new $ZodDate({ type: "date", coerce: false });
    const result = schema._zod.parse(payload(undefined), {} as any);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].code).toBe("invalid_type");
    expect(result.issues[0].input).toBeUndefined();
  });

  it("rejects a plain string when coercion is disabled", () => {
    const schema = new $ZodDate({ type: "date", coerce: false });
    const result = schema._zod.parse(payload("2023-01-01"), {} as any);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].code).toBe("invalid_type");
    // No `received` field because the original value wasn't a Date.
    expect((result.issues[0] as any).received).toBeUndefined();
  });

  it("rejects a number when coercion is disabled", () => {
    const schema = new $ZodDate({ type: "date", coerce: false });
    const result = schema._zod.parse(payload(1_640_995_200_000), {} as any);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].code).toBe("invalid_type");
  });

  // -------------------------------------------------------------------------
  // 3️⃣  Coercion enabled – successful conversions
  // -------------------------------------------------------------------------
  it("coerces a valid ISO string to Date", () => {
    const schema = new $ZodDate({ type: "date", coerce: true });
    const iso = "2023-01-01T12:34:56.000Z";
    const result = schema._zod.parse(payload(iso), {} as any);
    expect(result.issues).toHaveLength(0);
    expect(result.value).toBeInstanceOf(Date);
    expect(result.value.toISOString()).toBe(iso);
  });

  it("coerces a numeric timestamp to Date", () => {
    const schema = new $ZodDate({ type: "date", coerce: true });
    const ts = 1_640_995_200_000; // 2022‑01‑01T00:00:00.000Z
    const result = schema._zod.parse(payload(ts), {} as any);
    expect(result.issues).toHaveLength(0);
    expect(result.value).toBeInstanceOf(Date);
    expect(result.value.getTime()).toBe(ts);
  });

  it("coerces an existing Date instance (no‑op)", () => {
    const schema = new $ZodDate({ type: "date", coerce: true });
    const now = new Date();
    const result = schema._zod.parse(payload(now), {} as any);
    expect(result.issues).toHaveLength(0);
    expect(result.value).toBe(now);
  });

  // -------------------------------------------------------------------------
  // 4️⃣  Coercion enabled – failure conversions
  // -------------------------------------------------------------------------
  it("fails coercion for an invalid string", () => {
    const schema = new $ZodDate({ type: "date", coerce: true });
    const result = schema._zod.parse(payload("not-a-date"), {} as any);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].code).toBe("invalid_type");
    // The original payload was a string → no `received` field.
    expect((result.issues[0] as any).received).toBeUndefined();
  });

  it("fails coercion for NaN timestamp", () => {
    const schema = new $ZodDate({ type: "date", coerce: true });
    const result = schema._zod.parse(payload(NaN), {} as any);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].code).toBe("invalid_type");
  });

  // -------------------------------------------------------------------------
  // 5️⃣  Invalid Date objects (Date instance whose time is NaN)
  // -------------------------------------------------------------------------
  it("rejects a Date instance whose internal time is NaN", () => {
    const schema = new $ZodDate({ type: "date", coerce: false });
    const bad = new Date(NaN);
    const result = schema._zod.parse(payload(bad), {} as any);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].code).toBe("invalid_type");
    // When the input *is* a Date we get a `received: "Invalid Date"` field.
    expect(result.issues[0].received).toBe("Invalid Date");
  });

  // -------------------------------------------------------------------------
  // 6️⃣  Issues array accumulation (ensuring parser only pushes)
  // -------------------------------------------------------------------------
  it("adds issues without clearing previously added ones", () => {
    const schema = new $ZodDate({ type: "date", coerce: false });
    const p = payload("first‑bad");
    const afterFirst = schema._zod.parse(p, {} as any);
    const afterSecond = schema._zod.parse(afterFirst, {} as any);
    expect(afterSecond.issues).toHaveLength(2);
    // Both issues should reference the same schema instance.
    expect(afterSecond.issues[0].inst).toBe(schema);
    expect(afterSecond.issues[1].inst).toBe(schema);
  });
});
