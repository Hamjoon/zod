Imagine three different experts in software testing who are tasked with developing comprehensive Vitest test cases for the following TypeScript class.To comprehensively test all methods in the following class named ZodFile they must following these steps:
- Extract and list all the public methods including their signatures
- For each methods, generate a basic Vitest test case that checks the method's functionality
- Given the source code of the class and the listed methods, identify potential edge cases and exception handling scenarios that should be tested
- Generate Vitest test cases that specifically test for the identified edge cases and exceptions
- Merge all the individual test cases into a complete Vitest test file (ZodFile.test.ts) for the given TypeScript class.All experts will propose one test cases for each method, share it with the group, and then proceed to the next step. If any expert realizes they're wrong at any point, they leave.
The ZodFile class is exported from `./schemas.js` (path relative to the test file).
The TypeScript class is:
// ZodFile
export interface ZodFile extends _ZodType<core.$ZodFileInternals>, core.$ZodFile {
  min(size: number, params?: string | core.$ZodCheckMinSizeParams): this;
  max(size: number, params?: string | core.$ZodCheckMaxSizeParams): this;
  mime(types: util.MimeTypes | Array<util.MimeTypes>, params?: string | core.$ZodCheckMimeTypeParams): this;
}

export const ZodFile: core.$constructor<ZodFile> = /*@__PURE__*/ core.$constructor("ZodFile", (inst, def) => {
  core.$ZodFile.init(inst, def);
  ZodType.init(inst, def);

  inst.min = (size, params) => inst.check(core._minSize(size, params));
  inst.max = (size, params) => inst.check(core._maxSize(size, params));
  inst.mime = (types, params) => inst.check(core._mime(Array.isArray(types) ? types : [types], params));
});
At the end they must propose one complete (including typical use cases, edge cases, and error scenarios) Vitest test file (ZodFile.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##