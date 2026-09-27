As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named $ZodDefault. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The $ZodDefault class is exported from `./schemas.js` (path relative to the test file).
Here is the $ZodDefault class:
////////////////////////////////////////////
////////////////////////////////////////////
//////////                        //////////
//////////      $ZodDefault       //////////
//////////                        //////////
////////////////////////////////////////////
////////////////////////////////////////////
export interface $ZodDefaultDef<T extends SomeType = $ZodType> extends $ZodTypeDef {
  type: "default";
  innerType: T;
  /** The default value. May be a getter. */
  defaultValue: util.NoUndefined<core.output<T>>;
}

export interface $ZodDefaultInternals<T extends SomeType = $ZodType>
  extends $ZodTypeInternals<util.NoUndefined<core.output<T>>, core.input<T> | undefined> {
  def: $ZodDefaultDef<T>;
  optin: "optional";
  optout?: "optional" | undefined; // required
  isst: never;
  values: T["_zod"]["values"];
}

export interface $ZodDefault<T extends SomeType = $ZodType> extends $ZodType {
  _zod: $ZodDefaultInternals<T>;
}

export const $ZodDefault: core.$constructor<$ZodDefault> = /*@__PURE__*/ core.$constructor(
  "$ZodDefault",
  (inst, def) => {
    $ZodType.init(inst, def);

    // inst._zod.qin = "true";
    inst._zod.optin = "optional";
    util.defineLazy(inst._zod, "values", () => def.innerType._zod.values);

    inst._zod.parse = (payload, ctx) => {
      if (payload.value === undefined) {
        payload.value = def.defaultValue;
        /**
         * $ZodDefault always returns the default value immediately.
         * It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
        return payload;
      }
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise) {
        return result.then((result) => handleDefaultResult(result, def));
      }
      return handleDefaultResult(result, def);
    };
  }
);