You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/core/registries.ts, play.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/core/registries.ts b/packages/zod/src/v4/core/registries.ts
index 2b48edc0f..a4e8ae063 100644
--- a/packages/zod/src/v4/core/registries.ts
+++ b/packages/zod/src/v4/core/registries.ts
@@ -27,7 +27,7 @@ type MetadataType = object | undefined;
 export class $ZodRegistry<Meta extends MetadataType = MetadataType, Schema extends $ZodType = $ZodType> {
   _meta!: Meta;
   _schema!: Schema;
-  _map: Map<Schema, $replace<Meta, Schema>> = new Map();
+  _map: WeakMap<Schema, $replace<Meta, Schema>> = new WeakMap();
   _idmap: Map<string, Schema> = new Map();
 
   add<S extends Schema>(
@@ -46,7 +46,7 @@ export class $ZodRegistry<Meta extends MetadataType = MetadataType, Schema exten
   }
 
   clear(): this {
-    this._map = new Map();
+    this._map = new WeakMap();
     this._idmap = new Map();
     return this;
   }
diff --git a/play.ts b/play.ts
index 4564a8e84..fa23e12e3 100644
--- a/play.ts
+++ b/play.ts
@@ -1,3 +1,10 @@
 import * as z from "zod";
 
 z;
+
+z.superRefine((val, ctx) => {
+  ctx.addIssue({
+    code: "custom",
+    message: "Custom message",
+  });
+});

</recent_change_diff>

Current test results:
<test_output>
 Test Files  174 passed (174)
      Tests  1946 passed (1946)
   Duration  9.38s (transform 930ms, setup 2.98s, collect 29.40s, tests 7.81s, environment 44ms, prepare 12.32s, typecheck 8.97s)

</test_output>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/registries.ts" lines="5-74">
export type $output = typeof $output;
export const $input: unique symbol = Symbol("ZodInput");
export type $input = typeof $input;

export type $replace<Meta, S extends $ZodType> = Meta extends $output
  ? core.output<S>
  : Meta extends $input
    ? core.input<S>
    : Meta extends (infer M)[]
      ? $replace<M, S>[]
      : Meta extends (...args: infer P) => infer R
        ? (
            ...args: {
              [K in keyof P]: $replace<P[K], S>; // tuple
            }
          ) => $replace<R, S>
        : // handle objects
          Meta extends object
          ? { [K in keyof Meta]: $replace<Meta[K], S> }
          : Meta;

type MetadataType = object | undefined;
export class $ZodRegistry<Meta extends MetadataType = MetadataType, Schema extends $ZodType = $ZodType> {
  _meta!: Meta;
  _schema!: Schema;
  _map: WeakMap<Schema, $replace<Meta, Schema>> = new WeakMap();
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
    this._map = new WeakMap();
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
      const f = { ...pm, ...this._map.get(schema) } as any;
      return Object.keys(f).length ? f : undefined;
    }
    return this._map.get(schema) as any;
</production_snippet>
