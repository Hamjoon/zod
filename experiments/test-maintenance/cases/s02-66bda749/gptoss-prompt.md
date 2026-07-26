You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/mini/tests/refine.test.ts, packages/zod/src/v4/mini/schemas.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/mini/schemas.ts b/packages/zod/src/v4/mini/schemas.ts
index e2a3ea37..cc63e2d8 100644
--- a/packages/zod/src/v4/mini/schemas.ts
+++ b/packages/zod/src/v4/mini/schemas.ts
@@ -12,10 +12,6 @@ export interface ZodMiniType<
   type: Internals["def"]["type"];
   check(...checks: (core.CheckFn<core.output<this>> | core.$ZodCheck<core.output<this>>)[]): this;
   with(...checks: (core.CheckFn<core.output<this>> | core.$ZodCheck<core.output<this>>)[]): this;
-  refine<Ch extends (arg: core.output<this>) => unknown | Promise<unknown>>(
-    check: Ch,
-    params?: string | core.$ZodCustomParams
-  ): Ch extends (arg: any) => arg is infer R ? core.$ZodNarrow<this, R> : this;
   clone(def?: Internals["def"], params?: { parent: boolean }): this;
   register<R extends core.$ZodRegistry>(
     registry: R,
@@ -72,7 +68,6 @@ export const ZodMiniType: core.$constructor<ZodMiniType> = /*@__PURE__*/ core.$c
       );
     };
     inst.with = inst.check;
