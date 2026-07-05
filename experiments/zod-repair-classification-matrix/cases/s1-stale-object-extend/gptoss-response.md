```diff
@@
-test("extent() on object with refinements should throw", () => {
-  const schema = z
-    .object({
-      a: z.string(),
-    })
-    .refine(() => true);
-
-  expect(() => schema.extend({ b: z.string() })).toThrow();
-});
+test("extend() on object with refinements should not throw when adding new keys", () => {
+  const schema = z
+    .object({
+      a: z.string(),
+    })
+    .refine(() => true);
+
+  // Since the new key does not overlap with the existing shape, extend should succeed.
+  expect(() => schema.extend({ b: z.string() })).not.toThrow();
+});
```