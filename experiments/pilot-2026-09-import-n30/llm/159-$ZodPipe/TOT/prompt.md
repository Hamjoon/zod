Imagine three different experts in software testing who are tasked with developing comprehensive Vitest test cases for the following TypeScript class. All experts will propose one test cases for each method, share it with the group, and then proceed to the next step. If any expert realizes they're wrong at any point, they leave.
The $ZodPipe class is exported from `./schemas.js` (path relative to the test file).
The TypeScript class is:
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
At the end they must propose one complete (including typical use cases, edge cases, and error scenarios) Vitest test file ($ZodPipe.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##