import { test, expect, describe } from "vitest";
import * as util from "../../packages/zod/src/v4/core/util.js";

describe("utility functions", () => {
  test("getEnumValues extracts string values", () => {
    const enumObj = { A: "a", B: "b", 0: "zero", 1: "one" };
    const values = util.getEnumValues(enumObj);
    expect(values).toEqual(["a", "b"]);
  });

  test("joinValues concatenates primitives", () => {
    const result = util.joinValues([1, "two", true] as const, ",");
    expect(result).toBe('1,"two",true');
  });

  test("jsonStringifyReplacer handles bigint", () => {
    const obj = { big: 10n, normal: 5 };
    const str = JSON.stringify(obj, util.jsonStringifyReplacer);
    expect(str).toBe('{"big":"10","normal":5}');
  });

  test("cached computes value once", () => {
    let calls = 0;
    const cached = util.cached(() => {
      calls++;
      return 123;
    });
    expect(calls).toBe(0);
    expect(cached.value).toBe(123);
    expect(calls).toBe(1);
    // second access should not call getter again
    expect(cached.value).toBe(123);
    expect(calls).toBe(1);
  });

  test("nullish detects null/undefined", () => {
    expect(util.nullish(null)).toBe(true);
    expect(util.nullish(undefined)).toBe(true);
    expect(util.nullish(0)).toBe(false);
    expect(util.nullish("")).toBe(false);
  });

  test("cleanRegex strips anchors", () => {
    expect(util.cleanRegex("^abc$")).toBe("abc");
    expect(util.cleanRegex("^abc")).toBe("abc");
    expect(util.cleanRegex("abc$")).toBe("abc");
    expect(util.cleanRegex("abc")).toBe("abc");
  });

  test("floatSafeRemainder works with decimals", () => {
    // 5.5 % 0.1 = 0.0 (due to floating point)
    const rem = util.floatSafeRemainder(5.5, 0.1);
    expect(rem).toBeCloseTo(0);
    // 5.7 % 0.2 = 0.1
    const rem2 = util.floatSafeRemainder(5.7, 0.2);
    expect(rem2).toBeCloseTo(0.1);
  });

  test("defineLazy defines property lazily and allows overwrite", () => {
    const obj: any = {};
    let getterCalls = 0;
    util.defineLazy(obj, "lazy", () => {
      getterCalls++;
      return 42;
    });
    // not yet called
    expect(getterCalls).toBe(0);
    // first access triggers getter
    expect(obj.lazy).toBe(42);
    expect(getterCalls).toBe(1);
    // subsequent access uses stored value
    expect(obj.lazy).toBe(42);
    expect(getterCalls).toBe(1);
    // setter overwrites
    obj.lazy = 100;
    expect(obj.lazy).toBe(100);
  });

  test("assignProp creates enumerable writable property", () => {
    const target: any = {};
    util.assignProp(target, "foo", 123);
    expect(Object.prototype.propertyIsEnumerable.call(target, "foo")).toBe(true);
    expect(target.foo).toBe(123);
    target.foo = 456;
    expect(target.foo).toBe(456);
  });

  test("getElementAtPath navigates nested structures", () => {
    const data = { a: [{ b: 2 }] };
    expect(util.getElementAtPath(data, ["a", 0, "b"])).toBe(2);
    expect(util.getElementAtPath(data, null)).toBe(data);
    expect(util.getElementAtPath(data, undefined)).toBe(data);
  });

  test("promiseAllObject resolves all promises preserving keys", async () => {
    const input = {
      a: Promise.resolve(1),
      b: Promise.resolve("x"),
    };
    const result = await util.promiseAllObject(input);
    expect(result).toEqual({ a: 1, b: "x" });
  });

  test("randomString generates correct length and charset", () => {
    const str = util.randomString(15);
    expect(str).toHaveLength(15);
    expect(/^[a-z]+$/.test(str)).toBe(true);
  });

  test("esc returns JSON stringified version", () => {
    expect(util.esc('hello "world"')).toBe(JSON.stringify('hello "world"'));
  });

  test("isObject distinguishes objects", () => {
    expect(util.isObject({})).toBe(true);
    expect(util.isObject([])).toBe(false);
    expect(util.isObject(null)).toBe(false);
    expect(util.isObject(123)).toBe(false);
  });

  test("allowsEval is a boolean", () => {
    expect(typeof util.allowsEval.value).toBe("boolean");
  });

  test("isPlainObject correctly identifies plain objects", () => {
    expect(util.isPlainObject({})).toBe(true);
    class Foo {}
    expect(util.isPlainObject(new Foo())).toBe(false);
    expect(util.isPlainObject(Object.create(null))).toBe(true);
  });

  test("numKeys counts own enumerable properties", () => {
    const obj = Object.create({ inherited: 1 });
    obj.a = 1;
    obj.b = 2;
    expect(util.numKeys(obj)).toBe(2);
  });

  test("getParsedType identifies various types", () => {
    expect(util.getParsedType(undefined)).toBe("undefined");
    expect(util.getParsedType("s")).toBe("string");
    expect(util.getParsedType(5)).toBe("number");
    expect(util.getParsedType(NaN)).toBe("nan");
    expect(util.getParsedType(true)).toBe("boolean");
    expect(util.getParsedType(() => {})).toBe("function");
    expect(util.getParsedType(10n)).toBe("bigint");
    expect(util.getParsedType(Symbol("s"))).toBe("symbol");
    expect(util.getParsedType([1, 2])).toBe("array");
    expect(util.getParsedType({})).toBe("object");
    expect(util.getParsedType(Promise.resolve())).toBe("promise");
    expect(util.getParsedType(new Map())).toBe("map");
    expect(util.getParsedType(new Set())).toBe("set");
    expect(util.getParsedType(new Date())).toBe("date");
    // File may not exist in node; skip if undefined
    if (typeof File !== "undefined") {
      expect(util.getParsedType(new File([], "name"))).toBe("file");
    }
  });

  test("escapeRegex escapes special characters", () => {
    const raw = "a+b*?^$.[|]{}()\\";
    const escaped = util.escapeRegex(raw);
    expect(escaped).toBe("a\\+b\\*\\?\\^\\$\\.\\[\\|\\]\\{\\}\\(\\)\\\\");
  });

  test("createTransparentProxy forwards get/set/has/delete", () => {
    const source = { a: 1, b: 2 };
    const proxy = util.createTransparentProxy(() => source);
    expect(proxy.a).toBe(1);
    proxy.c = 3;
    expect(source.c).toBe(3);
    expect("b" in proxy).toBe(true);
    delete proxy.b;
    expect("b" in source).toBe(false);
  });

  test("stringifyPrimitive formats values", () => {
    expect(util.stringifyPrimitive(10n)).toBe("10n");
    expect(util.stringifyPrimitive("hi")).toBe('"hi"');
    expect(util.stringifyPrimitive(5)).toBe("5");
    expect(util.stringifyPrimitive(true)).toBe("true");
  });

  test("optionalKeys returns keys with optional optin/optout", () => {
    const shape: any = {
      a: { _zod: { optin: "optional", optout: "optional" } },
      b: { _zod: { optin: "required", optout: "required" } },
      c: { _zod: { optin: "optional", optout: "required" } },
    };
    const keys = util.optionalKeys(shape);
    expect(keys).toEqual(["a"]);
  });

  test("normalizeParams handles various inputs", () => {
    // string input
    const res1 = util.normalizeParams("msg");
    expect(res1).toEqual({ error: expect.any(Function) });
    expect(res1.error()).toBe("msg");

    // object with message
    const res2 = util.normalizeParams({ message: "oops" });
    expect(res2).toEqual({ error: expect.any(Function) });
    expect(res2.error()).toBe("oops");

    // object with error function
    const fn = () => "bad";
    const res3 = util.normalizeParams({ error: fn });
    expect(res3).toEqual({ error: fn });
  });
});
