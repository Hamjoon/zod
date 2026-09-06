# Phase 2 review: templates and one fully rendered prompt per technique

Rendered unit: `038-ZodNull` (`packages/zod/src/v4/classic/schemas.ts`, 7 LOC, 81 unit tokens). All 25 rendered prompts are under `llm/{unit_id}/{TECH}/prompt.md`; token counts in `results/prompt-tokens.json`; template hashes in `manifest.json`. Each block below is the exact file content.

## Template ZSL (`prompts/ZSL.txt`, sha256 b2abfe59ce6f743a...)

```text
As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named {class_name}. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
Here is the {class_name} class:
{source_code}
```

## Template FSL (`prompts/FSL.txt`, sha256 5843367bc2fba4a1...)

```text
Here is an example TypeScript class and its Vitest test file, to show the expected style:
Example class ({example_class_name}):
{example_source}
Example test file ({example_class_name}.test.ts):
{example_test_source}

As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named {class_name}. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
Here is the {class_name} class:
{source_code}
```

## Template COT (`prompts/COT.txt`, sha256 263271223d71a6b3...)

```text
As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named {class_name} by following these steps:
- Extract and list all the public methods including their signatures
- For each methods, generate a basic Vitest test case that checks the method's functionality
- Given the source code of the class and the listed methods, identify potential edge cases and exception handling scenarios that should be tested
- Generate Vitest test cases that specifically test for the identified edge cases and exceptions
- Merge all the individual test cases into a complete Vitest test file ({class_name}.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
Here is the {class_name} class:
{source_code}
```

## Template TOT (`prompts/TOT.txt`, sha256 01e1bd977ebfb4e5...)

```text
Imagine three different experts in software testing who are tasked with developing comprehensive Vitest test cases for the following TypeScript class. All experts will propose one test cases for each method, share it with the group, and then proceed to the next step. If any expert realizes they're wrong at any point, they leave.
The TypeScript class is:
{source_code}
At the end they must propose one complete (including typical use cases, edge cases, and error scenarios) Vitest test file ({class_name}.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
```

## Template GTOT (`prompts/GTOT.txt`, sha256 159d35a124ef05aa...)

```text
Imagine three different experts in software testing who are tasked with developing comprehensive Vitest test cases for the following TypeScript class.To comprehensively test all methods in the following class named {class_name} they must following these steps:
- Extract and list all the public methods including their signatures
- For each methods, generate a basic Vitest test case that checks the method's functionality
- Given the source code of the class and the listed methods, identify potential edge cases and exception handling scenarios that should be tested
- Generate Vitest test cases that specifically test for the identified edge cases and exceptions
- Merge all the individual test cases into a complete Vitest test file ({class_name}.test.ts) for the given TypeScript class.All experts will propose one test cases for each method, share it with the group, and then proceed to the next step. If any expert realizes they're wrong at any point, they leave.
The TypeScript class is:
{source_code}
At the end they must propose one complete (including typical use cases, edge cases, and error scenarios) Vitest test file ({class_name}.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
```

## Rendered COT for 038-ZodNull (`llm/038-ZodNull/COT/prompt.md`, 246 tokens)

```text
As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named ZodNull by following these steps:
- Extract and list all the public methods including their signatures
- For each methods, generate a basic Vitest test case that checks the method's functionality
- Given the source code of the class and the listed methods, identify potential edge cases and exception handling scenarios that should be tested
- Generate Vitest test cases that specifically test for the identified edge cases and exceptions
- Merge all the individual test cases into a complete Vitest test file (ZodNull.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
Here is the ZodNull class:
// ZodNull
export interface ZodNull extends _ZodType<core.$ZodNullInternals> {}

export const ZodNull: core.$constructor<ZodNull> = /*@__PURE__*/ core.$constructor("ZodNull", (inst, def) => {
  core.$ZodNull.init(inst, def);
  ZodType.init(inst, def);
});
```

