**Step 1 – Public methods (extracted from the source)**  

| Method | Signature | Description (as inferred from the source) |
|--------|-----------|--------------------------------------------|
| `parse` | `parse(payload: { value: any; issues: any[] }, _ctx: any): { value: any; issues: any[] }` | Parses the supplied `payload.value`. If `def.coerce` is `true` it tries to coerce the value to a `Date`. It then validates that the result is a *real* `Date` (i.e. `instanceof Date` **and** not `NaN`). On success it returns the unchanged payload; on failure it pushes an issue object into `payload.issues` and returns the payload. |

> *Note*: `$ZodDate` is built with `core.$constructor`, therefore the only **public** method that is added directly by this class is `parse`. All other methods (e.g. `safeParse`, `refine`, …) are inherited from `$ZodType` and are not part of the code you supplied, so they are omitted from this test suite.

---

**Step 2 – Basic test cases for each method**

| Method | Basic test purpose |
|--------|--------------------|
| `parse` | Verify that a *valid* `Date` instance passes through unchanged and that no issues are added. |

---

**Step 3 – Edge‑case & exception analysis**

| Situation | Why it matters |
|-----------|----------------|
| `def.coerce === false` and the input is **not** a `Date` (string, number, `null`, `undefined`, object) | The parser must reject the value and push an issue. |
| `def.coerce === true` and the input is a **parsable** string or number | The parser should coerce the value to a `Date` and then succeed. |
| `def.coerce === true` and the input is an **unparsable** string (e.g. `"abc"`), `NaN`, or a `Date` that is *invalid* (`new Date("invalid")`) | Coercion yields an *Invalid Date*; the parser must treat it as a failure and push an issue. |
| Input is a **valid** `Date` object (both with and without coercion) | Should succeed – the coercion step is a no‑op. |
| Input is a **Date** that is *invalid* (`new Date(NaN)`) | Even though it is an instance of `Date`, `getTime()` is `NaN`; the parser must reject it. |
| Payload’s `issues` array is **already populated** before calling `parse` | The method must *append* new issues rather than replace the array. |
| The `payload` object is **mutated** (`payload.value` may be replaced when coercing) | Verify that the returned payload reflects the coerced value. |

---

**Step 4 – Comprehensive Vitest test file**

```typescript
###Test START##
import { describe, it, expect } from "vitest";
import { $ZodDate } from "./schemas.js";

/**
 * Helper to create a $ZodDate instance.
 * The constructor used by core.$constructor expects a definition object.
 */
function createSchema(coerce?: boolean) {
  // Minimal definition required by $ZodDate – type is always "date".
  return new $ZodDate({ type: "date", coerce });
}

/**
 * Helper to build a payload object that mimics the internal shape used by the parser.
 */
function makePayload(value: any) {
  return { value, issues: [] as any[] };
}

describe("$ZodDate.parse – basic behaviour", () => {
  it("accepts a valid Date instance (no coercion)", () => {
    const schema = createSchema(false);
    const now = new Date();
    const payload = makePayload(now);

    const result = schema._zod.parse(payload, undefined);
    expect(result).toBe(payload); // same reference
    expect(result.value).toBe(now); // unchanged
    expect(result.issues).toHaveLength(0);
  });

  it("accepts a valid Date instance (with coercion enabled)", () => {
    const schema = createSchema(true);
    const now = new Date();
    const payload = makePayload(now);

    const result = schema._zod.parse(payload, undefined);
    expect(result.value).toBe(now);
    expect(result.issues).toHaveLength(0);
  });
});

describe("$ZodDate.parse – coercion handling", () => {
  it("coerces a valid ISO string to Date when coerce = true", () => {
    const schema = createSchema(true);
    const iso = "2023-01-15T12:34:56.000Z";
    const payload = makePayload(iso);

    const result = schema._zod.parse(payload, undefined);
    expect(result.value).toBeInstanceOf(Date);
    expect((result.value as Date).toISOString()).toBe(iso);
    expect(result.issues).toHaveLength(0);
  });

  it("coerces a numeric timestamp to Date when coerce = true", () => {
    const schema = createSchema(true);
    const ts = 1_640_995_200_000; // corresponds to 2022‑01‑01T00:00:00.000Z
    const payload = makePayload(ts);

    const result = schema._zod.parse(payload, undefined);
    expect(result.value).toBeInstanceOf(Date);
    expect((result.value as Date).getTime()).toBe(ts);
    expect(result.issues).toHaveLength(0);
  });

  it("does NOT coerce when coerce = false – string stays string and fails", () => {
    const schema = createSchema(false);
    const iso = "2023-01-15T12:34:56.000Z";
    const payload = makePayload(iso);

    const result = schema._zod.parse(payload, undefined);
    // value must stay the original string
    expect(result.value).toBe(iso);
    // an issue should be added
    expect(result.issues).toHaveLength(1);
    const issue = result.issues[0];
    expect(issue).toMatchObject({
      expected: "date",
      code: "invalid_type",
      input: iso,
      inst: schema,
    });
  });
});

describe("$ZodDate.parse – invalid inputs", () => {
  const invalidInputs = [
    { desc: "plain object", val: { foo: "bar" } },
    { desc: "null", val: null },
    { desc: "undefined", val: undefined },
    { desc: "number (no coercion)", val: 12345 },
    { desc: "non‑date string", val: "not-a-date" },
    { desc: "Date with NaN time", val: new Date(NaN) },
  ];

  invalidInputs.forEach(({ desc, val }) => {
    it(`rejects ${desc} when coerce = false`, () => {
      const schema = createSchema(false);
      const payload = makePayload(val);
      const result = schema._zod.parse(payload, undefined);
      expect(result.issues).toHaveLength(1);
      const issue = result.issues[0];
      expect(issue.expected).toBe("date");
      expect(issue.code).toBe("invalid_type");
      expect(issue.input).toBe(val);
    });
  });

  it("rejects unparsable string even when coerce = true", () => {
    const schema = createSchema(true);
    const payload = makePayload("definitely-not-a-date");
    const result = schema._zod.parse(payload, undefined);
    expect(result.issues).toHaveLength(1);
    const issue = result.issues[0];
    expect(issue.expected).toBe("date");
    expect(issue.code).toBe("invalid_type");
    // because coercion produced an Invalid Date, `received` should be present
    expect(issue.received).toBe("Invalid Date");
  });

  it("rejects a Date that is invalid (NaN) even with coercion", () => {
    const schema = createSchema(true);
    const payload = makePayload(new Date(NaN));
    const result = schema._zod.parse(payload, undefined);
    expect(result.issues).toHaveLength(1);
    const issue = result.issues[0];
    expect(issue.expected).toBe("date");
    expect(issue.code).toBe("invalid_type");
    expect(issue.received).toBe("Invalid Date");
  });
});

describe("$ZodDate.parse – issues array handling", () => {
  it("appends new issues to an already‑filled issues array", () => {
    const schema = createSchema(false);
    const payload = makePayload("bad");
    // pre‑populate with a dummy issue
    payload.issues.push({ dummy: true } as any);

    const result = schema._zod.parse(payload, undefined);
    expect(result.issues).toHaveLength(2);
    // first issue is the dummy one we added
    expect(result.issues[0]).toMatchObject({ dummy: true });
    // second issue is the one generated by the parser
    expect(result.issues[1]).toMatchObject({
      expected: "date",
      code: "invalid_type",
      input: "bad",
    });
  });
});
###Test END##
```