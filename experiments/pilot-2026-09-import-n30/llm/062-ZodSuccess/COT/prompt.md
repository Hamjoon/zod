As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named ZodSuccess by following these steps:
- Extract and list all the public methods including their signatures
- For each methods, generate a basic Vitest test case that checks the method's functionality
- Given the source code of the class and the listed methods, identify potential edge cases and exception handling scenarios that should be tested
- Generate Vitest test cases that specifically test for the identified edge cases and exceptions
- Merge all the individual test cases into a complete Vitest test file (ZodSuccess.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The ZodSuccess class is exported from `./schemas.js` (path relative to the test file).
Here is the ZodSuccess class:
// ZodSuccess
export interface ZodSuccess<T extends core.SomeType = core.$ZodType>
  extends _ZodType<core.$ZodSuccessInternals<T>>,
    core.$ZodSuccess<T> {
  unwrap(): T;
}

export const ZodSuccess: core.$constructor<ZodSuccess> = /*@__PURE__*/ core.$constructor("ZodSuccess", (inst, def) => {
  core.$ZodSuccess.init(inst, def);
  ZodType.init(inst, def);

  inst.unwrap = () => inst._zod.def.innerType;
});