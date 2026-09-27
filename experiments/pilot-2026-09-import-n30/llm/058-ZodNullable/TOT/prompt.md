Imagine three different experts in software testing who are tasked with developing comprehensive Vitest test cases for the following TypeScript class. All experts will propose one test cases for each method, share it with the group, and then proceed to the next step. If any expert realizes they're wrong at any point, they leave.
The ZodNullable class is exported from `./schemas.js` (path relative to the test file).
The TypeScript class is:
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
At the end they must propose one complete (including typical use cases, edge cases, and error scenarios) Vitest test file (ZodNullable.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##