You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/docs/content/error-formatting.mdx, packages/zod/src/v4/core/errors.ts, packages/zod/src/v4/core/util.ts, play.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/docs/content/error-formatting.mdx b/packages/docs/content/error-formatting.mdx
index 185ce17c..05e12738 100644
--- a/packages/docs/content/error-formatting.mdx
+++ b/packages/docs/content/error-formatting.mdx
@@ -119,7 +119,7 @@ This returns the following string:
 
     To convert the error into a nested object:
 
-    ```ts
+     ```ts
     const formatted = z.formatError(result.error);
 
     // returns:
@@ -150,36 +150,27 @@ This returns the following string:
 
 ## `z.flattenError()`
 
-<Callout type="warn">
-  This has been deprecated in favor of `z.treeifyError()`.
-</Callout>
 
-<Accordions>
-  <Accordion title="Show docs">
-    
-    While `z.formatError()` is useful for traversing a potentially complex nested structure, the majority of schemas are *flat*—just one level deep. In this case, use `z.flattenError()` to retrieve a clean, shallow error object.
+While `z.treeifyError()` is useful for traversing a potentially complex nested structure, the majority of schemas are *flat*—just one level deep. In this case, use `z.flattenError()` to retrieve a clean, shallow error object.
 
-    ```ts
-    const flattened = z.flattenError(result.error);
-    // { errors: string[], properties: { [key: string]: string[] } }
-
-    {
-      formErrors: [ 'Unrecognized key: "extraKey"' ],
-      fieldErrors: {
-        username: [ 'Invalid input: expected string, received number' ],
-        favoriteNumbers: [ 'Invalid input: expected number, received string' ]
-      }
-    }
-    ```
+```ts
+const flattened = z.flattenError(result.error);
+// { errors: string[], properties: { [key: string]: string[] } }
 
-    The `formErrors` array contains any top-level errors (where `path` is `[]`). The `fieldErrors` object provides an array of errors for each field in the schema.
+{
+  formErrors: [ 'Unrecognized key: "extraKey"' ],
+  fieldErrors: {
+    username: [ 'Invalid input: expected string, received number' ],
+    favoriteNumbers: [ 'Invalid input: expected number, received string' ]
+  }
+}
+```
 
-    ```ts
-    flattened.fieldErrors.string; // => [ 'Invalid input: expected string, received number' ]
-    flattened.fieldErrors.numbers; // => [ 'Invalid input: expected number, received string' ]
-    ```
+The `formErrors` array contains any top-level errors (where `path` is `[]`). The `fieldErrors` object provides an array of errors for each field in the schema.
 
-    > **Note** — If you have issues with a `path` longer than one level, this function throws away some error information. 
+```ts
+flattened.fieldErrors.string; // => [ 'Invalid input: expected string, received number' ]
+flattened.fieldErrors.numbers; // => [ 'Invalid input: expected number, received string' ]
+```
 
-  </Accordion>
-</Accordions>
+> **Note** — If you have issues with a `path` longer than one level, this function throws away some error information. 
diff --git a/packages/zod/src/v4/core/errors.ts b/packages/zod/src/v4/core/errors.ts
index fff075e5..265e7175 100644
--- a/packages/zod/src/v4/core/errors.ts
+++ b/packages/zod/src/v4/core/errors.ts
@@ -216,7 +216,6 @@ type _FlattenedError<T, U = string> = {
   };
 };
 
