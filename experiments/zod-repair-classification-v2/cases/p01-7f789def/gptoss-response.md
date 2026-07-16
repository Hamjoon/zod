DECISION: fix_production
```diff
diff --git a/packages/zod/src/v4/core/schemas.ts b/packages/zod/src/v4/core/schemas.ts
index 2792..2844 100644
--- a/packages/zod/src/v4/core/schemas.ts
+++ b/packages/zod/src/v4/core/schemas.ts
@@
-      payload.value = {};
-      for (const key of Reflect.ownKeys(input)) {
-        if (key === "__proto__") continue;
+      payload.value = {};
+      // Only iterate over **enumerable** own properties.
+      // Reflect.ownKeys returns both enumerable and non‑enumerable keys (including symbols).
+      // Zod's record schema should ignore non‑enumerable properties, mirroring the behavior
+      // of plain object iteration (e.g., `for...in` or `Object.keys`). This also ensures that
+      // hidden/internal properties (like those used by Zod internally) do not cause validation
+      // failures.
+      for (const key of Reflect.ownKeys(input)) {
+        // Skip prototype pollution
+        if (key === "__proto__") continue;
+        // Skip non‑enumerable properties
+        if (!Object.prototype.propertyIsEnumerable.call(input, key)) continue;
         let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
         if (keyResult instanceof Promise) {
           throw new Error("Async schemas not supported in object keys currently");
         }
```