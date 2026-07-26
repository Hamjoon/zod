DECISION: fix_production
```diff
diff --git a/packages/zod/src/v3/types.ts b/packages/zod/src/v3/types.ts
index 2b3efe02..1df681cb 100644
--- a/packages/zod/src/v3/types.ts
+++ b/packages/zod/src/v3/types.ts
@@
-        if (!isValid(base)) return base;
+        if (!isValid(base)) return INVALID;
@@
-        if (!isValid(base)) return base;
+        if (!isValid(base)) return INVALID;
diff --git a/packages/zod/src/v4/core/to-json-schema.ts b/packages/zod/src/v4/core/to-json-schema.ts
index 06eeb793..641c7943 100644
--- a/packages/zod/src/v4/core/to-json-schema.ts
+++ b/packages/zod/src/v4/core/to-json-schema.ts
@@
-        case "pipe": {
-          const innerType = this.io === "input" ? def.in : def.out;
-          this.process(innerType, params);
-          result.ref = innerType;
-          break;
-        }
+        case "pipe": {
+          const innerType =
+            this.io === "input"
+              ? // If the input side of the pipe is a transform (e.g., preprocess), skip it
+                // because transforms cannot be represented in JSON Schema.
+                def.in._zod.def.type === "transform"
+                ? def.out
+                : def.in
+              : def.out;
+          this.process(innerType, params);
+          result.ref = innerType;
+          break;
+        }
```