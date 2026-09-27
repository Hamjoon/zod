As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named ZodNull. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The ZodNull class is exported from `./schemas.js` (path relative to the test file).
Here is the ZodNull class:
// ZodNull
export interface ZodNull extends _ZodType<core.$ZodNullInternals> {}

export const ZodNull: core.$constructor<ZodNull> = /*@__PURE__*/ core.$constructor("ZodNull", (inst, def) => {
  core.$ZodNull.init(inst, def);
  ZodType.init(inst, def);
});