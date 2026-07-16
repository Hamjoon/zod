You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/mini/tests/standard-schema.test.ts, packages/zod/src/v4/core/to-json-schema.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/mini/tests/standard-schema.test.ts b/packages/zod/src/v4/mini/tests/standard-schema.test.ts
index 9c5338b9..c74c7803 100644
--- a/packages/zod/src/v4/mini/tests/standard-schema.test.ts
+++ b/packages/zod/src/v4/mini/tests/standard-schema.test.ts
@@ -1,4 +1,4 @@
-import { test } from "vitest";
+import { expect, test } from "vitest";
 import type { StandardSchemaWithJSON } from "../../core/standard-schema.js";
 import * as z from "../index.js";
 
@@ -15,3 +15,36 @@ test("Zod Mini schemas are NOT assignable to StandardJSONSchema", () => {
   // @ts-expect-error
   acceptSchema(schema);
 });
+
+test("toJSONSchema result ~standard.jsonSchema works with objects", () => {
+  const schema = z.object({
+    firstName: z.string(),
+    lastName: z.string(),
+  });
+
+  const jsonSchema = z.toJSONSchema(schema);
+
+  // Call ~standard.jsonSchema.input - this should not throw
+  const inputSchema = jsonSchema["~standard"].jsonSchema.input({ target: "draft-07" });
+
+  expect(inputSchema).toMatchObject({
+    type: "object",
+    properties: {
+      firstName: { type: "string" },
+      lastName: { type: "string" },
+    },
+    required: ["firstName", "lastName"],
+  });
+
+  // Call ~standard.jsonSchema.output - this should not throw
+  const outputSchema = jsonSchema["~standard"].jsonSchema.output({ target: "draft-07" });
+
+  expect(outputSchema).toMatchObject({
+    type: "object",
+    properties: {
+      firstName: { type: "string" },
+      lastName: { type: "string" },
+    },
+    required: ["firstName", "lastName"],
+  });
+});

</recent_change_diff>

Current test results:
<test_output>
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v4.0.10 /Users/donggi/_projects/etc-projects/zod-thesis/.worktrees/p05-363c966b

 ❯  zod  src/v4/mini/tests/standard-schema.test.ts (2 tests | 1 failed) 3ms
   ✓ Zod Mini schemas are NOT assignable to StandardJSONSchema 1ms
   × toJSONSchema result ~standard.jsonSchema works with objects 2ms
 ✓  zod   TS  src/v4/mini/tests/standard-schema.test.ts (2 tests)

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL   zod  src/v4/mini/tests/standard-schema.test.ts > toJSONSchema result ~standard.jsonSchema works with objects
Error: [toJSONSchema]: Non-representable type encountered: object
 ❯ process src/v4/core/to-json-schema.ts:182:15
    180|       const processor = ctx.processors[def.type];
    181|       if (!processor) {
    182|         throw new Error(`[toJSONSchema]: Non-representable type encoun…
       |               ^
    183|       }
    184|       processor(schema, ctx, _json, params);
 ❯ Object.input src/v4/core/to-json-schema.ts:610:5
 ❯ src/v4/mini/tests/standard-schema.test.ts:28:58

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 3 passed (4)
Type Errors  no errors
   Start at  15:52:14
   Duration  7.48s (transform 1.36s, setup 31ms, collect 1.59s, tests 3ms, environment 0ms, prepare 6ms, typecheck 5.73s)


</test_output>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/mini/tests/standard-schema.test.ts" lines="1-75">
import { expect, test } from "vitest";
import type { StandardSchemaWithJSON } from "../../core/standard-schema.js";
import * as z from "../index.js";

function acceptSchema(schema: StandardSchemaWithJSON) {
  return schema;
}

test("Zod Mini schemas are NOT assignable to StandardJSONSchema", () => {
  const schema = z.string();

  // @ts-expect-error
  const _standard: StandardSchemaWithJSON["~standard"] = schema;

  // @ts-expect-error
  acceptSchema(schema);
});

test("toJSONSchema result ~standard.jsonSchema works with objects", () => {
  const schema = z.object({
    firstName: z.string(),
    lastName: z.string(),
  });

  const jsonSchema = z.toJSONSchema(schema);

  // Call ~standard.jsonSchema.input - this should not throw
  const inputSchema = jsonSchema["~standard"].jsonSchema.input({ target: "draft-07" });

  expect(inputSchema).toMatchObject({
    type: "object",
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
    },
    required: ["firstName", "lastName"],
  });

  // Call ~standard.jsonSchema.output - this should not throw
  const outputSchema = jsonSchema["~standard"].jsonSchema.output({ target: "draft-07" });

  expect(outputSchema).toMatchObject({
    type: "object",
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
    },
    required: ["firstName", "lastName"],
  });
});
</test_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/to-json-schema.ts" lines="479-530">
      defs[seen.defId] = seen.def;
    }
  }

  // set definitions in result
  if (ctx.external) {
  } else {
    if (Object.keys(defs).length > 0) {
      if (ctx.target === "draft-2020-12") {
        result.$defs = defs;
      } else {
        result.definitions = defs;
      }
    }
  }

  try {
    // this "finalizes" this schema and ensures all cycles are removed
    // each call to finalize() is functionally independent
    // though the seen map is shared
    const finalized = JSON.parse(JSON.stringify(result));
    Object.defineProperty(finalized, "~standard", {
      value: {
        ...schema["~standard"],
        jsonSchema: {
          input: createStandardJSONSchemaMethod(schema, "input"),
          output: createStandardJSONSchemaMethod(schema, "output"),
        },
      },
      enumerable: false,
      writable: false,
    });

    return finalized;
  } catch (_err) {
    throw new Error("Error converting schema to JSON.");
  }
}

function isTransforming(
  _schema: schemas.$ZodType,
  _ctx?: {
    seen: Set<schemas.$ZodType>;
  }
): boolean {
  const ctx = _ctx ?? { seen: new Set() };

  if (ctx.seen.has(_schema)) return false;
  ctx.seen.add(_schema);

  const def = (_schema as schemas.$ZodTypes)._zod.def;

</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/to-json-schema.ts" lines="581-634">

export type ZodStandardSchemaWithJSON<T> = StandardSchemaWithJSONProps<core.input<T>, core.output<T>>;
export interface ZodStandardJSONSchemaPayload<T> extends JSONSchema.BaseSchema {
  "~standard": ZodStandardSchemaWithJSON<T>;
}

/**
 * Creates a toJSONSchema method for a schema instance.
 * This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
 */
export const createToJSONSchemaMethod =
  <T extends schemas.$ZodType>(schema: T, processors: Record<string, Processor> = {}) =>
  (params?: ToJSONSchemaParams): ZodStandardJSONSchemaPayload<T> => {
    const ctx = initializeContext({ ...params, processors });
    process(schema, ctx);
    extractDefs(ctx, schema);
    return finalize(ctx, schema);
  };

/**
 * Creates a toJSONSchema method for a schema instance.
 * This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
 */
type StandardJSONSchemaMethodParams = Parameters<StandardJSONSchemaV1["~standard"]["jsonSchema"]["input"]>[0];
export const createStandardJSONSchemaMethod =
  <T extends schemas.$ZodType>(schema: T, io: "input" | "output") =>
  (params?: StandardJSONSchemaMethodParams): JSONSchema.BaseSchema => {
    const { libraryOptions, target } = params ?? {};
    const ctx = initializeContext({ ...(libraryOptions ?? {}), target, io, processors: {} });
    process(schema, ctx);
    extractDefs(ctx, schema);
    return finalize(ctx, schema);
  };
</production_snippet>
