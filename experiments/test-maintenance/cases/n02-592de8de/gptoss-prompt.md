You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/classic/schemas.ts, packages/zod/src/v4/core/schemas.ts, packages/zod/src/v4/mini/schemas.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/classic/schemas.ts b/packages/zod/src/v4/classic/schemas.ts
index 8cc254cc..191412d1 100644
--- a/packages/zod/src/v4/classic/schemas.ts
+++ b/packages/zod/src/v4/classic/schemas.ts
@@ -140,30 +140,6 @@ export const ZodType: core.$constructor<ZodType> = /*@__PURE__*/ core.$construct
     return inst;
   }) as any;
 
-  //  const parse: <T extends core.$ZodType>(
-  //   schema: T,
-  //   value: unknown,
-  //   _ctx?: core.ParseContext<core.$ZodIssue>
-  // ) => core.output<T> = /* @__PURE__ */ core._parse(ZodError, parse) as any;
-
-  //  const safeParse: <T extends core.$ZodType>(
-  //   schema: T,
-  //   value: unknown,
-  //   _ctx?: core.ParseContext<core.$ZodIssue>
-  // ) => ZodSafeParseResult<core.output<T>> = /* @__PURE__ */ core._safeParse(ZodError) as any;
-
-  //  const parseAsync: <T extends core.$ZodType>(
-  //   schema: T,
-  //   value: unknown,
-  //   _ctx?: core.ParseContext<core.$ZodIssue>
-  // ) => Promise<core.output<T>> = /* @__PURE__ */ core._parseAsync(ZodError) as any;
-
-  //  const safeParseAsync: <T extends core.$ZodType>(
-  //   schema: T,
-  //   value: unknown,
-  //   _ctx?: core.ParseContext<core.$ZodIssue>
-  // ) => Promise<ZodSafeParseResult<core.output<T>>> = /* @__PURE__ */ core._safeParseAsync(ZodError) as any;
-
   // parsing
   inst.parse = (data, params) => parse.parse(inst, data, params, { callee: inst.parse });
   inst.safeParse = (data, params) => parse.safeParse(inst, data, params);
diff --git a/packages/zod/src/v4/core/schemas.ts b/packages/zod/src/v4/core/schemas.ts
index 03dd354e..a9ff9668 100644
--- a/packages/zod/src/v4/core/schemas.ts
+++ b/packages/zod/src/v4/core/schemas.ts
@@ -791,28 +791,6 @@ export const $ZodCIDRv6: core.$constructor<$ZodCIDRv6> = /*@__PURE__*/ core.$con
   }
 );
 
-//////////////////////////////   ZodIP   //////////////////////////////
-
-// export interface $ZodIPDef extends $ZodStringFormatDef<"ip"> {
-//   version?: "v4" | "v6";
-// }
-
-// export interface $ZodIPInternals extends $ZodStringFormatInternals<"ip"> {
-//   def: $ZodIPDef;
-// }
-
-// export interface $ZodIP extends $ZodType {
-//   _zod: $ZodIPInternals;
-// }
-
-// export const $ZodIP: core.$constructor<$ZodIP> = /*@__PURE__*/ core.$constructor("$ZodIP", (inst, def): void => {
-//   if (def.version === "v4") def.pattern ??= regexes.ipv4;
-//   else if (def.version === "v6") def.pattern ??= regexes.ipv6;
-//   else def.pattern ??= regexes.ip;
-//   $ZodStringFormat.init(inst, def);
-
-// });
-
 //////////////////////////////   ZodBase64   //////////////////////////////
 export function isValidBase64(data: string): boolean {
   if (data === "") return true;
@@ -893,34 +871,6 @@ export const $ZodBase64URL: core.$constructor<$ZodBase64URL> = /*@__PURE__*/ cor
   }
 );
 
-//////////////////////////////   ZodJSONString   //////////////////////////////
-
-// export interface $ZodJSONStringDef extends $ZodStringFormatDef<"json_string"> {}
-// export Def $ZodJSONStringDef extends $ZodStringFormatInternals {
-// export interface $ZodJSONStringInternals extends $ZodStringFormatInternals {
-//   _def: $ZodJSONStringDef;
-// }
-
-// export const $ZodJSONString: core.$constructor<{_zod: $ZodJSONStringInternals}> = /*@__PURE__*/ core.$constructor(
-//   "$ZodJSONString",
-//   (inst, def): void => {
-//     $ZodStringFormat.init(inst, def);
-//     inst._zod.check = (payload) => {
-//       try {
-//         JSON.parse(payload.value);
-//         return;
-//       } catch {
-//         payload.issues.push({
-//           code: "invalid_format",
-//           format: "json_string",
-//           input: payload.value,
-//           inst,
-//         });
-//       }
-//     };
-//   }
-// );
-
 //////////////////////////////   ZodE164   //////////////////////////////
 
 export interface $ZodE164Def extends $ZodStringFormatDef<"e164"> {}
