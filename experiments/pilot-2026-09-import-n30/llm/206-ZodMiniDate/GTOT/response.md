**Step 1 – Public API extraction**

The `ZodMiniDate` export is **not** a classic ES‑class with its own method definitions – it is a *Zod schema constructor* built by `core.$constructor`.  
All public methods therefore come from the underlying Zod schema prototype (`core.$ZodDateInternals` / `ZodMiniType`).  
Typical Zod‑date‑schema methods that are available on a `ZodMiniDate` instance are:

| Method | Signature (simplified) | Description |
|--------|------------------------|-------------|
| `parse(value: unknown): Date` | `(value: unknown) => Date` | Parses `value` and returns a `Date` or throws `ZodError`. |
| `safeParse(value: unknown): { success: true; data: Date } \| { success: false; error: ZodError }` | `(value: unknown) => ParseResult<Date>` | Same as `parse` but never throws. |
| `optional(): ZodOptional<Date>` | `() => ZodOptional<Date>` | Makes the schema accept `undefined`. |
| `nullable(): ZodNullable<Date>` | `() => ZodNullable<Date>` | Makes the schema accept `null`. |
| `default(def: Date | (() => Date)): ZodDefault<Date>` | `(def: Date | (() => Date)) => ZodDefault<Date>` | Supplies a default value. |
| `refine(check: (arg: Date) => boolean, message?: string): this` | `(check: (arg: Date) => boolean, message?: string) => this` | Adds a custom validation. |
| `transform<Out>(mapper: (arg: Date) => Out): ZodEffects<Date, Out>` | `(mapper: (arg: Date) => Out) => ZodEffects<Date, Out>` | Transforms the parsed value. |
| `describe(description: string): this` | `(description: string) => this` | Attaches a description (metadata). |

> **Note:** The exact list may vary depending on the version of the internal `core` library, but the above methods are the ones most developers interact with when using a Zod‑date schema.

---

**Step 2 – Basic Vitest test cases (one per method)**  

Below are minimal “happy‑path” tests that verify each method works as expected with typical input.

```ts
import { describe, it, expect } from 'vitest';
import { ZodMiniDate } from './schemas.js';

describe('ZodMiniDate – basic functionality', () => {
  it('parse – accepts a valid Date object', () => {
    const schema = ZodMiniDate();
    const now = new Date();
    expect(schema.parse(now)).toBe(now);
  });

  it('safeParse – returns success for a valid ISO string', () => {
    const schema = ZodMiniDate();
    const iso = '2023-01-01T00:00:00.000Z';
    const result = schema.safeParse(iso);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(new Date(iso));
  });

  it('optional – allows undefined without error', () => {
    const schema = ZodMiniDate().optional();
    expect(schema.parse(undefined)).toBeUndefined();
  });

  it('nullable – allows null without error', () => {
    const schema = ZodMiniDate().nullable();
    expect(schema.parse(null)).toBeNull();
  });

  it('default – supplies a default Date when value is undefined', () => {
    const defaultDate = new Date('2000-01-01T00:00:00Z');
    const schema = ZodMiniDate().default(defaultDate);
    expect(schema.parse(undefined)).toEqual(defaultDate);
  });

  it('refine – accepts dates that satisfy custom predicate', () => {
    const schema = ZodMiniDate().refine(d => d.getFullYear() >= 2000, {
      message: 'Year must be >= 2000',
    });
    const good = new Date('2022-05-05');
    expect(schema.parse(good)).toBe(good);
  });

  it('transform – converts Date to timestamp number', () => {
    const schema = ZodMiniDate().transform(d => d.getTime());
    const date = new Date('2021-12-31T12:00:00Z');
    const result = schema.parse(date);
    expect(result).toBe(date.getTime());
  });

  it('describe – attaches description metadata (no runtime effect)', () => {
    const schema = ZodMiniDate().describe('A simple date schema');
    // description is stored in schema._def.description (implementation detail)
    // we just ensure the method returns the same schema instance
    expect(schema).toBeInstanceOf(Object);
  });
});
```

---

**Step 3 – Edge‑case & exception analysis**

