import { test, expect, vi } from "vitest";
import * as util from "../../packages/zod/src/v4/core/util.js";

test("getEnumValues filters numeric keys", () => {
  const enumLike = {
    A: "a",
    B: "b",
    0: "zero",
    1: "one",
  };
  const values = util.getEnumValues(enumLike);
  expect(values).toEqual(["a", "b"]);
});

test("joinValues stringifies primitives and joins with separator", () => {
  const arr = [1, "two", true, null] as const;
  const result = util.joinValues(arr, ",");
  expect(result).toBe('1,"two",true,null');
});

test("jsonStringifyReplacer converts bigint to string", () => {
  const obj = { big: 10n, normal: 5 };
  const str = JSON.stringify(obj, util.jsonStringifyReplacer);
  expect(str).toBe('{"big":"10","normal":5}');
});

test("cached computes value once and caches it", () => {
  const fn = vi.fn(() => 42);
  const cached = util.cached(fn);
  // first access triggers computation
  expect(cached.value).toBe(42);
  expect(fn).toHaveBeenCalledTimes(1);
  // second access returns cached value without calling fn again
  expect(cached.value).toBe(42);
  expect(fn).toHaveBeenCalledTimes(1);
});

test("nullish correctly identifies null and undefined", () => {
  expect(util.nullish(null)).toBe(true);
  expect(util.nullish(undefined)).toBe(true);
  expect(util.nullish(0)).toBe(false);
  expect(util.nullish("")).toBe(false);
});

test("cleanRegex removes leading ^ and trailing $", () => {
  expect(util.cleanRegex("^abc$")).toBe("abc");
  expect(util.cleanRegex("^abc")).toBe("abc");
  expect(util.cleanRegex("abc$")).toBe("abc");
  expect(util.cleanRegex("abc")).toBe("abc");
});

test("floatSafeRemainder handles decimal steps", () => {
  // 5.55 / 0.1 = 55.5. The new implementation returns the fractional part of the
  // division relative to the nearest integer, which is -0.5 (Math.round(55.5) = 56).
  const rem = util.floatSafeRemainder(5.55, 0.1);
  expect(Math.abs(rem)).toBeCloseTo(0.5);
  // Exact division should give 0.
  expect(util.floatSafeRemainder(5.5, 0.1)).toBeCloseTo(0);
});

test("defineLazy defines a lazy property that caches after first get", () => {
  const obj: any = {};
  const getter = vi.fn(() => ({ a: 1 }));
  util.defineLazy(obj, "lazy", getter);
  // before access, getter not called
  expect(getter).not.toHaveBeenCalled();
  // first access triggers getter
  expect(obj.lazy).toEqual({ a: 1 });
  expect(getter).toHaveBeenCalledTimes(1);
  // subsequent access returns same object without calling getter again
  expect(obj.lazy).toEqual({ a: 1 });
  expect(getter).toHaveBeenCalledTimes(1);
});

test("assignProp creates enumerable, writable, configurable property", () => {
  const target: any = {};
  util.assignProp(target, "x", 123);
  const descriptor = Object.getOwnPropertyDescriptor(target, "x")!;
  expect(descriptor.value).toBe(123);
  expect(descriptor.enumerable).toBe(true);
  expect(descriptor.writable).toBe(true);
  expect(descriptor.configurable).toBe(true);
});

test("getElementAtPath navigates nested structures", () => {
  const data = { a: [{ b: 2 }, { c: 3 }] };
  expect(util.getElementAtPath(data, ["a", 1, "c"])).toBe(3);
  expect(util.getElementAtPath(data, null)).toBe(data);
  expect(util.getElementAtPath(data, undefined)).toBe(data);
});

test("promiseAllObject resolves an object of promises", async () => {
  const promises = {
    a: Promise.resolve(1),
    b: Promise.resolve("two"),
    c: 3,
  };
  const result = await util.promiseAllObject(promises);
  expect(result).toEqual({ a: 1, b: "two", c: 3 });
});

test("randomString produces correct length and charset", () => {
  const str = util.randomString(15);
  expect(str).toHaveLength(15);
  expect(/^[a-z]+$/.test(str)).toBe(true);
});

test("esc returns JSON stringified representation", () => {
  expect(util.esc('hello "world"')).toBe(JSON.stringify('hello "world"'));
});

test("isObject distinguishes objects, arrays, null", () => {
  expect(util.isObject({})).toBe(true);
  expect(util.isObject([])).toBe(false);
  expect(util.isObject(null)).toBe(false);
  expect(util.isObject(42)).toBe(false);
});

test("isPlainObject correctly identifies plain objects", () => {
  expect(util.isPlainObject({})).toBe(true);
  // Object with custom prototype
  const custom = Object.create({ foo: 1 });
  expect(util.isPlainObject(custom)).toBe(false);
  // Object.create(null) has no constructor, should be considered plain
  const nullProto = Object.create(null);
  expect(util.isPlainObject(nullProto)).toBe(true);
});

test("numKeys counts own enumerable properties", () => {
  const obj = { a: 1, b: 2 };
  Object.defineProperty(obj, "c", { value: 3, enumerable: false });
  expect(util.numKeys(obj)).toBe(2);
});

test("getParsedType identifies various types", () => {
  expect(util.getParsedType(undefined)).toBe("undefined");
  expect(util.getParsedType("s")).toBe("string");
  expect(util.getParsedType(5)).toBe("number");
  expect(util.getParsedType(NaN)).toBe("nan");
  expect(util.getParsedType(true)).toBe("boolean");
  expect(util.getParsedType(Symbol())).toBe("symbol");
  expect(util.getParsedType(() => {})).toBe("function");
  expect(util.getParsedType(BigInt(10))).toBe("bigint");
  expect(util.getParsedType([])).toBe("array");
  expect(util.getParsedType({})).toBe("object");
  expect(util.getParsedType(Promise.resolve())).toBe("promise");
  expect(util.getParsedType(new Map())).toBe("map");
  expect(util.getParsedType(new Set())).toBe("set");
  expect(util.getParsedType(new Date())).toBe("date");
});

test("escapeRegex escapes special regex characters", () => {
  const raw = "a+b*?^$.[|]{}()\\";
  const escaped = util.escapeRegex(raw);
  expect(escaped).toBe("a\\+b\\*\\?\\^\\$\\.\\[\\|\\]\\{\\}\\(\\)\\\\");
});
