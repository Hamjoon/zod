Imagine three different experts in software testing who are tasked with developing comprehensive Vitest test cases for the following TypeScript class.To comprehensively test all methods in the following class named $ZodCheckStartsWith they must following these steps:
- Extract and list all the public methods including their signatures
- For each methods, generate a basic Vitest test case that checks the method's functionality
- Given the source code of the class and the listed methods, identify potential edge cases and exception handling scenarios that should be tested
- Generate Vitest test cases that specifically test for the identified edge cases and exceptions
- Merge all the individual test cases into a complete Vitest test file ($ZodCheckStartsWith.test.ts) for the given TypeScript class.All experts will propose one test cases for each method, share it with the group, and then proceed to the next step. If any expert realizes they're wrong at any point, they leave.
The $ZodCheckStartsWith class is exported from `./checks.js` (path relative to the test file).
The TypeScript class is:
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
At the end they must propose one complete (including typical use cases, edge cases, and error scenarios) Vitest test file ($ZodCheckStartsWith.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##