Imagine three different experts in software testing who are tasked with developing comprehensive Vitest test cases for the following TypeScript class.To comprehensively test all methods in the following class named ZodMiniBigInt they must following these steps:
- Extract and list all the public methods including their signatures
- For each methods, generate a basic Vitest test case that checks the method's functionality
- Given the source code of the class and the listed methods, identify potential edge cases and exception handling scenarios that should be tested
- Generate Vitest test cases that specifically test for the identified edge cases and exceptions
- Merge all the individual test cases into a complete Vitest test file (ZodMiniBigInt.test.ts) for the given TypeScript class.All experts will propose one test cases for each method, share it with the group, and then proceed to the next step. If any expert realizes they're wrong at any point, they leave.
The ZodMiniBigInt class is exported from `./schemas.js` (path relative to the test file).
The TypeScript class is:
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
At the end they must propose one complete (including typical use cases, edge cases, and error scenarios) Vitest test file (ZodMiniBigInt.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##