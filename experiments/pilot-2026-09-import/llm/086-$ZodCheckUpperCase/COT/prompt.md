As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named $ZodCheckUpperCase by following these steps:
- Extract and list all the public methods including their signatures
- For each methods, generate a basic Vitest test case that checks the method's functionality
- Given the source code of the class and the listed methods, identify potential edge cases and exception handling scenarios that should be tested
- Generate Vitest test cases that specifically test for the identified edge cases and exceptions
- Merge all the individual test cases into a complete Vitest test file ($ZodCheckUpperCase.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The $ZodCheckUpperCase class is exported from `./checks.js` (path relative to the test file).
Here is the $ZodCheckUpperCase class:
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