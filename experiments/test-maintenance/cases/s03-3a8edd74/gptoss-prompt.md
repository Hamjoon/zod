You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v3/tests/refine.test.ts, packages/zod/src/v4/classic/tests/json-schema.test.ts, packages/zod/src/v4/classic/tests/to-json-schema.test.ts, packages/zod/src/v3/types.ts, packages/zod/src/v4/core/to-json-schema.ts, play.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v3/types.ts b/packages/zod/src/v3/types.ts
index 1df681cb..2b3efe02 100644
--- a/packages/zod/src/v3/types.ts
+++ b/packages/zod/src/v3/types.ts
@@ -4074,7 +4074,7 @@ function createZodEnum(values: [string, ...string[]], params?: RawCreateParams)
 }
 
 export class ZodEnum<T extends [string, ...string[]]> extends ZodType<T[number], ZodEnumDef<T>, T[number]> {
-  _cache: Set<T[number]> | undefined;
+  #cache: Set<T[number]> | undefined;
 
   _parse(input: ParseInput): ParseReturnType<this["_output"]> {
     if (typeof input.data !== "string") {
@@ -4088,11 +4088,11 @@ export class ZodEnum<T extends [string, ...string[]]> extends ZodType<T[number],
       return INVALID;
     }
 
-    if (!this._cache) {
-      this._cache = new Set(this._def.values);
+    if (!this.#cache) {
+      this.#cache = new Set(this._def.values);
     }
 
-    if (!this._cache.has(input.data)) {
+    if (!this.#cache.has(input.data)) {
       const ctx = this._getOrReturnCtx(input);
       const expectedValues = this._def.values;
 
@@ -4172,7 +4172,7 @@ export interface ZodNativeEnumDef<T extends EnumLike = EnumLike> extends ZodType
 export type EnumLike = { [k: string]: string | number; [nu: number]: string };
 
 export class ZodNativeEnum<T extends EnumLike> extends ZodType<T[keyof T], ZodNativeEnumDef<T>, T[keyof T]> {
-  _cache: Set<T[keyof T]> | undefined;
+  #cache: Set<T[keyof T]> | undefined;
   _parse(input: ParseInput): ParseReturnType<T[keyof T]> {
     const nativeEnumValues = util.getValidEnumValues(this._def.values);
 
@@ -4187,11 +4187,11 @@ export class ZodNativeEnum<T extends EnumLike> extends ZodType<T[keyof T], ZodNa
       return INVALID;
     }
 
-    if (!this._cache) {
-      this._cache = new Set(util.getValidEnumValues(this._def.values));
+    if (!this.#cache) {
+      this.#cache = new Set(util.getValidEnumValues(this._def.values));
     }
 
-    if (!this._cache.has(input.data)) {
+    if (!this.#cache.has(input.data)) {
       const expectedValues = util.objectValues(nativeEnumValues);
 
       addIssueToContext(ctx, {
@@ -4411,7 +4411,7 @@ export class ZodEffects<T extends ZodTypeAny, Output = output<T>, Input = input<
           parent: ctx,
         });
 
-        if (!isValid(base)) return INVALID;
+        if (!isValid(base)) return base;
 
         const result = effect.transform(base.value, checkCtx);
         if (result instanceof Promise) {
@@ -4423,7 +4423,7 @@ export class ZodEffects<T extends ZodTypeAny, Output = output<T>, Input = input<
         return { status: status.value, value: result };
       } else {
         return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
-          if (!isValid(base)) return INVALID;
+          if (!isValid(base)) return base;
 
           return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
             status: status.value,
diff --git a/packages/zod/src/v4/core/to-json-schema.ts b/packages/zod/src/v4/core/to-json-schema.ts
index 641c7943..06eeb793 100644
--- a/packages/zod/src/v4/core/to-json-schema.ts
+++ b/packages/zod/src/v4/core/to-json-schema.ts
@@ -499,7 +499,7 @@ export class JSONSchemaGenerator {
           break;
         }
         case "pipe": {
-          const innerType = this.io === "input" ? (def.in._zod.def.type === "transform" ? def.out : def.in) : def.out;
+          const innerType = this.io === "input" ? def.in : def.out;
           this.process(innerType, params);
           result.ref = innerType;
           break;
diff --git a/play.ts b/play.ts
index 23bdd10a..41eb006b 100644
--- a/play.ts
+++ b/play.ts
@@ -1,21 +1,3 @@
-import { z } from "zod/v3";
+import { z } from "zod/v4";
 
-// import * as z from "zod";
-
-const parseResult = z
-  .string()
-  .refine((x) => false) // force anything/everything to fail
-  .transform((x) => {
-    console.log("I don't get called"); // correct
-    return x.length;
-  })
-  .refine((x) => {
-    console.log("I shouldn't get called!!!!!!");
-    console.log(typeof x); // number
-    console.log(x);
-  })
-  .safeParse("123");
-
-console.log(`succeeded:  ${parseResult.success}`); // false (correct behavior)
-
-// z.string().min(1234, { abort: true });
+z;

</recent_change_diff>

Current test results:
<test_output>
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v2.1.9 <worktree>/s03-3a8edd74/packages/zod

 ❯ src/v3/tests/refine.test.ts (14 tests | 1 failed) 8ms
   × superRefine after skipped transform 4ms
     → Called without transform
 ❯ src/v4/classic/tests/to-json-schema.test.ts (42 tests | 1 failed) 35ms
   × use output type for preprocess 1ms
     → Transforms cannot be represented in JSON Schema
 ✓  TS  src/v4/classic/tests/to-json-schema.test.ts (42 tests)
 ✓  TS  src/v3/tests/refine.test.ts (14 tests)

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/v3/tests/refine.test.ts > superRefine after skipped transform
Error: Called without transform
 ❯ Object.refinement src/v3/tests/refine.test.ts:306:15
    304|     .superRefine((val) => {
    305|       if (typeof val !== "number") {
    306|         throw new Error("Called without transform");
       |               ^
    307|       }
    308|     });
 ❯ executeRefinement src/v3/types.ts:4372:31
 ❯ ZodEffects._parse src/v3/types.ts:4392:9
 ❯ ZodEffects._parseSync src/v3/types.ts:211:25
 ❯ ZodEffects.safeParse src/v3/types.ts:242:25
 ❯ src/v3/tests/refine.test.ts:310:25

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/v4/classic/tests/to-json-schema.test.ts > use output type for preprocess
Error: Transforms cannot be represented in JSON Schema
 ❯ JSONSchemaGenerator.process src/v4/core/to-json-schema.ts:441:19
    439|         case "transform": {
    440|           if (this.unrepresentable === "throw") {
    441|             throw new Error("Transforms cannot be represented in JSON …
       |                   ^
    442|           }
    443|           break;
 ❯ JSONSchemaGenerator.process src/v4/core/to-json-schema.ts:503:16
 ❯ Module.toJSONSchema src/v4/core/to-json-schema.ts:801:7
 ❯ src/v4/classic/tests/to-json-schema.test.ts:1950:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯

 Test Files  2 failed | 2 passed (4)
      Tests  2 failed | 110 passed (112)
Type Errors  no errors
   Start at  15:51:09
   Duration  6.42s (transform 229ms, setup 0ms, collect 346ms, tests 43ms, environment 0ms, prepare 100ms, typecheck 6.29s)


</test_output>

Relevant test snippet:
<test_snippet path="packages/zod/src/v3/tests/refine.test.ts" lines="273-338">
  const Strings = z
    .string()
    .superRefine((val, ctx) => {
      if (val === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "foo",
          fatal: true,
        });
      }
    })
    .superRefine((val, ctx) => {
      if (val !== " ") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "bar",
        });
      }
    });

  const result = Strings.safeParse("");

  expect(result.success).toEqual(false);
  if (!result.success) expect(result.error.issues.length).toEqual(1);
});

test("superRefine after skipped transform", () => {
  const schema = z
    .string()
    .regex(/^\d+$/)
    .transform((val) => Number(val))
    .superRefine((val) => {
      if (typeof val !== "number") {
        throw new Error("Called without transform");
      }
    });

  const result = schema.safeParse("");

  expect(result.success).toEqual(false);
});
</test_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v3/types.ts" lines="4052-4120">

export type FilterEnum<Values, ToExclude> = Values extends []
  ? []
  : Values extends [infer Head, ...infer Rest]
    ? Head extends ToExclude
      ? FilterEnum<Rest, ToExclude>
      : [Head, ...FilterEnum<Rest, ToExclude>]
    : never;

export type typecast<A, T> = A extends T ? A : never;

function createZodEnum<U extends string, T extends Readonly<[U, ...U[]]>>(
  values: T,
  params?: RawCreateParams
): ZodEnum<Writeable<T>>;
function createZodEnum<U extends string, T extends [U, ...U[]]>(values: T, params?: RawCreateParams): ZodEnum<T>;
function createZodEnum(values: [string, ...string[]], params?: RawCreateParams) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params),
  });
}

export class ZodEnum<T extends [string, ...string[]]> extends ZodType<T[number], ZodEnumDef<T>, T[number]> {
  #cache: Set<T[number]> | undefined;

  _parse(input: ParseInput): ParseReturnType<this["_output"]> {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues) as "string",
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type,
      });
      return INVALID;
    }

    if (!this.#cache) {
      this.#cache = new Set(this._def.values);
    }

    if (!this.#cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;

      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues,
      });
      return INVALID;
    }
    return OK(input.data);
  }

  get options() {
    return this._def.values;
  }

  get enum(): Values<T> {
    const enumValues: any = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues as any;
  }

