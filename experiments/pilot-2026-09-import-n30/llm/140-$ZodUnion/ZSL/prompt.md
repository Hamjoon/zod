As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named $ZodUnion. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The $ZodUnion class is exported from `./schemas.js` (path relative to the test file).
Here is the $ZodUnion class:
export interface $ZodUnionDef<Options extends readonly SomeType[] = readonly $ZodType[]> extends $ZodTypeDef {
  type: "union";
  options: Options;
}

export interface $ZodUnionInternals<T extends readonly SomeType[] = readonly $ZodType[]> extends _$ZodTypeInternals {
  def: $ZodUnionDef<T>;
  isst: errors.$ZodIssueInvalidUnion;
  pattern: T[number]["_zod"]["pattern"];
  values: T[number]["_zod"]["values"]; //GetValues<T[number]>;
  output: $InferUnionOutput<T[number]>;
  input: $InferUnionInput<T[number]>;
  // if any element in the union is optional, then the union is optional
  optin: IsOptionalIn<T[number]> extends false ? "optional" | undefined : "optional";
  optout: IsOptionalOut<T[number]> extends false ? "optional" | undefined : "optional";
}

export interface $ZodUnion<T extends readonly SomeType[] = readonly $ZodType[]>
  extends $ZodType<any, any, $ZodUnionInternals<T>> {
  _zod: $ZodUnionInternals<T>;
}

export const $ZodUnion: core.$constructor<$ZodUnion> = /*@__PURE__*/ core.$constructor("$ZodUnion", (inst, def) => {
  $ZodType.init(inst, def);

  util.defineLazy(inst._zod, "optin", () =>
    def.options.some((o) => o._zod.optin === "optional") ? "optional" : undefined
  );

  util.defineLazy(inst._zod, "optout", () =>
    def.options.some((o) => o._zod.optout === "optional") ? "optional" : undefined
  );

  util.defineLazy(inst._zod, "values", () => {
    if (def.options.every((o) => o._zod.values)) {
      return new Set<util.Primitive>(def.options.flatMap((option) => Array.from(option._zod.values!)));
    }
    return undefined;
  });

  util.defineLazy(inst._zod, "pattern", () => {
    if (def.options.every((o) => o._zod.pattern)) {
      const patterns = def.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${patterns.map((p) => util.cleanRegex(p!.source)).join("|")})$`);
    }
    return undefined;
  });

  inst._zod.parse = (payload, ctx) => {
    let async = false;

    const results: util.MaybeAsync<ParsePayload>[] = [];
    for (const option of def.options) {
      const result = option._zod.run(
        {
          value: payload.value,
          issues: [],
        },
        ctx
      );
      if (result instanceof Promise) {
        results.push(result);
        async = true;
      } else {
        if (result.issues.length === 0) return result;
        results.push(result);
      }
    }

    if (!async) return handleUnionResults(results as ParsePayload[], payload, inst, ctx);
    return Promise.all(results).then((results) => {
      return handleUnionResults(results as ParsePayload[], payload, inst, ctx);
    });
  };
});