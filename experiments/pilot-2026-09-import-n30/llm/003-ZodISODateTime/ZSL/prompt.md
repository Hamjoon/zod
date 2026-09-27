As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named ZodISODateTime. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The ZodISODateTime class is exported from `./iso.js` (path relative to the test file).
Here is the ZodISODateTime class:
export interface ZodISODateTime extends schemas.ZodStringFormat {
  _zod: core.$ZodISODateTimeInternals;
}

export const ZodISODateTime: core.$constructor<ZodISODateTime> = /*@__PURE__*/ core.$constructor(
  "ZodISODateTime",
  (inst, def) => {
    core.$ZodISODateTime.init(inst, def);
    schemas.ZodStringFormat.init(inst, def);
  }
);