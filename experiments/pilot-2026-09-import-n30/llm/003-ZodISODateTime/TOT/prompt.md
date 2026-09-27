Imagine three different experts in software testing who are tasked with developing comprehensive Vitest test cases for the following TypeScript class. All experts will propose one test cases for each method, share it with the group, and then proceed to the next step. If any expert realizes they're wrong at any point, they leave.
The ZodISODateTime class is exported from `./iso.js` (path relative to the test file).
The TypeScript class is:
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
At the end they must propose one complete (including typical use cases, edge cases, and error scenarios) Vitest test file (ZodISODateTime.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##