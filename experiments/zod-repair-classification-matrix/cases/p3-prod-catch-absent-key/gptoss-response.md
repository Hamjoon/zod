```diff
*** a/packages/zod/src/v4/core/schemas.ts
@@
-    for (const key in shape) {
-      const schema = shape[key];
-      if (Object.prototype.hasOwnProperty.call(input, key)) {
-        const value = input[key];
-        const result = schema._zod.run(
-          {
-            value,
-            issues: [],
-          },
-          ctx
-        );
-
-        if (result instanceof Promise) {
-          proms.push(
-            result.then((result) => handleObjectResult(result, output, key, issues))
-          );
-        } else {
-          handleObjectResult(result, output, key, issues);
-        }
-      } else {
-        // key is missing – previously we unconditionally reported a missing‑key error.
-        // This prevented `.catch()` on a property from handling an absent key.
-        // Instead, run the property's schema with `undefined` so that any
-        // catch‑wrapper can provide a default value.
-        const result = schema._zod.run(
-          {
-            value: undefined,
-            issues: [],
-          },
-          ctx
-        );
-
-        if (result instanceof Promise) {
-          proms.push(
-            result.then((result) => handleObjectResult(result, output, key, issues))
-          );
-        } else {
-          handleObjectResult(result, output, key, issues);
-        }
-      }
-    }
+    for (const key in shape) {
+      const schema = shape[key];
+      const hasKey = Object.prototype.hasOwnProperty.call(input, key);
+      const value = hasKey ? input[key] : undefined;
+
+      // Always run the property's schema – even when the key is absent.
+      // This allows schemas wrapped with `.catch()` (or other transforms that
+      // provide defaults) to handle missing keys gracefully.
+      const result = schema._zod.run(
+        {
+          value,
+          issues: [],
+        },
+        ctx
+      );
+
+      if (result instanceof Promise) {
+        proms.push(
+          result.then((result) => handleObjectResult(result, output, key, issues))
+        );
+      } else {
+        handleObjectResult(result, output, key, issues);
+      }
+    }
*** End of File
```