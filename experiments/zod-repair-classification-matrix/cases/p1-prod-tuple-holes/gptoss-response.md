**Modified file:** `packages/zod/src/v4/core/schemas.ts`

```diff
@@
   inst._zod.parse = (payload, ctx) => {
@@
   };
 });

+// Helper to determine if a schema produces an *optional* output without a default value.
+// Such schemas can be safely omitted (truncated) from the tuple output only when every
+// later element is also optional in the same sense. A schema wrapped in `z.default()`
+// is *required* for output purposes because it will always emit a concrete value,
+// even when the input is missing.
+function isOptionalWithoutDefault(schema: any): boolean {
+  const typeName = schema?._def?.typeName;
+  // ZodOptional and ZodExactOptional represent optional outputs.
+  // ZodDefault represents a defaulted value which must be present in the output.
+  return (
+    (typeName === "ZodOptional" || typeName === "ZodExactOptional") &&
+    typeName !== "ZodDefault"
+  );
+}
+
 // ---------------------------------------------------------------------------
// Tuple handling (excerpt)
@@
-    for (let i = 0; i < def.items.length; i++) {
-      const schema = def.items[i];
-
-      // If the input array is shorter than the tuple definition we may need to
-      // truncate optional slots. The original implementation simply broke out of
-      // the loop when it encountered a missing element, assuming all remaining
-      // slots were optional. This caused regressions when a later slot had a
-      // default value (making the output required) – the earlier optional slot
-      // would be silently dropped, swallowing its validation errors.
-      if (i >= input.length) {
-        // If every remaining schema is optional we can safely truncate.
-        const remaining = def.items.slice(i);
-        const canTruncate = remaining.every(
-          (s) => s._def?.typeName === "ZodOptional" || s._def?.typeName === "ZodExactOptional"
-        );
-        if (canTruncate) break;
-
-        // Otherwise we treat the missing value as `undefined` and let the schema
-        // decide (it will usually succeed for optional schemas, or produce an
-        // error for refined ones).
-        const result = schema._zod.run({ value: undefined, issues: [] }, ctx);
-        if (result.success) {
-          output[i] = result.value;
-        } else {
-          result.issues.forEach((iss) => issues.push(iss));
-        }
-        continue;
-      }
-
-      const result = schema._zod.run({ value: input[i], issues: [] }, ctx);
-      if (result.success) {
-        output[i] = result.value;
-      } else {
-        result.issues.forEach((iss) => issues.push(iss));
-      }
-    }
+    for (let i = 0; i < def.items.length; i++) {
+      const schema = def.items[i];
+
+      // When the input array is shorter than the tuple definition we need to decide
+      // whether we can truncate the remaining slots. Truncation is only safe when
+      // **all** remaining schemas are optional *and* have no default value. A defaulted
+      // schema must appear in the output, so we must continue validation rather than
+      // silently dropping earlier optional slots.
+      if (i >= input.length) {
+        const remaining = def.items.slice(i);
+        const canTruncate = remaining.every(isOptionalWithoutDefault);
+        if (canTruncate) break;
+
+        // Missing input is treated as `undefined` and passed to the schema.
+        // This allows optional schemas to succeed (producing `undefined`) while
+        // still surfacing validation errors for refined optional schemas.
+        const result = schema._zod.run({ value: undefined, issues: [] }, ctx);
+        if (result.success) {
+          output[i] = result.value;
+        } else {
+          result.issues.forEach((iss) => issues.push(iss));
+        }
+        continue;
+      }
+
+      const result = schema._zod.run({ value: input[i], issues: [] }, ctx);
+      if (result.success) {
+        output[i] = result.value;
+      } else {
+        result.issues.forEach((iss) => issues.push(iss));
+      }
+    }
*** End of File ***
```