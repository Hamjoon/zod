You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/classic/tests/discriminated-unions.test.ts, packages/zod/src/v4/core/errors.ts, packages/zod/src/v4/core/schemas.ts, packages/zod/src/v4/locales/en.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/classic/tests/discriminated-unions.test.ts b/packages/zod/src/v4/classic/tests/discriminated-unions.test.ts
index c3a448cd..3545a483 100644
--- a/packages/zod/src/v4/classic/tests/discriminated-unions.test.ts
+++ b/packages/zod/src/v4/classic/tests/discriminated-unions.test.ts
@@ -158,10 +158,14 @@ test("invalid discriminator value", () => {
         "errors": [],
         "note": "No matching discriminator",
         "discriminator": "type",
+        "options": [
+          "a",
+          "b"
+        ],
         "path": [
           "type"
         ],
-        "message": "Invalid input"
+        "message": "Invalid discriminator value. Expected 'a' | 'b'"
       }
     ]],
       "success": false,

</recent_change_diff>

Current test results:
<test_output>
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v4.0.10 <worktree>/p10-2e5b23dc

 ❯  zod  src/v4/classic/tests/discriminated-unions.test.ts (22 tests | 1 failed) 23ms
   ✓ _values 3ms
   ✓ valid parse - object 1ms
   ✓ valid - include discriminator key (deprecated) 0ms
   ✓ valid - optional discriminator (object) 0ms
   ✓ valid - discriminator value of various primitive types 2ms
   ✓ invalid - null 3ms
   × invalid discriminator value 3ms
   ✓ invalid discriminator value - unionFallback 1ms
   ✓ valid discriminator value, invalid data 1ms
   ✓ wrong schema - missing discriminator 0ms
   ✓ async - valid 2ms
   ✓ async - invalid 0ms
   ✓ valid - literals with .default or .pipe 0ms
   ✓ enum and nativeEnum 0ms
   ✓ branded 0ms
   ✓ optional and nullable 2ms
   ✓ multiple discriminators 0ms
   ✓ single element union 1ms
   ✓ nested discriminated unions 1ms
   ✓ readonly literal discriminator 0ms
   ✓ pipes 0ms
   ✓ def 0ms
 ✓  zod   TS  src/v4/classic/tests/discriminated-unions.test.ts (22 tests)

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL   zod  src/v4/classic/tests/discriminated-unions.test.ts > invalid discriminator value
Error: Snapshot `invalid discriminator value 1` mismatched

- Expected
+ Received

@@ -3,17 +3,13 @@
    {
      "code": "invalid_union",
      "errors": [],
      "note": "No matching discriminator",
      "discriminator": "type",
-     "options": [
-       "a",
-       "b"
-     ],
      "path": [
        "type"
      ],
-     "message": "Invalid discriminator value. Expected 'a' | 'b'"
+     "message": "Invalid input"
    }
  ]],
    "success": false,
  }

 ❯ src/v4/classic/tests/discriminated-unions.test.ts:153:18
    151|     .safeParse({ type: "x", a: "abc" });
    152| 
    153|   expect(result).toMatchInlineSnapshot(`
       |                  ^
    154|     {
    155|       "error": [ZodError: [

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


  Snapshots  1 failed
 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 43 passed (44)
Type Errors  no errors
   Start at  15:53:44
   Duration  6.62s (transform 1.37s, setup 63ms, collect 1.68s, tests 23ms, environment 0ms, prepare 5ms, typecheck 4.66s)


</test_output>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/discriminated-unions.test.ts" lines="136-193">
          "expected": "object",
          "message": "Invalid input: expected object, received null",
          "path": [],
        },
      ]
    `);
  }
});

test("invalid discriminator value", () => {
  const result = z
    .discriminatedUnion("type", [
      z.object({ type: z.literal("a"), a: z.string() }),
      z.object({ type: z.literal("b"), b: z.string() }),
    ])
    .safeParse({ type: "x", a: "abc" });

  expect(result).toMatchInlineSnapshot(`
    {
      "error": [ZodError: [
      {
        "code": "invalid_union",
        "errors": [],
        "note": "No matching discriminator",
        "discriminator": "type",
        "options": [
          "a",
          "b"
        ],
        "path": [
          "type"
        ],
        "message": "Invalid discriminator value. Expected 'a' | 'b'"
      }
    ]],
      "success": false,
    }
  `);
});

