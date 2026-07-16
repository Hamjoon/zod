DECISION: fix_production
```diff
@@
-const formatMap: Partial<Record<checks.$ZodStringFormats, string | undefined>> = {
-  guid: "uuid",
-  url: "uri",
-  datetime: "date-time",
-  json_string: "json-string",
-  regex: "", // do not set
-};
+// Map Zod string formats to JSON Schema formats.
+// Previously, a special entry for `regex` was added with an empty string to suppress the format.
+// This broke expected behavior where a `regex` format should be emitted as `"regex"`.
+// The map now only includes standard mappings; unknown formats fall back to the original format string.
+const formatMap: Partial<Record<checks.$ZodStringFormats, string>> = {
+  guid: "uuid",
+  url: "uri",
+  datetime: "date-time",
+  json_string: "json-string",
+};
```