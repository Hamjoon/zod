Imagine three different experts in software testing who are tasked with developing comprehensive Vitest test cases for the following TypeScript class. All experts will propose one test cases for each method, share it with the group, and then proceed to the next step. If any expert realizes they're wrong at any point, they leave.
The TypeScript class is:
// ZodNull
export interface ZodNull extends _ZodType<core.$ZodNullInternals> {}

export const ZodNull: core.$constructor<ZodNull> = /*@__PURE__*/ core.$constructor("ZodNull", (inst, def) => {
  core.$ZodNull.init(inst, def);
  ZodType.init(inst, def);
});
At the end they must propose one complete (including typical use cases, edge cases, and error scenarios) Vitest test file (ZodNull.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##