-    inst.refine = (check, params) => inst.check(refine(check, params)) as never;
     inst.clone = (_def, params) => core.clone(inst, _def, params);
     inst.brand = () => inst as any;
     inst.register = ((reg: any, meta: any) => {

</recent_change_diff>

Current test results:
<test_output>
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v4.0.10 <worktree>/s02-66bda749

 ❯  zod  src/v4/mini/tests/refine.test.ts (2 tests | 2 failed) 2ms
     × type guard narrows output type 2ms
     × non-type-guard refine does not narrow 0ms
 ❯  zod   TS  src/v4/mini/tests/refine.test.ts (2 tests | 2 failed)
     × type guard narrows output type
     × non-type-guard refine does not narrow

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯

 FAIL   zod  src/v4/mini/tests/refine.test.ts > type refinement with type guards > type guard narrows output type
TypeError: __vite_ssr_import_1__.string(...).refine is not a function
 ❯ src/v4/mini/tests/refine.test.ts:7:31
      5| describe("type refinement with type guards", () => {
      6|   test("type guard narrows output type", () => {
      7|     const schema = z.string().refine((s): s is "a" => s === "a");
       |                               ^
      8| 
      9|     expectTypeOf<core.input<typeof schema>>().toEqualTypeOf<string>();

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/6]⎯

 FAIL   zod  src/v4/mini/tests/refine.test.ts > type refinement with type guards > non-type-guard refine does not narrow
TypeError: __vite_ssr_import_1__.string(...).refine is not a function
 ❯ src/v4/mini/tests/refine.test.ts:14:31
     12| 
     13|   test("non-type-guard refine does not narrow", () => {
     14|     const schema = z.string().refine((s) => s.length > 0);
       |                               ^
     15| 
     16|     expectTypeOf<core.input<typeof schema>>().toEqualTypeOf<string>();

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/6]⎯

 FAIL   zod  src/v4/mini/tests/refine.test.ts > type refinement with type guards > type guard narrows output type
TypeCheckError: Property 'refine' does not exist on type 'ZodMiniString<string>'.
 ❯ src/v4/mini/tests/refine.test.ts:7:31
      5| describe("type refinement with type guards", () => {
      6|   test("type guard narrows output type", () => {
      7|     const schema = z.string().refine((s): s is "a" => s === "a");
       |                               ^
      8| 
      9|     expectTypeOf<core.input<typeof schema>>().toEqualTypeOf<string>();

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/6]⎯

 FAIL   zod  src/v4/mini/tests/refine.test.ts > type refinement with type guards > type guard narrows output type
TypeCheckError: Parameter 's' implicitly has an 'any' type.
 ❯ src/v4/mini/tests/refine.test.ts:7:39
      5| describe("type refinement with type guards", () => {
      6|   test("type guard narrows output type", () => {
      7|     const schema = z.string().refine((s): s is "a" => s === "a");
       |                                       ^
      8| 
      9|     expectTypeOf<core.input<typeof schema>>().toEqualTypeOf<string>();

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/6]⎯

 FAIL   zod  src/v4/mini/tests/refine.test.ts > type refinement with type guards > non-type-guard refine does not narrow
TypeCheckError: Property 'refine' does not exist on type 'ZodMiniString<string>'.
 ❯ src/v4/mini/tests/refine.test.ts:14:31
     12| 
     13|   test("non-type-guard refine does not narrow", () => {
     14|     const schema = z.string().refine((s) => s.length > 0);
       |                               ^
     15| 
     16|     expectTypeOf<core.input<typeof schema>>().toEqualTypeOf<string>();

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/6]⎯

 FAIL   zod  src/v4/mini/tests/refine.test.ts > type refinement with type guards > non-type-guard refine does not narrow
TypeCheckError: Parameter 's' implicitly has an 'any' type.
 ❯ src/v4/mini/tests/refine.test.ts:14:39
     12| 
     13|   test("non-type-guard refine does not narrow", () => {
     14|     const schema = z.string().refine((s) => s.length > 0);
       |                                       ^
     15| 
     16|     expectTypeOf<core.input<typeof schema>>().toEqualTypeOf<string>();

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/6]⎯


 Test Files  2 failed (2)
      Tests  4 failed (4)
Type Errors  2 failed
   Start at  15:50:48
   Duration  7.65s (transform 233ms, setup 17ms, collect 266ms, tests 2ms, environment 0ms, prepare 3ms, typecheck 7.29s)


</test_output>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/mini/schemas.ts" lines="1-39">
import * as core from "../core/index.js";
import { util } from "../core/index.js";
import * as parse from "./parse.js";

type SomeType = core.SomeType;

export interface ZodMiniType<
  out Output = unknown,
  out Input = unknown,
  out Internals extends core.$ZodTypeInternals<Output, Input> = core.$ZodTypeInternals<Output, Input>,
> extends core.$ZodType<Output, Input, Internals> {
  type: Internals["def"]["type"];
  check(...checks: (core.CheckFn<core.output<this>> | core.$ZodCheck<core.output<this>>)[]): this;
  with(...checks: (core.CheckFn<core.output<this>> | core.$ZodCheck<core.output<this>>)[]): this;
  clone(def?: Internals["def"], params?: { parent: boolean }): this;
  register<R extends core.$ZodRegistry>(
    registry: R,
    ...meta: this extends R["_schema"]
      ? undefined extends R["_meta"]
        ? [core.$replace<R["_meta"], this>?]
        : [core.$replace<R["_meta"], this>]
      : ["Incompatible schema"]
  ): this;
  brand<T extends PropertyKey = PropertyKey, Dir extends "in" | "out" | "inout" = "out">(
    value?: T
  ): PropertyKey extends T ? this : core.$ZodBranded<this, T, Dir>;

  def: Internals["def"];

  parse(data: unknown, params?: core.ParseContext<core.$ZodIssue>): core.output<this>;
  safeParse(data: unknown, params?: core.ParseContext<core.$ZodIssue>): util.SafeParseResult<core.output<this>>;
  parseAsync(data: unknown, params?: core.ParseContext<core.$ZodIssue>): Promise<core.output<this>>;
  safeParseAsync(
    data: unknown,
    params?: core.ParseContext<core.$ZodIssue>
  ): Promise<util.SafeParseResult<core.output<this>>>;
  apply<T>(fn: (schema: this) => T): T;
}

</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/mini/schemas.ts" lines="45-95">
  (inst, def) => {
    if (!inst._zod) throw new Error("Uninitialized schema in ZodMiniType.");

    core.$ZodType.init(inst, def);

    inst.def = def;
    inst.type = def.type;
    inst.parse = (data, params) => parse.parse(inst, data, params, { callee: inst.parse });
    inst.safeParse = (data, params) => parse.safeParse(inst, data, params);
    inst.parseAsync = async (data, params) => parse.parseAsync(inst, data, params, { callee: inst.parseAsync });
    inst.safeParseAsync = async (data, params) => parse.safeParseAsync(inst, data, params);
    inst.check = (...checks) => {
      return inst.clone(
        {
          ...def,
          checks: [
            ...(def.checks ?? []),
            ...checks.map((ch) =>
              typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch
            ),
          ],
        },
        { parent: true }
      );
    };
    inst.with = inst.check;
    inst.clone = (_def, params) => core.clone(inst, _def, params);
    inst.brand = () => inst as any;
    inst.register = ((reg: any, meta: any) => {
      reg.add(inst, meta);
      return inst;
    }) as any;
    inst.apply = (fn) => fn(inst);
  }
);

export interface _ZodMiniString<T extends core.$ZodStringInternals<unknown> = core.$ZodStringInternals<unknown>>
  extends _ZodMiniType<T>,
    core.$ZodString<T["input"]> {
  _zod: T;
}

// ZodMiniString
export interface ZodMiniString<Input = unknown>
  extends _ZodMiniString<core.$ZodStringInternals<Input>>,
    core.$ZodString<Input> {}
export const ZodMiniString: core.$constructor<ZodMiniString> = /*@__PURE__*/ core.$constructor(
  "ZodMiniString",
  (inst, def) => {
    core.$ZodString.init(inst, def);
    ZodMiniType.init(inst, def);
</production_snippet>
