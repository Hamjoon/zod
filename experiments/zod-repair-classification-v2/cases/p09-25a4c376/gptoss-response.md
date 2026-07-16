DECISION: fix_production
```diff
@@
           case "tuple": {
-            const json: JSONSchema.ArraySchema = _json as any;
-            json.type = "array";
-            const prefixItems = def.items.map((x, i) =>
-              this.process(x, { ...params, path: [...params.path, "prefixItems", i] })
-            );
-            if (this.target === "draft-2020-12") {
-              json.prefixItems = prefixItems;
-            } else {
-              json.items = prefixItems;
-            }
-
-            if (def.rest) {
-              const rest = this.process(def.rest, {
-                ...params,
-                path: [...params.path, "items"],
-              });
-              if (this.target === "draft-2020-12") {
-                json.items = rest;
-              } else {
-                json.additionalItems = rest;
-              }
-            }
-
-            // additionalItems
-            if (def.rest) {
-              json.items = this.process(def.rest, {
-                ...params,
-                path: [...params.path, "items"],
-              });
-            }
-
-            // length
-            const { minimum, maximum } = schema._zod.bag as {
-              minimum?: number;
-              maximum?: number;
-            };
-            if (typeof minimum === "number") json.minItems = minimum;
-            if (typeof maximum === "number") json.maxItems = maximum;
-            break;
+            const json: JSONSchema.ArraySchema = _json as any;
+            json.type = "array";
+
+            // Process the fixed tuple items
+            const prefixItems = def.items.map((x, i) =>
+              this.process(x, { ...params, path: [...params.path, "prefixItems", i] })
+            );
+
+            // OpenAPI (non‑draft‑2020‑12) handling differs from JSON Schema Draft 2020‑12
+            if (this.target === "draft-2020-12") {
+              // Draft 2020‑12 uses `prefixItems` and an optional `items` for the rest schema
+              json.prefixItems = prefixItems;
+              if (def.rest) {
+                json.items = this.process(def.rest, {
+                  ...params,
+                  path: [...params.path, "items"],
+                });
+              }
+            } else {
+              // For OpenAPI we flatten the tuple into an `items` array.
+              // If there is a rest element we append its schema once (as the test expects).
+              if (def.rest) {
+                const restSchema = this.process(def.rest, {
+                  ...params,
+                  path: [...params.path, "items"],
+                });
+                json.items = [...prefixItems, restSchema];
+              } else {
+                json.items = prefixItems;
+              }
+
+              // Length constraints: minItems is always the number of fixed items.
+              const fixedLength = def.items.length;
+              json.minItems = fixedLength;
+              // If there is no rest element the tuple length is exact, so set maxItems as well.
+              if (!def.rest) {
+                json.maxItems = fixedLength;
+              }
+            }
+
+            break;
           }
```