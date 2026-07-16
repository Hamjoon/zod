You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/classic/tests/assignability.test.ts, packages/zod/package.json, packages/zod/src/v4/classic/schemas.ts, packages/zod/src/v4/core/schemas.ts, play.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/classic/tests/assignability.test.ts b/packages/zod/src/v4/classic/tests/assignability.test.ts
index 43a3fbfe4..603ff6c1a 100644
--- a/packages/zod/src/v4/classic/tests/assignability.test.ts
+++ b/packages/zod/src/v4/classic/tests/assignability.test.ts
@@ -192,3 +192,19 @@ test("assignability with narrowing", () => {
 
   type RefinedUnionSchema<T extends z.ZodUnion> = T;
 });
+
+test("generic assignability in objects", () => {
+  interface SortItem<T extends string> {
+    key: T;
+    order: string;
+  }
+
+  const createSortItemSchema = <T extends z.ZodType<string>>(sortKeySchema: T) =>
+    z.object({
+      key: sortKeySchema,
+      order: z.string(),
+    });
+
+  <T extends z.ZodType<string>>(sortKeySchema: T, defaultSortBy: SortItem<z.output<T>>[] = []) =>
+    createSortItemSchema(sortKeySchema).array().default(defaultSortBy);
+});

</recent_change_diff>

Current test results:
<test_output>
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v2.1.9 /Users/donggi/_projects/etc-projects/zod-thesis/.worktrees/p08-2be1c6ad/packages/zod

 ✓ src/v4/classic/tests/assignability.test.ts (5 tests) 7ms
 ❯  TS  src/v4/classic/tests/assignability.test.ts (5 tests | 1 failed)
   × generic assignability in objects
     → No overload matches this call.
  Overload 1 of 2, '(def { [K in keyof ({ -readonly [k in keyof { key T; order ZodString; } as { key T; order ZodString; }[k] extends OptionalOutSchema ? never  k] output<{ key T; order ZodString; }[k]>; } & { -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? k  never]? output<...>; })] ({ -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? never  k] output<...>; } & { -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? k  never]? output<...>; })[K]; }[]) ZodDefault<...>', gave the following error.
    Argument of type 'SortItem<output<T>>[]' is not assignable to parameter of type '{ [K in keyof ({ -readonly [k in keyof { key T; order ZodString; } as { key T; order ZodString; }[k] extends OptionalOutSchema ? never  k] output<{ key T; order ZodString; }[k]>; } & { -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? k  never]? output<...>; })] ({ -readonly [k in ...'.
      Type 'SortItem<output<T>>' is not assignable to type '{ [K in keyof ({ -readonly [k in keyof { key T; order ZodString; } as { key T; order ZodString; }[k] extends OptionalOutSchema ? never  k] output<{ key T; order ZodString; }[k]>; } & { -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? k  never]? output<...>; })] ({ -readonly [k in ...'.
  Overload 2 of 2, '(def () => { [K in keyof ({ -readonly [k in keyof { key T; order ZodString; } as { key T; order ZodString; }[k] extends OptionalOutSchema ? never  k] output<{ key T; order ZodString; }[k]>; } & { -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? k  never]? output<...>; })] ({ -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? never  k] output<...>; } & { -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? k  never]? output<...>; })[K]; }[]) ZodDefault<...>', gave the following error.
    Argument of type 'SortItem<output<T>>[]' is not assignable to parameter of type '() => { [K in keyof ({ -readonly [k in keyof { key T; order ZodString; } as { key T; order ZodString; }[k] extends OptionalOutSchema ? never  k] output<{ key T; order ZodString; }[k]>; } & { -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? k  never]? output<...>; })] ({ -readonly ...'.
      Type 'SortItem<output<T>>[]' provides no match for the signature '() { [K in keyof ({ -readonly [k in keyof { key T; order ZodString; } as { key T; order ZodString; }[k] extends OptionalOutSchema ? never  k] output<{ key T; order ZodString; }[k]>; } & { -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? k  never]? output<...>; })] ({ -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? never  k] output<...>; } & { -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? k  never]? output<...>; })[K]; }[]'.

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/v4/classic/tests/assignability.test.ts > generic assignability in objects
TypeCheckError: No overload matches this call.
  Overload 1 of 2, '(def { [K in keyof ({ -readonly [k in keyof { key T; order ZodString; } as { key T; order ZodString; }[k] extends OptionalOutSchema ? never  k] output<{ key T; order ZodString; }[k]>; } & { -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? k  never]? output<...>; })] ({ -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? never  k] output<...>; } & { -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? k  never]? output<...>; })[K]; }[]) ZodDefault<...>', gave the following error.
    Argument of type 'SortItem<output<T>>[]' is not assignable to parameter of type '{ [K in keyof ({ -readonly [k in keyof { key T; order ZodString; } as { key T; order ZodString; }[k] extends OptionalOutSchema ? never  k] output<{ key T; order ZodString; }[k]>; } & { -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? k  never]? output<...>; })] ({ -readonly [k in ...'.
      Type 'SortItem<output<T>>' is not assignable to type '{ [K in keyof ({ -readonly [k in keyof { key T; order ZodString; } as { key T; order ZodString; }[k] extends OptionalOutSchema ? never  k] output<{ key T; order ZodString; }[k]>; } & { -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? k  never]? output<...>; })] ({ -readonly [k in ...'.
  Overload 2 of 2, '(def () => { [K in keyof ({ -readonly [k in keyof { key T; order ZodString; } as { key T; order ZodString; }[k] extends OptionalOutSchema ? never  k] output<{ key T; order ZodString; }[k]>; } & { -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? k  never]? output<...>; })] ({ -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? never  k] output<...>; } & { -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? k  never]? output<...>; })[K]; }[]) ZodDefault<...>', gave the following error.
    Argument of type 'SortItem<output<T>>[]' is not assignable to parameter of type '() => { [K in keyof ({ -readonly [k in keyof { key T; order ZodString; } as { key T; order ZodString; }[k] extends OptionalOutSchema ? never  k] output<{ key T; order ZodString; }[k]>; } & { -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? k  never]? output<...>; })] ({ -readonly ...'.
      Type 'SortItem<output<T>>[]' provides no match for the signature '() { [K in keyof ({ -readonly [k in keyof { key T; order ZodString; } as { key T; order ZodString; }[k] extends OptionalOutSchema ? never  k] output<{ key T; order ZodString; }[k]>; } & { -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? k  never]? output<...>; })] ({ -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? never  k] output<...>; } & { -readonly [k in keyof { ...; } as { ...; }[k] extends OptionalOutSchema ? k  never]? output<...>; })[K]; }[]'.
 ❯ src/v4/classic/tests/assignability.test.ts:209:57
    207| 
    208|   <T extends z.ZodType<string>>(sortKeySchema: T, defaultSortBy: SortI…
    209|     createSortItemSchema(sortKeySchema).array().default(defaultSortBy);
       |                                                         ^
    210| });
    211| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 9 passed (10)
