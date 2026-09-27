As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named ZodSymbol by following these steps:
- Extract and list all the public methods including their signatures
- For each methods, generate a basic Vitest test case that checks the method's functionality
- Given the source code of the class and the listed methods, identify potential edge cases and exception handling scenarios that should be tested
- Generate Vitest test cases that specifically test for the identified edge cases and exceptions
- Merge all the individual test cases into a complete Vitest test file (ZodSymbol.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The ZodSymbol class is exported from `./schemas.js` (path relative to the test file).
Here is the ZodSymbol class:
// symbol
export interface ZodSymbol extends _ZodType<core.$ZodSymbolInternals> {}

export const ZodSymbol: core.$constructor<ZodSymbol> = /*@__PURE__*/ core.$constructor("ZodSymbol", (inst, def) => {
  core.$ZodSymbol.init(inst, def);
  ZodType.init(inst, def);
});