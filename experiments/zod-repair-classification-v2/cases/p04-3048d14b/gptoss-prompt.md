You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/core/tests/extend.test.ts, packages/zod/jsr.json, packages/zod/package.json, packages/zod/src/v4/core/util.ts, packages/zod/src/v4/core/versions.ts, play.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/core/tests/extend.test.ts b/packages/zod/src/v4/core/tests/extend.test.ts
new file mode 100644
index 000000000..101adac1e
--- /dev/null
+++ b/packages/zod/src/v4/core/tests/extend.test.ts
@@ -0,0 +1,18 @@
+import { test } from "vitest";
+import * as z from "zod/v4";
+
+test("extend chaining preserves and overrides properties", () => {
+  const schema1 = z.object({
+    email: z.string(),
+  });
+
+  const schema2 = schema1.extend({
+    email: schema1.shape.email.check(z.email()),
+  });
+
+  const schema3 = schema2.extend({
+    email: schema2.shape.email.or(z.literal("")),
+  });
+
+  schema3.parse({ email: "test@example.com" });
+});

</recent_change_diff>

Current test results:
<test_output>
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v2.1.9 <worktree>/p04-3048d14b/packages/zod

 ❯ src/v4/core/tests/extend.test.ts (1 test | 1 failed) 5ms
   × extend chaining preserves and overrides properties 5ms
     → Cannot redefine property: checks
 ✓  TS  src/v4/core/tests/extend.test.ts (1 test)

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/v4/core/tests/extend.test.ts > extend chaining preserves and overrides properties
TypeError: Cannot redefine property: checks
 ❯ Module.extend src/v4/core/util.ts:607:10
    605| 
    606|   const def = cloneDef(schema);
    607|   Object.defineProperties(def, {
       |          ^
    608|     shape: {
    609|       get() {
 ❯ _.inst.extend src/v4/classic/schemas.ts:1136:17
 ❯ src/v4/core/tests/extend.test.ts:13:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 1 passed (2)
Type Errors  no errors
   Start at  15:51:55
   Duration  3.91s (transform 246ms, setup 0ms, collect 358ms, tests 5ms, environment 0ms, prepare 56ms, typecheck 3.71s)


</test_output>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/core/tests/extend.test.ts" lines="1-43">
import { test } from "vitest";
import * as z from "zod/v4";

test("extend chaining preserves and overrides properties", () => {
  const schema1 = z.object({
    email: z.string(),
  });

  const schema2 = schema1.extend({
    email: schema1.shape.email.check(z.email()),
  });

  const schema3 = schema2.extend({
    email: schema2.shape.email.or(z.literal("")),
  });

  schema3.parse({ email: "test@example.com" });
});
</test_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/util.ts" lines="260-314">
      throw new Error("cached value already set");
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

export function assignProp<T extends object, K extends PropertyKey>(
  target: T,
  prop: K,
  value: K extends keyof T ? T[K] : any
): void {
  Object.defineProperty(target, prop, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

export function cloneDef(schema: schemas.$ZodType): any {
  const def: any = {};
  Object.defineProperties(def, Object.getOwnPropertyDescriptors(schema._zod.def));
  return def;
}

export function getElementAtPath(obj: any, path: (string | number)[] | null | undefined): any {
  if (!path) return obj;
  return path.reduce((acc, key) => acc?.[key], obj);
}

export function promiseAllObject<T extends object>(promisesObj: T): Promise<{ [k in keyof T]: Awaited<T[k]> }> {
  const keys = Object.keys(promisesObj);
  const promises = keys.map((key) => (promisesObj as any)[key]);

  return Promise.all(promises).then((results) => {
    const resolvedObj: any = {};
    for (let i = 0; i < keys.length; i++) {
      resolvedObj[keys[i]!] = results[i];
    }
    return resolvedObj;
  });
}

export function randomString(length = 10): string {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/util.ts" lines="523-687">

export type CleanKey<T extends PropertyKey> = T extends `?${infer K}` ? K : T extends `${infer K}?` ? K : T;
export type ToCleanMap<T extends schemas.$ZodLooseShape> = {
  [k in keyof T]: k extends `?${infer K}` ? K : k extends `${infer K}?` ? K : k;
};
export type FromCleanMap<T extends schemas.$ZodLooseShape> = {
  [k in keyof T as k extends `?${infer K}` ? K : k extends `${infer K}?` ? K : k]: k;
};

export const NUMBER_FORMAT_RANGES: Record<checks.$ZodNumberFormats, [number, number]> = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-3.4028234663852886e38, 3.4028234663852886e38],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE],
};

export const BIGINT_FORMAT_RANGES: Record<checks.$ZodBigIntFormats, [bigint, bigint]> = {
  int64: [/* @__PURE__*/ BigInt("-9223372036854775808"), /* @__PURE__*/ BigInt("9223372036854775807")],
  uint64: [/* @__PURE__*/ BigInt(0), /* @__PURE__*/ BigInt("18446744073709551615")],
};

export function pick(schema: schemas.$ZodObject, mask: Record<string, unknown>): any {
  const currDef = schema._zod.def;

  const def = cloneDef(schema);
  Object.defineProperties(def, {
    shape: {
      get() {
        const newShape: Writeable<schemas.$ZodShape> = {};
        for (const key in mask) {
          if (!(key in currDef.shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key]) continue;
          newShape[key] = currDef.shape[key]!;
        }

        assignProp(this, "shape", newShape); // self-caching
        return newShape;
      },
    },
    checks: {
      value: [],
    },
  });

  return clone(schema, def) as any;
}

export function omit(schema: schemas.$ZodObject, mask: object): any {
  const currDef = schema._zod.def;

  const def = cloneDef(schema);
  Object.defineProperties(def, {
    shape: {
      get() {
        const newShape: Writeable<schemas.$ZodShape> = { ...schema._zod.def.shape };
        for (const key in mask) {
          if (!(key in currDef.shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!(mask as any)[key]) continue;

          delete newShape[key];
        }
        assignProp(this, "shape", newShape); // self-caching
        return newShape;
      },
    },
    checks: {
      value: [],
    },
  });

  return clone(schema, def);
}

export function extend(schema: schemas.$ZodObject, shape: schemas.$ZodShape): any {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to extend: expected a plain object");
  }

  const def = cloneDef(schema);
  Object.defineProperties(def, {
    shape: {
      get() {
        const _shape = { ...schema._zod.def.shape, ...shape };
        assignProp(this, "shape", _shape); // self-caching
        return _shape;
      },
    },
    checks: {
      value: [],
    },
  });
  return clone(schema, def) as any;
}

export function merge(a: schemas.$ZodObject, b: schemas.$ZodObject): any {
  const def = cloneDef(a);
  Object.defineProperties(def, {
    shape: {
      get() {
        const _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
        assignProp(this, "shape", _shape); // self-caching
        return _shape;
      },
    },
    catchall: {
      get() {
        return b._zod.def.catchall;
      },
    },
    checks: {
      value: [], // delete existing checks
    },
  });

  return clone(a, def) as any;
}

export function partial(
  Class: SchemaClass<schemas.$ZodOptional> | null,
  schema: schemas.$ZodObject,
  mask: object | undefined
): any {
  const def = cloneDef(schema);
  Object.defineProperties(def, {
    shape: {
      get() {
        const oldShape = schema._zod.def.shape;
        const shape: Writeable<schemas.$ZodShape> = { ...oldShape };

        if (mask) {
          for (const key in mask) {
            if (!(key in oldShape)) {
              throw new Error(`Unrecognized key: "${key}"`);
            }
            if (!(mask as any)[key]) continue;
            // if (oldShape[key]!._zod.optin === "optional") continue;
            shape[key] = Class
              ? new Class({
                  type: "optional",
                  innerType: oldShape[key]!,
                })
              : oldShape[key]!;
          }
        } else {
          for (const key in oldShape) {
            // if (oldShape[key]!._zod.optin === "optional") continue;
            shape[key] = Class
              ? new Class({
                  type: "optional",
                  innerType: oldShape[key]!,
                })
              : oldShape[key]!;
          }
        }

        assignProp(this, "shape", shape); // self-caching
        return shape;
      },
    },
    checks: {
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/versions.ts" lines="1-29">
export const version = {
  major: 4,
  minor: 0,
  patch: 7 as number,
} as const;
</production_snippet>