Type Errors  1 failed
   Start at  15:53:13
   Duration  3.70s (transform 428ms, setup 0ms, collect 651ms, tests 7ms, environment 0ms, prepare 112ms, typecheck 3.59s)


</test_output>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/assignability.test.ts" lines="170-235">
  z.object({ key: z.string() }) satisfies z.ZodType;
  z.object({ key: z.string() }) satisfies z.ZodType<{ key: string }>;
  z.array(z.string()) satisfies z.ZodType;
  z.union([z.string(), z.number()]) satisfies z.ZodType;
  z.intersection(z.string(), z.number()) satisfies z.ZodType;
  z.tuple([z.string(), z.number()]) satisfies z.ZodType;
  z.record(z.string(), z.number()) satisfies z.ZodType;
  z.map(z.string(), z.number()) satisfies z.ZodType;
  z.set(z.string()) satisfies z.ZodType;
  z.literal("example") satisfies z.ZodType;

  expectTypeOf<z.ZodType extends z.core.$ZodType ? true : false>().toEqualTypeOf<true>();
});

test("assignability with narrowing", () => {
  type _RefinedSchema<T extends z.ZodType<object> | z.ZodUnion> = T extends z.ZodUnion
    ? RefinedUnionSchema<T> // <-- Type instantiation is excessively deep and possibly infinite.
    : T extends z.ZodType<object>
      ? RefinedTypeSchema<z.output<T>> // <-- Type instantiation is excessively deep and possibly infinite.
      : never;

  type RefinedTypeSchema<T extends object> = T;

  type RefinedUnionSchema<T extends z.ZodUnion> = T;
});

