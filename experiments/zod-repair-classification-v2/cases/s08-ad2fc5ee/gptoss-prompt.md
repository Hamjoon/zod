You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/classic/tests/to-json-schema.test.ts, packages/docs/content/api.mdx, packages/docs/content/json-schema.mdx, packages/docs/content/v4/index.mdx, packages/zod/src/v4/classic/schemas.ts, packages/zod/src/v4/core/schemas.ts, packages/zod/src/v4/core/to-json-schema.ts, play.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/docs/content/api.mdx b/packages/docs/content/api.mdx
index e673ea9d..89580628 100644
--- a/packages/docs/content/api.mdx
+++ b/packages/docs/content/api.mdx
@@ -1630,6 +1630,38 @@ z.set(z.string()).check(z.size(5)); // must contain 5 items exactly
 </Tab>
 </Tabs>
 
+## Files
+
+To validate `File` instances:
+
+<Tabs groupId="lib" items={["Zod", "Zod Mini"]}>
+<Tab value="Zod">
+```ts
+const fileSchema = z.file();
+
+fileSchema.min(10_000); // minimum .size (bytes)
+fileSchema.max(1_000_000); // maximum .size (bytes)
+fileSchema.mime(["image/png"]); // MIME type
+```
+
+</Tab>
+<Tab value='zod/v4-mini'>
+```ts
+const fileSchema = z.file();
+
+fileSchema.check(
+  z.minSize(10_000), // minimum .size (bytes)
+  z.maxSize(1_000_000), // maximum .size (bytes)
+  z.mime(["image/png"]); // MIME type
+)
+```
+</Tab>
+</Tabs>
+
+
+
+
+
 ## Promises
 
 <Callout type="warn">
@@ -2446,6 +2478,7 @@ const jsonSchema = z.lazy(() => {
 });
 ```
 
+
 ## Custom
 
 You can create a Zod schema for any TypeScript type by using `z.custom()`. This is useful for creating schemas for types that are not supported by Zod out of the box, such as template string literals.
diff --git a/packages/docs/content/json-schema.mdx b/packages/docs/content/json-schema.mdx
index 7039b2d5..f729c30b 100644
--- a/packages/docs/content/json-schema.mdx
+++ b/packages/docs/content/json-schema.mdx
@@ -26,6 +26,7 @@ z.toJSONSchema(schema)
 //   type: 'object',
 //   properties: { name: { type: 'string' }, age: { type: 'number' } },
 //   required: [ 'name', 'age' ]
+//   additionalProperties: false
 // }
 ```
 
@@ -312,7 +313,6 @@ z.void(); // ❌
 z.date(); // ❌
 z.map(); // ❌
 z.set(); // ❌
-z.file(); // ❌
 z.transform(); // ❌
 z.nan(); // ❌
 z.custom(); // ❌
@@ -348,6 +348,7 @@ toJSONSchema(User);
 //   type: 'object',
 //   properties: { name: { type: 'string' }, friend: { '$ref': '#' } },
 //   required: [ 'name', 'friend' ]
+//   additionalProperties: false
 // }
 ```
 
diff --git a/packages/docs/content/v4/index.mdx b/packages/docs/content/v4/index.mdx
index 686841cb..bd318149 100644
--- a/packages/docs/content/v4/index.mdx
+++ b/packages/docs/content/v4/index.mdx
@@ -584,7 +584,7 @@ const fileSchema = z.file();
 
 fileSchema.min(10_000); // minimum .size (bytes)
 fileSchema.max(1_000_000); // maximum .size (bytes)
-fileSchema.type("image/png"); // MIME type
+fileSchema.mime(["image/png"]); // MIME type
 ```
 
 ## Internationalization
