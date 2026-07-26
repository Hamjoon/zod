You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/classic/tests/error-utils.test.ts, packages/zod/src/v4/classic/tests/index.test.ts, packages/docs/content/error-customization.mdx, packages/zod/package.json, packages/zod/src/v4/classic/schemas.ts, packages/zod/src/v4/core/errors.ts, play.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/docs/content/error-customization.mdx b/packages/docs/content/error-customization.mdx
index 8206a6bc..c817a358 100644
--- a/packages/docs/content/error-customization.mdx
+++ b/packages/docs/content/error-customization.mdx
@@ -56,7 +56,7 @@ Every issue contains a `message` property with a human-readable error message. E
 
 ## The `error` param
 
-Virtually every Zod API accepts an optional error message parameter.
+Virtually every Zod API accepts an optional error message.
 
 ```ts
 z.string("Not a string!");
@@ -87,7 +87,7 @@ z.string("Bad!");
 z.string().min(5, "Too short!");
 z.uuid("Bad UUID!");
 z.iso.date("Bad date!");
-z.array(z.string(), "Bad array!");
+z.array(z.string(), "Not an array!");
 z.array(z.string()).min(5, "Too few items!");
 z.set(z.string(), "Bad set!");
 ```
@@ -133,7 +133,8 @@ z.set(z.string(), { error: "Bad set!" });
 </Tab>
 </Tabs>
 