## Rendered TOT for 038-ZodNull (`llm/038-ZodNull/TOT/prompt.md`, 207 tokens)

```text
Imagine three different experts in software testing who are tasked with developing comprehensive Vitest test cases for the following TypeScript class. All experts will propose one test cases for each method, share it with the group, and then proceed to the next step. If any expert realizes they're wrong at any point, they leave.
The TypeScript class is:
// ZodNull
export interface ZodNull extends _ZodType<core.$ZodNullInternals> {}

export const ZodNull: core.$constructor<ZodNull> = /*@__PURE__*/ core.$constructor("ZodNull", (inst, def) => {
  core.$ZodNull.init(inst, def);
  ZodType.init(inst, def);
});
At the end they must propose one complete (including typical use cases, edge cases, and error scenarios) Vitest test file (ZodNull.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
```

## Rendered GTOT for 038-ZodNull (`llm/038-ZodNull/GTOT/prompt.md`, 327 tokens)

```text
Imagine three different experts in software testing who are tasked with developing comprehensive Vitest test cases for the following TypeScript class.To comprehensively test all methods in the following class named ZodNull they must following these steps:
- Extract and list all the public methods including their signatures
- For each methods, generate a basic Vitest test case that checks the method's functionality
- Given the source code of the class and the listed methods, identify potential edge cases and exception handling scenarios that should be tested
- Generate Vitest test cases that specifically test for the identified edge cases and exceptions
- Merge all the individual test cases into a complete Vitest test file (ZodNull.test.ts) for the given TypeScript class.All experts will propose one test cases for each method, share it with the group, and then proceed to the next step. If any expert realizes they're wrong at any point, they leave.
The TypeScript class is:
// ZodNull
export interface ZodNull extends _ZodType<core.$ZodNullInternals> {}

export const ZodNull: core.$constructor<ZodNull> = /*@__PURE__*/ core.$constructor("ZodNull", (inst, def) => {
  core.$ZodNull.init(inst, def);
  ZodType.init(inst, def);
});
At the end they must propose one complete (including typical use cases, edge cases, and error scenarios) Vitest test file (ZodNull.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
```

## Rendered ZSL for 038-ZodNull (`llm/038-ZodNull/ZSL/prompt.md`, 140 tokens)

```text
As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named ZodNull. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
Here is the ZodNull class:
// ZodNull
export interface ZodNull extends _ZodType<core.$ZodNullInternals> {}

export const ZodNull: core.$constructor<ZodNull> = /*@__PURE__*/ core.$constructor("ZodNull", (inst, def) => {
  core.$ZodNull.init(inst, def);
  ZodType.init(inst, def);
});
```

## Rendered FSL for 038-ZodNull (`llm/038-ZodNull/FSL/prompt.md`, 2262 tokens)

