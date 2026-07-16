You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/core/schemas.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/core/schemas.ts b/packages/zod/src/v4/core/schemas.ts
index 07c83973..1f37db4c 100644
--- a/packages/zod/src/v4/core/schemas.ts
+++ b/packages/zod/src/v4/core/schemas.ts
@@ -171,7 +171,8 @@ export interface _$ZodType<T extends $ZodTypeInternals = $ZodTypeInternals>
 
 export const $ZodType: core.$constructor<$ZodType> = /*@__PURE__*/ core.$constructor("$ZodType", (inst, def) => {
   inst ??= {} as any;
-  inst._zod.id = def.type + "_" + util.randomString(10);
+  // avoids issues with using Math.random() in Next.js caching
+  util.defineLazy(inst._zod, "id", () => def.type + "_" + util.randomString(10));
   inst._zod.def = def; // set _def property
   inst._zod.bag = inst._zod.bag || {}; // initialize _bag object
   inst._zod.version = version;

</recent_change_diff>

Current test results:
<test_output>
 Test Files  158 passed (158)
      Tests  1660 passed (1660)
   Duration  6.06s (transform 553ms, setup 0ms, collect 16.29s, tests 2.13s, environment 7ms, prepare 6.10s, typecheck 5.58s)

</test_output>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/schemas.ts" lines="149-200">
  /** @internal The inferred output type */
  output: O; //extends { $out: infer O } ? O : Out;
  /** @internal The inferred input type */
  input: I; //extends { $in: infer I } ? I : In;
}

export type $ZodStandardSchema<T> = StandardSchemaV1.Props<core.input<T>, core.output<T>>;

export type SomeType = { _zod: _$ZodTypeInternals };

export interface $ZodType<
  O = unknown,
  I = unknown,
  Internals extends $ZodTypeInternals<O, I> = $ZodTypeInternals<O, I>,
> {
  _zod: Internals;
  "~standard": $ZodStandardSchema<this>;
}
export interface _$ZodType<T extends $ZodTypeInternals = $ZodTypeInternals>
  extends $ZodType<T["output"], T["input"], T> {
  // _zod: T;
}

export const $ZodType: core.$constructor<$ZodType> = /*@__PURE__*/ core.$constructor("$ZodType", (inst, def) => {
  inst ??= {} as any;
  // avoids issues with using Math.random() in Next.js caching
  util.defineLazy(inst._zod, "id", () => def.type + "_" + util.randomString(10));
  inst._zod.def = def; // set _def property
  inst._zod.bag = inst._zod.bag || {}; // initialize _bag object
  inst._zod.version = version;

  const checks = [...(inst._zod.def.checks ?? [])];

  // if inst is itself a checks.$ZodCheck, run it as a check
  if (inst._zod.traits.has("$ZodCheck")) {
    checks.unshift(inst as any);
  }
  //

  for (const ch of checks) {
    for (const fn of ch._zod.onattach) {
      fn(inst);
    }
  }

  if (checks.length === 0) {
    // deferred initializer
    // inst._zod.parse is not yet defined
    inst._zod.deferred ??= [];
    inst._zod.deferred?.push(() => {
      inst._zod.run = inst._zod.parse;
    });
</production_snippet>
