You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/core/schemas.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/core/schemas.ts b/packages/zod/src/v4/core/schemas.ts
index 58ff0f91a..0e7252b84 100644
--- a/packages/zod/src/v4/core/schemas.ts
+++ b/packages/zod/src/v4/core/schemas.ts
@@ -298,7 +298,8 @@ export const $ZodType: core.$constructor<$ZodType> = /*@__PURE__*/ core.$constru
     };
   }
 
-  inst["~standard"] = {
+  // Lazy initialize ~standard to avoid creating objects for every schema
+  util.defineLazy(inst, "~standard", () => ({
     validate: (value: unknown) => {
       try {
         const r = safeParse(inst, value);
@@ -309,7 +310,7 @@ export const $ZodType: core.$constructor<$ZodType> = /*@__PURE__*/ core.$constru
     },
     vendor: "zod",
     version: 1 as const,
-  };
+  }));
 });
 
 export { clone } from "./util.js";

</recent_change_diff>

Current test results:
<test_output>
 Test Files  193 passed | 1 skipped (194)
      Tests  2371 passed | 1 todo (2372)
   Duration  8.91s (transform 4.82s, setup 865ms, collect 25.13s, tests 4.67s, environment 6ms, prepare 396ms, typecheck 4.90s)

</test_output>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/schemas.ts" lines="276-338">
      if (ctx.direction === "backward") {
        // run canary
        // initial pass (no checks)
        const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });

        if (canary instanceof Promise) {
          return canary.then((canary) => {
            return handleCanaryResult(canary, payload, ctx);
          });
        }

        return handleCanaryResult(canary, payload, ctx);
      }

      // forward
      const result = inst._zod.parse(payload, ctx);
      if (result instanceof Promise) {
        if (ctx.async === false) throw new core.$ZodAsyncError();
        return result.then((result) => runChecks(result, checks, ctx));
      }

      return runChecks(result, checks, ctx);
    };
  }

  // Lazy initialize ~standard to avoid creating objects for every schema
  util.defineLazy(inst, "~standard", () => ({
    validate: (value: unknown) => {
      try {
        const r = safeParse(inst, value);
        return r.success ? { value: r.data } : { issues: r.error?.issues };
      } catch (_) {
        return safeParseAsync(inst, value).then((r) => (r.success ? { value: r.data } : { issues: r.error?.issues }));
      }
    },
    vendor: "zod",
    version: 1 as const,
  }));
});

export { clone } from "./util.js";

//////////////////////////////////////////
//////////////////////////////////////////
//////////                      //////////
//////////      $ZodString      //////////
//////////                      //////////
//////////////////////////////////////////
//////////////////////////////////////////
export interface $ZodStringDef extends $ZodTypeDef {
  type: "string";
  coerce?: boolean;
  checks?: checks.$ZodCheck<string>[];
}

export interface $ZodStringInternals<Input> extends $ZodTypeInternals<string, Input> {
  def: $ZodStringDef;
  /** @deprecated Internal API, use with caution (not deprecated) */
  pattern: RegExp;

  /** @deprecated Internal API, use with caution (not deprecated) */
  isst: errors.$ZodIssueInvalidType;
  bag: util.LoosePartial<{
</production_snippet>
