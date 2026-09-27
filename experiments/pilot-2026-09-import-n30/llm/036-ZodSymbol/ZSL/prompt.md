As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named ZodSymbol. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The ZodSymbol class is exported from `./schemas.js` (path relative to the test file).
Here is the ZodSymbol class:
// symbol
export interface ZodSymbol extends _ZodType<core.$ZodSymbolInternals> {}

export const ZodSymbol: core.$constructor<ZodSymbol> = /*@__PURE__*/ core.$constructor("ZodSymbol", (inst, def) => {
  core.$ZodSymbol.init(inst, def);
  ZodType.init(inst, def);
});