test("generic assignability in objects", () => {
  interface SortItem<T extends string> {
    key: T;
    order: string;
  }

  const createSortItemSchema = <T extends z.ZodType<string>>(sortKeySchema: T) =>
    z.object({
      key: sortKeySchema,
      order: z.string(),
    });

  <T extends z.ZodType<string>>(sortKeySchema: T, defaultSortBy: SortItem<z.output<T>>[] = []) =>
    createSortItemSchema(sortKeySchema).array().default(defaultSortBy);
});
</test_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/classic/schemas.ts" lines="50-100">
  parse(data: unknown, params?: core.ParseContext<core.$ZodIssue>): core.output<this>;
  safeParse(data: unknown, params?: core.ParseContext<core.$ZodIssue>): parse.ZodSafeParseResult<core.output<this>>;
  parseAsync(data: unknown, params?: core.ParseContext<core.$ZodIssue>): Promise<core.output<this>>;
  safeParseAsync(
    data: unknown,
    params?: core.ParseContext<core.$ZodIssue>
  ): Promise<parse.ZodSafeParseResult<core.output<this>>>;
  spa: (
    data: unknown,
    params?: core.ParseContext<core.$ZodIssue>
  ) => Promise<parse.ZodSafeParseResult<core.output<this>>>;

  // refinements
  refine(check: (arg: core.output<this>) => unknown | Promise<unknown>, params?: string | core.$ZodCustomParams): this;
  /** @deprecated Use `.check()` instead. */
  superRefine(
    refinement: (arg: core.output<this>, ctx: RefinementCtx<core.output<this>>) => void | Promise<void>
  ): this;
  overwrite(fn: (x: core.output<this>) => core.output<this>): this;

  // wrappers
  optional(): ZodOptional<this>;
  nonoptional(params?: string | core.$ZodNonOptionalParams): ZodNonOptional<this>;
  nullable(): ZodNullable<this>;
  nullish(): ZodOptional<ZodNullable<this>>;
  default(def: util.NoUndefined<core.output<this>>): ZodDefault<this>;
  default(def: () => util.NoUndefined<core.output<this>>): ZodDefault<this>;
  prefault(def: () => core.input<this>): ZodPrefault<this>;
  prefault(def: core.input<this>): ZodPrefault<this>;
  array(): ZodArray<this>;
  or<T extends core.SomeType>(option: T): ZodUnion<[this, T]>;
  and<T extends core.SomeType>(incoming: T): ZodIntersection<this, T>;
  transform<NewOut>(
    transform: (arg: core.output<this>, ctx: RefinementCtx<core.output<this>>) => NewOut | Promise<NewOut>
  ): ZodPipe<this, ZodTransform<Awaited<NewOut>, core.output<this>>>;
  catch(def: core.output<this>): ZodCatch<this>;
  catch(def: (ctx: core.$ZodCatchCtx) => core.output<this>): ZodCatch<this>;
  pipe<T extends core.$ZodType<any, core.output<this>>>(
    target: T | core.$ZodType<any, core.output<this>>
  ): ZodPipe<this, T>;
  readonly(): ZodReadonly<this>;

  /** Returns a new instance that has been registered in `z.globalRegistry` with the specified description */
  describe(description: string): this;
  description?: string;
  /** Returns the metadata associated with this instance in `z.globalRegistry` */
  meta(): core.$replace<core.GlobalMeta, this> | undefined;
  /** Returns a new instance that has been registered in `z.globalRegistry` with the specified metadata */
  meta(data: core.$replace<core.GlobalMeta, this>): this;

  // helpers
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/schemas.ts" lines="1505-1605">
        proms.push(result.then((result) => handleArrayResult(result, payload, i)));
      } else {
        handleArrayResult(result, payload, i);
      }
    }

    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }

    return payload; //handleArrayResultsAsync(parseResults, final);
  };
});

//////////////////////////////////////////
//////////////////////////////////////////
//////////                      //////////
//////////      $ZodObject      //////////
//////////                      //////////
//////////////////////////////////////////
//////////////////////////////////////////

type OptionalOutSchema = { _zod: { optout: "optional" } };
type OptionalInSchema = { _zod: { optin: "optional" } };

