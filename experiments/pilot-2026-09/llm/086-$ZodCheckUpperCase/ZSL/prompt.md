As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named $ZodCheckUpperCase. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
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