diff --git a/packages/zod/src/v4/mini/schemas.ts b/packages/zod/src/v4/mini/schemas.ts
index 6b4f54aa..7d1cec37 100644
--- a/packages/zod/src/v4/mini/schemas.ts
+++ b/packages/zod/src/v4/mini/schemas.ts
@@ -282,19 +282,6 @@ export function ksuid(params?: string | core.$ZodKSUIDParams): ZodMiniKSUID {
   return core._ksuid(ZodMiniKSUID, params);
 }
 
-// ZodMiniIP
-// export interface ZodMiniIP extends ZodMiniStringFormat<"ip"> {
-//   _zod: core.$ZodIPInternals;
-// }
-// export const ZodMiniIP: core.$constructor<ZodMiniIP> = /*@__PURE__*/ core.$constructor("ZodMiniIP", (inst, def) => {
-//   core.$ZodIP.init(inst, def);
-//   ZodMiniStringFormat.init(inst, def);
-// });
-
-// export function ip(params?: string | core.$ZodIPParams): ZodMiniIP {
-//   return core._ip(ZodMiniIP, params);
-// }
-
 // ZodMiniIPv4
 export interface ZodMiniIPv4 extends ZodMiniStringFormat<"ipv4"> {
   _zod: core.$ZodIPv4Internals;

</recent_change_diff>

Current test results:
<test_output>
 Test Files  154 passed (154)
      Tests  1592 passed (1592)
   Duration  6.22s (transform 520ms, setup 0ms, collect 17.10s, tests 1.91s, environment 12ms, prepare 6.50s, typecheck 5.78s)

</test_output>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/classic/schemas.ts" lines="117-167">
  core.$ZodType.init(inst, def);
  inst.def = def;
  Object.defineProperty(inst, "_def", { value: def });

  // base methods
  inst.check = (...checks) => {
    return inst.clone(
      {
        ...def,
        checks: [
          ...(def.checks ?? []),
          ...checks.map((ch) =>
            typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch
          ),
        ],
      }
      // { parent: true }
    );
  };
  inst.clone = (def, params) => core.clone(inst, def, params);
  inst.brand = () => inst as any;
  inst.register = ((reg: any, meta: any) => {
    reg.add(inst, meta);
    return inst;
  }) as any;

  // parsing
  inst.parse = (data, params) => parse.parse(inst, data, params, { callee: inst.parse });
  inst.safeParse = (data, params) => parse.safeParse(inst, data, params);
  inst.parseAsync = async (data, params) => parse.parseAsync(inst, data, params, { callee: inst.parseAsync });
  inst.safeParseAsync = async (data, params) => parse.safeParseAsync(inst, data, params);
  inst.spa = inst.safeParseAsync;

  // refinements
  inst.refine = (check, params) => inst.check(refine(check, params));
  inst.superRefine = (refinement) => inst.check(superRefine(refinement));
  inst.overwrite = (fn) => inst.check(checks.overwrite(fn));

  // wrappers
  inst.optional = () => optional(inst);
  inst.nullable = () => nullable(inst);
  inst.nullish = () => optional(nullable(inst));
  inst.nonoptional = (params) => nonoptional(inst, params);
  inst.array = () => array(inst);
  inst.or = (arg) => union([inst, arg]);
  inst.and = (arg) => intersection(inst, arg);
  inst.transform = (tx) => pipe(inst, transform(tx as any)) as never;
  inst.default = (def) => _default(inst, def);
  inst.prefault = (def) => prefault(inst, def);
  // inst.coalesce = (def, params) => coalesce(inst, def, params);
  inst.catch = (params) => _catch(inst, params);
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/schemas.ts" lines="768-818">
export const $ZodCIDRv6: core.$constructor<$ZodCIDRv6> = /*@__PURE__*/ core.$constructor(
  "$ZodCIDRv6",
  (inst, def): void => {
    def.pattern ??= regexes.cidrv6; // not used for validation
    $ZodStringFormat.init(inst, def);

    inst._zod.check = (payload) => {
      const [address, prefix] = payload.value.split("/");
      try {
        if (!prefix) throw new Error();
        const prefixNum = Number(prefix);
        if (`${prefixNum}` !== prefix) throw new Error();
        if (prefixNum < 0 || prefixNum > 128) throw new Error();
        new URL(`http://[${address}]`);
      } catch {
        payload.issues.push({
          code: "invalid_format",
          format: "cidrv6",
          input: payload.value,
          inst,
        });
      }
    };
  }
);

//////////////////////////////   ZodBase64   //////////////////////////////
export function isValidBase64(data: string): boolean {
  if (data === "") return true;
  if (data.length % 4 !== 0) return false;
  try {
    atob(data);
    return true;
  } catch {
    return false;
  }
}

export interface $ZodBase64Def extends $ZodStringFormatDef<"base64"> {}
export interface $ZodBase64Internals extends $ZodStringFormatInternals<"base64"> {}

export interface $ZodBase64 extends $ZodType {
  _zod: $ZodBase64Internals;
}

export const $ZodBase64: core.$constructor<$ZodBase64> = /*@__PURE__*/ core.$constructor(
  "$ZodBase64",
  (inst, def): void => {
    def.pattern ??= regexes.base64;
    $ZodStringFormat.init(inst, def);

</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/schemas.ts" lines="848-898">
  _zod: $ZodBase64URLInternals;
}

export const $ZodBase64URL: core.$constructor<$ZodBase64URL> = /*@__PURE__*/ core.$constructor(
  "$ZodBase64URL",
  (inst, def): void => {
    def.pattern ??= regexes.base64url;
    $ZodStringFormat.init(inst, def);

    inst._zod.onattach.push((inst) => {
      inst._zod.bag.contentEncoding = "base64url";
    });

    inst._zod.check = (payload) => {
      if (isValidBase64URL(payload.value)) return;

      payload.issues.push({
        code: "invalid_format",
        format: "base64url",
        input: payload.value,
        inst,
      });
    };
  }
);

//////////////////////////////   ZodE164   //////////////////////////////

export interface $ZodE164Def extends $ZodStringFormatDef<"e164"> {}
export interface $ZodE164Internals extends $ZodStringFormatInternals<"e164"> {}

export interface $ZodE164 extends $ZodType {
  _zod: $ZodE164Internals;
}

export const $ZodE164: core.$constructor<$ZodE164> = /*@__PURE__*/ core.$constructor("$ZodE164", (inst, def): void => {
  def.pattern ??= regexes.e164;
  $ZodStringFormat.init(inst, def);
});

//////////////////////////////   ZodJWT   //////////////////////////////

export function isValidJWT(token: string, algorithm: util.JWTAlgorithm | null = null): boolean {
  try {
    const tokensParts = token.split(".");
    if (tokensParts.length !== 3) return false;
    const [header] = tokensParts;
    const parsedHeader = JSON.parse(atob(header));
    if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
    if (!parsedHeader.alg) return false;
    if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/mini/schemas.ts" lines="259-309">
}
export const ZodMiniXID: core.$constructor<ZodMiniXID> = /*@__PURE__*/ core.$constructor("ZodMiniXID", (inst, def) => {
  core.$ZodXID.init(inst, def);
  ZodMiniStringFormat.init(inst, def);
});

export function xid(params?: string | core.$ZodXIDParams): ZodMiniXID {
  return core._xid(ZodMiniXID, params);
}

// ZodMiniKSUID
export interface ZodMiniKSUID extends ZodMiniStringFormat<"ksuid"> {
  _zod: core.$ZodKSUIDInternals;
}
export const ZodMiniKSUID: core.$constructor<ZodMiniKSUID> = /*@__PURE__*/ core.$constructor(
  "ZodMiniKSUID",
  (inst, def) => {
    core.$ZodKSUID.init(inst, def);
    ZodMiniStringFormat.init(inst, def);
  }
);

export function ksuid(params?: string | core.$ZodKSUIDParams): ZodMiniKSUID {
  return core._ksuid(ZodMiniKSUID, params);
}

// ZodMiniIPv4
export interface ZodMiniIPv4 extends ZodMiniStringFormat<"ipv4"> {
  _zod: core.$ZodIPv4Internals;
}
export const ZodMiniIPv4: core.$constructor<ZodMiniIPv4> = /*@__PURE__*/ core.$constructor(
  "ZodMiniIPv4",
  (inst, def) => {
    core.$ZodIPv4.init(inst, def);
    ZodMiniStringFormat.init(inst, def);
  }
);

export function ipv4(params?: string | core.$ZodIPv4Params): ZodMiniIPv4 {
  return core._ipv4(ZodMiniIPv4, params);
}

// ZodMiniIPv6
export interface ZodMiniIPv6 extends ZodMiniStringFormat<"ipv6"> {
  _zod: core.$ZodIPv6Internals;
}
export const ZodMiniIPv6: core.$constructor<ZodMiniIPv6> = /*@__PURE__*/ core.$constructor(
  "ZodMiniIPv6",
  (inst, def) => {
    core.$ZodIPv6.init(inst, def);
    ZodMiniStringFormat.init(inst, def);
</production_snippet>
