DECISION: fix_production
```diff
diff --git a/packages/zod/src/v4/classic/schemas.ts b/packages/zod/src/v4/classic/schemas.ts
index 05144e2c..cae4af3c 100644
--- a/packages/zod/src/v4/classic/schemas.ts
+++ b/packages/zod/src/v4/classic/schemas.ts
@@
 
-export function custom<O>(
-  fn?: (data: unknown) => unknown,
+export function custom<O = unknown, I = O>(
+  fn?: (data: I) => unknown,
   _params?: string | core.$ZodCustomParams | undefined
-): ZodCustom<O, O> {
+): ZodCustom<O, I> {
   return core._custom(ZodCustom, fn ?? (() => true), _params) as any;
 }
 
 export function refine<T>(
   fn: (arg: NoInfer<T>) => util.MaybeAsync<unknown>,
```