test("invalid discriminator value - unionFallback", () => {
  const result = z
    .discriminatedUnion(
      "type",
      [z.object({ type: z.literal("a"), a: z.string() }), z.object({ type: z.literal("b"), b: z.string() })],
      { unionFallback: true }
    )
    .safeParse({ type: "x", a: "abc" });
  expect(result).toMatchInlineSnapshot(`
    {
      "error": [ZodError: [
      {
        "code": "invalid_union",
        "errors": [
          [
            {
              "code": "invalid_value",
              "values": [
</test_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/errors.ts" lines="68-118">
}

export interface $ZodIssueInvalidStringFormat extends $ZodIssueBase {
  readonly code: "invalid_format";
  readonly format: $ZodStringFormats | (string & {});
  readonly pattern?: string;
  readonly input?: string;
}

export interface $ZodIssueNotMultipleOf<Input extends number | bigint = number | bigint> extends $ZodIssueBase {
  readonly code: "not_multiple_of";
  readonly divisor: number;
  readonly input?: Input;
}

export interface $ZodIssueUnrecognizedKeys extends $ZodIssueBase {
  readonly code: "unrecognized_keys";
  readonly keys: string[];
  readonly input?: Record<string, unknown>;
}

interface $ZodIssueInvalidUnionNoMatch extends $ZodIssueBase {
  readonly code: "invalid_union";
  readonly errors: $ZodIssue[][];
  readonly input?: unknown;
  readonly discriminator?: string | undefined;
  readonly inclusive?: true;
}

interface $ZodIssueInvalidUnionMultipleMatch extends $ZodIssueBase {
  readonly code: "invalid_union";
  readonly errors: [];
  readonly input?: unknown;
  readonly discriminator?: string | undefined;
  readonly inclusive: false;
}

export type $ZodIssueInvalidUnion = $ZodIssueInvalidUnionNoMatch | $ZodIssueInvalidUnionMultipleMatch;

export interface $ZodIssueInvalidKey<Input = unknown> extends $ZodIssueBase {
  readonly code: "invalid_key";
  readonly origin: "map" | "record";
  readonly issues: $ZodIssue[];
  readonly input?: Input;
}

export interface $ZodIssueInvalidElement<Input = unknown> extends $ZodIssueBase {
  readonly code: "invalid_element";
  readonly origin: "map" | "set";
  readonly key: unknown;
  readonly issues: $ZodIssue[];
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/schemas.ts" lines="2332-2385">
    inst._zod.parse = (payload, ctx) => {
      const input = payload.value;
      if (!util.isObject(input)) {
        payload.issues.push({
          code: "invalid_type",

          expected: "object",
          input,
          inst,
        });
        return payload;
      }

      const opt = disc.value.get(input?.[def.discriminator] as any);
      if (opt) {
        return opt._zod.run(payload, ctx) as any;
      }

      if (def.unionFallback) {
        return _super(payload, ctx);
      }

      // no matching discriminator
      payload.issues.push({
        code: "invalid_union",

        errors: [],
        note: "No matching discriminator",
        discriminator: def.discriminator,
        input,
        path: [def.discriminator],
        inst,
      });

      return payload;
    };
  });

////////////////////////////////////////////////
////////////////////////////////////////////////
//////////                            //////////
//////////      $ZodIntersection      //////////
//////////                            //////////
////////////////////////////////////////////////
////////////////////////////////////////////////

export interface $ZodIntersectionDef<Left extends SomeType = $ZodType, Right extends SomeType = $ZodType>
  extends $ZodTypeDef {
  type: "intersection";
  left: Left;
  right: Right;
}

export interface $ZodIntersectionInternals<A extends SomeType = $ZodType, B extends SomeType = $ZodType>
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/locales/en.ts" lines="80-130">
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }

        return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue as errors.$ZodStringFormatIssues;
        if (_issue.format === "starts_with") {
          return `Invalid string: must start with "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with") return `Invalid string: must end with "${_issue.suffix}"`;
        if (_issue.format === "includes") return `Invalid string: must include "${_issue.includes}"`;
        if (_issue.format === "regex") return `Invalid string: must match pattern ${_issue.pattern}`;
        return `Invalid ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${issue.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${util.joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${issue.origin}`;
      case "invalid_union":
        return "Invalid input";
      case "invalid_element":
        return `Invalid value in ${issue.origin}`;
      default:
        return `Invalid input`;
    }
  };
};

export default function (): { localeError: errors.$ZodErrorMap } {
  return {
    localeError: error(),
  };
}
</production_snippet>
