Imagine three different experts in software testing who are tasked with developing comprehensive Vitest test cases for the following TypeScript class. All experts will propose one test cases for each method, share it with the group, and then proceed to the next step. If any expert realizes they're wrong at any point, they leave.
The $ZodCheckIncludes class is exported from `./checks.js` (path relative to the test file).
The TypeScript class is:
///////////////////////////////////
/////    $ZodCheckIncludes    /////
///////////////////////////////////
export interface $ZodCheckIncludesDef extends $ZodCheckStringFormatDef<"includes"> {
  includes: string;
  position?: number | undefined;
}

export interface $ZodCheckIncludesInternals extends $ZodCheckInternals<string> {
  def: $ZodCheckIncludesDef;
  issc: errors.$ZodIssueInvalidStringFormat;
}

export interface $ZodCheckIncludes extends $ZodCheck<string> {
  _zod: $ZodCheckIncludesInternals;
}

export const $ZodCheckIncludes: core.$constructor<$ZodCheckIncludes> = /*@__PURE__*/ core.$constructor(
  "$ZodCheckIncludes",
  (inst, def) => {
    $ZodCheck.init(inst, def);

    const escapedRegex = util.escapeRegex(def.includes);
    const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
    def.pattern = pattern;
    inst._zod.onattach.push((inst) => {
      const bag = inst._zod.bag as schemas.$ZodStringInternals<unknown>["bag"];
      bag.patterns ??= new Set();
      bag.patterns.add(pattern);
    });

    inst._zod.check = (payload) => {
      if (payload.value.includes(def.includes, def.position)) return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "includes",
        includes: def.includes,
        input: payload.value,
        inst,
        continue: !def.abort,
      });
    };
  }
);
At the end they must propose one complete (including typical use cases, edge cases, and error scenarios) Vitest test file ($ZodCheckIncludes.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##