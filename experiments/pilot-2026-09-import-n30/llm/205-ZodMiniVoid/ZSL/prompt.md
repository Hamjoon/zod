As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named ZodMiniVoid. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The ZodMiniVoid class is exported from `./schemas.js` (path relative to the test file).
Here is the ZodMiniVoid class:
// ZodMiniVoid
export interface ZodMiniVoid extends _ZodMiniType<core.$ZodVoidInternals> {
  // _zod: core.$ZodVoidInternals;
}

export const ZodMiniVoid: core.$constructor<ZodMiniVoid> = /*@__PURE__*/ core.$constructor(
  "ZodMiniVoid",
  (inst, def) => {
    core.$ZodVoid.init(inst, def);
    ZodMiniType.init(inst, def);
  }
);