diff --git a/packages/zod/src/v4/classic/schemas.ts b/packages/zod/src/v4/classic/schemas.ts
index 979a72b9..1c1a405c 100644
--- a/packages/zod/src/v4/classic/schemas.ts
+++ b/packages/zod/src/v4/classic/schemas.ts
@@ -1554,7 +1554,7 @@ export interface ZodFile extends ZodType {
 
   min(size: number, params?: string | core.$ZodCheckMinSizeParams): this;
   max(size: number, params?: string | core.$ZodCheckMaxSizeParams): this;
-  mime(types: Array<util.MimeTypes>, params?: string | core.$ZodCheckMimeTypeParams): this;
+  mime(types: util.MimeTypes | Array<util.MimeTypes>, params?: string | core.$ZodCheckMimeTypeParams): this;
 }
 export const ZodFile: core.$constructor<ZodFile> = /*@__PURE__*/ core.$constructor("ZodFile", (inst, def) => {
   core.$ZodFile.init(inst, def);
@@ -1562,7 +1562,7 @@ export const ZodFile: core.$constructor<ZodFile> = /*@__PURE__*/ core.$construct
 
   inst.min = (size, params) => inst.check(core._minSize(size, params));
   inst.max = (size, params) => inst.check(core._maxSize(size, params));
-  inst.mime = (types, params) => inst.check(core._mime(types, params));
+  inst.mime = (types, params) => inst.check(core._mime(Array.isArray(types) ? types : [types], params));
 });
 
 export function file(params?: string | core.$ZodFileParams): ZodFile {
diff --git a/packages/zod/src/v4/core/schemas.ts b/packages/zod/src/v4/core/schemas.ts
index 6f499bd0..37acf14c 100644
--- a/packages/zod/src/v4/core/schemas.ts
+++ b/packages/zod/src/v4/core/schemas.ts
@@ -2779,6 +2779,11 @@ export interface $ZodFileDef extends $ZodTypeDef {
 export interface $ZodFileInternals extends $ZodTypeInternals<File, File> {
   def: $ZodFileDef;
   isst: errors.$ZodIssueInvalidType;
+  bag: util.LoosePartial<{
+    minimum: number;
+    maximum: number;
+    mime: util.MimeTypes[];
+  }>;
 }
 
 export interface $ZodFile extends $ZodType {
diff --git a/packages/zod/src/v4/core/to-json-schema.ts b/packages/zod/src/v4/core/to-json-schema.ts
index ca1a6800..26d7adb3 100644
--- a/packages/zod/src/v4/core/to-json-schema.ts
+++ b/packages/zod/src/v4/core/to-json-schema.ts
@@ -433,10 +433,33 @@ export class JSONSchemaGenerator {
           }
           break;
         }
+
         case "file": {
-          if (this.unrepresentable === "throw") {
-            throw new Error("File cannot be represented in JSON Schema");
+          const json: JSONSchema.StringSchema = _json as any;
+          const file: JSONSchema.StringSchema = {
+            type: "string",
+            format: "binary",
+            contentEncoding: "binary",
+          };
+
+          const { minimum, maximum, mime } = schema._zod.bag as schemas.$ZodFileInternals["bag"];
+          if (minimum !== undefined) file.minLength = minimum;
+          if (maximum !== undefined) file.maxLength = maximum;
+          if (mime) {
+            if (mime.length === 1) {
+              file.contentMediaType = mime[0];
+              Object.assign(json, file);
+            } else {
+              json.anyOf = mime.map((m) => {
+                const mFile: JSONSchema.StringSchema = { ...file, contentMediaType: m };
+                return mFile;
+              });
+            }
           }
+
+          // if (this.unrepresentable === "throw") {
+          //   throw new Error("File cannot be represented in JSON Schema");
+          // }
           break;
         }
         case "transform": {
diff --git a/play.ts b/play.ts
index 5973834c..3685c47f 100644
--- a/play.ts
+++ b/play.ts
@@ -17,3 +17,9 @@ const HelloSchema = FirstSchema.and(SecondSchema).and(ThirdSchema).describe("123
 // Zod 4
 const result = z.toJSONSchema(HelloSchema, { target: "draft-7" });
 console.dir(result, { depth: null });
+
+const fileSchema = z.file();
+
+fileSchema.min(10_000); // minimum .size (bytes)
+fileSchema.max(1_000_000); // maximum .size (bytes)
+fileSchema.mime(["image/png"]); // MIME type

</recent_change_diff>

Current test results:
<test_output>
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v2.1.9 <worktree>/s08-ad2fc5ee/packages/zod

 ❯ src/v4/classic/tests/to-json-schema.test.ts (43 tests | 1 failed) 31ms
   × toJSONSchema > unsupported schema types 2ms
     → expected [Function] to throw an error
 ✓  TS  src/v4/classic/tests/to-json-schema.test.ts (43 tests)

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/v4/classic/tests/to-json-schema.test.ts > toJSONSchema > unsupported schema types
AssertionError: expected [Function] to throw an error

- Expected: 
null

+ Received: 
undefined

 ❯ src/v4/classic/tests/to-json-schema.test.ts:242:46
    240|     // File type
    241|     const fileSchema = z.file();
    242|     expect(() => z.toJSONSchema(fileSchema)).toThrow("File cannot be r…
       |                                              ^
    243| 
    244|     // Transform

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 85 passed (86)
Type Errors  no errors
   Start at  15:52:32
   Duration  4.14s (transform 158ms, setup 0ms, collect 240ms, tests 31ms, environment 0ms, prepare 62ms, typecheck 4.01s)


</test_output>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/to-json-schema.test.ts" lines="215-268">
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "maximum": 1.7976931348623157e+308,
        "minimum": -1.7976931348623157e+308,
        "type": "number",
      }
    `);
    expect(z.toJSONSchema(z.jwt())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "format": "jwt",
        "type": "string",
      }
    `);
  });

  test("unsupported schema types", () => {
    expect(() => z.toJSONSchema(z.bigint())).toThrow("BigInt cannot be represented in JSON Schema");
    expect(() => z.toJSONSchema(z.int64())).toThrow("BigInt cannot be represented in JSON Schema");
    expect(() => z.toJSONSchema(z.symbol())).toThrow("Symbols cannot be represented in JSON Schema");
    expect(() => z.toJSONSchema(z.void())).toThrow("Void cannot be represented in JSON Schema");
    expect(() => z.toJSONSchema(z.date())).toThrow("Date cannot be represented in JSON Schema");
    expect(() => z.toJSONSchema(z.map(z.string(), z.number()))).toThrow("Map cannot be represented in JSON Schema");
    expect(() => z.toJSONSchema(z.set(z.string()))).toThrow("Set cannot be represented in JSON Schema");
    expect(() => z.toJSONSchema(z.custom(() => true))).toThrow("Custom types cannot be represented in JSON Schema");

    // File type
    const fileSchema = z.file();
    expect(() => z.toJSONSchema(fileSchema)).toThrow("File cannot be represented in JSON Schema");

    // Transform
    const transformSchema = z.string().transform((val) => Number.parseInt(val));
    expect(() => z.toJSONSchema(transformSchema)).toThrow("Transforms cannot be represented in JSON Schema");

    // Static catch values
    const staticCatchSchema = z.string().catch(() => "sup");
    expect(z.toJSONSchema(staticCatchSchema)).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "default": "sup",
        "type": "string",
      }
    `);

    // Dynamic catch values
    const dynamicCatchSchema = z.string().catch((ctx) => `${ctx.issues.length}`);
    expect(() => z.toJSONSchema(dynamicCatchSchema)).toThrow("Dynamic catch values are not supported in JSON Schema");
  });

  test("string formats", () => {
    expect(z.toJSONSchema(z.string().email())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "format": "email",
        "pattern": "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
</test_snippet>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/to-json-schema.test.ts" lines="2024-2074">
            "testStr": {
              "type": "string",
            },
          },
          "required": [
            "testStr",
          ],
          "type": "object",
        },
        {
          "additionalProperties": false,
          "properties": {
            "testBool": {
              "type": "boolean",
            },
          },
          "required": [
            "testBool",
          ],
          "type": "object",
        },
      ],
      "description": "123",
    }
  `);
});
</test_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/classic/schemas.ts" lines="1532-1590">
  });
});

