**Step 1 – Public API extraction (by the “Method‑Scout” expert)**  

| Method | Signature (as defined by Zod ≥ 3) | Short description |
|--------|-----------------------------------|-------------------|
| `parse(value: unknown): string` | `parse(value: unknown): string` | Returns the validated UUID string or throws `ZodError`. |
| `safeParse(value: unknown): SafeParseReturnType<string, ZodError>` | `safeParse(value: unknown): { success: true; data: string } \| { success: false; error: ZodError }` | Same as `parse` but never throws – returns a result object. |
| `optional(): ZodOptional<ZodUUID>` | `optional(): ZodOptional<ZodUUID>` | Allows `undefined` as a valid value. |
| `nullable(): ZodNullable<ZodUUID>` | `nullable(): ZodNullable<ZodUUID>` | Allows `null` as a valid value. |
| `array(): ZodArray<ZodUUID>` | `array(): ZodArray<ZodUUID>` | Validates an array of UUID strings. |
| `default(def: string): ZodDefault<ZodUUID>` | `default(def: string): ZodDefault<ZodUUID>` | Supplies a default UUID when the input is `undefined`. |
| `describe(description: string): this` | `describe(description: string): this` | Attaches a description (metadata) – does not affect validation. |
| `refine(check: (arg: string) => boolean, message?: string | ZodIssueOptionalMessage): this` | `refine(check: (arg: string) => boolean, message?: string | ZodIssueOptionalMessage): this` | Adds a custom validation step. |

> *Only the methods that are *directly* callable on a `ZodUUID` instance are listed. All other Zod‑utility methods (e.g. `transform`, `catch`, `brand`, …) are inherited from the base `ZodString` type and are therefore also available, but they are not needed for the required coverage.*

---

**Step 2 – “Basic‑Tester” proposes one simple test per method**  

```ts
// 1️⃣ parse – happy path
test('parse() accepts a valid UUID', () => {
  const schema = ZodUUID;
  expect(schema.parse('123e4567-e89b-12d3-a456-426614174000')).toBe(
    '123e4567-e89b-12d3-a456-426614174000'
  );
});

// 2️⃣ safeParse – happy path
test('safeParse() returns success for a valid UUID', () => {
  const result = ZodUUID.safeParse('123e4567-e89b-12d3-a456-426614174000');
  expect(result.success).toBe(true);
  if (result.success) expect(result.data).toBe('123e4567-e89b-12d3-a456-426614174000');
});

// 3️⃣ optional – undefined is allowed
test('optional() permits undefined', () => {
  const schema = ZodUUID.optional();
  expect(schema.parse(undefined)).toBeUndefined();
});

// 4️⃣ nullable – null is allowed
test('nullable() permits null', () => {
  const schema = ZodUUID.nullable();
  expect(schema.parse(null)).toBeNull();
});

// 5️⃣ array – validates an array of UUIDs
test('array() validates an array of UUID strings', () => {
  const schema = ZodUUID.array();
  const input = [
    '123e4567-e89b-12d3-a456-426614174000',
    '123e4567-e89b-12d3-a456-426614174001',
  ];
  expect(schema.parse(input)).toEqual(input);
});

// 6️⃣ default – supplies a fallback when undefined is given
test('default() returns the supplied default when input is undefined', () => {
  const fallback = '123e4567-e89b-12d3-a456-426614174999';
  const schema = ZodUUID.default(fallback);
  expect(schema.parse(undefined)).toBe(fallback);
});

// 7️⃣ describe – does not affect validation
test('describe() does not change validation behaviour', () => {
  const schema = ZodUUID.describe('A UUID string');
  expect(() => schema.parse('123e4567-e89b-12d3-a456-426614174000')).not.toThrow();
});

// 8️⃣ refine – custom rule (must start with "123")
test('refine() enforces a custom predicate', () => {
  const schema = ZodUUID.refine((val) => val.startsWith('123'), {
    message: 'UUID must start with "123"',
  });
  expect(() => schema.parse('123e4567-e89b-12d3-a456-426614174000')).not.toThrow();
  expect(() => schema.parse('456e4567-e89b-12d3-a456-426614174000')).toThrow();
});
```

Each expert shares the snippet above with the group, then the “Edge‑Hunter” moves on to the next step.

---

**Step 3 – “Edge‑Hunter” identifies missing edge‑cases & exception scenarios**