</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v3/types.ts" lines="4150-4219">
  ): ZodEnum<typecast<Writeable<FilterEnum<T, ToExclude[number]>>, [string, ...string[]]>> {
    return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)) as FilterEnum<T, ToExclude[number]>, {
      ...this._def,
      ...newDef,
    }) as any;
  }

  static create = createZodEnum;
}

/////////////////////////////////////////////
/////////////////////////////////////////////
//////////                         //////////
//////////      ZodNativeEnum      //////////
//////////                         //////////
/////////////////////////////////////////////
/////////////////////////////////////////////
export interface ZodNativeEnumDef<T extends EnumLike = EnumLike> extends ZodTypeDef {
  values: T;
  typeName: ZodFirstPartyTypeKind.ZodNativeEnum;
}

export type EnumLike = { [k: string]: string | number; [nu: number]: string };

export class ZodNativeEnum<T extends EnumLike> extends ZodType<T[keyof T], ZodNativeEnumDef<T>, T[keyof T]> {
  #cache: Set<T[keyof T]> | undefined;
  _parse(input: ParseInput): ParseReturnType<T[keyof T]> {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);

    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues) as "string",
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type,
      });
      return INVALID;
    }

    if (!this.#cache) {
      this.#cache = new Set(util.getValidEnumValues(this._def.values));
    }

    if (!this.#cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);

      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues,
      });
      return INVALID;
    }
    return OK(input.data as any);
  }

  get enum() {
    return this._def.values;
  }

  static create = <Elements extends EnumLike>(values: Elements, params?: RawCreateParams): ZodNativeEnum<Elements> => {
    return new ZodNativeEnum({
      values: values,
      typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
      ...processCreateParams(params),
    });
  };
}

