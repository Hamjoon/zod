You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/classic/schemas.ts, play.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/classic/schemas.ts b/packages/zod/src/v4/classic/schemas.ts
index b1cb77f6..f97fbc39 100644
--- a/packages/zod/src/v4/classic/schemas.ts
+++ b/packages/zod/src/v4/classic/schemas.ts
@@ -1043,7 +1043,7 @@ export interface ZodObject<
   strict(): ZodObject<Shape, core.$strict>;
 
   /** This is the default behavior. This method call is likely unnecessary. */
-  strip(): ZodObject<Shape, core.$strict>;
+  strip(): ZodObject<Shape, core.$strip>;
 
   extend<U extends core.$ZodLooseShape & Partial<Record<keyof Shape, core.SomeType>>>(
     shape: U
diff --git a/play.ts b/play.ts
index bc79699c..7cf893bd 100644
--- a/play.ts
+++ b/play.ts
@@ -2,18 +2,4 @@ import { z } from "zod/v4";
 
 z;
 
-// const time = z.iso.datetime();
-console.log("z.iso.datetime()");
-console.log(z.iso.datetime()._zod.def.pattern);
-
-console.log("z.iso.datetime({local: true})");
-console.log(z.iso.datetime({ local: true })._zod.def.pattern);
-
-console.log("z.iso.datetime({offset: true})");
-console.log(z.iso.datetime({ offset: true })._zod.def.pattern);
-
-console.log("z.iso.datetime({precision: z.TimePrecision.Minute})");
-console.log(z.iso.datetime({ precision: z.TimePrecision.Minute })._zod.def.pattern);
-
-console.log("z.iso.datetime({offset: true, local: true })");
-console.log(z.iso.datetime({ offset: true, local: true })._zod.def.pattern);
+console.dir(z.iso.datetime({ local: true }).parse("2025-05-21T12:00"), { depth: null });

</recent_change_diff>

Current test results:
<test_output>
 Test Files  162 passed (162)
      Tests  1684 passed (1684)
   Duration  6.26s (transform 428ms, setup 0ms, collect 15.04s, tests 5.42s, environment 11ms, prepare 7.08s, typecheck 5.87s)

</test_output>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/classic/schemas.ts" lines="1021-1071">
}

// ZodObject

export interface ZodObject<
  /** @ts-ignore Cast variance */
  out Shape extends core.$ZodShape = core.$ZodLooseShape,
  out Config extends core.$ZodObjectConfig = core.$ZodObjectConfig,
> extends _ZodType<core.$ZodObjectInternals<Shape, Config>>,
    core.$ZodObject<Shape, Config> {
  shape: Shape;

  keyof(): ZodEnum<util.ToEnum<keyof Shape & string>>;
  /** Define a schema to validate all unrecognized keys. This overrides the existing strict/loose behavior. */
  catchall<T extends core.SomeType>(schema: T): ZodObject<Shape, core.$catchall<T>>;

  /** @deprecated Use `z.looseObject()` or `.loose()` instead. */
  passthrough(): ZodObject<Shape, core.$loose>;
  /** Consider `z.looseObject(A.shape)` instead */
  loose(): ZodObject<Shape, core.$loose>;

  /** Consider `z.strictObject(A.shape)` instead */
  strict(): ZodObject<Shape, core.$strict>;

  /** This is the default behavior. This method call is likely unnecessary. */
  strip(): ZodObject<Shape, core.$strip>;

  extend<U extends core.$ZodLooseShape & Partial<Record<keyof Shape, core.SomeType>>>(
    shape: U
  ): ZodObject<util.Extend<Shape, U>, Config>;

  /**
   * @deprecated Use spread syntax and the `.shape` property to combine two object schemas:
   *
   * ```ts
   * const A = z.object({ a: z.string() });
   * const B = z.object({ b: z.number() });
   *
   * const C = z.object({
   *    ...A.shape,
   *    ...B.shape
   * });
   * ```
   */
  merge<U extends ZodObject>(other: U): ZodObject<util.Extend<Shape, U["shape"]>, U["_zod"]["config"]>;

  pick<M extends util.Exactly<util.Mask<keyof Shape>, M>>(
    mask: M
  ): ZodObject<util.Flatten<Pick<Shape, Extract<keyof Shape, keyof M>>>, Config>;

  omit<M extends util.Exactly<util.Mask<keyof Shape>, M>>(
</production_snippet>
