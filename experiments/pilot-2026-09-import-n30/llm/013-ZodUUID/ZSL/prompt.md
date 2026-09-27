As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named ZodUUID. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The ZodUUID class is exported from `./schemas.js` (path relative to the test file).
Here is the ZodUUID class:
// ZodUUID
export interface ZodUUID extends ZodStringFormat<"uuid"> {
  _zod: core.$ZodUUIDInternals;
}

export const ZodUUID: core.$constructor<ZodUUID> = /*@__PURE__*/ core.$constructor("ZodUUID", (inst, def) => {
  // ZodStringFormat.init(inst, def);
  core.$ZodUUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});