export function literal<const T extends Array<util.Literal>>(
  value: T,
  params?: string | core.$ZodLiteralParams
): ZodLiteral<T[number]>;
export function literal<const T extends util.Literal>(
  value: T,
  params?: string | core.$ZodLiteralParams
): ZodLiteral<T>;
export function literal(value: any, params: any) {
  return new ZodLiteral({
    type: "literal",
    values: Array.isArray(value) ? value : [value],
    ...util.normalizeParams(params),
  });
}

// ZodFile
export interface ZodFile extends ZodType {
  _zod: core.$ZodFileInternals;

  min(size: number, params?: string | core.$ZodCheckMinSizeParams): this;
  max(size: number, params?: string | core.$ZodCheckMaxSizeParams): this;
  mime(types: util.MimeTypes | Array<util.MimeTypes>, params?: string | core.$ZodCheckMimeTypeParams): this;
}
export const ZodFile: core.$constructor<ZodFile> = /*@__PURE__*/ core.$constructor("ZodFile", (inst, def) => {
  core.$ZodFile.init(inst, def);
  ZodType.init(inst, def);

  inst.min = (size, params) => inst.check(core._minSize(size, params));
  inst.max = (size, params) => inst.check(core._maxSize(size, params));
  inst.mime = (types, params) => inst.check(core._mime(Array.isArray(types) ? types : [types], params));
});