</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v3/types.ts" lines="4389-4451">
        if (inner.status === "dirty") status.dirty();

        // return value is ignored
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted") return INVALID;
          if (inner.status === "dirty") status.dirty();

          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }

    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        });

        if (!isValid(base)) return base;

        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(
            `Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`
          );
        }

        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base)) return base;

          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result,
          }));
        });
      }
    }

    util.assertNever(effect);
  }

  static create = <I extends ZodTypeAny>(
    schema: I,
    effect: Effect<I["_output"]>,
    params?: RawCreateParams
  ): ZodEffects<I, I["_output"]> => {
    return new ZodEffects({
      schema,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect,
      ...processCreateParams(params),
    });
  };

</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/to-json-schema.ts" lines="477-527">
          result.ref = def.innerType;
          let catchValue: any;
          try {
            catchValue = def.catchValue(undefined as any);
          } catch {
            throw new Error("Dynamic catch values are not supported in JSON Schema");
          }
          _json.default = catchValue;
          break;
        }
        case "nan": {
          if (this.unrepresentable === "throw") {
            throw new Error("NaN cannot be represented in JSON Schema");
          }
          break;
        }
        case "template_literal": {
          const json = _json as JSONSchema.StringSchema;
          const pattern = schema._zod.pattern;
          if (!pattern) throw new Error("Pattern not found in template literal");
          json.type = "string";
          json.pattern = pattern.source;
          break;
        }
        case "pipe": {
          const innerType = this.io === "input" ? def.in : def.out;
          this.process(innerType, params);
          result.ref = innerType;
          break;
        }
        case "readonly": {
          this.process(def.innerType, params);
          result.ref = def.innerType;
          _json.readOnly = true;
          break;
        }
        // passthrough types
        case "promise": {
          this.process(def.innerType, params);
          result.ref = def.innerType;
          break;
        }
        case "optional": {
          this.process(def.innerType, params);
          result.ref = def.innerType;
          break;
        }
        case "lazy": {
          const innerType = (schema as schemas.$ZodLazy)._zod.innerType;
          this.process(innerType, params);
          result.ref = innerType;
</production_snippet>
