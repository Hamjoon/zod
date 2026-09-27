As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named ZodNullable. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The ZodNullable class is exported from `./schemas.js` (path relative to the test file).
Here is the ZodNullable class:
// ZodNullable
export interface ZodNullable<T extends core.SomeType = core.$ZodType>
  extends _ZodType<core.$ZodNullableInternals<T>>,
    core.$ZodNullable<T> {
  unwrap(): T;
}

export const ZodNullable: core.$constructor<ZodNullable> = /*@__PURE__*/ core.$constructor(
  "ZodNullable",
  (inst, def) => {
    core.$ZodNullable.init(inst, def);
    ZodType.init(inst, def);

    inst.unwrap = () => inst._zod.def.innerType;
  }
);