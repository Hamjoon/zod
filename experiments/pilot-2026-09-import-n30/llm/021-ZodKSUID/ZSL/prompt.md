As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named ZodKSUID. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The ZodKSUID class is exported from `./schemas.js` (path relative to the test file).
Here is the ZodKSUID class:
// ZodKSUID
export interface ZodKSUID extends ZodStringFormat<"ksuid"> {
  _zod: core.$ZodKSUIDInternals;
}

export const ZodKSUID: core.$constructor<ZodKSUID> = /*@__PURE__*/ core.$constructor("ZodKSUID", (inst, def) => {
  // ZodStringFormat.init(inst, def);
  core.$ZodKSUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});