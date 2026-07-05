```diff
diff --git a/packages/zod/src/v4/classic/tests/tuple.test.ts b/packages/zod/src/v4/classic/tests/tuple.test.ts
index 9c8f7e2..d3b4a1f 100644
--- a/packages/zod/src/v4/classic/tests/tuple.test.ts
+++ b/packages/zod/src/v4/classic/tests/tuple.test.ts
@@
   const r2 = testTuple.safeParse(["asdf", 1234, true]);
   expect(r2.success).toEqual(false);
   expect(r2.error!).toMatchInlineSnapshot(`
-    [ZodError: [
-      {
-        "code": "too_big",
-        "maximum": 2,
-        "origin": "array",
-        "path": [],
-        "message": "Too big: expected array to have <2 items"
-      }
-    ]]
+    [ZodError: [
+      {
+        "code": "too_big",
+        "maximum": 2,
+        "inclusive": true,
+        "origin": "array",
+        "path": [],
+        "message": "Too big: expected array to have <=2 items"
+      }
+    ]]
   `);
@@
   const r2 = await testTuple.safeParseAsync(["asdf", 1234, true]);
   expect(r2.success).toEqual(false);
   expect(r2.error!).toMatchInlineSnapshot(`
-    [ZodError: [
-      {
-        "code": "too_big",
-        "maximum": 2,
-        "origin": "array",
-        "path": [],
-        "message": "Too big: expected array to have <2 items"
-      }
-    ]]
+    [ZodError: [
+      {
+        "code": "too_big",
+        "maximum": 2,
+        "inclusive": true,
+        "origin": "array",
+        "path": [],
+        "message": "Too big: expected array to have <=2 items"
+      }
+    ]]
   `);
```