import { test, expect, describe } from "vitest";
import * as schemas from "../../packages/zod/src/v4/mini/schemas.js";

describe("ZodMini schema constructors and core behaviours", () => {
  test("string schema has correct type and can add custom check", () => {
    const s = schemas.string();
    expect(s._zod.def.type).toBe("string");

    const sChecked = s.check((val) => val.length > 2);
    // original schema unchanged
    expect(s._zod.def.checks).toBeUndefined();
    // new schema has a check
    expect(Array.isArray(sChecked._zod.def.checks)).toBe(true);
    expect(sChecked._zod.def.checks?.length).toBe(1);
    // the stored check should be an object with a _zod.check function
    const stored = sChecked._zod.def.checks?.[0];
    expect(stored).toHaveProperty("_zod");
    expect(typeof (stored as any)._zod.check).toBe("function");
  });

  test("optional, nullable and nullish schemas compose correctly", () => {
    const str = schemas.string();
    const opt = schemas.optional(str);
    expect(opt._zod.def.type).toBe("optional");
    expect(opt._zod.def.innerType).toBe(str._zod);

    const nul = schemas.nullable(str);
    expect(nul._zod.def.type).toBe("nullable");
    expect(nul._zod.def.innerType).toBe(str._zod);

    const nullish = schemas.nullish(str);
    // nullish is optional(nullable(str))
    expect(nullish._zod.def.type).toBe("optional");
    const innerNullable = (nullish as any)._zod.def.innerType;
    expect(innerNullable.def.type).toBe("nullable");
    expect(innerNullable.def.innerType).toBe(str._zod);
  });

  test("default and prefault schemas store default values", () => {
    const str = schemas.string();
    const def = schemas._default(str, "hello");
    expect(def._zod.def.type).toBe("default");
    expect(def._zod.def.defaultValue).toBe("hello");

    const pref = schemas.prefault(str, () => "world");
    expect(pref._zod.def.type).toBe("prefault");
    expect(pref._zod.def.defaultValue).toBe("world");
  });

  test("enum and literal schemas capture values", () => {
    const en = schemas.enum(["a", "b"]);
    expect(en._zod.def.type).toBe("enum");
    expect(en._zod.def.entries).toEqual({ a: "a", b: "b" });

    const lit = schemas.literal("x");
    expect(lit._zod.def.type).toBe("literal");
    expect(lit._zod.def.values).toEqual(["x"]);
  });

  test("array and tuple schemas retain element definitions", () => {
    const str = schemas.string();
    const arr = schemas.array(str);
    expect(arr._zod.def.type).toBe("array");
    expect(arr._zod.def.element).toBe(str._zod);

    const tup = schemas.tuple([str, schemas.number()]);
    expect(tup._zod.def.type).toBe("tuple");
    expect(tup._zod.def.items?.length).toBe(2);
    expect(tup._zod.def.items?.[0]).toBe(str._zod);
  });

  test("object schema shape and keyof utility", () => {
    const obj = schemas.object({ a: schemas.string(), b: schemas.number() });
    expect(obj._zod.def.type).toBe("object");
    // shape is lazily defined; accessing triggers getter
    expect(obj.shape).toHaveProperty("a");
    expect(obj.shape).toHaveProperty("b");

    const keys = schemas.keyof(obj);
    expect(keys._zod.def.type).toBe("literal");
    // keys should contain both property names
    expect(keys._zod.def.values).toContain("a");
    expect(keys._zod.def.values).toContain("b");
  });

  test("union and discriminated union schemas", () => {
    const u = schemas.union([schemas.string(), schemas.number()]);
    expect(u._zod.def.type).toBe("union");
    expect(u._zod.def.options?.length).toBe(2);

    const disc = schemas.discriminatedUnion("type", [
      schemas.object({ type: schemas.literal("a"), val: schemas.string() }),
      schemas.object({ type: schemas.literal("b"), val: schemas.number() }),
    ]);
    expect(disc._zod.def.type).toBe("union");
    expect(disc._zod.def.discriminator).toBe("type");
    expect(disc._zod.def.options?.length).toBe(2);
  });

  test("pipe and transform schemas store functions", () => {
    const pipe = schemas.pipe(schemas.string(), schemas.boolean());
    expect(pipe._zod.def.type).toBe("pipe");
    expect(pipe._zod.def.in).toBe(schemas.string()._zod);
    expect(pipe._zod.def.out).toBe(schemas.boolean()._zod);

    const tr = schemas.transform((i: string) => Number(i));
    expect(tr._zod.def.type).toBe("transform");
    expect(typeof tr._zod.def.transform).toBe("function");
  });

  test("readonly and template literal schemas", () => {
    const ro = schemas.readonly(schemas.string());
    expect(ro._zod.def.type).toBe("readonly");
    expect(ro._zod.def.innerType).toBe(schemas.string()._zod);

    const tmpl = schemas.templateLiteral([{ type: "string", value: "foo" } as any]);
    expect(tmpl._zod.def.type).toBe("template_literal");
    expect(Array.isArray(tmpl._zod.def.parts)).toBe(true);
  });

  test("lazy and json schemas resolve correctly", () => {
    const lazy = schemas._lazy(() => schemas.string());
    expect(lazy._zod.def.type).toBe("lazy");
    const resolved = lazy._zod.def.getter();
    expect(resolved._zod.def.type).toBe("string");

    const json = schemas.json();
    expect(json._zod.def.type).toBe("lazy");
    const jsonResolved = json._zod.def.getter();
    expect(jsonResolved._zod.def.type).toBe("union");
    // union should contain string, number, boolean, null, array, record
    const optionTypes = jsonResolved._zod.def.options.map((o: any) => o.def.type);
    expect(optionTypes).toContain("string");
    expect(optionTypes).toContain("number");
    expect(optionTypes).toContain("boolean");
    expect(optionTypes).toContain("null");
    expect(optionTypes).toContain("array");
    expect(optionTypes).toContain("record");
  });
});
