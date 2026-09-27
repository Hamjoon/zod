Imagine three different experts in software testing who are tasked with developing comprehensive Vitest test cases for the following TypeScript class.To comprehensively test all methods in the following class named $ZodIPv6 they must following these steps:
- Extract and list all the public methods including their signatures
- For each methods, generate a basic Vitest test case that checks the method's functionality
- Given the source code of the class and the listed methods, identify potential edge cases and exception handling scenarios that should be tested
- Generate Vitest test cases that specifically test for the identified edge cases and exceptions
- Merge all the individual test cases into a complete Vitest test file ($ZodIPv6.test.ts) for the given TypeScript class.All experts will propose one test cases for each method, share it with the group, and then proceed to the next step. If any expert realizes they're wrong at any point, they leave.
The $ZodIPv6 class is exported from `./schemas.js` (path relative to the test file).
The TypeScript class is:
export interface $ZodIPv6Def extends $ZodStringFormatDef<"ipv6"> {
  version?: "v6";
}

export interface $ZodIPv6Internals extends $ZodStringFormatInternals<"ipv6"> {
  def: $ZodIPv6Def;
}

export interface $ZodIPv6 extends $ZodType {
  _zod: $ZodIPv6Internals;
}

export const $ZodIPv6: core.$constructor<$ZodIPv6> = /*@__PURE__*/ core.$constructor("$ZodIPv6", (inst, def): void => {
  def.pattern ??= regexes.ipv6;
  $ZodStringFormat.init(inst, def);

  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag as $ZodStringInternals<unknown>["bag"];
    bag.format = `ipv6`;
  });

  inst._zod.check = (payload) => {
    try {
      new URL(`http://[${payload.value}]`);
      // return;
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: payload.value,
        inst,
        continue: !def.abort,
      });
    }
  };
});
At the end they must propose one complete (including typical use cases, edge cases, and error scenarios) Vitest test file ($ZodIPv6.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##