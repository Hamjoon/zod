DECISION: fix_production
```diff
diff --git a/packages/zod/src/v4/classic/schemas.ts b/packages/zod/src/v4/classic/schemas.ts
index 9c2e1f7..b7a3d4e 100644
--- a/packages/zod/src/v4/classic/schemas.ts
+++ b/packages/zod/src/v4/classic/schemas.ts
@@
   nullish(): ZodOptional<ZodNullable<this>>;
-  default(def: util.NoUndefined<core.output<this>>): ZodDefault<this>;
-  default(def: () => util.NoUndefined<core.output<this>>): ZodDefault<this>;
+  /**
+   * Set a default value for the schema. The overloads are generic so that
+   * TypeScript can correctly infer default values that are themselves generic
+   * (e.g. arrays of objects whose property types depend on a generic Zod type).
+   *
+   * Previously the overloads accepted a concrete `util.NoUndefined<core.output<this>>`
+   * which caused TypeScript to reject values like `SortItem<z.output<T>>[]` in generic
+   * contexts because the type was not considered assignable to the exact mapped type
+   * produced by `$InferObjectOutput`. By making the overloads generic (`Def extends …`)
+   * we allow any value that is assignable to the output type, fixing the assignability
+   * test without weakening runtime behavior.
+   */
+  default<Def extends util.NoUndefined<core.output<this>>>(def: Def): ZodDefault<this>;
+  default<Def extends util.NoUndefined<core.output<this>>>(def: () => Def): ZodDefault<this>;
   prefault(def: () => core.input<this>): ZodPrefault<this>;
   prefault(def: core.input<this>): ZodPrefault<this>;
   array(): ZodArray<this>;
   or<T extends core.SomeType>(option: T): ZodUnion<[this, T]>;
   and<T extends core.SomeType>(incoming: T): ZodIntersection<this, T>;
```