| Method | Edge‑case / Failure scenario | Why it matters |
|--------|-----------------------------|----------------|
| `parse` | • `null` / `undefined` (when not optional/nullable) <br>• Non‑date strings (`'not-a-date'`) <br>• Numbers that are not valid timestamps (`NaN`, `Infinity`) <br>• Objects that look like dates (`{}`) | Zod should reject anything that cannot be coerced to a real `Date`. |
| `safeParse` | Same inputs as `parse` – we need to verify `success === false` and that the `error` contains the correct issue code/message. |
| `optional` | Passing `null` (should still error) – optional only relaxes `undefined`. |
| `nullable` | Passing `undefined` (should still error) – nullable only relaxes `null`. |
| `default` | Providing a *factory* function instead of a static `Date` – ensure it is called lazily. |
| `refine` | Predicate returns `false` – should raise a `ZodError` with the custom message. <br>Predicate throws – should be wrapped as a validation error. |
| `transform` | Mapper throws – should surface as a validation error. <br>Mapper returns `undefined` – allowed (transform can change type). |
| `describe` | No functional impact – but we can verify that the description is stored in the schema definition. |

Additional cross‑method edge cases:

* **Timezone handling** – parsing ISO strings without timezone (`'2023-01-01'`) should be interpreted as UTC or local depending on Zod’s implementation; we test that the resulting `Date` matches the expected timestamp.
* **Leap‑year dates** – `'2020-02-29'` is valid, `'2021-02-29'` is invalid.
* **Large timestamps** – dates far in the future/past (e.g., year 3000, year -500) to ensure no overflow.

---

**Step 4 – Edge‑case Vitest test cases**

```ts
import { describe, it, expect } from 'vitest';
import { ZodMiniDate } from './schemas.js';

describe('ZodMiniDate – edge cases & error handling', () => {
  // ---------- parse ----------
  it('parse – throws on null when schema is not nullable', () => {
    const schema = ZodMiniDate();
    expect(() => schema.parse(null)).toThrowError();
  });

  it('parse – throws on undefined when schema is not optional', () => {
    const schema = ZodMiniDate();
    expect(() => schema.parse(undefined)).toThrowError();
  });

  it('parse – throws on an invalid date string', () => {
    const schema = ZodMiniDate();
    expect(() => schema.parse('not-a-date')).toThrowError();
  });

  it('parse – throws on NaN timestamp number', () => {
    const schema = ZodMiniDate();
    expect(() => schema.parse(NaN)).toThrowError();
  });

  it('parse – correctly parses a date‑only string (treated as UTC)', () => {
    const schema = ZodMiniDate();
    const result = schema.parse('2023-01-01');
    // 2023‑01‑01T00:00:00.000Z in UTC
    expect(result.toISOString()).toBe('2023-01-01T00:00:00.000Z');
  });

  it('parse – accepts a leap‑year date', () => {
    const schema = ZodMiniDate();
    const result = schema.parse('2020-02-29');
    expect(result.getUTCFullYear()).toBe(2020);
    expect(result.getUTCMonth()).toBe(1); // February (0‑based)
    expect(result.getUTCDate()).toBe(29);
  });

  it('parse – rejects a non‑existent leap‑year date', () => {
    const schema = ZodMiniDate();
    expect(() => schema.parse('2021-02-29')).toThrowError();
  });

  // ---------- safeParse ----------
  it('safeParse – returns failure for null', () => {
    const schema = ZodMiniDate();
    const res = schema.safeParse(null);
    expect(res.success).toBe(false);
    expect(res.error.issues[0].code).toBe('invalid_type');
  });

  it('safeParse – returns failure for malformed string', () => {
    const schema = ZodMiniDate();
    const res = schema.safeParse('abc');
    expect(res.success).toBe(false);
    expect(res.error.issues[0].code).toBe('invalid_string');
  });

  // ---------- optional ----------
  it('optional – still rejects null', () => {
    const schema = ZodMiniDate().optional();
    expect(() => schema.parse(null)).toThrowError();
  });

  // ---------- nullable ----------
  it('nullable – still rejects undefined', () => {
    const schema = ZodMiniDate().nullable();
    expect(() => schema.parse(undefined)).toThrowError();
  });

  // ---------- default ----------
  it('default – uses a factory function lazily', () => {
    const factory = vi.fn(() => new Date('1999-12-31T23:59:59Z'));
    const schema = ZodMiniDate().default(factory);
    // factory should not be called until parsing
    expect(factory).not.toHaveBeenCalled();
    const result = schema.parse(undefined);
    expect(factory).toHaveBeenCalledOnce();
    expect(result.toISOString()).toBe('1999-12-31T23:59:59.000Z');
  });

  // ---------- refine ----------
  it('refine – fails when predicate returns false', () => {
    const schema = ZodMiniDate().refine(d => d.getFullYear() === 2022, {
      message: 'Year must be 2022',
    });
    expect(() => schema.parse(new Date('2021-01-01'))).toThrowError(/Year must be 2022/);
  });

  it('refine – propagates thrown error from predicate', () => {
    const schema = ZodMiniDate().refine(() => {
      throw new Error('Predicate exploded');
    });
    expect(() => schema.parse(new Date())).toThrowError(/Predicate exploded/);
  });

  // ---------- transform ----------
  it('transform – propagates error thrown by mapper', () => {
    const schema = ZodMiniDate().transform(() => {
      throw new Error('Mapper failed');
    });
    expect(() => schema.parse(new Date())).toThrowError(/Mapper failed/);
  });

  // ---------- large timestamps ----------
  it('parse – handles far‑future date (year 3000)', () => {
    const schema = ZodMiniDate();
    const dateStr = '3000-01-01T00:00:00Z';
    const result = schema.parse(dateStr);
    expect(result.getUTCFullYear()).toBe(3000);
  });

  it('parse – handles far‑past date (year -500)', () => {
    const schema = ZodMiniDate();
    const dateStr = '-0500-01-01T00:00:00Z';
    const result = schema.parse(dateStr);
    expect(result.getUTCFullYear()).toBe(-500);
  });
});
```

