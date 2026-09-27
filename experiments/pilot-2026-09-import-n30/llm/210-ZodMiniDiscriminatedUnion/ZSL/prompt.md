As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named ZodMiniDiscriminatedUnion. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The ZodMiniDiscriminatedUnion class is exported from `./schemas.js` (path relative to the test file).
Here is the ZodMiniDiscriminatedUnion class:
// ZodMiniDiscriminatedUnion
export interface ZodMiniDiscriminatedUnion<Options extends readonly SomeType[] = readonly core.$ZodType[]>
  extends ZodMiniUnion<Options> {
  _zod: core.$ZodDiscriminatedUnionInternals<Options>;
}

export const ZodMiniDiscriminatedUnion: core.$constructor<ZodMiniDiscriminatedUnion> = /*@__PURE__*/ core.$constructor(
  "ZodMiniDiscriminatedUnion",
  (inst, def) => {
    core.$ZodDiscriminatedUnion.init(inst, def);
    ZodMiniType.init(inst, def);
  }
);