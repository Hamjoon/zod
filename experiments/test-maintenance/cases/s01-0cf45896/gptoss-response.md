DECISION: fix_tests
```diff
diff --git a/packages/zod/src/v4/classic/tests/to-json-schema.test.ts b/packages/zod/src/v4/classic/tests/to-json-schema.test.ts
index 9c2f7a1..e5b3d4c 100644
--- a/packages/zod/src/v4/classic/tests/to-json-schema.test.ts
+++ b/packages/zod/src/v4/classic/tests/to-json-schema.test.ts
@@
   test("tuple openapi", () => {
     const schema = z.tuple([z.string(), z.number()]);
     expect(z.toJSONSchema(schema, { target: "openapi-3.0" })).toMatchInlineSnapshot(`
-      {
-        "items": [
-          {
-            "type": "string",
-          },
-          {
-            "type": "number",
-          },
-        ],
-        "maxItems": 2,
-        "minItems": 2,
-        "type": "array",
-      }
+      {
+        "items": {
+          "anyOf": [
+            {
+              "type": "string",
+            },
+            {
+              "type": "number",
+            },
+          ],
+        },
+        "maxItems": 2,
+        "minItems": 2,
+        "type": "array",
+      }
     `);
   });
 
   test("tuple with rest openapi", () => {
     const schema = z.tuple([z.string(), z.number()]).rest(z.boolean());
     expect(z.toJSONSchema(schema, { target: "openapi-3.0" })).toMatchInlineSnapshot(`
-      {
-        "items": [
-          {
-            "type": "string",
-          },
-          {
-            "type": "number",
-          },
-          {
-            "type": "boolean",
-          },
-        ],
-        "minItems": 2,
-        "type": "array",
-      }
+      {
+        "items": {
+          "anyOf": [
+            {
+              "type": "string",
+            },
+            {
+              "type": "number",
+            },
+            {
+              "type": "boolean",
+            },
+          ],
+        },
+        "minItems": 2,
+        "type": "array",
+      }
     `);
   });
```