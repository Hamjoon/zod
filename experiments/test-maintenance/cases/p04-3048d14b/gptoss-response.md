DECISION: fix_production
```diff
@@
 export function cloneDef(schema: schemas.$ZodType): any {
   const def: any = {};
-  Object.defineProperties(def, Object.getOwnPropertyDescriptors(schema._zod.def));
+  // Clone property descriptors but ensure they are configurable.
+  // This allows later utilities (e.g., extend, pick, omit) to safely
+  // redefine properties like `checks` without hitting "Cannot redefine property"
+  // errors when the original descriptor is non-configurable.
+  const descriptors = Object.getOwnPropertyDescriptors(schema._zod.def);
+  for (const key of Object.keys(descriptors) as (keyof typeof descriptors)[]) {
+    const desc = descriptors[key];
+    // Preserve existing attributes but force configurable to true.
+    descriptors[key] = {
+      ...desc,
+      configurable: true,
+    };
+  }
+  Object.defineProperties(def, descriptors);
   return def;
 }
```