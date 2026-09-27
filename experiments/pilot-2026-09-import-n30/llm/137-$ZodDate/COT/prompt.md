As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named $ZodDate by following these steps:
- Extract and list all the public methods including their signatures
- For each methods, generate a basic Vitest test case that checks the method's functionality
- Given the source code of the class and the listed methods, identify potential edge cases and exception handling scenarios that should be tested
- Generate Vitest test cases that specifically test for the identified edge cases and exceptions
- Merge all the individual test cases into a complete Vitest test file ($ZodDate.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The $ZodDate class is exported from `./schemas.js` (path relative to the test file).
Here is the $ZodDate class:
///////////////////////////////////////
///////////////////////////////////////
//////////                     ////////
//////////      $ZodDate        ////////
//////////                     ////////
///////////////////////////////////////
///////////////////////////////////////
export interface $ZodDateDef extends $ZodTypeDef {
  type: "date";
  coerce?: boolean;
}

export interface $ZodDateInternals<T = unknown> extends $ZodTypeInternals<Date, T> {
  def: $ZodDateDef;
  isst: errors.$ZodIssueInvalidType; // | errors.$ZodIssueInvalidDate;
  bag: util.LoosePartial<{
    minimum: Date;
    maximum: Date;
    format: string;
  }>;
}

export interface $ZodDate<T = unknown> extends $ZodType {
  _zod: $ZodDateInternals<T>;
}

export const $ZodDate: core.$constructor<$ZodDate> = /*@__PURE__*/ core.$constructor("$ZodDate", (inst, def) => {
  $ZodType.init(inst, def);

  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce) {
      try {
        payload.value = new Date(payload.value as string | number | Date);
      } catch (_err: any) {}
    }
    const input = payload.value;

    const isDate = input instanceof Date;
    const isValidDate = isDate && !Number.isNaN(input.getTime());
    if (isValidDate) return payload;
    payload.issues.push({
      expected: "date",
      code: "invalid_type",
      input,
      ...(isDate ? { received: "Invalid Date" } : {}),
      inst,
    });

    return payload;
  };
});