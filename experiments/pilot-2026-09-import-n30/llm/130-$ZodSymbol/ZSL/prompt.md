As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named $ZodSymbol. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The $ZodSymbol class is exported from `./schemas.js` (path relative to the test file).
Here is the $ZodSymbol class:
////////////////////////////////////////////
////////////////////////////////////////////
//////////                        //////////
//////////       $ZodSymbol       //////////
//////////                        //////////
////////////////////////////////////////////
////////////////////////////////////////////
export interface $ZodSymbolDef extends $ZodTypeDef {
  type: "symbol";
}

export interface $ZodSymbolInternals extends $ZodTypeInternals<symbol, symbol> {
  def: $ZodSymbolDef;
  isst: errors.$ZodIssueInvalidType;
}

export interface $ZodSymbol extends $ZodType {
  _zod: $ZodSymbolInternals;
}

export const $ZodSymbol: core.$constructor<$ZodSymbol> = /*@__PURE__*/ core.$constructor("$ZodSymbol", (inst, def) => {
  $ZodType.init(inst, def);

  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (typeof input === "symbol") return payload;
    payload.issues.push({
      expected: "symbol",
      code: "invalid_type",
      input,
      inst,
    });
    return payload;
  };
});