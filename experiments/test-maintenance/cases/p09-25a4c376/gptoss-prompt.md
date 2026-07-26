You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/classic/tests/to-json-schema.test.ts, packages/docs/loaders/get-llm-text.ts, packages/zod/src/v4/core/to-json-schema.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/classic/tests/to-json-schema.test.ts b/packages/zod/src/v4/classic/tests/to-json-schema.test.ts
index 1e242235b..c0a206b2f 100644
--- a/packages/zod/src/v4/classic/tests/to-json-schema.test.ts
+++ b/packages/zod/src/v4/classic/tests/to-json-schema.test.ts
@@ -653,6 +653,24 @@ describe("toJSONSchema", () => {
   });
 
   test("tuple", () => {
+    const schema = z.tuple([z.string(), z.number()]);
+    expect(z.toJSONSchema(schema)).toMatchInlineSnapshot(`
+      {
+        "$schema": "https://json-schema.org/draft/2020-12/schema",
+        "prefixItems": [
+          {
+            "type": "string",
+          },
+          {
+            "type": "number",
+          },
+        ],
+        "type": "array",
+      }
+    `);
+  });
+
+  test("tuple with rest", () => {
     const schema = z.tuple([z.string(), z.number()]).rest(z.boolean());
     expect(z.toJSONSchema(schema)).toMatchInlineSnapshot(`
       {
@@ -673,6 +691,46 @@ describe("toJSONSchema", () => {
     `);
   });
 
