As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named $ZodCheckIncludes by following these steps:
- Extract and list all the public methods including their signatures
- For each methods, generate a basic Vitest test case that checks the method's functionality
- Given the source code of the class and the listed methods, identify potential edge cases and exception handling scenarios that should be tested
- Generate Vitest test cases that specifically test for the identified edge cases and exceptions
- Merge all the individual test cases into a complete Vitest test file ($ZodCheckIncludes.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The $ZodCheckIncludes class is exported from `./checks.js` (path relative to the test file).
Here is the $ZodCheckIncludes class:
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