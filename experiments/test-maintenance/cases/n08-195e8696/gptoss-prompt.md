You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/classic/errors.ts, packages/zod/src/v4/classic/from-json-schema.ts, packages/zod/src/v4/core/core.ts, packages/zod/src/v4/core/util.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/classic/errors.ts b/packages/zod/src/v4/classic/errors.ts
index 695a5343..e4eb99d0 100644
--- a/packages/zod/src/v4/classic/errors.ts
+++ b/packages/zod/src/v4/classic/errors.ts
@@ -61,8 +61,8 @@ const initializer = (inst: ZodError, issues: core.$ZodIssue[]) => {
   //   },
   // });
 };
-export const ZodError: core.$constructor<ZodError> = core.$constructor("ZodError", initializer);
-export const ZodRealError: core.$constructor<ZodError> = core.$constructor("ZodError", initializer, {
+export const ZodError: core.$constructor<ZodError> = /*@__PURE__*/ core.$constructor("ZodError", initializer);
+export const ZodRealError: core.$constructor<ZodError> = /*@__PURE__*/ core.$constructor("ZodError", initializer, {
   Parent: Error,
 });
 
diff --git a/packages/zod/src/v4/classic/from-json-schema.ts b/packages/zod/src/v4/classic/from-json-schema.ts
index 76cbf999..7934f337 100644
--- a/packages/zod/src/v4/classic/from-json-schema.ts
+++ b/packages/zod/src/v4/classic/from-json-schema.ts
@@ -29,7 +29,7 @@ interface ConversionContext {
 }
 
 // Keys that are recognized and handled by the conversion logic
-const RECOGNIZED_KEYS = new Set([
+const RECOGNIZED_KEYS = /*@__PURE__*/ new Set([
   // Schema identification
   "$schema",
   "$ref",
diff --git a/packages/zod/src/v4/core/core.ts b/packages/zod/src/v4/core/core.ts
index 8950dbbf..c191fdbe 100644
--- a/packages/zod/src/v4/core/core.ts
+++ b/packages/zod/src/v4/core/core.ts
@@ -10,7 +10,7 @@ export interface $constructor<T extends ZodTrait, D = T["_zod"]["def"]> {
 }
 
 /** A special constant with type `never` */
-export const NEVER: never = Object.freeze({
+export const NEVER: never = /*@__PURE__*/ Object.freeze({
   status: "aborted",
 }) as never;
 
diff --git a/packages/zod/src/v4/core/util.ts b/packages/zod/src/v4/core/util.ts
index f7b9ada7..8738df4e 100644
--- a/packages/zod/src/v4/core/util.ts
+++ b/packages/zod/src/v4/core/util.ts
@@ -254,7 +254,7 @@ export function floatSafeRemainder(val: number, step: number): number {
   return ratio - roundedRatio;
 }
 
-const EVALUATING = Symbol("evaluating");
+const EVALUATING = /* @__PURE__*/ Symbol("evaluating");
 
 export function defineLazy<T, K extends keyof T>(object: T, key: K, getter: () => T[K]): void {
   let value: T[K] | typeof EVALUATING | undefined = undefined;
@@ -361,7 +361,7 @@ export function isObject(data: any): data is Record<PropertyKey, unknown> {
   return typeof data === "object" && data !== null && !Array.isArray(data);
 }
 
-export const allowsEval: { value: boolean } = cached(() => {
+export const allowsEval: { value: boolean } = /* @__PURE__*/ cached(() => {
   // Skip the probe under `jitless`: strict CSPs report the caught `new Function`
   // as a `securitypolicyviolation` even though the throw is swallowed.
   if (globalConfig.jitless) {
@@ -476,8 +476,15 @@ export const getParsedType = (data: any): ParsedTypes => {
   }
 };
 
-export const propertyKeyTypes: Set<string> = new Set(["string", "number", "symbol"]);
-export const primitiveTypes: Set<string> = new Set(["string", "number", "bigint", "boolean", "symbol", "undefined"]);
+export const propertyKeyTypes: Set<string> = /* @__PURE__*/ new Set(["string", "number", "symbol"]);
+export const primitiveTypes: Set<string> = /* @__PURE__*/ new Set([
+  "string",
+  "number",
+  "bigint",
+  "boolean",
+  "symbol",
+  "undefined",
+]);
 export function escapeRegex(str: string): string {
   return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
 }

</recent_change_diff>

Current test results:
<test_output>
 Test Files  212 passed (212)
      Tests  2662 passed (2662)
   Duration  8.13s (transform 4.97s, setup 961ms, collect 22.83s, tests 3.84s, environment 8ms, prepare 409ms, typecheck 4.45s)

</test_output>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/classic/errors.ts" lines="39-90">
        inst.issues.push(issue);
        inst.message = JSON.stringify(inst.issues, util.jsonStringifyReplacer, 2);
      },
      // enumerable: false,
    },
    addIssues: {
      value: (issues: any) => {
        inst.issues.push(...issues);
        inst.message = JSON.stringify(inst.issues, util.jsonStringifyReplacer, 2);
      },
      // enumerable: false,
    },
    isEmpty: {
      get() {
        return inst.issues.length === 0;
      },
      // enumerable: false,
    },
  });
  // Object.defineProperty(inst, "isEmpty", {
  //   get() {
  //     return inst.issues.length === 0;
  //   },
  // });
};
export const ZodError: core.$constructor<ZodError> = /*@__PURE__*/ core.$constructor("ZodError", initializer);
export const ZodRealError: core.$constructor<ZodError> = /*@__PURE__*/ core.$constructor("ZodError", initializer, {
  Parent: Error,
});

export type {
  /** @deprecated Use `z.core.$ZodFlattenedError` instead. */
  $ZodFlattenedError as ZodFlattenedError,
  /** @deprecated Use `z.core.$ZodFormattedError` instead. */
  $ZodFormattedError as ZodFormattedError,
  /** @deprecated Use `z.core.$ZodErrorMap` instead. */
  $ZodErrorMap as ZodErrorMap,
} from "../core/index.js";

/** @deprecated Use `z.core.$ZodRawIssue` instead. */
export type IssueData = core.$ZodRawIssue;

// /** @deprecated Use `z.core.$ZodErrorMapCtx` instead. */
// export type ErrorMapCtx = core.$ZodErrorMapCtx;
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/classic/from-json-schema.ts" lines="7-57">

// Local z object to avoid circular dependency with ../index.js
const z = {
  ..._schemas,
  ..._checks,
  iso: _iso,
};

type JSONSchemaVersion = "draft-2020-12" | "draft-7" | "draft-4" | "openapi-3.0";

interface FromJSONSchemaParams {
  defaultTarget?: JSONSchemaVersion;
  registry?: $ZodRegistry<any>;
}

interface ConversionContext {
  version: JSONSchemaVersion;
  defs: Record<string, JSONSchema.JSONSchema>;
  refs: Map<string, ZodType>;
  processing: Set<string>;
  rootSchema: JSONSchema.JSONSchema;
  registry: $ZodRegistry<any>;
}

// Keys that are recognized and handled by the conversion logic
const RECOGNIZED_KEYS = /*@__PURE__*/ new Set([
  // Schema identification
  "$schema",
  "$ref",
  "$defs",
  "definitions",
  // Core schema keywords
  "$id",
  "id",
  "$comment",
  "$anchor",
  "$vocabulary",
  "$dynamicRef",
  "$dynamicAnchor",
  // Type
  "type",
  "enum",
  "const",
  // Composition
  "anyOf",
  "oneOf",
  "allOf",
  "not",
  // Object
  "properties",
  "required",
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/core.ts" lines="1-38">
import type * as errors from "./errors.js";
import type * as schemas from "./schemas.js";
import type { Class } from "./util.js";
//////////////////////////////   CONSTRUCTORS   ///////////////////////////////////////

type ZodTrait = { _zod: { def: any; [k: string]: any } };
export interface $constructor<T extends ZodTrait, D = T["_zod"]["def"]> {
  new (def: D): T;
  init(inst: T, def: D): asserts inst is T;
}

/** A special constant with type `never` */
export const NEVER: never = /*@__PURE__*/ Object.freeze({
  status: "aborted",
}) as never;

export /*@__NO_SIDE_EFFECTS__*/ function $constructor<T extends ZodTrait, D = T["_zod"]["def"]>(
  name: string,
  initializer: (inst: T, def: D) => void,
  params?: { Parent?: typeof Class }
): $constructor<T, D> {
  function init(inst: T, def: D) {
    if (!inst._zod) {
      Object.defineProperty(inst, "_zod", {
        value: {
          def,
          constr: _,
          traits: new Set(),
        },
        enumerable: false,
      });
    }

    if (inst._zod.traits.has(name)) {
      return;
    }

    inst._zod.traits.add(name);
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/util.ts" lines="232-282">
      }
      throw new Error("cached value already set");
    },
  };
}

export function nullish(input: any): boolean {
  return input === null || input === undefined;
}

export function cleanRegex(source: string): string {
  const start = source.startsWith("^") ? 1 : 0;
  const end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start, end);
}

export function floatSafeRemainder(val: number, step: number): number {
  const ratio = val / step;
  const roundedRatio = Math.round(ratio);
  // Use a relative epsilon scaled to the magnitude of the result
  const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
  if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
  return ratio - roundedRatio;
}

const EVALUATING = /* @__PURE__*/ Symbol("evaluating");

export function defineLazy<T, K extends keyof T>(object: T, key: K, getter: () => T[K]): void {
  let value: T[K] | typeof EVALUATING | undefined = undefined;
  Object.defineProperty(object, key, {
    get() {
      if (value === EVALUATING) {
        // Circular reference detected, return undefined to break the cycle
        return undefined as T[K];
      }
      if (value === undefined) {
        value = EVALUATING;
        value = getter();
      }
      return value;
    },
    set(v) {
      Object.defineProperty(object, key, {
        value: v,
        // configurable: true,
      });
      // object[key] = v;
    },
    configurable: true,
  });
}
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/util.ts" lines="339-389">
  }
  return str;
}

export function esc(str: string): string {
  return JSON.stringify(str);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const captureStackTrace: (targetObject: object, constructorOpt?: Function) => void = (
  "captureStackTrace" in Error ? Error.captureStackTrace : (..._args: any[]) => {}
) as any;

export function isObject(data: any): data is Record<PropertyKey, unknown> {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}

export const allowsEval: { value: boolean } = /* @__PURE__*/ cached(() => {
  // Skip the probe under `jitless`: strict CSPs report the caught `new Function`
  // as a `securitypolicyviolation` even though the throw is swallowed.
  if (globalConfig.jitless) {
    return false;
  }

  // @ts-ignore
  if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
    return false;
  }

  try {
    const F = Function;
    new F("");
    return true;
  } catch (_) {
    return false;
  }
});

export function isPlainObject(o: any): o is Record<PropertyKey, unknown> {
  if (isObject(o) === false) return false;

  // modified constructor
  const ctor = o.constructor;
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/util.ts" lines="454-512">
        return "null";
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return "promise";
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return "map";
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return "set";
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return "date";
      }
      // @ts-ignore
      if (typeof File !== "undefined" && data instanceof File) {
        return "file";
      }
      return "object";

    default:
      throw new Error(`Unknown data type: ${t}`);
  }
};

export const propertyKeyTypes: Set<string> = /* @__PURE__*/ new Set(["string", "number", "symbol"]);
export const primitiveTypes: Set<string> = /* @__PURE__*/ new Set([
  "string",
  "number",
  "bigint",
  "boolean",
  "symbol",
  "undefined",
]);
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// zod-specific utils
export function clone<T extends schemas.$ZodType>(inst: T, def?: T["_zod"]["def"], params?: { parent: boolean }): T {
  const cl = new inst._zod.constr(def ?? inst._zod.def);
  if (!def || params?.parent) cl._zod.parent = inst;
  return cl as any;
}

export type EmptyToNever<T> = keyof T extends never ? never : T;

export type Normalize<T> = T extends undefined
  ? never
  : T extends Record<any, any>
    ? Flatten<
        {
          [k in keyof Omit<T, "error" | "message">]: T[k];
        } & ("error" extends keyof T
          ? {
              error?: Exclude<T["error"], string>;
              // path?: PropertyKey[] | undefined;
              // message?: string | undefined;
            }
</production_snippet>
