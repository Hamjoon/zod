You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/core/schemas.ts, packages/zod/src/v4/core/util.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/core/schemas.ts b/packages/zod/src/v4/core/schemas.ts
index 486d2442..ed60b732 100644
--- a/packages/zod/src/v4/core/schemas.ts
+++ b/packages/zod/src/v4/core/schemas.ts
@@ -220,6 +220,7 @@ export const $ZodType: core.$constructor<$ZodType> = /*@__PURE__*/ core.$constru
       let asyncResult!: Promise<unknown> | undefined;
       for (const ch of checks) {
         if (ch._zod.def.when) {
+          if (util.explicitlyAborted(payload)) continue;
           const shouldRun = ch._zod.def.when(payload);
           if (!shouldRun) continue;
         } else if (isAborted) {
diff --git a/packages/zod/src/v4/core/util.ts b/packages/zod/src/v4/core/util.ts
index dec85921..d686be29 100644
--- a/packages/zod/src/v4/core/util.ts
+++ b/packages/zod/src/v4/core/util.ts
@@ -811,6 +811,18 @@ export function aborted(x: schemas.ParsePayload, startIndex = 0): boolean {
   return false;
 }
 
+// Checks for explicit abort (continue === false), as opposed to implicit abort (continue === undefined).
+// Used to respect `abort: true` in .refine() even for checks that have a `when` function.
+export function explicitlyAborted(x: schemas.ParsePayload, startIndex = 0): boolean {
+  if (x.aborted === true) return true;
+  for (let i = startIndex; i < x.issues.length; i++) {
+    if (x.issues[i]?.continue === false) {
+      return true;
+    }
+  }
+  return false;
+}
+
 export function prefixIssues(path: PropertyKey, issues: errors.$ZodRawIssue[]): errors.$ZodRawIssue[] {
   return issues.map((iss) => {
     (iss as any).path ??= [];

</recent_change_diff>

Current test results:
<test_output>
 Test Files  204 passed (204)
      Tests  2524 passed (2524)
   Duration  8.81s (transform 5.35s, setup 1.51s, collect 27.91s, tests 4.94s, environment 19ms, prepare 564ms, typecheck 4.37s)

</test_output>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/schemas.ts" lines="198-248">

  for (const ch of checks) {
    for (const fn of ch._zod.onattach) {
      fn(inst);
    }
  }

  if (checks.length === 0) {
    // deferred initializer
    // inst._zod.parse is not yet defined
    inst._zod.deferred ??= [];
    inst._zod.deferred?.push(() => {
      inst._zod.run = inst._zod.parse;
    });
  } else {
    const runChecks = (
      payload: ParsePayload,
      checks: checks.$ZodCheck<never>[],
      ctx?: ParseContextInternal | undefined
    ): util.MaybeAsync<ParsePayload> => {
      let isAborted = util.aborted(payload);

      let asyncResult!: Promise<unknown> | undefined;
      for (const ch of checks) {
        if (ch._zod.def.when) {
          if (util.explicitlyAborted(payload)) continue;
          const shouldRun = ch._zod.def.when(payload);
          if (!shouldRun) continue;
        } else if (isAborted) {
          continue;
        }
        const currLen = payload.issues.length;
        const _ = ch._zod.check(payload as any) as any as ParsePayload;

        if (_ instanceof Promise && ctx?.async === false) {
          throw new core.$ZodAsyncError();
        }
        if (asyncResult || _ instanceof Promise) {
          asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
            await _;
            const nextLen = payload.issues.length;
            if (nextLen === currLen) return;
            if (!isAborted) isAborted = util.aborted(payload, currLen);
          });
        } else {
          const nextLen = payload.issues.length;
          if (nextLen === currLen) continue;
          if (!isAborted) isAborted = util.aborted(payload, currLen);
        }
      }

</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/util.ts" lines="789-850">
          });
        }
      }

      assignProp(this, "shape", shape); // self-caching
      return shape;
    },
  });

  return clone(schema, def) as any;
}

export type Constructor<T, Def extends any[] = any[]> = new (...args: Def) => T;

// invalid_type | too_big | too_small | invalid_format | not_multiple_of | unrecognized_keys | invalid_union | invalid_key | invalid_element | invalid_value | custom
export function aborted(x: schemas.ParsePayload, startIndex = 0): boolean {
  if (x.aborted === true) return true;
  for (let i = startIndex; i < x.issues.length; i++) {
    if (x.issues[i]?.continue !== true) {
      return true;
    }
  }
  return false;
}

// Checks for explicit abort (continue === false), as opposed to implicit abort (continue === undefined).
// Used to respect `abort: true` in .refine() even for checks that have a `when` function.
export function explicitlyAborted(x: schemas.ParsePayload, startIndex = 0): boolean {
  if (x.aborted === true) return true;
  for (let i = startIndex; i < x.issues.length; i++) {
    if (x.issues[i]?.continue === false) {
      return true;
    }
  }
  return false;
}

export function prefixIssues(path: PropertyKey, issues: errors.$ZodRawIssue[]): errors.$ZodRawIssue[] {
  return issues.map((iss) => {
    (iss as any).path ??= [];
    (iss as any).path.unshift(path);
    return iss;
  });
}

export function unwrapMessage(message: string | { message: string } | undefined | null): string | undefined {
  return typeof message === "string" ? message : message?.message;
}

export function finalizeIssue(
  iss: errors.$ZodRawIssue,
  ctx: schemas.ParseContextInternal | undefined,
  config: $ZodConfig
): errors.$ZodIssue {
  const full = { ...iss, path: iss.path ?? [] } as errors.$ZodIssue;

  // for backwards compatibility
  if (!iss.message) {
    const message =
      unwrapMessage(iss.inst?._zod.def?.error?.(iss as never)) ??
      unwrapMessage(ctx?.error?.(iss as never)) ??
      unwrapMessage(config.customError?.(iss)) ??
</production_snippet>
