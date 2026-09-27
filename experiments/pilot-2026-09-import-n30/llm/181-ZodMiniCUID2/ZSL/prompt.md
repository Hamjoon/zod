As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named ZodMiniCUID2. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The ZodMiniCUID2 class is exported from `./schemas.js` (path relative to the test file).
Here is the ZodMiniCUID2 class:
// ZodMiniCUID2
export interface ZodMiniCUID2 extends _ZodMiniString<core.$ZodCUID2Internals> {
  // _zod: core.$ZodCUID2Internals;
}

export const ZodMiniCUID2: core.$constructor<ZodMiniCUID2> = /*@__PURE__*/ core.$constructor(
  "ZodMiniCUID2",
  (inst, def) => {
    core.$ZodCUID2.init(inst, def);
    ZodMiniStringFormat.init(inst, def);
  }
);