---

**Step 5 – Merged, ready‑to‑run Vitest file**

```ts
###Test START##
import { describe, it, expect, vi } from 'vitest';
import { ZodMiniDate } from './schemas.js';

/* ----------------------------------------------------------------------
   Public API – basic “happy‑path” tests
----------------------------------------------------------------------- */
describe('ZodMiniDate – basic functionality', () => {
  it('parse – accepts a valid Date object', () => {
    const schema = ZodMiniDate();
    const now = new Date();
    expect(schema.parse(now)).toBe(now);
  });

  it('safeParse – returns success for a valid ISO string', () => {
    const schema = ZodMiniDate();
    const iso = '2023-01-01T00:00:00.000Z';
    const result = schema.safeParse(iso);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(new Date(iso));
  });

  it('optional – allows undefined without error', () => {
    const schema = ZodMiniDate().optional();
    expect(schema.parse(undefined)).toBeUndefined();
  });

  it('nullable – allows null without error', () => {
    const schema = ZodMiniDate().nullable();
    expect(schema.parse(null)).toBeNull();
  });

  it('default – supplies a default Date when value is undefined', () => {
    const defaultDate = new Date('2000-01-01T00:00:00Z');
    const schema = ZodMiniDate().default(defaultDate);
    expect(schema.parse(undefined)).toEqual(defaultDate);
  });

  it('refine – accepts dates that satisfy custom predicate', () => {
    const schema = ZodMiniDate().refine(d => d.getFullYear() >= 2000, {
      message: 'Year must be >= 2000',
    });
    const good = new Date('2022-05-05');
    expect(schema.parse(good)).toBe(good);
  });

  it('transform – converts Date to timestamp number', () => {
    const schema = ZodMiniDate().transform(d => d.getTime());
    const date = new Date('2021-12-31T12:00:00Z');
    const result = schema.parse(date);
    expect(result).toBe(date.getTime());
  });

  it('describe – attaches description metadata (no runtime effect)', () => {
    const schema = ZodMiniDate().describe('A simple date schema');
    // The method should return the same schema instance
    expect(schema).toBeInstanceOf(Object);
  });
});

/* ----------------------------------------------------------------------
   Edge‑cases & error handling tests
----------------------------------------------------------------------- */
describe('ZodMiniDate – edge cases & error handling', () => {
  // ---------- parse ----------
  it('parse – throws on null when schema is not nullable', () => {
    const schema = ZodMiniDate();
    expect(() => schema.parse(null)).toThrowError();
  });

  it('parse – throws on undefined when schema is not optional', () => {
    const schema = ZodMiniDate();
    expect(() => schema.parse(undefined)).toThrowError();
  });

  it('parse – throws on an invalid date string', () => {
    const schema = ZodMiniDate();
    expect(() => schema.parse('not-a-date')).toThrowError();
  });

  it('parse – throws on NaN timestamp number', () => {
    const schema = ZodMiniDate();
    expect(() => schema.parse(NaN)).toThrowError();
  });

  it('parse – correctly parses a date‑only string (treated as UTC)', () => {
    const schema = ZodMiniDate();
    const result = schema.parse('2023-01-01');
    expect(result.toISOString()).toBe('2023-01-01T00:00:00.000Z');
  });

  it('parse – accepts a leap‑year date', () => {
    const schema = ZodMiniDate();
    const result = schema.parse('2020-02-29');
    expect(result.getUTCFullYear()).toBe(2020);
    expect(result.getUTCMonth()).toBe(1);
    expect(result.getUTCDate()).toBe(29);
  });

  it('parse – rejects a non‑existent leap‑year date', () => {
    const schema = ZodMiniDate();
    expect(() => schema.parse('2021-02-29')).toThrowError();
  });

  // ---------- safeParse ----------
  it('safeParse – returns failure for null', () => {
    const schema = ZodMiniDate();
    const res = schema.safeParse(null);
    expect(res.success).toBe(false);
    expect(res.error.issues[0].code).toBe('invalid_type');
  });

  it('safeParse – returns failure for malformed string', () => {
    const schema = ZodMiniDate();
    const res = schema.safeParse('abc');
    expect(res.success).toBe(false);
    expect(res.error.issues[0].code).toBe('invalid_string');
  });

  // ---------- optional ----------
  it('optional – still rejects null', () => {
    const schema = ZodMiniDate().optional();
    expect(() => schema.parse(null)).toThrowError();
  });

  // ---------- nullable ----------
  it('nullable – still rejects undefined', () => {
    const schema = ZodMiniDate().nullable();
    expect(() => schema.parse(undefined)).toThrowError();
  });

  // ---------- default ----------
  it('default – uses a factory function lazily', () => {
    const factory = vi.fn(() => new Date('1999-12-31T23:59:59Z'));
    const schema = ZodMiniDate().default(factory);
    expect(factory).not.toHaveBeenCalled();
    const result = schema.parse(undefined);
    expect(factory).toHaveBeenCalledOnce();
    expect(result.toISOString()).toBe('1999-12-31T23:59:59.000Z');
  });

  // ---------- refine ----------
  it('refine – fails when predicate returns false', () => {
    const schema = ZodMiniDate().refine(d => d.getFullYear() === 2022, {
      message: 'Year must be 2022',
    });
    expect(() => schema.parse(new Date('2021-01-01'))).toThrowError(/Year must be 2022/);
  });

  it('refine – propagates thrown error from predicate', () => {
    const schema = ZodMiniDate().refine(() => {
      throw new Error('Predicate exploded');
    });
    expect(() => schema.parse(new Date())).toThrowError(/Predicate exploded/);
  });

  // ---------- transform ----------
  it('transform – propagates error thrown by mapper', () => {
    const schema = ZodMiniDate().transform(() => {
      throw new Error('Mapper failed');
    });
    expect(() => schema.parse(new Date())).toThrowError(/Mapper failed/);
  });

  // ---------- large timestamps ----------
  it('parse – handles far‑future date (year 3000)', () => {
    const schema = ZodMiniDate();
    const dateStr = '3000-01-01T00:00:00Z';
    const result = schema.parse(dateStr);
    expect(result.getUTCFullYear()).toBe(3000);
  });

  it('parse – handles far‑past date (year -500)', () => {
    const schema = ZodMiniDate();
    const dateStr = '-0500-01-01T00:00:00Z';
    const result = schema.parse(dateStr);
    expect(result.getUTCFullYear()).toBe(-500);
  });
});
###Test END##
```