```text
Here is an example TypeScript class and its Vitest test file, to show the expected style:
Example class ($ZodRegistry):
export class $ZodRegistry<Meta extends MetadataType = MetadataType, Schema extends $ZodType = $ZodType> {
  _meta!: Meta;
  _schema!: Schema;
  _map: Map<Schema, $replace<Meta, Schema>> = new Map();
  _idmap: Map<string, Schema> = new Map();

  add<S extends Schema>(
    schema: S,
    ..._meta: undefined extends Meta ? [$replace<Meta, S>?] : [$replace<Meta, S>]
  ): this {
    const meta: any = _meta[0];
    this._map.set(schema, meta!);
    if (meta && typeof meta === "object" && "id" in meta) {
      if (this._idmap.has(meta.id!)) {
        throw new Error(`ID ${meta.id} already exists in the registry`);
      }
      this._idmap.set(meta.id!, schema);
    }
    return this as any;
  }

  clear(): this {
    this._map = new Map();
    this._idmap = new Map();
    return this;
  }

  remove(schema: Schema): this {
    const meta: any = this._map.get(schema);
    if (meta && typeof meta === "object" && "id" in meta) {
      this._idmap.delete(meta.id!);
    }
    this._map.delete(schema);
    return this;
  }

  get<S extends Schema>(schema: S): $replace<Meta, S> | undefined {
    // return this._map.get(schema) as any;

    // inherit metadata
    const p = schema._zod.parent as Schema;
    if (p) {
      const pm: any = { ...(this.get(p) ?? {}) };
      delete pm.id; // do not inherit id
      return { ...pm, ...this._map.get(schema) } as any;
    }
    return this._map.get(schema) as any;
  }

  has(schema: Schema): boolean {
    return this._map.has(schema);
  }
}
Example test file ($ZodRegistry.test.ts):
import { expect, expectTypeOf, test } from "vitest";
import * as z from "zod/v4";

test("globalRegistry", () => {
  const reg = z.registry();

  const a = z.string();
  reg.add(a);
  expect(reg.has(a)).toEqual(true);

  reg.remove(a);
  expect(reg.has(a)).toEqual(false);

  a.register(z.globalRegistry, { field: "sup" });
  expect(z.globalRegistry.has(a)).toEqual(true);
  expect(z.globalRegistry.get(a)).toEqual({ field: "sup" });

  z.globalRegistry.remove(a);
  expect(z.globalRegistry.has(a)).toEqual(false);
});

test("z.registry", () => {
  const fieldRegistry = z.registry<{ name: string; description: string }>();

  const a = z.string();
  fieldRegistry.add(a, { name: "hello", description: "world" });
  const a_meta = fieldRegistry.get(a);
  expect(a_meta).toEqual({ name: "hello", description: "world" });

  fieldRegistry.remove(a);
  expect(fieldRegistry.has(a)).toEqual(false);
  expect(fieldRegistry.get(a)).toEqual(undefined);
});

test("z.registry no metadata", () => {
  const fieldRegistry = z.registry();

  const a = z.string();
  fieldRegistry.add(a);
  fieldRegistry.add(z.number());
  expect(fieldRegistry.get(a)).toEqual(undefined);
  expect(fieldRegistry.has(a)).toEqual(true);
});

test("z.registry with schema constraints", () => {
  const fieldRegistry = z.registry<{ name: string; description: string }, z.ZodString>();

  const a = z.string();
  fieldRegistry.add(a, { name: "hello", description: "world" });
  // @ts-expect-error
  fieldRegistry.add(z.number(), { name: "test" });
  // @ts-expect-error
  z.number().register(fieldRegistry, { name: "test", description: "test" });
});

// test("z.namedRegistry", () => {
//   const namedReg = z
//     .namedRegistry<{ name: string; description: string }>()
//     .add(z.string(), { name: "hello", description: "world" })
//     .add(z.number(), { name: "number", description: "number" });

//   expect(namedReg.get("hello")).toEqual({
//     name: "hello",
//     description: "world",
//   });
//   expect(namedReg.has("hello")).toEqual(true);
//   expect(namedReg.get("number")).toEqual({
//     name: "number",
//     description: "number",
//   });

//   // @ts-expect-error
//   namedReg.get("world");
//   // @ts-expect-error
//   expect(namedReg.get("world")).toEqual(undefined);

//   const hello = namedReg.get("hello");
//   expect(hello).toEqual({ name: "hello", description: "world" });
//   expectTypeOf<typeof hello>().toEqualTypeOf<{
//     name: "hello";
//     description: "world";
//   }>();
//   expectTypeOf<typeof namedReg.items>().toEqualTypeOf<{
//     hello: { name: "hello"; description: "world" };
//     number: { name: "number"; description: "number" };
//   }>();
// });

test("output type in registry meta", () => {
  const reg = z.registry<{ out: z.$output }>();
  const a = z.string();
  reg.add(a, { out: "asdf" });
  // @ts-expect-error
  reg.add(a, 1234);
  expectTypeOf(reg.get(a)).toEqualTypeOf<{ out: string } | undefined>();
});

test("output type in registry meta - objects and arrays", () => {
  const reg = z.registry<{ name: string; examples: z.$output[] }>();
  const a = z.string();
  reg.add(a, { name: "hello", examples: ["world"] });

  // @ts-expect-error
  reg.add(a, { name: "hello", examples: "world" });
  expectTypeOf(reg.get(a)).toEqualTypeOf<{ name: string; examples: string[] } | undefined>();
});

test("input type in registry meta", () => {
  const reg = z.registry<{ in: z.$input }>();
  const a = z.pipe(z.number(), z.transform(String));
  reg.add(a, { in: 1234 });
  // @ts-expect-error
  reg.add(a, "1234");
  expectTypeOf(reg.get(a)).toEqualTypeOf<{ in: number } | undefined>();
});

test("input type in registry meta - objects and arrays", () => {
  const reg = z.registry<{ name: string; examples: z.$input[] }>();
  const a = z.pipe(z.number(), z.transform(String));
  reg.add(a, { name: "hello", examples: [1234] });

  // @ts-expect-error
  reg.add(a, { name: "hello", examples: "world" });
  expectTypeOf(reg.get(a)).toEqualTypeOf<{ name: string; examples: number[] } | undefined>();
});

test(".meta method", () => {
  const a1 = z.string();
  const a2 = a1.meta({ name: "hello" });

  expect(a1.meta()).toEqual(undefined);
  expect(a2.meta()).toEqual({ name: "hello" });
  expect(a1 === a2).toEqual(false);
});

test(".meta metadata does not bubble up", () => {
  const a1 = z.string().meta({ name: "hello" });
  const a2 = a1.optional();

  expect(a1.meta()).toEqual({ name: "hello" });
  expect(a2.meta()).toEqual(undefined);
});

test(".describe", () => {
  const a1 = z.string();
  const a2 = a1.describe("Hello");

  expect(a1.description).toEqual(undefined);
  expect(a2.description).toEqual("Hello");
});

test("inherit across clone", () => {
  const A = z.string().meta({ a: true });
  expect(A.meta()).toEqual({ a: true });
  const B = A.meta({ b: true });
  expect(B.meta()).toEqual({ a: true, b: true });
  const C = B.describe("hello");
  expect(C.meta()).toEqual({ a: true, b: true, description: "hello" });
});

test("loose examples", () => {
  z.string().register(z.globalRegistry, {
    examples: ["example"],
  });
});

test("function meta witout replacement", () => {
  const myReg = z.registry<{
    defaulter: (arg: string, test: boolean) => number;
  }>();

  const mySchema = z.date();
  myReg.add(mySchema, {
    defaulter: (arg, _test) => {
      return arg.length;
    },
  });

  expect(myReg.get(mySchema)!.defaulter("hello", true)).toEqual(5);
});

test("function meta with replacement", () => {
  const myReg = z.registry<{
    defaulter: (arg: z.$input, test: boolean) => z.$output;
  }>();

  const mySchema = z.string().transform((val) => val.length);
  myReg.add(mySchema, {
    defaulter: (arg, _test) => {
      return arg.length;
    },
  });

  expect(myReg.get(mySchema)!.defaulter("hello", true)).toEqual(5);
});

test("test .clear()", () => {
  const reg = z.registry();
  const a = z.string();
  reg.add(a);
  expect(reg.has(a)).toEqual(true);
  reg.clear();
  expect(reg.has(a)).toEqual(false);
});


As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named ZodNull. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
Here is the ZodNull class:
// ZodNull
export interface ZodNull extends _ZodType<core.$ZodNullInternals> {}

export const ZodNull: core.$constructor<ZodNull> = /*@__PURE__*/ core.$constructor("ZodNull", (inst, def) => {
  core.$ZodNull.init(inst, def);
  ZodType.init(inst, def);
});
```