-/** @deprecated Use `z.treeifyError()` instead. */
 export function flattenError<T>(error: $ZodError<T>): _FlattenedError<T>;
 export function flattenError<T, U>(error: $ZodError<T>, mapper?: (issue: $ZodIssue) => U): _FlattenedError<T, U>;
 export function flattenError(error: $ZodError, mapper = (issue: $ZodIssue) => issue.message): any {
diff --git a/packages/zod/src/v4/core/util.ts b/packages/zod/src/v4/core/util.ts
index da0e1b69..f93be70f 100644
--- a/packages/zod/src/v4/core/util.ts
+++ b/packages/zod/src/v4/core/util.ts
@@ -17,7 +17,9 @@ export type JWTAlgorithm =
   | "ES512"
   | "PS256"
   | "PS384"
-  | "PS512";
+  | "PS512"
+  | "EdDSA"
+  | (string & {});
 export type IPVersion = "v4" | "v6";
 export type MimeTypes =
   | "application/json"
diff --git a/play.ts b/play.ts
index 667d56d8..119e939e 100644
--- a/play.ts
+++ b/play.ts
@@ -7,3 +7,6 @@ const a = z
   .default(5);
 
 console.dir(z.toJSONSchema(a, { io: "input" }), { depth: null });
+z.formatError;
+
+z.jwt({ alg: "Edscaasdf" });

</recent_change_diff>

Current test results:
<test_output>
 Test Files  156 passed (156)
      Tests  1600 passed (1600)
   Duration  5.23s (transform 419ms, setup 0ms, collect 14.04s, tests 1.74s, environment 8ms, prepare 5.66s, typecheck 4.83s)

</test_output>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/errors.ts" lines="193-243">
    enumerable: false,
  });
  Object.defineProperty(inst, "message", {
    get() {
      return JSON.stringify(def, util.jsonStringifyReplacer, 2);
    },
    enumerable: true,
    // configurable: false,
  });
};

export const $ZodError: $constructor<$ZodError> = $constructor("$ZodError", initializer);
interface $ZodRealError<T = any> extends $ZodError<T> {}
export const $ZodRealError: $constructor<$ZodRealError> = $constructor("$ZodError", initializer, { Parent: Error });

///////////////////    ERROR UTILITIES   ////////////////////////

// flatten
export type $ZodFlattenedError<T, U = string> = _FlattenedError<T, U>;
type _FlattenedError<T, U = string> = {
  formErrors: U[];
  fieldErrors: {
    [P in keyof T]?: U[];
  };
};

export function flattenError<T>(error: $ZodError<T>): _FlattenedError<T>;
export function flattenError<T, U>(error: $ZodError<T>, mapper?: (issue: $ZodIssue) => U): _FlattenedError<T, U>;
export function flattenError(error: $ZodError, mapper = (issue: $ZodIssue) => issue.message): any {
  const fieldErrors: any = {};
  const formErrors: any[] = [];
  for (const sub of error.issues) {
    if (sub.path.length > 0) {
      fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
      fieldErrors[sub.path[0]].push(mapper(sub));
    } else {
      formErrors.push(mapper(sub));
    }
  }
  return { formErrors, fieldErrors };
}

type _ZodFormattedError<T, U = string> = T extends [any, ...any[]]
  ? { [K in keyof T]?: $ZodFormattedError<T[K], U> }
  : T extends any[]
    ? { [k: number]: $ZodFormattedError<T[number], U> }
    : T extends object
      ? util.Flatten<{ [K in keyof T]?: $ZodFormattedError<T[K], U> }>
      : any;

export type $ZodFormattedError<T, U = string> = {
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/util.ts" lines="1-47">
import type * as checks from "./checks.js";
import type { $ZodConfig } from "./core.js";
import type * as errors from "./errors.js";
import type * as schemas from "./schemas.js";

// json
export type JSONType = string | number | boolean | null | JSONType[] | { [key: string]: JSONType };
export type JWTAlgorithm =
  | "HS256"
  | "HS384"
  | "HS512"
  | "RS256"
  | "RS384"
  | "RS512"
  | "ES256"
  | "ES384"
  | "ES512"
  | "PS256"
  | "PS384"
  | "PS512"
  | "EdDSA"
  | (string & {});
export type IPVersion = "v4" | "v6";
export type MimeTypes =
  | "application/json"
  | "application/xml"
  | "application/x-www-form-urlencoded"
  | "application/javascript"
  | "application/pdf"
  | "application/zip"
  | "application/vnd.ms-excel"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/vnd.ms-powerpoint"
  | "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  | "application/octet-stream"
  | "application/graphql"
  | "text/html"
  | "text/plain"
  | "text/css"
  | "text/javascript"
  | "text/csv"
  | "image/png"
  | "image/jpeg"
  | "image/gif"
  | "image/svg+xml"
</production_snippet>
