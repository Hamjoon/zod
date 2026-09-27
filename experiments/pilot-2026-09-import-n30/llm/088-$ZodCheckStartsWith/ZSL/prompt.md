As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named $ZodCheckStartsWith. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The $ZodCheckStartsWith class is exported from `./checks.js` (path relative to the test file).
Here is the $ZodCheckStartsWith class:
/////////////////////////////////////
/////    $ZodCheckStartsWith    /////
/////////////////////////////////////
export interface $ZodCheckStartsWithDef extends $ZodCheckStringFormatDef<"starts_with"> {
  prefix: string;
}

export interface $ZodCheckStartsWithInternals extends $ZodCheckInternals<string> {
  def: $ZodCheckStartsWithDef;
  issc: errors.$ZodIssueInvalidStringFormat;
}

export interface $ZodCheckStartsWith extends $ZodCheck<string> {
  _zod: $ZodCheckStartsWithInternals;
}

export const $ZodCheckStartsWith: core.$constructor<$ZodCheckStartsWith> = /*@__PURE__*/ core.$constructor(
  "$ZodCheckStartsWith",
  (inst, def) => {
    $ZodCheck.init(inst, def);

    const pattern = new RegExp(`^${util.escapeRegex(def.prefix)}.*`);
    def.pattern ??= pattern;
    inst._zod.onattach.push((inst) => {
      const bag = inst._zod.bag as schemas.$ZodStringInternals<unknown>["bag"];
      bag.patterns ??= new Set();
      bag.patterns.add(pattern);
    });

    inst._zod.check = (payload) => {
      if (payload.value.startsWith(def.prefix)) return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "starts_with",
        prefix: def.prefix,
        input: payload.value,
        inst,
        continue: !def.abort,
      });
    };
  }
);