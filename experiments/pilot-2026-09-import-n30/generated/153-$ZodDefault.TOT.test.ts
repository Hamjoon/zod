import { describe, it, expect, vi } from "vitest";
import { $ZodDefault } from "./schemas.js";

/**
 * Helper to create a minimal mock of an inner Zod type.
 *
 * @param result   – value that the inner type should return from its `run` method.
 * @param opts     – configuration for the mock.
 * @returns        – a mock object that mimics the shape required by `$ZodDefault`.
 */
function mockInnerType<T>(
  result: T,
  opts?: {
    async?: boolean;          // make `run` return a Promise
    throw?: boolean;          // make `run` throw an error
  }
) {
  const run = vi.fn((payload: any, _ctx: any) => {
    if (opts?.throw) throw new Error("inner type error");
    return opts?.async ? Promise.resolve(result) : result;
  });

  return {
    _zod: {
      run,
      // `values` is accessed lazily by `$ZodDefault`; an empty object is enough for the tests.
      values: {},
    },
  } as any;
}

/**
 * Small wrapper to instantiate `$ZodDefault` with a given definition.
 *
 * The real `$ZodDefault` constructor is produced by `core.$constructor`.  In the
 * library it is used as `new $ZodDefault(def)`.  The same pattern works here.
 */
function createDefaultSchema<T>(def: {
  type: "default";
  innerType: any;
  defaultValue: T;
}) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore – the constructor signature is not exported in the typings we have.
  return new ($ZodDefault as any)(def);
}

/* -------------------------------------------------------------------------- */
/*                               TEST SUITE                                   */
/* -------------------------------------------------------------------------- */

describe("$ZodDefault – parse behaviour", () => {
  it("returns the default value when payload.value is undefined (sync)", () => {
    const inner = mockInnerType("should‑not‑be‑called");
    const schema = createDefaultSchema({
      type: "default",
      innerType: inner,
      defaultValue: 42,
    });

    const payload = { value: undefined };
    const result = schema._zod.parse(payload, {});

    // The payload should be mutated to contain the default.
    expect(result).toBe(payload);
    expect(payload.value).toBe(42);
    // Inner type must not have been invoked.
    expect(inner._zod.run).not.toHaveBeenCalled();
  });

  it("uses a getter for defaultValue", () => {
    const inner = mockInnerType("ignored");
    const def: any = { type: "default", innerType: inner };
    Object.defineProperty(def, "defaultValue", {
      get: () => 99,
      configurable: true,
    });

    const schema = createDefaultSchema(def);

    const payload = { value: undefined };
    const result = schema._zod.parse(payload, {});

    expect(result).toBe(payload);
    expect(payload.value).toBe(99);
    expect(inner._zod.run).not.toHaveBeenCalled();
  });

  it("delegates to inner type when payload.value is defined (sync)", () => {
    const inner = mockInnerType({ transformed: true });
    const schema = createDefaultSchema({
      type: "default",
      innerType: inner,
      defaultValue: "unused",
    });

    const payload = { value: "present" };
    const result = schema._zod.parse(payload, {});

    // The result should be whatever the inner type returned.
    expect(result).toEqual({ transformed: true });
    expect(inner._zod.run).toHaveBeenCalledOnce();
    expect(inner._zod.run).toHaveBeenCalledWith(payload, {});
  });

  it("handles async inner type (Promise) and resolves to the transformed value", async () => {
    const inner = mockInnerType({ async: true }, { async: true });
    const schema = createDefaultSchema({
      type: "default",
      innerType: inner,
      defaultValue: "unused",
    });

    const payload = { value: "present" };
    const maybePromise = schema._zod.parse(payload, {});

    // The parser must return a Promise because the inner run is async.
    expect(maybePromise).toBeInstanceOf(Promise);
    const result = await maybePromise;
    expect(result).toEqual({ async: true });
    expect(inner._zod.run).toHaveBeenCalledOnce();
  });

  it("propagates errors thrown by the inner type", () => {
    const inner = mockInnerType(null, { throw: true });
    const schema = createDefaultSchema({
      type: "default",
      innerType: inner,
      defaultValue: "unused",
    });

    const payload = { value: "present" };
    expect(() => schema._zod.parse(payload, {})).toThrow(
      "inner type error"
    );
  });

  it("propagates async errors from the inner type", async () => {
    const inner = mockInnerType(null, {
      async: true,
      throw: true,
    });
    const schema = createDefaultSchema({
      type: "default",
      innerType: inner,
      defaultValue: "unused",
    });

    const payload = { value: "present" };
    const maybePromise = schema._zod.parse(payload, {});
    await expect(maybePromise).rejects.toThrow("inner type error");
  });
});
