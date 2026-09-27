As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named ZodMiniBigInt. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The ZodMiniBigInt class is exported from `./schemas.js` (path relative to the test file).
Here is the ZodMiniBigInt class:
// ZodMiniBigInt
export interface ZodMiniBigInt<T = unknown> extends _ZodMiniType<core.$ZodBigIntInternals<T>>, core.$ZodBigInt<T> {
  // _zod: core.$ZodBigIntInternals<T>;
}

export const ZodMiniBigInt: core.$constructor<ZodMiniBigInt> = /*@__PURE__*/ core.$constructor(
  "ZodMiniBigInt",
  (inst, def) => {
    core.$ZodBigInt.init(inst, def);
    ZodMiniType.init(inst, def);
  }
);