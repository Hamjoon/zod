**Step 1 – List all public methods (with signatures)**  

| Method | Signature | Description |
|--------|-----------|-------------|
| `parse` | `parse(payload: { value: any; issues: $ZodIssue[] }, _ctx: any): { value: any; issues: $ZodIssue[] }` | Validates the supplied `payload.value` as a JavaScript `Date`. If `def.coerce` is `true` it first tries to coerce the value (`string | number | Date`) into a `Date`. It pushes an issue when the value is not a valid `Date`. |

*No other public methods are defined directly on `$ZodDate`; all other helpers are inherited from `$ZodType` and are out of scope for this exercise.*

---

## Expert 1 – Basic test case for `parse`

```ts
// basic.test.ts (shared by Expert 1)
import { describe, it, expect } from "vitest";
import { $ZodDate } from "./schemas.js";

function payload(value: any) {
  return { value, issues: [] as any[] };
}

describe("$ZodDate – basic parse", () => {
  it("passes a valid Date instance unchanged", () => {
    const schema = new $ZodDate({ type: "date", coerce: false });
    const now = new Date();
    const result = schema._zod.parse(payload(now), {} as any);
    expect(result.issues).toHaveLength(0);
    expect(result.value).toBe(now);
  });
});
```

*Expert 1 shares the file and moves on to the next step.*

---

## Expert 2 – Edge‑case identification & extra basic tests  

**Potential edge cases / exception scenarios**

| Situation | Why it matters |
|-----------|----------------|
| `payload.value` is **`null`** or **`undefined`** | Not a `Date`; should generate an issue. |
| `payload.value` is a **string** while `coerce` is **`false`** | No coercion → issue. |
| `payload.value` is a **string** while `coerce` is **`true`** and the string is a **valid ISO date** | Should be coerced to a `Date` and pass. |
| `payload.value` is a **string** while `coerce` is **`true`** but the string is **invalid** | Coercion yields `Invalid Date` → issue. |
| `payload.value` is a **number** (timestamp) with `coerce:true` | Should be coerced to a `Date` and pass. |
| `payload.value` is a **`Date` whose internal time is `NaN`** (`new Date(NaN)`) | Treated as “Invalid Date” → issue. |
| Multiple calls – ensure **issues array is cumulative** (i.e., previous issues are not cleared). | Guarantees that the parser only *adds* issues. |

**Additional basic tests (one per edge case)**

```ts
// edge.basic.test.ts (shared by Expert 2)
import { describe, it, expect } from "vitest";
import { $ZodDate } from "./schemas.js";

function payload(value: any) {
  return { value, issues: [] as any[] };
}

describe("$ZodDate – edge‑case basics", () => {
  it("rejects null", () => {
    const schema = new $ZodDate({ type: "date", coerce: false });
    const result = schema._zod.parse(payload(null), {} as any);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].code).toBe("invalid_type");
  });

  it("rejects a string when coercion is disabled", () => {
    const schema = new $ZodDate({ type: "date", coerce: false });
    const result = schema._zod.parse(payload("2023-01-01"), {} as any);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].code).toBe("invalid_type");
  });

  it("coerces a valid ISO string when coercion is enabled", () => {
    const schema = new $ZodDate({ type: "date", coerce: true });
    const iso = "2023-01-01T00:00:00.000Z";
    const result = schema._zod.parse(payload(iso), {} as any);
    expect(result.issues).toHaveLength(0);
    expect(result.value).toBeInstanceOf(Date);
    expect(result.value.toISOString()).toBe(iso);
  });

  it("fails coercion for an invalid string", () => {
    const schema = new $ZodDate({ type: "date", coerce: true });
    const result = schema._zod.parse(payload("not-a-date"), {} as any);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].code).toBe("invalid_type");
    // When the original value is a string, `received` is not added.
    expect(result.issues[0].received).toBeUndefined();
  });

  it("coerces a numeric timestamp when coercion is enabled", () => {
    const schema = new $ZodDate({ type: "date", coerce: true });
    const ts = 1_640_995_200_000; // 2022‑01‑01T00:00:00.000Z
    const result = schema._zod.parse(payload(ts), {} as any);
    expect(result.issues).toHaveLength(0);
    expect(result.value).toBeInstanceOf(Date);
    expect(result.value.getTime()).toBe(ts);
  });

  it("rejects a Date with NaN time", () => {
    const schema = new $ZodDate({ type: "date", coerce: false });
    const bad = new Date(NaN);
    const result = schema._zod.parse(payload(bad), {} as any);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].code).toBe("invalid_type");
    expect(result.issues[0].received).toBe("Invalid Date");
  });

  it("adds issues without clearing previous ones", () => {
    const schema = new $ZodDate({ type: "date", coerce: false });
    const p = payload("foo");
    const first = schema._zod.parse(p, {} as any);
    const second = schema._zod.parse(first, {} as any);
    expect(second.issues).toHaveLength(2);
  });
});
```

*Expert 2 shares the edge‑case list and the extra tests, then proceeds.*

---

## Expert 3 – Consolidation & final test file  

Expert 3 reviews the contributions, confirms that all identified scenarios are covered, and merges everything into a single, ready‑to‑run Vitest file.

```ts
// $ZodDate.test.ts
###Test START##
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
###Test END##
```

**Explanation of the final file**

* The file starts and ends with the required markers (`###Test START##` / `###Test END##`).  
* All public behavior of `$ZodDate.parse` is exercised:
  * **Happy path** – valid `Date` objects (with and without coercion).  
  * **Straightforward failures** – `null`, `undefined`, non‑date primitives when coercion is off.  
  * **Coercion success** – ISO strings and numeric timestamps when `coerce: true`.  
  * **Coercion failure** – invalid strings / NaN timestamps.  
  * **Invalid `Date` objects** – `new Date(NaN)` produces the special `"Invalid Date"` handling.  
  * **Issue‑array accumulation** – ensures the parser only *adds* issues.  

* Each `it` block contains a single, focused assertion, making failures easy to locate.  
* The helper `payload` mirrors the shape expected by the internal parser (`{ value, issues }`).  

With this file in place, running `vitest` will fully validate the `$ZodDate` implementation against both typical usage and the identified edge‑case/exception scenarios.