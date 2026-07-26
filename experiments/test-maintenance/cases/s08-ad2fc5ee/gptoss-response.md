DECISION: fix_production
```diff
diff --git a/packages/zod/src/v4/core/to-json-schema.ts b/packages/zod/src/v4/core/to-json-schema.ts
index ca1a6800..26d7adb3 100644
--- a/packages/zod/src/v4/core/to-json-schema.ts
+++ b/packages/zod/src/v4/core/to-json-schema.ts
@@
         case "file": {
-          const json: JSONSchema.StringSchema = _json as any;
-          const file: JSONSchema.StringSchema = {
-            type: "string",
-            format: "binary",
-            contentEncoding: "binary",
-          };
-
-          const { minimum, maximum, mime } = schema._zod.bag as schemas.$ZodFileInternals["bag"];
-          if (minimum !== undefined) file.minLength = minimum;
-          if (maximum !== undefined) file.maxLength = maximum;
-          if (mime) {
-            if (mime.length === 1) {
-              file.contentMediaType = mime[0];
-              Object.assign(json, file);
-            } else {
-              json.anyOf = mime.map((m) => {
-                const mFile: JSONSchema.StringSchema = { ...file, contentMediaType: m };
-                return mFile;
-              });
-            }
-          }
-
-          // if (this.unrepresentable === "throw") {
-          //   throw new Error("File cannot be represented in JSON Schema");
-          // }
+          // Build a base JSON Schema representation for a file (binary string)
+          const json: JSONSchema.StringSchema = _json as any;
+          const base: JSONSchema.StringSchema = {
+            type: "string",
+            format: "binary",
+            contentEncoding: "binary",
+          };
+
+          const { minimum, maximum, mime } = schema._zod.bag as schemas.$ZodFileInternals["bag"];
+          if (minimum !== undefined) base.minLength = minimum;
+          if (maximum !== undefined) base.maxLength = maximum;
+
+          if (mime && mime.length > 0) {
+            if (mime.length === 1) {
+              // Single MIME type – add it directly to the schema
+              base.contentMediaType = mime[0];
+              Object.assign(json, base);
+            } else {
+              // Multiple MIME types – represent as an anyOf of schemas, each with its own contentMediaType
+              json.anyOf = mime.map((m) => ({
+                ...base,
+                contentMediaType: m,
+              }));
+            }
+          } else {
+            // No MIME type constraints – just assign the base schema
+            Object.assign(json, base);
+          }
+
+          // The previous behaviour threw an error for unrepresentable file schemas.
+          // This has been changed to provide a JSON Schema representation instead.
+          break;
         }
         case "transform": {
```