export function file(params?: string | core.$ZodFileParams): ZodFile {
  return core._file(ZodFile, params) as any;
}

// ZodTransform
export interface ZodTransform<O = unknown, I = unknown> extends ZodType {
  _zod: core.$ZodTransformInternals<O, I>;
}
export const ZodTransform: core.$constructor<ZodTransform> = /*@__PURE__*/ core.$constructor(
  "ZodTransform",
  (inst, def) => {
    core.$ZodTransform.init(inst, def);
    ZodType.init(inst, def);

    inst._zod.parse = (payload, _ctx) => {
      (payload as RefinementCtx).addIssue = (issue) => {
        if (typeof issue === "string") {
          payload.issues.push(util.issue(issue, payload.value, def));
        } else {
          // for Zod 3 backwards compatibility
          const _issue = issue as any;

          if (_issue.fatal) _issue.continue = false;
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/schemas.ts" lines="2757-2811">
//     payload.value = def.value; // always override
//     return payload;
//   };
// });

//////////////////////////////////////////
//////////////////////////////////////////
//////////                      //////////
//////////      $ZodFile        //////////
//////////                      //////////
//////////////////////////////////////////
//////////////////////////////////////////

// provide a fallback in case the File interface isn't provided in the environment
declare global {
  interface File {}
}

export interface $ZodFileDef extends $ZodTypeDef {
  type: "file";
}

export interface $ZodFileInternals extends $ZodTypeInternals<File, File> {
  def: $ZodFileDef;
  isst: errors.$ZodIssueInvalidType;
  bag: util.LoosePartial<{
    minimum: number;
    maximum: number;
    mime: util.MimeTypes[];
  }>;
}

export interface $ZodFile extends $ZodType {
  _zod: $ZodFileInternals;
}

export const $ZodFile: core.$constructor<$ZodFile> = /*@__PURE__*/ core.$constructor("$ZodFile", (inst, def) => {
  $ZodType.init(inst, def);

  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (input instanceof File) return payload;
    payload.issues.push({
      expected: "file",
      code: "invalid_type",
      input,
      inst,
    });
    return payload;
  };
});

//////////////////////////////////////////////
//////////////////////////////////////////////
//////////                          //////////
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/to-json-schema.ts" lines="411-487">
              if (this.unrepresentable === "throw") {
                throw new Error("Literal `undefined` cannot be represented in JSON Schema");
              } else {
                // do not add to vals
              }
            } else if (typeof val === "bigint") {
              if (this.unrepresentable === "throw") {
                throw new Error("BigInt literals cannot be represented in JSON Schema");
              } else {
                vals.push(Number(val));
              }
            } else {
              vals.push(val);
            }
          }
          if (vals.length === 0) {
            // do nothing (an undefined literal was stripped)
          } else if (vals.length === 1) {
            const val = vals[0];
            json.const = val;
          } else {
            json.enum = vals;
          }
          break;
        }

        case "file": {
          const json: JSONSchema.StringSchema = _json as any;
          const file: JSONSchema.StringSchema = {
            type: "string",
            format: "binary",
            contentEncoding: "binary",
          };

          const { minimum, maximum, mime } = schema._zod.bag as schemas.$ZodFileInternals["bag"];
          if (minimum !== undefined) file.minLength = minimum;
          if (maximum !== undefined) file.maxLength = maximum;
          if (mime) {
            if (mime.length === 1) {
              file.contentMediaType = mime[0];
              Object.assign(json, file);
            } else {
              json.anyOf = mime.map((m) => {
                const mFile: JSONSchema.StringSchema = { ...file, contentMediaType: m };
                return mFile;
              });
            }
          }

          // if (this.unrepresentable === "throw") {
          //   throw new Error("File cannot be represented in JSON Schema");
          // }
          break;
        }
        case "transform": {
          if (this.unrepresentable === "throw") {
            throw new Error("Transforms cannot be represented in JSON Schema");
          }
          break;
        }

        case "nullable": {
          const inner = this.process(def.innerType, params);
          _json.anyOf = [inner, { type: "null" }];
          break;
        }
        case "nonoptional": {
          this.process(def.innerType, params);
          result.ref = def.innerType;
          break;
        }
        case "success": {
          const json = _json as JSONSchema.BooleanSchema;
          json.type = "boolean";
          break;
        }
        case "default": {
</production_snippet>
