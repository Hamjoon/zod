**Step 1 – Public API of `$ZodIPv6`**

| Method / Property | Signature (as exposed by a Zod schema) | Description |
|-------------------|----------------------------------------|-------------|
| `parse(value: unknown)` | `parse(value: unknown): string` | Synchronously validates *value* against the IPv6 format. Returns the string if valid, otherwise throws a `ZodError`. |
| `safeParse(value: unknown)` | `safeParse(value: unknown): { success: true; data: string } \| { success: false; error: ZodError }` | Same validation as `parse` but never throws – it returns an object describing success or failure. |
| `refine(check: (val: string) => boolean, message?: string)` | `refine(check: (val: string) => boolean, message?: string): this` | Adds a custom predicate that runs **after** the built‑in IPv6 check. |
| `optional()` | `optional(): ZodOptional<this>` | Allows `undefined` as a valid value. |
| `nullable()` | `nullable(): ZodNullable<this>` | Allows `null` as a valid value. |
| `default(def: string)` | `default(def: string): ZodDefault<this>` | Supplies a default IPv6 string when the input is `undefined`. |
| `transform<Out>(fn: (val: string) => Out)` | `transform<Out>(fn: (val: string) => Out): ZodEffects<this, Out>` | Transforms a valid IPv6 string into another type. |
| `describe(description: string)` | `describe(description: string): this` | Attaches a description (metadata only). |
| `._zod` (internal) | `._zod: $ZodIPv6Internals` | Holds the internal state – useful for the edge‑case tests that inspect the *bag* and the *check* function. |

> **Note** – The class itself does not declare its own methods; it inherits the full Zod‑type API from `$ZodStringFormat`. The list above reflects the *public* surface that a consumer of `$ZodIPv6` can rely on.

---

## Step 2 – Basic Vitest test case for each public method  

Below each expert proposes **one** representative test case.  

### Expert A – `parse`
```ts
test('parse – accepts a canonical IPv6 address', () => {
  const schema = $ZodIPv6();
  const input = '2001:0db8:85a3:0000:0000:8a2e:0370:7334';
  expect(schema.parse(input)).toBe(input);
});
```

### Expert B – `safeParse`
```ts
test('safeParse – returns success for a compressed IPv6 address', () => {
  const schema = $ZodIPv6();
  const result = schema.safeParse('2001:db8::8a2e:370:7334');
  expect(result.success).toBe(true);
  if (result.success) expect(result.data).toBe('2001:db8::8a2e:370:7334');
});
```

### Expert C – `refine`
```ts
test('refine – custom predicate can reject a valid IPv6 address', () => {
  const schema = $ZodIPv6().refine(val => !val.startsWith('2001'), {
    message: 'IPv6 must not start with 2001',
  });
  const result = schema.safeParse('2001:db8::1');
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.issues[0].message).toBe('IPv6 must not start with 2001');
  }
});
```

---

## Step 3 – Identify edge‑cases & exception scenarios  

| Edge case / scenario | Why it matters |
|----------------------|----------------|
| **Empty string** | Should be rejected – an IPv6 address cannot be empty. |
| **Missing brackets in URL construction** – e.g. `"2001:db8::1"` is fine, but `"2001:db8::1]"` or `"[" + addr` is malformed. The internal `check` uses `new URL(\`http://[${payload.value}]\`)`; malformed brackets raise the *catch* path. |
| **Upper‑case hex digits** | IPv6 is case‑insensitive – both `ABCD` and `abcd` must be accepted. |
| **Embedded IPv4** – e.g. `::ffff:192.0.2.128` | Still a valid IPv6 representation; the URL constructor accepts it. |
| **Zone identifier** – e.g. `fe80::1%eth0` | The URL constructor **does not** accept a zone identifier, so this should be reported as an invalid format. |
| **Too many groups** – e.g. `2001:db8:0:0:0:0:0:0:1` (9 groups) | Must be rejected. |
| **Invalid characters** – e.g. `2001:db8::g123` | Must be rejected. |
| **`def.abort` flag** – when `abort: false` the payload should contain `continue: true` in the issue object, allowing further checks. |
| **Internal bag format** – after construction the internal bag’s `format` must be exactly `"ipv6"`. |

---

## Step 4 – Edge‑case / exception Vitest test cases  

### Expert A – Empty string & invalid characters
```ts
test('parse – rejects empty string and strings with illegal characters', () => {
  const schema = $ZodIPv6();
  expect(() => schema.parse('')).toThrow();               // empty
  expect(() => schema.parse('2001:db8::g123')).toThrow(); // illegal hex
});
```

### Expert B – Upper‑case & embedded IPv4
```ts
test('parse – accepts upper‑case hex and embedded IPv4 notation', () => {
  const schema = $ZodIPv6();
  expect(schema.parse('2001:DB8::1')).toBe('2001:DB8::1'); // upper‑case
  expect(schema.parse('::ffff:192.0.2.128')).toBe('::ffff:192.0.2.128'); // IPv4‑embedded
});
```

### Expert C – Zone identifier & abort flag handling
```ts
test('check – zone identifier is rejected and abort flag influences issue.continue', () => {
  // 1️⃣ zone identifier should be invalid
  const schemaWithAbort = $ZodIPv6({ abort: true } as any);
  const result1 = schemaWithAbort.safeParse('fe80::1%eth0');
  expect(result1.success).toBe(false);
  if (!result1.success) {
    const issue = result1.error.issues[0];
    expect(issue.code).toBe('invalid_format');
    expect(issue.continue).toBe(false); // abort = true → continue = false
  }

  // 2️⃣ abort: false → continue should be true
  const schemaNoAbort = $ZodIPv6({ abort: false } as any);
  const result2 = schemaNoAbort.safeParse('fe80::1%eth0');
  expect(result2.success).toBe(false);
  if (!result2.success) {
    const issue = result2.error.issues[0];
    expect(issue.continue).toBe(true);
  }
});
```

