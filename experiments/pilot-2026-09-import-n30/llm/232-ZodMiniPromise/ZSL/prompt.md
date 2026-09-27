As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named ZodMiniPromise. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The ZodMiniPromise class is exported from `./schemas.js` (path relative to the test file).
Here is the ZodMiniPromise class:
// ZodMiniPromise
export interface ZodMiniPromise<T extends SomeType = core.$ZodType> extends _ZodMiniType<core.$ZodPromiseInternals<T>> {
  // _zod: core.$ZodPromiseInternals<T>;
}

export const ZodMiniPromise: core.$constructor<ZodMiniPromise> = /*@__PURE__*/ core.$constructor(
  "ZodMiniPromise",
  (inst, def) => {
    core.$ZodPromise.init(inst, def);
    ZodMiniType.init(inst, def);
  }
);