-The `error` param optionally accepts a function. This function will be called at parse time if a valiation error occurs.
+
+The `error` param optionally accepts a function. An error customization function is known as an **error map** in Zod terminology. The error map will can at parse time if a valiation error occurs.
 
 ```ts
 z.string({ error: ()=>`[${Date.now()}]: Validation failure.` });
@@ -143,31 +144,16 @@ z.string({ error: ()=>`[${Date.now()}]: Validation failure.` });
 **Note** — In Zod v3, there were separate params for `message` (a string) and `errorMap` (a function). These have been unified in Zod 4 as `error`.
 </Callout>
 
+The error map receives a context object you can use to customize the error message based on the validation issue.
 
-The `error` function received a context object you can use to customize the error message based on the `input` or other validation information.
-
-<Tabs groupId="lib" items={["Zod", "Zod Mini"]}>
-<Tab value="Zod">
-```ts
-z.string({
-  error: (iss) => iss.input===undefined ? "Field is required." : "Invalid input."
-});
-```
-</Tab>
-<Tab value="Zod Mini">
 ```ts
 z.string({
-  error: (iss) => iss.input===undefined ? "Field is required." : "Invalid input."
+  error: (iss) => iss.input === undefined ? "Field is required." : "Invalid input."
 });
 ```
-</Tab>
-</Tabs>
 
 For advanced cases, the `iss` object provides additional information you can use to customize the error.
 
-
-<Tabs groupId="lib" items={["Zod", "Zod Mini"]}>
-<Tab value="Zod">
 ```ts
 z.string({
   error: (iss) => {
@@ -178,21 +164,6 @@ z.string({
   },
 });
 ```
-</Tab>
-<Tab value="Zod Mini">
-```ts
-z.string({
-  error: (iss) => {
-    iss.inst;
-    iss.code; // the issue code
-    iss.input; // the input data
-    iss.inst; // the schema/check that originated this issue
-    iss.path; // the path of the error
-  },
-});
-```
-</Tab>
-</Tabs>
 
 Depending on the API you are using, there may be additional properties available. Use TypeScript's autocomplete to explore the available properties.
 
@@ -207,6 +178,22 @@ z.string().min(5, {
 });
 ```
 
+Return `undefined` to avoid setting an error message. This is useful for customizing certain error messages but not others. Zod will yield control to the next error map in the [precedence chain](#error-precedence).
+
+```ts
+z.string().min(5, {
+  error: (iss) => {
+    // customize "too_small" error message
+    if (iss.code === "too_small") {
+      return `Password must have ${iss.minimum} characters or more`;
+    }
+
+    // use default error otherwise
+    return undefined;
+  },
+});
+```
+
 ## Per-parse error customization
 
 To customize errors on a *per-parse* basis, pass an error map into the parse method:
diff --git a/packages/zod/package.json b/packages/zod/package.json
index a3bf1f1d..4dc1a32e 100644
--- a/packages/zod/package.json
+++ b/packages/zod/package.json
@@ -1,6 +1,6 @@
 {
   "name": "zod",
-  "version": "3.25.20",
+  "version": "3.25.21",
   "type": "module",
   "author": "Colin McDonnell <zod@colinhacks.com>",
   "description": "TypeScript-first schema declaration and validation library with static type inference",
diff --git a/packages/zod/src/v4/classic/schemas.ts b/packages/zod/src/v4/classic/schemas.ts
index cae4af3c..05144e2c 100644
--- a/packages/zod/src/v4/classic/schemas.ts
+++ b/packages/zod/src/v4/classic/schemas.ts
@@ -1962,10 +1962,10 @@ export function check<O = unknown>(fn: core.CheckFn<O>, params?: string | core.$
   return ch;
 }
 
-export function custom<O = unknown, I = O>(
-  fn?: (data: O) => unknown,
+export function custom<O>(
+  fn?: (data: unknown) => unknown,
   _params?: string | core.$ZodCustomParams | undefined
-): ZodCustom<O, I> {
+): ZodCustom<O, O> {
   return core._custom(ZodCustom, fn ?? (() => true), _params) as any;
 }
 
diff --git a/packages/zod/src/v4/core/errors.ts b/packages/zod/src/v4/core/errors.ts
index 59fb738b..b2b09bba 100644
--- a/packages/zod/src/v4/core/errors.ts
+++ b/packages/zod/src/v4/core/errors.ts
@@ -86,7 +86,7 @@ export interface $ZodIssueInvalidValue<Input = unknown> extends $ZodIssueBase {
 }
 
 export interface $ZodIssueCustom extends $ZodIssueBase {
-  readonly code?: "custom";
+  readonly code: "custom";
   readonly params?: Record<string, any> | undefined;
   readonly input: unknown;
 }
@@ -149,6 +149,8 @@ export type $ZodIssue =
   | $ZodIssueInvalidValue
   | $ZodIssueCustom;
 
+export type $ZodIssueCode = $ZodIssue["code"];
+
 export type $ZodRawIssue<T extends $ZodIssueBase = $ZodIssue> = T extends any ? RawIssue<T> : never;
 type RawIssue<T extends $ZodIssueBase> = util.Flatten<
   util.MakePartial<T, "message" | "path"> & {
diff --git a/play.ts b/play.ts
index ab8f7e24..b6e8215b 100644
--- a/play.ts
+++ b/play.ts
@@ -1,3 +1,22 @@
 import * as z from "zod/v4";
 
-z;
+z.custom<Date>((val) => val instanceof Date);
+
+z.string().min(5, {
+  error: (iss) => {
+    // customize "too_small" error message
+    if (iss.code === "too_small") {
+      return `Password must have ${iss.minimum} characters or more`;
+    }
+
+    // use default error otherwise
+    return undefined;
+  },
+});
+
+z.ZodError;
+
+const arg = z.custom<Date>((val) => val instanceof Date);
+z.date().check(z.custom((val) => val.getTime() > 0));
+
+// z.tuple<[title: string, text: string]>([z.string(), z.string()]);

</recent_change_diff>

Current test results:
<test_output>
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v2.1.9 <worktree>/s06-6d47791b/packages/zod

 ✓ src/v4/classic/tests/error-utils.test.ts (11 tests) 12ms
 ✓ src/v4/classic/tests/index.test.ts (57 tests) 30ms
 ❯  TS  src/v4/classic/tests/index.test.ts (57 tests | 1 failed)
   × z.custom
     → 'val' is of type 'unknown'.
 ✓  TS  src/v4/classic/tests/error-utils.test.ts (11 tests)

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/v4/classic/tests/index.test.ts > z.custom
TypeCheckError: 'val' is of type 'unknown'.
 ❯ src/v4/classic/tests/index.test.ts:716:48
    714|   expect(() => z.parse(a, 123)).toThrow();
    715| 
    716|   const b = z.string().check(z.custom((val) => val.length > 3));
       |                                                ^
    717| 
    718|   expect(z.parse(b, "hello")).toEqual("hello");

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed | 3 passed (4)
      Tests  1 failed | 135 passed (136)
Type Errors  1 failed
   Start at  15:51:59
   Duration  5.60s (transform 355ms, setup 0ms, collect 1.17s, tests 42ms, environment 0ms, prepare 147ms, typecheck 5.29s)


</test_output>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/error-utils.test.ts" lines="1-28">
import { expect, expectTypeOf, test } from "vitest";
import * as z from "zod/v4";

const Test = z.object({
  f1: z.number(),
  f2: z.string().optional(),
  f3: z.string().nullable(),
  f4: z.array(z.object({ t: z.union([z.string(), z.boolean()]) })),
});
// type TestFlattenedErrors = core.inferFlattenedErrors<typeof Test, { message: string; code: number }>;
// type TestFormErrors = core.inferFlattenedErrors<typeof Test>;
const parsed = Test.safeParse({});

test("regular error", () => {
  expect(parsed).toMatchInlineSnapshot(`
    {
      "error": [ZodError: [
      {
        "expected": "number",
        "code": "invalid_type",
        "path": [
          "f1"
        ],
        "message": "Invalid input: expected number, received undefined"
      },
      {
        "expected": "string",
        "code": "invalid_type",
</test_snippet>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/index.test.ts" lines="684-744">
  expectTypeOf<c>().toEqualTypeOf<`${string}${boolean}`>();
  expect(z.parse(c, "hellotrue")).toEqual("hellotrue");
  expect(z.parse(c, "hellofalse")).toEqual("hellofalse");
  expect(() => z.parse(c, "hello")).toThrow();
  expect(() => z.parse(c, 123)).toThrow();

  // include literal prefix
  const d = z.templateLiteral([z.literal("hello"), z.number()]);
  type d = z.output<typeof d>;
  expectTypeOf<d>().toEqualTypeOf<`hello${number}`>();
  expect(z.parse(d, "hello123")).toEqual("hello123");
  expect(() => z.parse(d, 123)).toThrow();
  expect(() => z.parse(d, "world123")).toThrow();

  // include literal union
  const e = z.templateLiteral([z.literal(["aa", "bb"]), z.number()]);
  type e = z.output<typeof e>;
  expectTypeOf<e>().toEqualTypeOf<`aa${number}` | `bb${number}`>();
  expect(z.parse(e, "aa123")).toEqual("aa123");
  expect(z.parse(e, "bb123")).toEqual("bb123");
  expect(() => z.parse(e, "cc123")).toThrow();
  expect(() => z.parse(e, 123)).toThrow();
});

// this returns both a schema and a check
test("z.custom", () => {
  const a = z.custom((val) => {
    return typeof val === "string";
  });
  expect(z.parse(a, "hello")).toEqual("hello");
  expect(() => z.parse(a, 123)).toThrow();

  const b = z.string().check(z.custom((val) => val.length > 3));

  expect(z.parse(b, "hello")).toEqual("hello");
  expect(() => z.parse(b, "hi")).toThrow();
});

test("z.check", () => {
  // this is a more flexible version of z.custom that accepts an arbitrary _parse logic
  // the function should return base.$ZodResult
  const a = z.any().check(
    z.check<string>((ctx) => {
      if (typeof ctx.value === "string") return;
      ctx.issues.push({
        code: "custom",
        origin: "custom",
        message: "Expected a string",
        input: ctx.value,
      });
    })
  );
  expect(z.safeParse(a, "hello")).toMatchObject({
    success: true,
    data: "hello",
  });
  expect(z.safeParse(a, 123)).toMatchObject({
    success: false,
    error: { issues: [{ code: "custom", message: "Expected a string" }] },
  });
});
</test_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/classic/schemas.ts" lines="1940-1993">
    type: "promise",
    innerType,
  }) as ZodPromise<T>;
}

// ZodCustom
export interface ZodCustom<O = unknown, I = unknown> extends ZodType {
  _zod: core.$ZodCustomInternals<O, I>;
}
export const ZodCustom: core.$constructor<ZodCustom> = /*@__PURE__*/ core.$constructor("ZodCustom", (inst, def) => {
  core.$ZodCustom.init(inst, def);
  ZodType.init(inst, def);
});

// custom checks
export function check<O = unknown>(fn: core.CheckFn<O>, params?: string | core.$ZodCustomParams): core.$ZodCheck<O> {
  const ch = new core.$ZodCheck({
    check: "custom",
    ...util.normalizeParams(params),
  });

  ch._zod.check = fn;
  return ch;
}

export function custom<O>(
  fn?: (data: unknown) => unknown,
  _params?: string | core.$ZodCustomParams | undefined
): ZodCustom<O, O> {
  return core._custom(ZodCustom, fn ?? (() => true), _params) as any;
}

export function refine<T>(
  fn: (arg: NoInfer<T>) => util.MaybeAsync<unknown>,
  _params: string | core.$ZodCustomParams = {}
): core.$ZodCheck<T> {
  return core._custom(ZodCustom, fn, _params);
}

// superRefine
export function superRefine<T>(
  fn: (arg: T, payload: RefinementCtx<T>) => void | Promise<void>,
  params?: string | core.$ZodCustomParams
): core.$ZodCheck<T> {
  const ch = check<T>((payload) => {
    (payload as RefinementCtx).addIssue = (issue) => {
      if (typeof issue === "string") {
        payload.issues.push(util.issue(issue, payload.value, ch._zod.def));
      } else {
        // for Zod 3 backwards compatibility
        const _issue: any = issue;
        if (_issue.fatal) _issue.continue = false;
        _issue.code ??= "custom";
        _issue.input ??= payload.value;
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/errors.ts" lines="64-114">
  readonly input: unknown;
}

export interface $ZodIssueInvalidKey<Input = unknown> extends $ZodIssueBase {
  readonly code: "invalid_key";
  readonly origin: "map" | "record";
  readonly issues: $ZodIssue[];
  readonly input: Input;
}

export interface $ZodIssueInvalidElement<Input = unknown> extends $ZodIssueBase {
  readonly code: "invalid_element";
  readonly origin: "map" | "set";
  readonly key: unknown;
  readonly issues: $ZodIssue[];
  readonly input: Input;
}

export interface $ZodIssueInvalidValue<Input = unknown> extends $ZodIssueBase {
  readonly code: "invalid_value";
  readonly values: util.Primitive[];
  readonly input: Input;
}

export interface $ZodIssueCustom extends $ZodIssueBase {
  readonly code: "custom";
  readonly params?: Record<string, any> | undefined;
  readonly input: unknown;
}

////////////////////////////////////////////
////     first-party string formats     ////
////////////////////////////////////////////

export interface $ZodIssueStringCommonFormats extends $ZodIssueInvalidStringFormat {
  format: Exclude<$ZodStringFormats, "regex" | "jwt" | "starts_with" | "ends_with" | "includes">;
}

export interface $ZodIssueStringInvalidRegex extends $ZodIssueInvalidStringFormat {
  format: "regex";
  pattern: string;
}

export interface $ZodIssueStringInvalidJWT extends $ZodIssueInvalidStringFormat {
  format: "jwt";
  algorithm?: string;
}

export interface $ZodIssueStringStartsWith extends $ZodIssueInvalidStringFormat {
  format: "starts_with";
  prefix: string;
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/errors.ts" lines="127-178">
export type $ZodStringFormatIssues =
  | $ZodIssueStringCommonFormats
  | $ZodIssueStringInvalidRegex
  | $ZodIssueStringInvalidJWT
  | $ZodIssueStringStartsWith
  | $ZodIssueStringEndsWith
  | $ZodIssueStringIncludes;

////////////////////////
////     utils     /////
////////////////////////

export type $ZodIssue =
  | $ZodIssueInvalidType
  | $ZodIssueTooBig
  | $ZodIssueTooSmall
  | $ZodIssueInvalidStringFormat
  | $ZodIssueNotMultipleOf
  | $ZodIssueUnrecognizedKeys
  | $ZodIssueInvalidUnion
  | $ZodIssueInvalidKey
  | $ZodIssueInvalidElement
  | $ZodIssueInvalidValue
  | $ZodIssueCustom;

export type $ZodIssueCode = $ZodIssue["code"];

export type $ZodRawIssue<T extends $ZodIssueBase = $ZodIssue> = T extends any ? RawIssue<T> : never;
type RawIssue<T extends $ZodIssueBase> = util.Flatten<
  util.MakePartial<T, "message" | "path"> & {
    /** The input data */
    readonly input?: unknown;
    /** The schema or check that originated this issue. */
    readonly inst?: $ZodType | $ZodCheck;
    /** @deprecated Internal use only. If `true`, Zod will continue executing validation despite this issue. */
    readonly continue?: boolean | undefined;
  } & Record<string, any>
>;

export interface $ZodErrorMap<T extends $ZodIssueBase = $ZodIssue> {
  // biome-ignore lint:
  (issue: $ZodRawIssue<T>): { message: string } | string | undefined | null;
}

////////////////////////    ERROR CLASS   ////////////////////////

// const ZOD_ERROR: symbol = Symbol.for("{{zod.error}}");
export interface $ZodError<T = unknown> extends Error {
  type: T;
  issues: $ZodIssue[];
  _zod: {
    output: T;
</production_snippet>
