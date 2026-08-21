import { test, expect, describe } from "vitest";
import * as schemas from "../../packages/zod/src/v4/classic/schemas.js";

describe("Zod core schema behaviours", () => {
  test("string schema with min length and trim", () => {
    const s = schemas.string().min(3).trim();
    expect(s.parse("  abc  ")).toBe("abc");
    const result = s.safeParse("ab");
    expect(result.success).toBe(false);
  });

  test("optional and nullable wrappers", () => {
    const opt = schemas.string().optional();
    expect(opt.isOptional()).toBe(true);
    expect(opt.parse(undefined)).toBeUndefined();

    const nul = schemas.string().nullable();
    expect(nul.isNullable()).toBe(true);
    expect(nul.parse(null)).toBeNull();
  });

  test("default and catch wrappers", () => {
    const def = schemas.string().default("fallback");
    expect(def.parse(undefined)).toBe("fallback");
    // catch should replace errors with the provided value
    const ct = schemas.string().catch("fallback");
    const bad = ct.safeParse(123 as any);
    expect(bad.success).toBe(true);
    expect(bad.data).toBe("fallback");
  });

  test("enum creation and extraction", () => {
    const colors = schemas.enum(["red", "green", "blue"]);
    expect(colors.parse("green")).toBe("green");
    const onlyRed = colors.extract(["red"]);
    expect(onlyRed.parse("red")).toBe("red");
    expect(onlyRed.safeParse("blue").success).toBe(false);
  });

  test("union of string and number", () => {
    const u = schemas.union([schemas.string(), schemas.number()]);
    expect(u.parse("hello")).toBe("hello");
    expect(u.parse(42)).toBe(42);
    expect(u.safeParse(true as any).success).toBe(false);
  });

  test("object schema with shape, partial and required", () => {
    const Obj = schemas.object({ a: schemas.string(), b: schemas.number() });
    const parsed = Obj.parse({ a: "x", b: 5 });
    expect(parsed).toEqual({ a: "x", b: 5 });

    const PartialObj = Obj.partial();
    const pResult = PartialObj.safeParse({});
    expect(pResult.success).toBe(true);
    expect(pResult.data).toEqual({});

    const RequiredObj = PartialObj.required();
    const rResult = RequiredObj.safeParse({});
    expect(rResult.success).toBe(false);
  });

  test("number schema with range checks and int", () => {
    const n = schemas.number().gt(0).lt(10).int();
    expect(n.parse(5)).toBe(5);
    expect(n.safeParse(0).success).toBe(false);
    expect(n.safeParse(10).success).toBe(false);
    expect(n.safeParse(5.5).success).toBe(false);
  });

  test("refine and superRefine custom validation", () => {
    const startsWithX = schemas.string().refine((v) => v.startsWith("x"), "must start with x");
    expect(startsWithX.safeParse("xyl").success).toBe(true);
    expect(startsWithX.safeParse("y").success).toBe(false);

    const superR = schemas.string().superRefine((val, ctx) => {
      if (val.length < 2) ctx.addIssue("too short");
    });
    const srResult = superR.safeParse("a");
    expect(srResult.success).toBe(false);
  });

  test("describe and meta handling", () => {
    const described = schemas.string().describe("my string");
    expect(described.description).toBe("my string");
    expect(described.meta()).toEqual({ description: "my string" });

    const withMeta = described.meta({ foo: "bar" });
    expect(withMeta.meta()).toEqual({ description: "my string", foo: "bar" });
  });

  test("pipe transformation from string to number", () => {
    const pipe = schemas
      .string()
      .transform((s) => s.length)
      .pipe(schemas.number().int());
    expect(pipe.parse("abcd")).toBe(4);
    expect(pipe.safeParse("").success).toBe(false);
  });

  test("custom check and instanceof helper", () => {
    const isString = schemas.custom((d) => typeof d === "string");
    expect(isString.parse("hi")).toBe("hi");
    expect(isString.safeParse(123 as any).success).toBe(false);

    const dateSchema = schemas.instanceof(Date);
    const now = new Date();
    expect(dateSchema.parse(now)).toBe(now);
    expect(dateSchema.safeParse("not a date" as any).success).toBe(false);
  });
});
