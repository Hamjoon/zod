You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/classic/tests/json-schema.test.ts, packages/zod/src/v4/core/to-json-schema.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/core/to-json-schema.ts b/packages/zod/src/v4/core/to-json-schema.ts
index c262c861..fc03b34b 100644
--- a/packages/zod/src/v4/core/to-json-schema.ts
+++ b/packages/zod/src/v4/core/to-json-schema.ts
@@ -48,11 +48,12 @@ interface EmitParams {
     | undefined;
 }
 
-const formatMap: Partial<Record<checks.$ZodStringFormats, string>> = {
+const formatMap: Partial<Record<checks.$ZodStringFormats, string | undefined>> = {
   guid: "uuid",
   url: "uri",
   datetime: "date-time",
   json_string: "json-string",
+  regex: "", // do not set
 };
 
 interface Seen {
@@ -156,15 +157,16 @@ export class JSONSchemaGenerator {
           // custom pattern overrides format
           if (format) {
             json.format = formatMap[format as checks.$ZodStringFormats] ?? format;
+            if (json.format === "") delete json.format; // empty format is not valid
           }
           if (contentEncoding) json.contentEncoding = contentEncoding;
           if (patterns && patterns.size > 0) {
             const regexes = [...patterns];
-            if (regexes.length === 1) {
-              json.pattern = regexes[0].source;
-            } else {
-              json.allOf = [
+            if (regexes.length === 1) json.pattern = regexes[0].source;
+            else if (regexes.length > 1) {
+              result.schema.allOf = [
                 ...regexes.map((regex) => ({
+                  ...(this.target === "draft-7" ? { type: "string" } : {}),
                   pattern: regex.source,
                 })),
               ];

</recent_change_diff>

Current test results:
<test_output>
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v2.1.9 /Users/donggi/_projects/etc-projects/zod-thesis/.worktrees/s04-6b13cc94/packages/zod

 ❯ src/v4/classic/tests/json-schema.test.ts (41 tests | 2 failed) 35ms
   × toJSONSchema > string formats 3ms
     → Snapshot `toJSONSchema > string formats 12` mismatched
   × toJSONSchema > string patterns 1ms
     → Snapshot `toJSONSchema > string patterns 2` mismatched
 ✓  TS  src/v4/classic/tests/json-schema.test.ts (41 tests)

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/v4/classic/tests/json-schema.test.ts > toJSONSchema > string formats
Error: Snapshot `toJSONSchema > string formats 12` mismatched

- Expected
+ Received

  {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
-   "format": "regex",
    "pattern": "asdf",
    "type": "string",
  }

 ❯ src/v4/classic/tests/json-schema.test.ts:361:54
    359|       }
    360|     `);
    361|     expect(z.toJSONSchema(z.string().regex(/asdf/))).toMatchInlineSnap…
       |                                                      ^
    362|       {
    363|         "$schema": "https://json-schema.org/draft/2020-12/schema",

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/v4/classic/tests/json-schema.test.ts > toJSONSchema > string patterns
Error: Snapshot `toJSONSchema > string patterns 2` mismatched

- Expected
+ Received

@@ -6,8 +6,7 @@
      },
      {
        "pattern": "world$",
      },
    ],
-   "format": "regex",
    "type": "string",
  }

 ❯ src/v4/classic/tests/json-schema.test.ts:397:7
    395|           .regex(/world$/)
    396|       )
    397|     ).toMatchInlineSnapshot(`
       |       ^
    398|   {
    399|     "$schema": "https://json-schema.org/draft/2020-12/schema",

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯

  Snapshots  2 failed
 Test Files  1 failed | 1 passed (2)
      Tests  2 failed | 80 passed (82)
Type Errors  no errors
   Start at  15:51:29
   Duration  4.08s (transform 156ms, setup 0ms, collect 231ms, tests 35ms, environment 0ms, prepare 42ms, typecheck 3.97s)


</test_output>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/json-schema.test.ts" lines="339-436">
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "contentEncoding": "base64",
        "format": "base64",
        "pattern": "^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$",
        "type": "string",
      }
    `);
    expect(z.toJSONSchema(z.url())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "format": "uri",
        "type": "string",
      }
    `);
    expect(z.toJSONSchema(z.guid())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "format": "uuid",
        "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$",
        "type": "string",
      }
    `);
    expect(z.toJSONSchema(z.string().regex(/asdf/))).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "format": "regex",
        "pattern": "asdf",
        "type": "string",
      }
    `);
  });

  test("string patterns", () => {
    expect(z.toJSONSchema(z.string().startsWith("hello").includes("cruel").endsWith("world"))).toMatchInlineSnapshot(`
  {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "allOf": [
      {
        "pattern": "^hello.*",
      },
      {
        "pattern": "cruel",
      },
      {
        "pattern": ".*world$",
      },
    ],
    "type": "string",
  }
`);

    expect(
      z.toJSONSchema(
        z
          .string()
          .regex(/^hello/)
          .regex(/world$/)
      )
    ).toMatchInlineSnapshot(`
  {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "allOf": [
      {
        "pattern": "^hello",
      },
      {
        "pattern": "world$",
      },
    ],
    "format": "regex",
    "type": "string",
  }
`);
  });

  test("number constraints", () => {
    expect(z.toJSONSchema(z.number().min(5).max(10))).toMatchInlineSnapshot(
      `
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "maximum": 10,
        "minimum": 5,
        "type": "number",
      }
    `
    );

    expect(z.toJSONSchema(z.number().gt(5).gt(10))).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "exclusiveMinimum": 10,
        "type": "number",
      }
    `);

    expect(z.toJSONSchema(z.number().gt(5).gte(10))).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
</test_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/to-json-schema.ts" lines="26-81">
interface ProcessParams {
  schemaPath: schemas.$ZodType[];
  path: (string | number)[];
}

interface EmitParams {
  /** How to handle cycles.
   * - `"ref"` — Default. Cycles will be broken using $defs
   * - `"throw"` — Cycles will throw an error if encountered */
  cycles?: "ref" | "throw";
  /* How to handle reused schemas.
   * - `"inline"` — Default. Reused schemas will be inlined
   * - `"ref"` — Reused schemas will be extracted as $defs */
  reused?: "ref" | "inline";

  external?:
    | {
        /**  */
        registry: $ZodRegistry<{ id?: string | undefined }>;
        uri: (id: string) => string;
        defs: Record<string, JSONSchema.BaseSchema>;
      }
    | undefined;
}

const formatMap: Partial<Record<checks.$ZodStringFormats, string | undefined>> = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: "", // do not set
};

interface Seen {
  /** JSON Schema result for this Zod schema */
  schema: JSONSchema.BaseSchema;
  /** A cached version of the schema that doesn't get overwritten during ref resolution */
  def?: JSONSchema.BaseSchema;
  defId?: string | undefined;
  /** Number of times this schema was encountered during traversal */
  count: number;
  /** Cycle path */
  cycle?: (string | number)[] | undefined;
  isParent?: boolean | undefined;
  ref?: schemas.$ZodType | undefined | null;
}

export class JSONSchemaGenerator {
  metadataRegistry: $ZodRegistry<Record<string, any>>;
  target: "draft-7" | "draft-2020-12";
  unrepresentable: "throw" | "any";
  override: (ctx: { zodSchema: schemas.$ZodTypes; jsonSchema: JSONSchema.BaseSchema }) => void;
  io: "input" | "output";

  counter = 0;
  seen: Map<schemas.$ZodType, Seen>;
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/to-json-schema.ts" lines="135-194">
    // if (parent) {
    //   // schema was cloned from another schema
    //   result.ref = parent;
    //   this.process(parent, params);
    //   this.seen.get(parent)!.isParent = true;
    // }

    if (parent) {
      // schema was cloned from another schema
      result.ref = parent;
      this.process(parent, params);
      this.seen.get(parent)!.isParent = true;
    } else {
      const _json = result.schema;
      switch (def.type) {
        case "string": {
          const json: JSONSchema.StringSchema = _json as any;
          json.type = "string";
          const { minimum, maximum, format, patterns, contentEncoding } = schema._zod
            .bag as schemas.$ZodStringInternals<unknown>["bag"];
          if (typeof minimum === "number") json.minLength = minimum;
          if (typeof maximum === "number") json.maxLength = maximum;
          // custom pattern overrides format
          if (format) {
            json.format = formatMap[format as checks.$ZodStringFormats] ?? format;
            if (json.format === "") delete json.format; // empty format is not valid
          }
          if (contentEncoding) json.contentEncoding = contentEncoding;
          if (patterns && patterns.size > 0) {
            const regexes = [...patterns];
            if (regexes.length === 1) json.pattern = regexes[0].source;
            else if (regexes.length > 1) {
              result.schema.allOf = [
                ...regexes.map((regex) => ({
                  ...(this.target === "draft-7" ? { type: "string" } : {}),
                  pattern: regex.source,
                })),
              ];
            }
          }

          break;
        }
        case "number": {
          const json: JSONSchema.NumberSchema | JSONSchema.IntegerSchema = _json as any;
          const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
          if (typeof format === "string" && format.includes("int")) json.type = "integer";
          else json.type = "number";

          if (typeof exclusiveMinimum === "number") json.exclusiveMinimum = exclusiveMinimum;
          if (typeof minimum === "number") {
            json.minimum = minimum;
            if (typeof exclusiveMinimum === "number") {
              if (exclusiveMinimum >= minimum) delete json.minimum;
              else delete json.exclusiveMinimum;
            }
          }

          if (typeof exclusiveMaximum === "number") json.exclusiveMaximum = exclusiveMaximum;
          if (typeof maximum === "number") {
</production_snippet>
