As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named $ZodIPv6. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The $ZodIPv6 class is exported from `./schemas.js` (path relative to the test file).
Here is the $ZodIPv6 class:
export interface $ZodIPv6Def extends $ZodStringFormatDef<"ipv6"> {
  version?: "v6";
}

export interface $ZodIPv6Internals extends $ZodStringFormatInternals<"ipv6"> {
  def: $ZodIPv6Def;
}

export interface $ZodIPv6 extends $ZodType {
  _zod: $ZodIPv6Internals;
}

export const $ZodIPv6: core.$constructor<$ZodIPv6> = /*@__PURE__*/ core.$constructor("$ZodIPv6", (inst, def): void => {
  def.pattern ??= regexes.ipv6;
  $ZodStringFormat.init(inst, def);

  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag as $ZodStringInternals<unknown>["bag"];
    bag.format = `ipv6`;
  });

  inst._zod.check = (payload) => {
    try {
      new URL(`http://[${payload.value}]`);
      // return;
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: payload.value,
        inst,
        continue: !def.abort,
      });
    }
  };
});