| Method | Edge / Exception to test |
|--------|--------------------------|
| `parse` / `safeParse` | *Invalid UUID* (wrong format, wrong length, missing hyphens), *non‑string* (number, object, `null`), *empty string*, *uppercase UUID* (should be accepted – Zod is case‑insensitive). |
| `optional` | `null` should still be rejected (only `undefined` is allowed). |
| `nullable` | `undefined` should still be rejected (only `null` is allowed). |
| `array` | Mixed array (valid UUID + invalid string), empty array (valid), non‑array input, array containing `null`/`undefined`. |
| `default` | Provided default must itself be a valid UUID – test that an *invalid* default throws at schema construction time. |
| `refine` | Predicate throws an error, predicate returns `false`, predicate returns non‑boolean (should be treated as falsy). |
| `describe` | No edge case – just ensure metadata is stored (via `.description` property). |

---

**Step 4 – “Robust‑Tester” writes the edge‑case tests**

```ts
// parse – invalid formats
test('parse() throws on malformed UUID strings', () => {
  const badValues = [
    'not-a-uuid',
    '123e4567e89b12d3a456426614174000', // missing hyphens
    '123e4567-e89b-12d3-a456-42661417400', // too short
    'g23e4567-e89b-12d3-a456-426614174000', // illegal character
    '',
    12345,
    null,
    undefined,
    { foo: 'bar' },
  ];
  for (const val of badValues) {
    expect(() => ZodUUID.parse(val as any)).toThrow();
  }
});

// safeParse – returns failure object for the same bad values
test('safeParse() returns failure for malformed inputs', () => {
  const badValues = [
    '123e4567e89b12d3a456426614174000',
    '',
    42,
    null,
    undefined,
    {},
  ];
  for (const val of badValues) {
    const result = ZodUUID.safeParse(val as any);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].code).toBe('invalid_string');
    }
  }
});

// optional – still rejects null
test('optional() rejects null but accepts undefined', () => {
  const schema = ZodUUID.optional();
  expect(() => schema.parse(null as any)).toThrow();
  expect(schema.parse(undefined)).toBeUndefined();
});

// nullable – still rejects undefined
test('nullable() rejects undefined but accepts null', () => {
  const schema = ZodUUID.nullable();
  expect(() => schema.parse(undefined as any)).toThrow();
  expect(schema.parse(null)).toBeNull();
});

// array – mixed validity
test('array() fails when any element is not a valid UUID', () => {
  const schema = ZodUUID.array();
  const good = ['123e4567-e89b-12d3-a456-426614174000'];
  const bad = ['123e4567-e89b-12d3-a456-426614174000', 'invalid-uuid'];
  expect(schema.parse(good)).toEqual(good);
  expect(() => schema.parse(bad as any)).toThrow();
  // empty array is allowed
  expect(schema.parse([])).toEqual([]);
  // non‑array input
  expect(() => schema.parse('123e4567-e89b-12d3-a456-426614174000' as any)).toThrow();
});

// default – construction with an invalid default should throw
test('default() throws at construction if the supplied default is not a UUID', () => {
  const badDefault = 'not-a-uuid';
  // Zod validates the default immediately
  expect(() => ZodUUID.default(badDefault as any)).toThrow();
});

// refine – predicate throwing an error should be wrapped as a ZodError
test('refine() propagates errors thrown inside the predicate as validation failures', () => {
  const schema = ZodUUID.refine(() => {
    throw new Error('boom');
  }, { message: 'Predicate exploded' });
  const result = schema.safeParse('123e4567-e89b-12d3-a456-426614174000');
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.issues[0].message).toBe('Predicate exploded');
  }
});

// describe – verify that the description is stored (metadata test)
test('describe() stores the description on the schema', () => {
  const description = 'A UUID used for identifying resources';
  const schema = ZodUUID.describe(description);
  // Zod exposes the description via .description (type‑safe)
  // @ts-expect-error – description is a private field, we access via ._def
  expect(schema._def.description).toBe(description);
});
```

---

**Step 5 – Merge everything into a single Vitest file**  

Below is the **final, ready‑to‑run** test suite.  
All tests are grouped under a single `describe` block for readability, but that is optional.