+  test("tuple openapi", () => {
+    const schema = z.tuple([z.string(), z.number()]);
+    expect(z.toJSONSchema(schema, { target: "openapi-3.0" })).toMatchInlineSnapshot(`
+      {
+        "items": [
+          {
+            "type": "string",
+          },
+          {
+            "type": "number",
+          },
+        ],
+        "maxItems": 2,
+        "minItems": 2,
+        "type": "array",
+      }
+    `);
+  });
+
+  test("tuple with rest openapi", () => {
+    const schema = z.tuple([z.string(), z.number()]).rest(z.boolean());
+    expect(z.toJSONSchema(schema, { target: "openapi-3.0" })).toMatchInlineSnapshot(`
+      {
+        "items": [
+          {
+            "type": "string",
+          },
+          {
+            "type": "number",
+          },
+          {
+            "type": "boolean",
+          },
+        ],
+        "minItems": 2,
+        "type": "array",
+      }
+    `);
+  });
+
   test("promise", () => {
     const schema = z.promise(z.string());
     expect(z.toJSONSchema(schema)).toMatchInlineSnapshot(`

</recent_change_diff>

Current test results:
<test_output>
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v2.1.9 <worktree>/p09-25a4c376/packages/zod

 ❯ src/v4/classic/tests/to-json-schema.test.ts (55 tests | 2 failed) 41ms
   × toJSONSchema > tuple openapi 2ms
     → Snapshot `toJSONSchema > tuple openapi 1` mismatched
   × toJSONSchema > tuple with rest openapi 1ms
     → Snapshot `toJSONSchema > tuple with rest openapi 1` mismatched
 ✓  TS  src/v4/classic/tests/to-json-schema.test.ts (55 tests)

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/v4/classic/tests/to-json-schema.test.ts > toJSONSchema > tuple openapi
Error: Snapshot `toJSONSchema > tuple openapi 1` mismatched

- Expected
+ Received

@@ -5,9 +5,7 @@
      },
      {
        "type": "number",
      },
    ],
-   "maxItems": 2,
-   "minItems": 2,
    "type": "array",
  }

 ❯ src/v4/classic/tests/to-json-schema.test.ts:696:63
    694|   test("tuple openapi", () => {
    695|     const schema = z.tuple([z.string(), z.number()]);
    696|     expect(z.toJSONSchema(schema, { target: "openapi-3.0" })).toMatchI…
       |                                                               ^
    697|       {
    698|         "items": [

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/v4/classic/tests/to-json-schema.test.ts > toJSONSchema > tuple with rest openapi
Error: Snapshot `toJSONSchema > tuple with rest openapi 1` mismatched

- Expected
+ Received

  {
-   "items": [
-     {
+   "additionalItems": {
-       "type": "string",
-     },
-     {
-       "type": "number",
-     },
-     {
+     "type": "boolean",
+   },
+   "items": {
-       "type": "boolean",
+     "type": "boolean",
-     },
+   },
-   ],
-   "minItems": 2,
    "type": "array",
  }

 ❯ src/v4/classic/tests/to-json-schema.test.ts:715:63
    713|   test("tuple with rest openapi", () => {
    714|     const schema = z.tuple([z.string(), z.number()]).rest(z.boolean());
    715|     expect(z.toJSONSchema(schema, { target: "openapi-3.0" })).toMatchI…
       |                                                               ^
    716|       {
    717|         "items": [

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯

  Snapshots  2 failed
 Test Files  1 failed | 1 passed (2)
      Tests  2 failed | 108 passed (110)
Type Errors  no errors
   Start at  15:53:26
   Duration  5.53s (transform 159ms, setup 7ms, collect 219ms, tests 41ms, environment 0ms, prepare 46ms, typecheck 5.43s)


</test_output>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/to-json-schema.test.ts" lines="631-758">
            ],
            "type": "object",
          },
        ],
      }
    `);
  });

  test("record", () => {
    const schema = z.record(z.string(), z.boolean());
    expect(z.toJSONSchema(schema)).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": {
          "type": "boolean",
        },
        "propertyNames": {
          "type": "string",
        },
        "type": "object",
      }
    `);
  });

  test("tuple", () => {
    const schema = z.tuple([z.string(), z.number()]);
    expect(z.toJSONSchema(schema)).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "prefixItems": [
          {
            "type": "string",
          },
          {
            "type": "number",
          },
        ],
        "type": "array",
      }
    `);
  });

  test("tuple with rest", () => {
    const schema = z.tuple([z.string(), z.number()]).rest(z.boolean());
    expect(z.toJSONSchema(schema)).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "items": {
          "type": "boolean",
        },
        "prefixItems": [
          {
            "type": "string",
          },
          {
            "type": "number",
          },
        ],
        "type": "array",
      }
    `);
  });

  test("tuple openapi", () => {
    const schema = z.tuple([z.string(), z.number()]);
    expect(z.toJSONSchema(schema, { target: "openapi-3.0" })).toMatchInlineSnapshot(`
      {
        "items": [
          {
            "type": "string",
          },
          {
            "type": "number",
          },
        ],
        "maxItems": 2,
        "minItems": 2,
        "type": "array",
      }
    `);
  });

  test("tuple with rest openapi", () => {
    const schema = z.tuple([z.string(), z.number()]).rest(z.boolean());
    expect(z.toJSONSchema(schema, { target: "openapi-3.0" })).toMatchInlineSnapshot(`
      {
        "items": [
          {
            "type": "string",
          },
          {
            "type": "number",
          },
          {
            "type": "boolean",
          },
        ],
        "minItems": 2,
        "type": "array",
      }
    `);
  });

  test("promise", () => {
    const schema = z.promise(z.string());
    expect(z.toJSONSchema(schema)).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "string",
      }
    `);
  });

  test("lazy", () => {
    const schema = z.lazy(() => z.string());
    expect(z.toJSONSchema(schema)).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "string",
      }
    `);
  });

  // enum
  test("enum", () => {
    const a = z.enum(["a", "b", "c"]);
    expect(z.toJSONSchema(a)).toMatchInlineSnapshot(`
      {
</test_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/to-json-schema.ts" lines="348-423">
          }
          case "intersection": {
            const json: JSONSchema.BaseSchema = _json as any;
            const a = this.process(def.left, {
              ...params,
              path: [...params.path, "allOf", 0],
            });
            const b = this.process(def.right, {
              ...params,
              path: [...params.path, "allOf", 1],
            });

            const isSimpleIntersection = (val: any) => "allOf" in val && Object.keys(val).length === 1;
            const allOf = [
              ...(isSimpleIntersection(a) ? (a.allOf as any[]) : [a]),
              ...(isSimpleIntersection(b) ? (b.allOf as any[]) : [b]),
            ];
            json.allOf = allOf;
            break;
          }
          case "tuple": {
            const json: JSONSchema.ArraySchema = _json as any;
            json.type = "array";
            const prefixItems = def.items.map((x, i) =>
              this.process(x, { ...params, path: [...params.path, "prefixItems", i] })
            );
            if (this.target === "draft-2020-12") {
              json.prefixItems = prefixItems;
            } else {
              json.items = prefixItems;
            }

            if (def.rest) {
              const rest = this.process(def.rest, {
                ...params,
                path: [...params.path, "items"],
              });
              if (this.target === "draft-2020-12") {
                json.items = rest;
              } else {
                json.additionalItems = rest;
              }
            }

            // additionalItems
            if (def.rest) {
              json.items = this.process(def.rest, {
                ...params,
                path: [...params.path, "items"],
              });
            }

            // length
            const { minimum, maximum } = schema._zod.bag as {
              minimum?: number;
              maximum?: number;
            };
            if (typeof minimum === "number") json.minItems = minimum;
            if (typeof maximum === "number") json.maxItems = maximum;
            break;
          }
          case "record": {
            const json: JSONSchema.ObjectSchema = _json as any;
            json.type = "object";
            if (this.target !== "draft-4") {
              json.propertyNames = this.process(def.keyType, {
                ...params,
                path: [...params.path, "propertyNames"],
              });
            }
            json.additionalProperties = this.process(def.valueType, {
              ...params,
              path: [...params.path, "additionalProperties"],
            });
            break;
          }
</production_snippet>
