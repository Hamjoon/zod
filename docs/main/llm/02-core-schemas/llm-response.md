```ts
import { test, expect, describe } from "vitest";
import * as schemas from "../../packages/zod/src/v4/core/schemas.js";

/**
 * Helper to run validation via the internal "~standard" API.
 * Returns the successful value or throws if issues are present.
 */
function validate(schema: any, value: unknown) {
  const result = schema["~standard"].validate(value);
  if ("issues" in result) {
    // For async results the validate may return a Promise
    if (result.issues instanceof Promise) {
      return result.issues.then(() => {
        throw new Error("unexpected async issues");
      });
    }
    throw new Error("validation failed");
  }
  return result.value;
}

/* -------------------------------------------------------------------------- */
/* Primitive schemas                                                            */
/* -------------------------------------------------------------------------- */

test("string schema validates strings and rejects non‑strings", () => {
  const s = new schemas.$ZodString({ type: "string", checks: [] });
  expect(validate(s, "hello")).toBe("hello");
  expect(() => validate(s, 123)).toThrow();
});

test("number schema coerces when enabled", () => {
  const n = new schemas.$ZodNumber({ type: "number", coerce: true, checks: [] });
  expect(validate(n, "42")).toBe(42);
});

test("boolean schema coerces when enabled", () => {
  const b = new schemas.$ZodBoolean({ type: "boolean", coerce: true, checks: [] });
  expect(validate(b, 0)).toBe(false);
  expect(validate(b, "true")).toBe(true);
});

/* -------------------------------------------------------------------------- */
/* Composite schemas                                                            */
/* -------------------------------------------------------------------------- */

test("array schema validates homogeneous arrays", () => {
  const elem = new schemas.$ZodNumber({ type: "number", checks: [] });
  const arr = new schemas.$ZodArray({ type: "array", element: elem });
  expect(validate(arr, [1, 2, 3])).toEqual([1, 2, 3]);
  expect(() => validate(arr, "not an array")).toThrow();
});

test("object schema validates required fields", () => {
  const obj = new schemas.$ZodObject({
    type: "object",
    shape: {
      name: new schemas.$ZodString({ type: "string", checks: [] }),
      age: new schemas.$ZodNumber({ type: "number", checks: [] }),
    },
  });
  expect(validate(obj, { name: "Bob", age: 30 })).toEqual({ name: "Bob", age: 30 });
  // missing required field triggers inner schema error (age undefined)
  expect(() => validate(obj, { name: "Bob" })).toThrow();
});

test("optional schema allows undefined", () => {
  const inner = new schemas.$ZodString({ type: "string", checks: [] });
  const opt = new schemas.$ZodOptional({ type: "optional", innerType: inner });
  expect(validate(opt, undefined)).toBe(undefined);
  expect(validate(opt, "hi")).toBe("hi");
});

test("nullable schema allows null", () => {
  const inner = new schemas.$ZodNumber({ type: "number", checks: [] });
  const nul = new schemas.$ZodNullable({ type: "nullable", innerType: inner });
  expect(validate(nul, null)).toBe(null);
  expect(validate(nul, 7)).toBe(7);
});

test("default schema supplies a default value", () => {
  const inner = new schemas.$ZodNumber({ type: "number", checks: [] });
  const def = new schemas.$ZodDefault({
    type: "default",
    innerType: inner,
    defaultValue: 5,
  });
  expect(validate(def, undefined)).toBe(5);
  expect(validate(def, 10)).toBe(10);
});

/* -------------------------------------------------------------------------- */
/* Union & discriminated union                                                 */
/* -------------------------------------------------------------------------- */

test("union schema picks first matching option", () => {
  const s1 = new schemas.$ZodString({ type: "string", checks: [] });
  const n1 = new schemas.$ZodNumber({ type: "number", checks: [] });
  const u = new schemas.$ZodUnion({
    type: "union",
    options: [s1, n1],
  });
  expect(validate(u, "abc")).toBe("abc");
  expect(validate(u, 123)).toBe(123);
  expect(() => validate(u, true)).toThrow();
});

test("discriminated union resolves based on literal discriminator", () => {
  const litA = new schemas.$ZodLiteral({ type: "literal", values: ["a"] });
  const litB = new schemas.$ZodLiteral({ type: "literal", values: ["b"] });

  const schemaA = new schemas.$ZodObject({
    type: "object",
    shape: {
      type: litA,
      value: new schemas.$ZodString({ type: "string", checks: [] }),
    },
  });

  const schemaB = new schemas.$ZodObject({
    type: "object",
    shape: {
      type: litB,
      count: new schemas.$ZodNumber({ type: "number", checks: [] }),
    },
  });

  const du = new schemas.$ZodDiscriminatedUnion({
    type: "union",
    options: [schemaA, schemaB],
    discriminator: "type",
  });

  expect(validate(du, { type: "a", value: "x" })).toEqual({ type: "a", value: "x" });
  expect(validate(du, { type: "b", count: 2 })).toEqual({ type: "b", count: 2 });
  expect(() => validate(du, { type: "c", value: "x" })).toThrow();
});

/* -------------------------------------------------------------------------- */
/* Enum, literal and template literal                                         */
/* -------------------------------------------------------------------------- */

test("enum schema validates defined members", () => {
  const MyEnum = { A: "a", B: "b" } as const;
  const e = new schemas.$ZodEnum({ type: "enum", entries: MyEnum });
  expect(validate(e, "a")).toBe("a");
  expect(() => validate(e, "c")).toThrow();
});

test("literal schema validates exact values", () => {
  const lit = new schemas.$ZodLiteral({ type: "literal", values: [42, "foo"] });
  expect(validate(lit, 42)).toBe(42);
  expect(validate(lit, "foo")).toBe("foo");
  expect(() => validate(lit, 43)).toThrow();
});

test("template literal schema validates concatenated strings", () => {
  const tmpl = new schemas.$ZodTemplateLiteral({
    type: "template_literal",
    parts: ["hello", "world"],
  });
  expect(validate(tmpl, "helloworld")).toBe("helloworld");
  expect(() => validate(tmpl, "hello")).toThrow();
});

/* -------------------------------------------------------------------------- */
/* Custom, transform, pipe and async schemas                                   */
/* -------------------------------------------------------------------------- */

test("custom schema runs user‑provided predicate", () => {
  const even = new schemas.$ZodCustom({
    type: "custom",
    fn: (x: unknown) => typeof x === "number" && x % 2 === 0,
    checks: [],
  });
  expect(validate(even, 4)).toBe(4);
  expect(() => validate(even, 5)).toThrow();
});

test("transform schema changes the output type", () => {
  const tr = new schemas.$ZodTransform({
    type: "transform",
    transform: (input) => String(input),
  });
  expect(validate(tr, 123)).toBe("123");
});

test("pipe schema runs left then right schema", () => {
  const left = new schemas.$ZodString({ type: "string", checks: [] });
  const right = new schemas.$ZodString({ type: "string", checks: [] });
  const pipe = new schemas.$ZodPipe({
    type: "pipe",
    in: left,
    out: right,
  });
  expect(validate(pipe, "test")).toBe("test");
  expect(() => validate(pipe, 123)).toThrow();
});

test("promise schema validates resolved values asynchronously", async () => {
  const inner = new schemas.$ZodNumber({ type: "number", checks: [] });
  const prom = new schemas.$ZodPromise({
    type: "promise",
    innerType: inner,
  });
  const result = await prom["~standard"].validate(Promise.resolve(7));
  expect(result).toEqual({ value: 7 });
});

/* -------------------------------------------------------------------------- */
/* Lazy schema (simple forward reference)                                      */
/* -------------------------------------------------------------------------- */

test("lazy schema resolves the inner schema on first use", () => {
  const lazy = new schemas.$ZodLazy({
    type: "lazy",
    getter: () =>
      new schemas.$ZodString({
        type: "string",
        checks: [],
      }),
  });
  expect(validate(lazy, "deferred")).toBe("deferred");
});
```