export type $InferObjectOutputFallback<
  T extends $ZodLooseShape,
  Extra extends Record<string, unknown>,
> = string extends keyof T
  ? object
  : keyof (T & Extra) extends never
    ? Record<string, never>
    : util.Prettify<
        {
          // this is a simplified fallback type
          // there is no support for key optionality
          -readonly [k in keyof T]: core.output<T[k]>;
        } & Extra
      >;

export type $InferObjectInputFallback<
  T extends $ZodLooseShape,
  Extra extends Record<string, unknown>,
> = string extends keyof T
  ? object
  : keyof (T & Extra) extends never
    ? Record<string, never>
    : util.Prettify<
        {
          // this is a simplified fallback type
          // there is no support for key optionality
          -readonly [k in keyof T]: core.input<T[k]>;
        } & Extra
      >;

export type $InferObjectOutput<T extends $ZodLooseShape, Extra extends Record<string, unknown>> = string extends keyof T
  ? object
  : keyof (T & Extra) extends never
    ? Record<string, never>
    : util.Prettify<
        {
          -readonly [k in keyof T as T[k] extends OptionalOutSchema ? never : k]: core.output<T[k]>;
        } & {
          -readonly [k in keyof T as T[k] extends OptionalOutSchema ? k : never]?: core.output<T[k]>;
        } & Extra
      >;

export type $InferObjectInput<T extends $ZodLooseShape, Extra extends Record<string, unknown>> = string extends keyof T
  ? object
  : keyof (T & Extra) extends never
    ? Record<string, never>
    : util.Prettify<
        {
          -readonly [k in keyof T as T[k] extends OptionalInSchema ? never : k]: core.input<T[k]>;
        } & {
          -readonly [k in keyof T as T[k] extends OptionalInSchema ? k : never]?: core.input<T[k]>;
        } & Extra
      >;

function handleObjectResult(result: ParsePayload, final: ParsePayload, key: PropertyKey) {
  // if(isOptional)
  if (result.issues.length) {
    final.issues.push(...util.prefixIssues(key, result.issues));
  }

  (final.value as any)[key] = result.value;
}

function handleOptionalObjectResult(result: ParsePayload, final: ParsePayload, key: PropertyKey, input: any) {
  if (result.issues.length) {
    // validation failed against value schema
    if (input[key] === undefined) {
      // if input was undefined, ignore the error
      if (key in input) {
        (final.value as any)[key] = undefined;
      } else {
        (final.value as any)[key] = result.value;
      }
    } else {
      final.issues.push(...util.prefixIssues(key, result.issues));
    }
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/schemas.ts" lines="1851-1901">
      }
    }

    if (unrecognized.length) {
      payload.issues.push({
        code: "unrecognized_keys",
        keys: unrecognized,
        input,
        inst,
      });
    }

    if (!proms.length) return payload;
    return Promise.all(proms).then(() => {
      return payload;
    });
  };
});

/////////////////////////////////////////
/////////////////////////////////////////
//////////                    ///////////
//////////      $ZodUnion      //////////
//////////                    ///////////
/////////////////////////////////////////
/////////////////////////////////////////
export type $InferUnionOutput<T extends SomeType> = T extends any ? core.output<T> : never;
export type $InferUnionInput<T extends SomeType> = T extends any ? core.input<T> : never;
export interface $ZodUnionDef<Options extends readonly SomeType[] = readonly $ZodType[]> extends $ZodTypeDef {
  type: "union";
  options: Options;
}

export interface $ZodUnionInternals<T extends readonly SomeType[] = readonly $ZodType[]>
  extends $ZodTypeInternals<$InferUnionOutput<T[number]>, $InferUnionInput<T[number]>> {
  def: $ZodUnionDef<T>;
  isst: errors.$ZodIssueInvalidUnion;
  pattern: T[number]["_zod"]["pattern"];
}

export interface $ZodUnion<T extends readonly SomeType[] = readonly $ZodType[]> extends $ZodType {
  _zod: $ZodUnionInternals<T>;
}

function handleUnionResults(results: ParsePayload[], final: ParsePayload, inst: $ZodUnion, ctx?: ParseContext) {
  for (const result of results) {
    if (result.issues.length === 0) {
      final.value = result.value;
      return final;
    }
  }
</production_snippet>
