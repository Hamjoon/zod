As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named $ZodPipe by following these steps:
- Extract and list all the public methods including their signatures
- For each methods, generate a basic Vitest test case that checks the method's functionality
- Given the source code of the class and the listed methods, identify potential edge cases and exception handling scenarios that should be tested
- Generate Vitest test cases that specifically test for the identified edge cases and exceptions
- Merge all the individual test cases into a complete Vitest test file ($ZodPipe.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The $ZodPipe class is exported from `./schemas.js` (path relative to the test file).
Here is the $ZodPipe class:
////////////////////////////////////////////
////////////////////////////////////////////
//////////                        //////////
//////////      $ZodPipe      //////////
//////////                        //////////
////////////////////////////////////////////
////////////////////////////////////////////
export interface $ZodPipeDef<A extends SomeType = $ZodType, B extends SomeType = $ZodType> extends $ZodTypeDef {
  type: "pipe";
  in: A;
  out: B;
}

export interface $ZodPipeInternals<A extends SomeType = $ZodType, B extends SomeType = $ZodType>
  extends $ZodTypeInternals<core.output<B>, core.input<A>> {
  def: $ZodPipeDef<A, B>;
  isst: never;
  values: A["_zod"]["values"];
  optin: A["_zod"]["optin"];
  optout: B["_zod"]["optout"];
  propValues: A["_zod"]["propValues"];
}

export interface $ZodPipe<A extends SomeType = $ZodType, B extends SomeType = $ZodType> extends $ZodType {
  _zod: $ZodPipeInternals<A, B>;
}

export const $ZodPipe: core.$constructor<$ZodPipe> = /*@__PURE__*/ core.$constructor("$ZodPipe", (inst, def) => {
  $ZodType.init(inst, def);
  util.defineLazy(inst._zod, "values", () => def.in._zod.values);
  util.defineLazy(inst._zod, "optin", () => def.in._zod.optin);
  util.defineLazy(inst._zod, "optout", () => def.out._zod.optout);
  util.defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);

  inst._zod.parse = (payload, ctx) => {
    const left = def.in._zod.run(payload, ctx);
    if (left instanceof Promise) {
      return left.then((left) => handlePipeResult(left, def, ctx));
    }
    return handlePipeResult(left, def, ctx);
  };
});