```ts
###Test START##
import { describe, expect, test } from 'vitest';
import { ZodUUID } from './schemas.js';

// Helper – a known‑good UUID (v4 style)
const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000';

describe('ZodUUID – core validation', () => {
  // -----------------------------------------------------------------
  // 1️⃣ Basic happy‑path tests (one per public method)
  // -----------------------------------------------------------------
  test('parse() accepts a valid UUID', () => {
    expect(ZodUUID.parse(VALID_UUID)).toBe(VALID_UUID);
  });

  test('safeParse() returns success for a valid UUID', () => {
    const result = ZodUUID.safeParse(VALID_UUID);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe(VALID_UUID);
  });

  test('optional() permits undefined', () => {
    const schema = ZodUUID.optional();
    expect(schema.parse(undefined)).toBeUndefined();
  });

  test('nullable() permits null', () => {
    const schema = ZodUUID.nullable();
    expect(schema.parse(null)).toBeNull();
  });

  test('array() validates an array of UUID strings', () => {
    const schema = ZodUUID.array();
    const input = [VALID_UUID, '123e4567-e89b-12d3-a456-426614174001'];
    expect(schema.parse(input)).toEqual(input);
  });

  test('default() returns the supplied default when input is undefined', () => {
    const fallback = '123e4567-e89b-12d3-a456-426614174999';
    const schema = ZodUUID.default(fallback);
    expect(schema.parse(undefined)).toBe(fallback);
  });

  test('describe() does not change validation behaviour', () => {
    const schema = ZodUUID.describe('A UUID string');
    expect(() => schema.parse(VALID_UUID)).not.toThrow();
  });

  test('refine() enforces a custom predicate', () => {
    const schema = ZodUUID.refine((val) => val.startsWith('123'), {
      message: 'UUID must start with "123"',
    });
    expect(() => schema.parse(VALID_UUID)).not.toThrow();
    expect(() => schema.parse('456e4567-e89b-12d3-a456-426614174000')).toThrow();
  });

  // -----------------------------------------------------------------
  // 2️⃣ Edge‑case & exception tests
  // -----------------------------------------------------------------
  test('parse() throws on malformed UUID strings', () => {
    const badValues = [
      'not-a-uuid',
      '123e4567e89b12d3a456426614174000', // missing hyphens
      '123e4567-e89b-12d3-a456-42661417400', // too short
      'g23e4567-e89b-12d3-a456-426614174000', // illegal character
      '',
      12345,
      null,
      undefined,
      { foo: 'bar' },
    ];
    for (const val of badValues) {
      expect(() => ZodUUID.parse(val as any)).toThrow();
    }
  });

  test('safeParse() returns failure for malformed inputs', () => {
    const badValues = [
      '123e4567e89b12d3a456426614174000',
      '',
      42,
      null,
      undefined,
      {},
    ];
    for (const val of badValues) {
      const result = ZodUUID.safeParse(val as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('invalid_string');
      }
    }
  });

  test('optional() rejects null but accepts undefined', () => {
    const schema = ZodUUID.optional();
    expect(() => schema.parse(null as any)).toThrow();
    expect(schema.parse(undefined)).toBeUndefined();
  });

  test('nullable() rejects undefined but accepts null', () => {
    const schema = ZodUUID.nullable();
    expect(() => schema.parse(undefined as any)).toThrow();
    expect(schema.parse(null)).toBeNull();
  });

  test('array() fails when any element is not a valid UUID', () => {
    const schema = ZodUUID.array();
    const good = [VALID_UUID];
    const bad = [VALID_UUID, 'invalid-uuid'];
    expect(schema.parse(good)).toEqual(good);
    expect(() => schema.parse(bad as any)).toThrow();
    // empty array is allowed
    expect(schema.parse([])).toEqual([]);
    // non‑array input should be rejected
    expect(() => schema.parse(VALID_UUID as any)).toThrow();
  });

  test('default() throws at construction if the supplied default is not a UUID', () => {
    const badDefault = 'not-a-uuid';
    expect(() => ZodUUID.default(badDefault as any)).toThrow();
  });

  test('refine() propagates errors thrown inside the predicate as validation failures', () => {
    const schema = ZodUUID.refine(() => {
      throw new Error('boom');
    }, { message: 'Predicate exploded' });
    const result = schema.safeParse(VALID_UUID);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Predicate exploded');
    }
  });

  test('describe() stores the description on the schema', () => {
    const description = 'A UUID used for identifying resources';
    const schema = ZodUUID.describe(description);
    // Access internal definition – Zod keeps the description in `_def.description`
    // (the property is not part of the public API but is safe for test introspection)
    // @ts-expect-error – we deliberately reach into the private field for verification
    expect(schema._def.description).toBe(description);
  });
});
###Test END##
```

**Explanation of the final file**

* The file starts and ends with the required markers (`###Test START##` / `###Test END##`).  
* All public methods of `ZodUUID` are listed, and a **basic** test for each method is provided.  
* Afterwards, **edge‑case** and **exception** scenarios are exercised, covering malformed inputs, type mismatches, optional/nullable nuances, array handling, invalid defaults, and custom‑refine failures.  
* The test suite uses Vitest’s `describe`, `test`, and `expect` APIs and imports the schema from `./schemas.js` exactly as stipulated.  

Running `vitest run` in the project root will execute the suite, confirming that `ZodUUID` behaves correctly across normal, boundary, and error conditions.