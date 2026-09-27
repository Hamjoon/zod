import { describe, it, expect } from "vitest";

/**
 * The library under test exports a small “mini‑Zod” API.
 * We import the intersection constructor together with a few basic schema
 * factories that are needed for the test scenarios.
 *
 * Adjust the import list if the actual library uses different names.
 */
import {
  ZodMiniIntersection,
  ZodObject,
  ZodString,
  ZodNumber,
  ZodLiteral,
  ZodEnum,
  ZodUnion,
  ZodError,
} from "./schemas.js";

/**
 * Helper to create a Zod object schema in a concise way.
 */
function obj(shape: Record<string, any>) {
  return ZodObject(shape);
}

/**
 * -------------------------------------------------------------------------
 * 1️⃣  Typical use‑case – intersecting two *object* schemas.
 * -------------------------------------------------------------------------
 *
 *   - Both schemas have disjoint keys → the resulting schema requires **all**
 *     keys.
 *   - Valid data must satisfy **both** parts.
 */
describe("ZodMiniIntersection – basic object intersection", () => {
  const A = obj({ a: ZodString() });
  const B = obj({ b: ZodNumber() });

  // The intersection is created via the exported constructor.
  const Intersection = ZodMiniIntersection.create(A, B);

  it("parses data that satisfies both schemas", () => {
    const result = Intersection.parse({ a: "hello", b: 42 });
    expect(result).toEqual({ a: "hello", b: 42 });
  });

  it("fails when a required key from the first schema is missing", () => {
    expect(() => Intersection.parse({ b: 10 })).toThrowError(ZodError);
  });

  it("fails when a required key from the second schema is missing", () => {
    expect(() => Intersection.parse({ a: "test" })).toThrowError(ZodError);
  });

  it("fails when a key has the wrong type for either side", () => {
    // a should be string, b should be number
    expect(() => Intersection.parse({ a: 123, b: 10 })).toThrowError(ZodError);
    expect(() => Intersection.parse({ a: "ok", b: "nope" })).toThrowError(ZodError);
  });
});

/**
 * -------------------------------------------------------------------------
 * 2️⃣  Edge‑case – overlapping keys with **compatible** types.
 * -------------------------------------------------------------------------
 *
 *   - Both schemas define the same key (`id`) with the *same* type.
 *   - The intersection should keep that key and still require it.
 */
describe("ZodMiniIntersection – overlapping compatible keys", () => {
  const A = obj({ id: ZodNumber(), name: ZodString() });
  const B = obj({ id: ZodNumber(), age: ZodNumber() });

  const Intersection = ZodMiniIntersection.create(A, B);

  it("accepts data where the overlapping key matches the shared type", () => {
    const data = { id: 1, name: "Alice", age: 30 };
    expect(Intersection.parse(data)).toEqual(data);
  });

  it("rejects data where the overlapping key has an incompatible type", () => {
    // id must be a number, not a string
    expect(() => Intersection.parse({ id: "1", name: "Bob", age: 20 })).toThrowError(
      ZodError
    );
  });
});

/**
 * -------------------------------------------------------------------------
 * 3️⃣  Edge‑case – overlapping keys with **incompatible** types.
 * -------------------------------------------------------------------------
 *
 *   - `id` is a string in one schema and a number in the other.
 *   - The intersection should be **unsatisfiable**; parsing any value must
 *     raise an error.
 */
describe("ZodMiniIntersection – overlapping incompatible keys", () => {
  const A = obj({ id: ZodString() });
  const B = obj({ id: ZodNumber() });

  const Intersection = ZodMiniIntersection.create(A, B);

  it("always fails because the same key cannot satisfy both types", () => {
    const attempts = [
      { id: "123" },
      { id: 123 },
      { id: null },
      {},
    ];
    attempts.forEach((payload) => {
      expect(() => Intersection.parse(payload)).toThrowError(ZodError);
    });
  });
});

/**
 * -------------------------------------------------------------------------
 * 4️⃣  Typical use‑case – intersecting **literal** and **enum** schemas.
 * -------------------------------------------------------------------------
 *
 *   - Demonstrates that the intersection works with non‑object schemas.
 *   - The resulting schema should accept only the value that satisfies *both*
 *     constraints (i.e., the literal that is also a member of the enum).
 */
describe("ZodMiniIntersection – literal & enum intersection", () => {
  const Literal = ZodLiteral("RED");
  const Enum = ZodEnum(["RED", "GREEN", "BLUE"]);

  const Intersection = ZodMiniIntersection.create(Literal, Enum);

  it("accepts the literal that is also part of the enum", () => {
    expect(Intersection.parse("RED")).toBe("RED");
  });

  it("rejects a literal not present in the enum", () => {
    expect(() => Intersection.parse("YELLOW")).toThrowError(ZodError);
  });

  it("rejects any other type (e.g., number)", () => {
    expect(() => Intersection.parse(42)).toThrowError(ZodError);
  });
});

/**
 * -------------------------------------------------------------------------
 * 5️⃣  Edge‑case – intersecting a schema with a **union** that contains it.
 * -------------------------------------------------------------------------
 *
 *   - `A` is a string schema.
 *   - `B` is a union of string and number.
 *   - The intersection should resolve to the more specific `A` (i.e., string).
 */
describe("ZodMiniIntersection – schema intersected with a containing union", () => {
  const A = ZodString();
  const B = ZodUnion([ZodString(), ZodNumber()]);

  const Intersection = ZodMiniIntersection.create(A, B);

  it("accepts strings (the common part)", () => {
    expect(Intersection.parse("hello")).toBe("hello");
  });

  it("rejects numbers because they are not part of the first schema", () => {
    expect(() => Intersection.parse(123)).toThrowError(ZodError);
  });
});

/**
 * -------------------------------------------------------------------------
 * 6️⃣  Error‑scenario – passing **non‑schema** arguments to the constructor.
 * -------------------------------------------------------------------------
 *
 *   - The constructor should throw a clear error when the supplied arguments
 *     are not Zod schemas.
 */
describe("ZodMiniIntersection – constructor validation", () => {
  it("throws when the first argument is not a schema", () => {
    // @ts-expect-error – intentionally passing a wrong type
    expect(() => ZodMiniIntersection.create(123 as any, ZodString())).toThrowError(
      TypeError
    );
  });

  it("throws when the second argument is not a schema", () => {
    // @ts-expect-error – intentionally passing a wrong type
    expect(() => ZodMiniIntersection.create(ZodString(), {} as any)).toThrowError(
      TypeError
    );
  });
});

/**
 * -------------------------------------------------------------------------
 * 7️⃣  Type‑inference sanity check (compile‑time only, no runtime effect).
 * -------------------------------------------------------------------------
 *
 *   - Using TypeScript’s `expectType` from `tsd` is not possible inside a Vitest
 *     file, but we can still write a comment that the following line should
 *     compile without errors, ensuring the intersection preserves the merged
 *     shape.
 *
 *   ```ts
 *   // The inferred type should be { a: string; b: number }
 *   const _: { a: string; b: number } = Intersection.parse({ a: "x", b: 1 });
 *   ```
 *
 *   This comment serves as documentation for developers reading the test.
 */
