You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/classic/tests/json-schema.test.ts, packages/docs/content/json-schema.mdx, packages/zod/src/v4/core/to-json-schema.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/docs/content/json-schema.mdx b/packages/docs/content/json-schema.mdx
index 94298d727..084007d7b 100644
--- a/packages/docs/content/json-schema.mdx
+++ b/packages/docs/content/json-schema.mdx
@@ -142,7 +142,7 @@ Below is a quick reference for each supported parameter. Each one is explained i
 interface ToJSONSchemaParams {
   /** The JSON Schema version to target.
    * - `"draft-2020-12"` — Default. JSON Schema Draft 2020-12
-   * - `"draft-7"` — Default. JSON Schema Draft 7 */
+   * - `"draft-7"` — JSON Schema Draft 7 */
   target?: "draft-7" | "draft-2020-12";
 
   /** A registry used to look up metadata for each schema. 
diff --git a/packages/zod/src/v4/core/to-json-schema.ts b/packages/zod/src/v4/core/to-json-schema.ts
index 3b350c7de..22d48b57e 100644
--- a/packages/zod/src/v4/core/to-json-schema.ts
+++ b/packages/zod/src/v4/core/to-json-schema.ts
@@ -719,9 +719,9 @@ export class JSONSchemaGenerator {
     }
 
     if (this.target === "draft-2020-12") {
-      result.$schema = "https://json-schema.org/draft-2020-12/schema";
+      result.$schema = "https://json-schema.org/draft/2020-12/schema";
     } else if (this.target === "draft-7") {
-      result.$schema = "https://json-schema.org/draft-07/schema";
+      result.$schema = "http://json-schema.org/draft-07/schema#";
     } else {
       console.warn(`Invalid target: ${this.target}`);
     }

</recent_change_diff>

Current test results:
<test_output>
 ❯ src/v4/classic/tests/json-schema.test.ts:1004:18
    1002|     },
    1003|   });
    1004|   expect(schema).toMatchInlineSnapshot(`
       |                  ^
    1005|     {
    1006|       "$schema": "https://json-schema.org/draft-2020-12/schema",

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[23/37]⎯

 FAIL  src/v4/classic/tests/json-schema.test.ts > override with refs
Error: Snapshot `override with refs 1` mismatched

- Expected
+ Received

  {
-   "$schema": "https://json-schema.org/draft-2020-12/schema",
+   "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "STRING",
  }

 ❯ src/v4/classic/tests/json-schema.test.ts:1044:18
    1042|   });
    1043| 
    1044|   expect(result).toMatchInlineSnapshot(`
       |                  ^
    1045|     {
    1046|       "$schema": "https://json-schema.org/draft-2020-12/schema",

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[24/37]⎯

 FAIL  src/v4/classic/tests/json-schema.test.ts > pipe
Error: Snapshot `pipe 1` mismatched

- Expected
+ Received

  {
-   "$schema": "https://json-schema.org/draft-2020-12/schema",
+   "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "number",
  }

 ❯ src/v4/classic/tests/json-schema.test.ts:1085:13
    1083| 
    1084|   const a = z.toJSONSchema(mySchema);
    1085|   expect(a).toMatchInlineSnapshot(`
       |             ^
    1086|     {
    1087|       "$schema": "https://json-schema.org/draft-2020-12/schema",

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[25/37]⎯

 FAIL  src/v4/classic/tests/json-schema.test.ts > passthrough schemas
Error: Snapshot `passthrough schemas 1` mismatched

- Expected
+ Received

@@ -14,11 +14,11 @@
          "str",
        ],
        "type": "object",
      },
    },
-   "$schema": "https://json-schema.org/draft-2020-12/schema",
+   "$schema": "https://json-schema.org/draft/2020-12/schema",
    "properties": {
      "a": {
        "$ref": "#/$defs/__schema0",
      },
      "b": {

 ❯ src/v4/classic/tests/json-schema.test.ts:1121:18
    1119|     reused: "ref",
    1120|   });
    1121|   expect(result).toMatchInlineSnapshot(`
       |                  ^
    1122|     {
    1123|       "$defs": {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[26/37]⎯

 FAIL  src/v4/classic/tests/json-schema.test.ts > extract schemas with id
Error: Snapshot `extract schemas with id 1` mismatched

- Expected
+ Received

@@ -7,11 +7,11 @@
      "name": {
        "id": "name",
        "type": "string",
      },
    },
-   "$schema": "https://json-schema.org/draft-2020-12/schema",
+   "$schema": "https://json-schema.org/draft/2020-12/schema",
    "properties": {
      "age": {
        "$ref": "#/$defs/age",
      },
      "first_name": {

 ❯ src/v4/classic/tests/json-schema.test.ts:1179:18
    1177|     })
    1178|   );
    1179|   expect(result).toMatchInlineSnapshot(`
       |                  ^
    1180|     {
    1181|       "$defs": {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[27/37]⎯

 FAIL  src/v4/classic/tests/json-schema.test.ts > unrepresentable literal values are ignored
Error: Snapshot `unrepresentable literal values are ignored 1` mismatched

- Expected
+ Received

@@ -1,7 +1,7 @@
  {
-   "$schema": "https://json-schema.org/draft-2020-12/schema",
+   "$schema": "https://json-schema.org/draft/2020-12/schema",
    "enum": [
      "hello",
      null,
      5,
      1324,

 ❯ src/v4/classic/tests/json-schema.test.ts:1225:13
    1223| test("unrepresentable literal values are ignored", () => {
    1224|   const a = z.toJSONSchema(z.literal(["hello", null, 5, BigInt(1324), …
    1225|   expect(a).toMatchInlineSnapshot(`
       |             ^
    1226|     {
    1227|       "$schema": "https://json-schema.org/draft-2020-12/schema",

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[28/37]⎯

 FAIL  src/v4/classic/tests/json-schema.test.ts > describe with id
Error: Snapshot `describe with id 1` mismatched

- Expected
+ Received

@@ -3,11 +3,11 @@
      "jobId": {
        "id": "jobId",
        "type": "string",
      },
    },
-   "$schema": "https://json-schema.org/draft-2020-12/schema",
+   "$schema": "https://json-schema.org/draft/2020-12/schema",
    "properties": {
      "current": {
        "$ref": "#/$defs/jobId",
        "description": "Current job",
      },

 ❯ src/v4/classic/tests/json-schema.test.ts:1266:13
    1264|     })
    1265|   );
    1266|   expect(a).toMatchInlineSnapshot(`
       |             ^
    1267|     {
    1268|       "$defs": {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[29/37]⎯

 FAIL  src/v4/classic/tests/json-schema.test.ts > overwrite id
Error: Snapshot `overwrite id 1` mismatched

- Expected
+ Received

@@ -7,11 +7,11 @@
      "bbb": {
        "$ref": "#/$defs/aaa",
        "id": "bbb",
      },
    },
-   "$schema": "https://json-schema.org/draft-2020-12/schema",
+   "$schema": "https://json-schema.org/draft/2020-12/schema",
    "properties": {
      "current": {
        "$ref": "#/$defs/aaa",
      },
      "previous": {

 ❯ src/v4/classic/tests/json-schema.test.ts:1303:13
    1301|     })
    1302|   );
    1303|   expect(a).toMatchInlineSnapshot(`
       |             ^
    1304|     {
    1305|       "$defs": {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[30/37]⎯

 FAIL  src/v4/classic/tests/json-schema.test.ts > overwrite descriptions
Error: Snapshot `overwrite descriptions 1` mismatched

- Expected
+ Received

@@ -1,7 +1,7 @@
  {
-   "$schema": "https://json-schema.org/draft-2020-12/schema",
+   "$schema": "https://json-schema.org/draft/2020-12/schema",
    "properties": {
      "d": {
        "description": "d",
        "type": "string",
      },

 ❯ src/v4/classic/tests/json-schema.test.ts:1380:13
    1378|     })
    1379|   );
    1380|   expect(a).toMatchInlineSnapshot(`
       |             ^
    1381|     {
    1382|       "$schema": "https://json-schema.org/draft-2020-12/schema",

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[31/37]⎯

 FAIL  src/v4/classic/tests/json-schema.test.ts > top-level readonly
Error: Snapshot `top-level readonly 1` mismatched

- Expected
+ Received

@@ -16,11 +16,11 @@
          "a",
        ],
        "type": "object",
      },
    },
-   "$schema": "https://json-schema.org/draft-2020-12/schema",
+   "$schema": "https://json-schema.org/draft/2020-12/schema",
    "id": "A",
    "properties": {
      "b": {
        "$ref": "#/$defs/B",
      },

 ❯ src/v4/classic/tests/json-schema.test.ts:1460:18
    1458| 
    1459|   const result = z.toJSONSchema(A);
    1460|   expect(result).toMatchInlineSnapshot(`
       |                  ^
    1461|     {
    1462|       "$defs": {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[32/37]⎯

 FAIL  src/v4/classic/tests/json-schema.test.ts > basic registry
Error: Snapshot `basic registry 1` mismatched

- Expected
+ Received

@@ -1,9 +1,9 @@
  {
    "schemas": {
      "Post": {
-       "$schema": "https://json-schema.org/draft-2020-12/schema",
+       "$schema": "https://json-schema.org/draft/2020-12/schema",
        "properties": {
          "author": {
            "$ref": "User",
          },
          "content": {
@@ -19,11 +19,11 @@
          "author",
        ],
        "type": "object",
      },
      "User": {
-       "$schema": "https://json-schema.org/draft-2020-12/schema",
+       "$schema": "https://json-schema.org/draft/2020-12/schema",
        "properties": {
          "name": {
            "type": "string",
          },
          "posts": {

 ❯ src/v4/classic/tests/json-schema.test.ts:1522:18
    1520| 
    1521|   const result = z.toJSONSchema(myRegistry);
    1522|   expect(result).toMatchInlineSnapshot(`
       |                  ^
    1523|     {
    1524|       "schemas": {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[33/37]⎯

 FAIL  src/v4/classic/tests/json-schema.test.ts > _ref
Error: Snapshot `_ref 1` mismatched

- Expected
+ Received

  {
-   "$schema": "https://json-schema.org/draft-2020-12/schema",
+   "$schema": "https://json-schema.org/draft/2020-12/schema",
    "description": "a",
    "type": "string",
  }

 ❯ src/v4/classic/tests/json-schema.test.ts:1572:13
    1570|   // const a = z.promise(z.string().describe("a"));
    1571|   const a = z.toJSONSchema(z.promise(z.string().describe("a")));
    1572|   expect(a).toMatchInlineSnapshot(`
       |             ^
    1573|     {
    1574|       "$schema": "https://json-schema.org/draft-2020-12/schema",

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[34/37]⎯

 FAIL  src/v4/classic/tests/json-schema.test.ts > defaults/prefaults
Error: Snapshot `defaults/prefaults 1` mismatched

- Expected
+ Received

  {
-   "$schema": "https://json-schema.org/draft-2020-12/schema",
+   "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "number",
  }

 ❯ src/v4/classic/tests/json-schema.test.ts:1608:27
    1606| 
    1607|   // a
    1608|   expect(toJSONSchema(a)).toMatchInlineSnapshot(`
       |                           ^
    1609|     {
    1610|       "$schema": "https://json-schema.org/draft-2020-12/schema",

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[35/37]⎯

 FAIL  src/v4/classic/tests/json-schema.test.ts > input type
Error: Snapshot `input type 1` mismatched

- Expected
+ Received

@@ -1,7 +1,7 @@
  {
-   "$schema": "https://json-schema.org/draft-2020-12/schema",
+   "$schema": "https://json-schema.org/draft/2020-12/schema",
    "properties": {
      "a": {
        "type": "string",
      },
      "b": {

 ❯ src/v4/classic/tests/json-schema.test.ts:1660:49
    1658|     e: z.string().prefault("hello"),
    1659|   });
    1660|   expect(toJSONSchema(schema, { io: "input" })).toMatchInlineSnapshot(`
       |                                                 ^
    1661|     {
    1662|       "$schema": "https://json-schema.org/draft-2020-12/schema",

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[36/37]⎯

 FAIL  src/v4/classic/tests/json-schema.test.ts > examples on pipe
Error: Snapshot `examples on pipe 1` mismatched

- Expected
+ Received

  {
-   "$schema": "https://json-schema.org/draft-2020-12/schema",
+   "$schema": "https://json-schema.org/draft/2020-12/schema",
    "examples": [
      "test",
    ],
    "type": "string",
  }

 ❯ src/v4/classic/tests/json-schema.test.ts:1744:13
    1742| 
    1743|   const i = z.toJSONSchema(schema, { io: "input", unrepresentable: "an…
    1744|   expect(i).toMatchInlineSnapshot(`
       |             ^
    1745|     {
    1746|       "$schema": "https://json-schema.org/draft-2020-12/schema",

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[37/37]⎯

  Snapshots  37 failed
 Test Files  1 failed | 1 passed (2)
      Tests  37 failed | 41 passed (78)
Type Errors  no errors
   Start at  15:52:15
   Duration  4.42s (transform 575ms, setup 0ms, collect 907ms, tests 39ms, environment 0ms, prepare 73ms, typecheck 4.19s)


</test_output>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/json-schema.test.ts" lines="1-220">
import { describe, expect, test } from "vitest";
import * as z from "zod/v4";
import { toJSONSchema } from "zod/v4/core";

describe("toJSONSchema", () => {
  test("primitive types", () => {
    expect(toJSONSchema(z.string())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "type": "string",
      }
    `);
    expect(toJSONSchema(z.number())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "type": "number",
      }
    `);
    expect(toJSONSchema(z.boolean())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "type": "boolean",
      }
    `);
    expect(toJSONSchema(z.null())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "type": "null",
      }
    `);
    expect(toJSONSchema(z.undefined())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "type": "null",
      }
    `);
    expect(toJSONSchema(z.any())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
      }
    `);
    expect(toJSONSchema(z.unknown())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
      }
    `);
    expect(toJSONSchema(z.never())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "not": {},
      }
    `);
    expect(toJSONSchema(z.email())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "format": "email",
        "pattern": "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
        "type": "string",
      }
    `);
    expect(toJSONSchema(z.iso.datetime())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "format": "date-time",
        "pattern": "^((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))T([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(\\.\\d+)?(Z)$",
        "type": "string",
      }
    `);
    expect(toJSONSchema(z.iso.date())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "format": "date",
        "pattern": "^((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))$",
        "type": "string",
      }
    `);
    expect(toJSONSchema(z.iso.time())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "format": "time",
        "pattern": "^([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(\\.\\d+)?$",
        "type": "string",
      }
    `);
    expect(toJSONSchema(z.iso.duration())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "format": "duration",
        "pattern": "^P(?:(\\d+W)|(?!.*W)(?=\\d|T\\d)(\\d+Y)?(\\d+M)?(\\d+D)?(T(?=\\d)(\\d+H)?(\\d+M)?(\\d+([.,]\\d+)?S)?)?)$",
        "type": "string",
      }
    `);
    expect(toJSONSchema(z.ipv4())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "format": "ipv4",
        "pattern": "^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$",
        "type": "string",
      }
    `);
    expect(toJSONSchema(z.ipv6())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "format": "ipv6",
        "pattern": "^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})$",
        "type": "string",
      }
    `);
    expect(toJSONSchema(z.uuid())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "format": "uuid",
        "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$",
        "type": "string",
      }
    `);
    expect(toJSONSchema(z.guid())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "format": "uuid",
        "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$",
        "type": "string",
      }
    `);
    expect(toJSONSchema(z.url())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "format": "uri",
        "type": "string",
      }
    `);
    expect(toJSONSchema(z.base64())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "contentEncoding": "base64",
        "format": "base64",
        "pattern": "^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$",
        "type": "string",
      }
    `);
    expect(toJSONSchema(z.cuid())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "format": "cuid",
        "pattern": "^[cC][^\\s-]{8,}$",
        "type": "string",
      }
    `);
    // expect(toJSONSchema(z.regex(/asdf/))).toMatchInlineSnapshot();
    expect(toJSONSchema(z.emoji())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "format": "emoji",
        "pattern": "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$",
        "type": "string",
      }
    `);
    expect(toJSONSchema(z.nanoid())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "format": "nanoid",
        "pattern": "^[a-zA-Z0-9_-]{21}$",
        "type": "string",
      }
    `);
    expect(toJSONSchema(z.cuid2())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "format": "cuid2",
        "pattern": "^[0-9a-z]+$",
        "type": "string",
      }
    `);
    expect(toJSONSchema(z.ulid())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "format": "ulid",
        "pattern": "^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$",
        "type": "string",
      }
    `);
    // expect(toJSONSchema(z.cidr())).toMatchInlineSnapshot();
    expect(toJSONSchema(z.number())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "type": "number",
      }
    `);
    expect(toJSONSchema(z.int())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "maximum": 9007199254740991,
        "minimum": -9007199254740991,
        "type": "integer",
      }
    `);
    expect(toJSONSchema(z.int32())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "maximum": 2147483647,
        "minimum": -2147483648,
        "type": "integer",
      }
    `);
    expect(toJSONSchema(z.float32())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "maximum": 3.4028234663852886e+38,
        "minimum": -3.4028234663852886e+38,
        "type": "number",
      }
    `);
    expect(toJSONSchema(z.float64())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft-2020-12/schema",
        "maximum": 1.7976931348623157e+308,
        "minimum": -1.7976931348623157e+308,
        "type": "number",
      }
    `);
</test_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/to-json-schema.ts" lines="697-749">

    for (const entry of [...this.seen.entries()].reverse()) {
      flattenRef(entry[0], { target: this.target });
    }

    const result = { ...root.def };

    const defs: JSONSchema.BaseSchema["$defs"] = params.external?.defs ?? {};
    for (const entry of this.seen.entries()) {
      const seen = entry[1];
      if (seen.def && seen.defId) {
        defs[seen.defId] = seen.def;
      }
    }

    // set definitions in result
    if (!params.external && Object.keys(defs).length > 0) {
      if (this.target === "draft-2020-12") {
        result.$defs = defs;
      } else {
        result.definitions = defs;
      }
    }

    if (this.target === "draft-2020-12") {
      result.$schema = "https://json-schema.org/draft/2020-12/schema";
    } else if (this.target === "draft-7") {
      result.$schema = "http://json-schema.org/draft-07/schema#";
    } else {
      console.warn(`Invalid target: ${this.target}`);
    }

    try {
      // this "finalizes" this schema and ensures all cycles are removed
      // each call to .emit() is functionally independent
      // though the seen map is shared
      return JSON.parse(JSON.stringify(result));
    } catch (_err) {
      throw new Error("Error converting schema to JSON.");
    }
  }
}

interface ToJSONSchemaParams extends Omit<JSONSchemaGeneratorParams & EmitParams, never> {}
interface RegistryToJSONSchemaParams extends Omit<JSONSchemaGeneratorParams & EmitParams, never> {
  uri?: (id: string) => string;
}

export function toJSONSchema(schema: schemas.$ZodType, _params?: ToJSONSchemaParams): JSONSchema.BaseSchema;
export function toJSONSchema(
  registry: $ZodRegistry<{ id?: string | undefined }>,
  _params?: RegistryToJSONSchemaParams
): { schemas: Record<string, JSONSchema.BaseSchema> };
</production_snippet>
