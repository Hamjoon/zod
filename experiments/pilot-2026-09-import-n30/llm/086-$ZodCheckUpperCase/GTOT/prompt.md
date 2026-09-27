Imagine three different experts in software testing who are tasked with developing comprehensive Vitest test cases for the following TypeScript class.To comprehensively test all methods in the following class named $ZodCheckUpperCase they must following these steps:
- Extract and list all the public methods including their signatures
- For each methods, generate a basic Vitest test case that checks the method's functionality
- Given the source code of the class and the listed methods, identify potential edge cases and exception handling scenarios that should be tested
- Generate Vitest test cases that specifically test for the identified edge cases and exceptions
- Merge all the individual test cases into a complete Vitest test file ($ZodCheckUpperCase.test.ts) for the given TypeScript class.All experts will propose one test cases for each method, share it with the group, and then proceed to the next step. If any expert realizes they're wrong at any point, they leave.
The $ZodCheckUpperCase class is exported from `./checks.js` (path relative to the test file).
The TypeScript class is:
//////////////////////////////////////
/////    $ZodCheckUpperCase    /////
//////////////////////////////////////
export interface $ZodCheckUpperCaseDef extends $ZodCheckStringFormatDef<"uppercase"> {}

export interface $ZodCheckUpperCaseInternals extends $ZodCheckInternals<string> {
  def: $ZodCheckUpperCaseDef;
  issc: errors.$ZodIssueInvalidStringFormat;
}

export interface $ZodCheckUpperCase extends $ZodCheck<string> {
  _zod: $ZodCheckUpperCaseInternals;
}

export const $ZodCheckUpperCase: core.$constructor<$ZodCheckUpperCase> = /*@__PURE__*/ core.$constructor(
  "$ZodCheckUpperCase",
  (inst, def) => {
    def.pattern ??= regexes.uppercase;
    $ZodCheckStringFormat.init(inst, def);
  }
);
At the end they must propose one complete (including typical use cases, edge cases, and error scenarios) Vitest test file ($ZodCheckUpperCase.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##