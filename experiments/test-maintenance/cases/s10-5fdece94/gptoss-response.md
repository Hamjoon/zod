DECISION: fix_tests
diff --git a/packages/zod/src/v4/classic/tests/array.test.ts b/packages/zod/src/v4/classic/tests/array.test.ts
index 9c1e2a7..d4f3b9c 100644
--- a/packages/zod/src/v4/classic/tests/array.test.ts
+++ b/packages/zod/src/v4/classic/tests/array.test.ts
@@
   expect(r1.error!.issues).toMatchInlineSnapshot(`
     [
       {
-        "code": "too_small",
-        "message": "Too small: expected array to have >2 items",
+        "code": "too_small",
+        "inclusive": true,
+        "message": "Too small: expected array to have >=2 items",
         "minimum": 2,
         "origin": "array",
         "path": [],
       },
     ]
   `);
@@
   expect(r2.error!.issues).toMatchInlineSnapshot(`
     [
       {
-        "code": "too_big",
-        "maximum": 2,
-        "message": "Too big: expected array to have <2 items",
+        "code": "too_big",
+        "inclusive": true,
+        "maximum": 2,
+        "message": "Too big: expected array to have <=2 items",
         "origin": "array",
         "path": [],
       },
     ]
   `);
@@
   expect(r1.error!.issues).toMatchInlineSnapshot(`
     [
       {
-        "code": "too_small",
-        "message": "Too small: expected array to have >2 items",
+        "code": "too_small",
+        "inclusive": true,
+        "message": "Too small: expected array to have >=2 items",
         "minimum": 2,
         "origin": "array",
         "path": [],
       },
     ]
   `);
@@
   expect(result).toMatchInlineSnapshot(`
     {
       "error": [ZodError: [
       {
         "expected": "string",
         "code": "invalid_type",
         "path": [
           "people",
           0
         ],
         "message": "Invalid input: expected string, received number"
       },
       {
-        "origin": "array",
-        "code": "too_small",
-        "minimum": 2,
+        "origin": "array",
+        "code": "too_small",
+        "inclusive": true,
+        "minimum": 2,
         "path": [
           "people"
         ],
-        "message": "Too small: expected array to have >2 items"
+        "message": "Too small: expected array to have >=2 items"
       }
     ]],
       "success": false,
     }
   `);
diff --git a/packages/zod/src/v4/classic/tests/error.test.ts b/packages/zod/src/v4/classic/tests/error.test.ts
index a7b3c4d..e9f2a1b 100644
--- a/packages/zod/src/v4/classic/tests/error.test.ts
+++ b/packages/zod/src/v4/classic/tests/error.test.ts
@@
   expect(result.error).toMatchInlineSnapshot(`
     [ZodError: [
       {
-        "origin": "array",
-        "code": "too_small",
-        "minimum": 3,
-        "path": [],
-        "message": "Too small: expected array to have >3 items"
+        "origin": "array",
+        "code": "too_small",
+        "inclusive": true,
+        "minimum": 3,
+        "path": [],
+        "message": "Too small: expected array to have >=3 items"
       }
     ]]
   `);
@@
   expect(result.error).toMatchInlineSnapshot(`
     [ZodError: [
       {
         "origin": "string",
         "code": "too_small",
-        "minimum": 10,
+        "inclusive": true,
+        "minimum": 10,
         "path": [],
         "message": "override"
       }
     ]]
   `);
@@
   expect(result.error).toMatchInlineSnapshot(`
     [ZodError: [
       {
         "origin": "string",
         "code": "too_small",
-        "minimum": 6,
+        "inclusive": true,
+        "minimum": 6,
         "path": [
           "password"
         ],
-        "message": "Too small: expected string to have >6 characters"
+        "message": "override"
       },
       {
         "code": "custom",
         "path": [
           "confirm"
@@
   expect(e).toMatchInlineSnapshot(`
     [ZodError: [
       {
         "expected": "string",
         "code": "invalid_type",
         "path": [],
-        "message": "Invalid input: expected string, received number"
+        "message": "override"
       }
     ]]
   `);
diff --git a/packages/zod/src/v4/classic/tests/nested-refine.test.ts b/packages/zod/src/v4/classic/tests/nested-refine.test.ts
index 3d2e1f4..b6c7a9e 100644
--- a/packages/zod/src/v4/classic/tests/nested-refine.test.ts
+++ b/packages/zod/src/v4/classic/tests/nested-refine.test.ts
@@
       {
         "origin": "string",
         "code": "too_small",
-        "minimum": 1,
+        "inclusive": true,
+        "minimum": 1,
         "path": [
           "nested",
           "confirm"
@@
         "origin": "string",
         "code": "too_small",
-        "minimum": 1,
+        "inclusive": true,
+        "minimum": 1,
         "path": [
           "nested",
           "confirm"
diff --git a/packages/zod/src/v4/classic/tests/preprocess.test.ts b/packages/zod/src/v4/classic/tests/preprocess.test.ts
index 5e8c2a1..c3d4b6f 100644
--- a/packages/zod/src/v4/classic/tests/preprocess.test.ts
+++ b/packages/zod/src/v4/classic/tests/preprocess.test.ts
@@
       {
         "origin": "string",
         "code": "too_small",
-        "minimum": 1,
+        "inclusive": true,
+        "minimum": 1,
         "path": [
           "nonEmptyStr"
         ],
-        "message": "Too small: expected string to have >1 characters"
+        "message": "Too small: expected string to have >=1 characters"
       },
       {
         "origin": "number",
         "code": "too_small",
         "minimum": 0,
diff --git a/packages/zod/src/v4/classic/tests/validations.test.ts b/packages/zod/src/v4/classic/tests/validations.test.ts
index 8f7a2c3..a1b4d5e 100644
--- a/packages/zod/src/v4/classic/tests/validations.test.ts
+++ b/packages/zod/src/v4/classic/tests/validations.test.ts
@@
       [
         {
           "code": "too_small",
-          "message": "Too small: expected string to have >4 characters",
+          "inclusive": true,
+          "message": "Too small: expected string to have >=4 characters",
           "minimum": 4,
           "origin": "string",
           "path": [],
         },
       ]
@@
       [
         {
           "code": "too_big",
+          "inclusive": true,
           "maximum": 4,
-          "message": "Too big: expected string to have <4 characters",
+          "message": "Too big: expected string to have <=4 characters",
           "origin": "string",
           "path": [],
         },
       ]
*** End of File ***