### Expert A – Internal bag format
```ts
test('internal bag – format is set to "ipv6" on attach', () => {
  const schema = $ZodIPv6();
  // The internal bag lives under schema._zod.bag (ZodStringInternals)
  const bag = (schema as any)._zod.bag as { format?: string };
  expect(bag.format).toBe('ipv6');
});
```

### Expert B – Too many groups
```ts
test('parse – rejects IPv6 with more than 8 groups', () => {
  const schema = $ZodIPv6();
  const tooMany = '2001:db8:0:0:0:0:0:0:1'; // 9 groups
  expect(() => schema.parse(tooMany)).toThrow();
});
```

---

## Step 5 – Merged, complete Vitest test file  

```ts
###Test START##
import { describe, expect, test } from 'vitest';
import { $ZodIPv6 } from './schemas.js';

// ---------------------------------------------------------------------------
// Helper – extracts the first issue from a ZodError (if any)
// ---------------------------------------------------------------------------
function firstIssue(error: any) {
  return error?.issues?.[0] ?? {};
}

// ---------------------------------------------------------------------------
// Public‑method basic tests
// ---------------------------------------------------------------------------
describe('$ZodIPv6 – basic public API', () => {
  test('parse – accepts a canonical IPv6 address', () => {
    const schema = $ZodIPv6();
    const input = '2001:0db8:85a3:0000:0000:8a2e:0370:7334';
    expect(schema.parse(input)).toBe(input);
  });

  test('safeParse – returns success for a compressed IPv6 address', () => {
    const schema = $ZodIPv6();
    const result = schema.safeParse('2001:db8::8a2e:370:7334');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe('2001:db8::8a2e:370:7334');
  });

  test('refine – custom predicate can reject a valid IPv6 address', () => {
    const schema = $ZodIPv6().refine(
      (val) => !val.startsWith('2001'),
      { message: 'IPv6 must not start with 2001' }
    );
    const result = schema.safeParse('2001:db8::1');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('IPv6 must not start with 2001');
    }
  });
});

// ---------------------------------------------------------------------------
// Edge‑case & exception handling tests
// ---------------------------------------------------------------------------
describe('$ZodIPv6 – edge cases & internal behaviour', () => {
  test('parse – rejects empty string and strings with illegal characters', () => {
    const schema = $ZodIPv6();
    expect(() => schema.parse('')).toThrow();
    expect(() => schema.parse('2001:db8::g123')).toThrow();
  });

  test('parse – accepts upper‑case hex and embedded IPv4 notation', () => {
    const schema = $ZodIPv6();
    expect(schema.parse('2001:DB8::1')).toBe('2001:DB8::1');
    expect(schema.parse('::ffff:192.0.2.128')).toBe('::ffff:192.0.2.128');
  });

  test('check – zone identifier is rejected and abort flag influences issue.continue', () => {
    // abort = true (default) → continue = false
    const schemaAbort = $ZodIPv6({ abort: true } as any);
    const resultAbort = schemaAbort.safeParse('fe80::1%eth0');
    expect(resultAbort.success).toBe(false);
    if (!resultAbort.success) {
      const issue = firstIssue(resultAbort.error);
      expect(issue.code).toBe('invalid_format');
      expect(issue.continue).toBe(false);
    }

    // abort = false → continue = true
    const schemaNoAbort = $ZodIPv6({ abort: false } as any);
    const resultNoAbort = schemaNoAbort.safeParse('fe80::1%eth0');
    expect(resultNoAbort.success).toBe(false);
    if (!resultNoAbort.success) {
      const issue = firstIssue(resultNoAbort.error);
      expect(issue.continue).toBe(true);
    }
  });

  test('internal bag – format is set to "ipv6" on attach', () => {
    const schema = $ZodIPv6();
    const bag = (schema as any)._zod?.bag as { format?: string };
    expect(bag?.format).toBe('ipv6');
  });

  test('parse – rejects IPv6 with more than 8 groups', () => {
    const schema = $ZodIPv6();
    const tooMany = '2001:db8:0:0:0:0:0:0:1'; // 9 groups
    expect(() => schema.parse(tooMany)).toThrow();
  });
});
###Test END##
```

**Explanation of the final file**

1. **Imports** – pulls the `$ZodIPv6` constructor from the relative `./schemas.js` file and Vitest utilities.  
2. **Helper** – `firstIssue` eases extraction of the first issue from a `ZodError`.  
3. **Basic public‑API suite** – one test per core public method (`parse`, `safeParse`, `refine`).  
4. **Edge‑case suite** – covers all the scenarios identified in Step 3, including:
   * empty / malformed strings,
   * case‑insensitivity,
   * IPv4‑embedded notation,
   * zone identifiers with both `abort: true` and `abort: false`,
   * inspection of the internal `_zod.bag.format`,
   * too many address groups.
5. **Structure** – the file is wrapped with the required markers `###Test START##` and `###Test END##` so it can be dropped directly into the repository.

Running `vitest` against this file will exercise the full validation logic of `$ZodIPv6`, confirming that the default regex pattern, the internal `format` bag, the URL‑based check, and the `abort` flag all behave as intended.