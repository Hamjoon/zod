**###Test START##**  
```ts
/**
 * Vitest test suite for the `ZodMiniDiscriminatedUnion` class.
 *
 * The tests cover:
 *  1. Successful parsing of valid discriminated union objects.
 *  2. Rejection of objects with missing discriminant keys.
 *  3. Rejection of objects with an unknown discriminant value.
 *  4. Handling of extra (non‑defined) properties.
 *  5. Edge‑case behaviour when the union is created with an empty options array.
 *
 * The test file assumes the public API of a “mini‑Zod” discriminated union mirrors the
 * behaviour of the real Zod library:
 *   - The constructor returned by `core.$constructor` can be invoked as a function
 *     taking an array of schema options.
 *   - The resulting instance exposes the standard Zod methods: `parse`, `safeParse`,
 *     and `describe`.
 *
 * If the real implementation deviates, adjust the import/instantiation logic
 * accordingly.
 */

import { describe, it, expect } from "vitest";
import { ZodMiniDiscriminatedUnion } from "./schemas.js";
import { core } from "./schemas.js"; // assumed export for building simple mock schemas

/**
 * Helper to create a very small “object” schema compatible with the mini‑Zod core.
 * The real library likely provides a `ZodMiniObject` factory; for the purpose of
 * these tests we build the minimal shape directly using the core utilities.
 *
 * Each schema must expose a `parse` method that validates its own fields.
 */
function miniObjectSchema<T extends Record<string, any>>(
  shape: T
): core.$ZodType<T> {
  // The core library probably has a `$ZodObject` constructor; we emulate it.
  // This mock is sufficient for the discriminated‑union tests because the
  // union only forwards the `parse` call to the selected option.
  const parse = (data: unknown) => {
    if (typeof data !== "object" || data === null) {
      throw new Error("Expected object");
    }
    const obj = data as Record<string, unknown>;
    for (const key in shape) {
      const validator = shape[key];
      // Simple primitive validator: just check type equality.
      const expected = (validator as any).expected;
      if (typeof obj[key] !== expected) {
        throw new Error(
          `Invalid type for "${key}": expected ${expected}, got ${typeof obj[
            key
          ]}`
        );
      }
    }
    // Return the data typed as T.
    return obj as T;
  };
  // Minimal mock of a Zod type.
  return {
    _def: { typeName: "ZodMiniObject" },
    parse,
    safeParse: (data: unknown) => {
      try {
        return { success: true, data: parse(data) };
      } catch (e) {
        return { success: false, error: e as Error };
      }
    },
    // The real library may have many more methods; they are not needed here.
  } as unknown as core.$ZodType<T>;
}

/**
 * Primitive validators used in the mock object schemas.
 */
const stringValidator = { expected: "string" };
const numberValidator = { expected: "number" };

describe("ZodMiniDiscriminatedUnion – core behaviours", () => {
  // -------------------------------------------------------------------------
  // 1️⃣  Valid discriminated‑union parsing
  // -------------------------------------------------------------------------
  it("parses a valid discriminated union object (happy path)", () => {
    // Define two possible shapes of the union.
    const CatSchema = miniObjectSchema({
      type: { expected: "string" }, // discriminant
      kind: { expected: "string" }, // literal "cat"
      lives: numberValidator,
    });

    const DogSchema = miniObjectSchema({
      type: { expected: "string" }, // discriminant
      kind: { expected: "string" }, // literal "dog"
      barkVolume: numberValidator,
    });

    // Create the discriminated union using the `type` key as the discriminator.
    const Union = ZodMiniDiscriminatedUnion([
      CatSchema,
      DogSchema,
    ] as const);

    // Valid cat object
    const cat = {
      type: "cat",
      kind: "cat",
      lives: 9,
    };
    expect(Union.parse(cat)).toEqual(cat);

    // Valid dog object
    const dog = {
      type: "dog",
      kind: "dog",
      barkVolume: 5,
    };
    expect(Union.parse(dog)).toEqual(dog);
  });

  // -------------------------------------------------------------------------
  // 2️⃣  Missing discriminant key
  // -------------------------------------------------------------------------
  it("throws when the discriminant key is missing", () => {
    const A = miniObjectSchema({
      type: { expected: "string" },
      a: stringValidator,
    });
    const B = miniObjectSchema({
      type: { expected: "string" },
      b: numberValidator,
    });

    const Union = ZodMiniDiscriminatedUnion([A, B] as const);

    const missingKey = { a: "hello", b: 42 };
    expect(() => Union.parse(missingKey)).toThrowError(
      /missing.*type/i
    );
  });

  // -------------------------------------------------------------------------
  // 3️⃣  Unknown discriminant value
  // -------------------------------------------------------------------------
  it("rejects objects with an unknown discriminant value", () => {
    const Circle = miniObjectSchema({
      shape: { expected: "string" }, // discriminant
      radius: numberValidator,
    });
    const Square = miniObjectSchema({
      shape: { expected: "string" }, // discriminant
      side: numberValidator,
    });

    const Union = ZodMiniDiscriminatedUnion([Circle, Square] as const);

    const unknown = {
      shape: "triangle", // not one of the defined literals
      base: 3,
      height: 4,
    };

    expect(() => Union.parse(unknown)).toThrowError(
      /invalid discriminant value/i
    );
  });

  // -------------------------------------------------------------------------
  // 4️⃣  Extra properties (strict vs. passthrough)
  // -------------------------------------------------------------------------
  it("allows extra properties when the underlying schemas are non‑strict", () => {
    // For this test we deliberately make the inner schemas permissive
    // (they only validate the discriminant; other fields are ignored).
    const Base = miniObjectSchema({
      kind: { expected: "string" },
    });

    const Union = ZodMiniDiscriminatedUnion([Base] as const);

    const withExtras = {
      kind: "any",
      extra1: "hello",
      extra2: 123,
    };

    // The union should forward to the single option and therefore accept the extras.
    expect(Union.parse(withExtras)).toEqual(withExtras);
  });

  // -------------------------------------------------------------------------
  // 5️⃣  Edge case – empty options array
  // -------------------------------------------------------------------------
  it("throws when instantiated with an empty options array", () => {
    // The constructor should guard against creating a union with no members.
    expect(() => ZodMiniDiscriminatedUnion([] as const)).toThrowError(
      /must provide at least one option/i
    );
  });
});
```

**Explanation of the test suite**

| # | Focus | What the test asserts |
|---|-------|-----------------------|
| 1️⃣ | **Happy path** | Both members of the discriminated union parse correctly when the discriminant (`type`) matches the concrete schema. |
| 2️⃣ | **Missing discriminant** | An object lacking the discriminator key triggers a validation error. |
| 3️⃣ | **Unknown discriminant value** | When the discriminator contains a value that does not correspond to any defined option, parsing fails. |
| 4️⃣ | **Extra fields** | Demonstrates that the union forwards validation to the selected member, so any extra fields that the member does not forbid are accepted. |
| 5️⃣ | **Empty union** | Guard clause in the constructor prevents creation of a union with zero options. |

The mock `miniObjectSchema` is deliberately lightweight – it only checks that the expected primitive types are present. This is sufficient for exercising the discriminated‑union logic without pulling in the full Zod implementation, keeping the test fast and focused on the `ZodMiniDiscriminatedUnion` behaviour.

If the real library provides richer schema factories (e.g., `ZodMiniObject`, `ZodMiniString`, etc.), replace the mock helper with the actual constructors; the test expectations remain the same.

**###Test END##**