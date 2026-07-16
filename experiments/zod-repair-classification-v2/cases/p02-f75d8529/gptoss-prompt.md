You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/classic/tests/literal.test.ts, packages/zod/src/v4/classic/tests/template-literal.test.ts, packages/zod/src/v4/core/schemas.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/classic/tests/literal.test.ts b/packages/zod/src/v4/classic/tests/literal.test.ts
index 78d1c088..8c48b20d 100644
--- a/packages/zod/src/v4/classic/tests/literal.test.ts
+++ b/packages/zod/src/v4/classic/tests/literal.test.ts
@@ -90,3 +90,28 @@ test("readonly", () => {
   const a = ["asdf"] as const;
   z.literal(a);
 });
+
+test("literal pattern", () => {
+  expect(z.literal(1.1)._zod.pattern).toMatchInlineSnapshot(`/\\^\\(1\\\\\\.1\\)\\$/`);
+
+  expect(z.templateLiteral([z.literal(1.1)]).safeParse("1.1")).toMatchInlineSnapshot(`
+    {
+      "data": "1.1",
+      "success": true,
+    }
+  `);
+  expect(z.templateLiteral([z.literal(1.1)]).safeParse("1n1")).toMatchInlineSnapshot(`
+    {
+      "error": [ZodError: [
+      {
+        "code": "invalid_format",
+        "format": "template_literal",
+        "pattern": "^(1\\\\.1)$",
+        "path": [],
+        "message": "Invalid input"
+      }
+    ]],
+      "success": false,
+    }
+  `);
+});
diff --git a/packages/zod/src/v4/classic/tests/template-literal.test.ts b/packages/zod/src/v4/classic/tests/template-literal.test.ts
index 17e3a689..50f5c22e 100644
--- a/packages/zod/src/v4/classic/tests/template-literal.test.ts
+++ b/packages/zod/src/v4/classic/tests/template-literal.test.ts
@@ -6,6 +6,7 @@ const hello = z.templateLiteral(["hello"]);
 const world = z.templateLiteral(["", z.literal("world")]);
 const one = z.templateLiteral([1]);
 const two = z.templateLiteral(["", z.literal(2)]);
+const onePointOne = z.templateLiteral([z.literal(1.1)]);
 const truee = z.templateLiteral([true]);
 const anotherTrue = z.templateLiteral(["", z.literal(true)]);
 const falsee = z.templateLiteral([false]);
@@ -289,6 +290,7 @@ test("template literal parsing - success - basic cases", () => {
   world.parse("world");
   one.parse("1");
   two.parse("2");
+  onePointOne.parse("1.1");
   truee.parse("true");
   anotherTrue.parse("true");
   falsee.parse("false");
@@ -381,6 +383,7 @@ test("template literal parsing - failure - basic cases", () => {
   expect(() => one.parse("2")).toThrow();
   expect(() => one.parse("12")).toThrow();
   expect(() => one.parse("21")).toThrow();
+  expect(() => onePointOne.parse("1s1")).toThrow();
   expect(() => two.parse("1")).toThrow();
   expect(() => two.parse("21")).toThrow();
   expect(() => two.parse("12")).toThrow();

</recent_change_diff>

Current test results:
<test_output>
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v2.1.9 /Users/donggi/_projects/etc-projects/zod-thesis/.worktrees/p02-f75d8529/packages/zod

 ❯ src/v4/classic/tests/literal.test.ts (10 tests | 1 failed) 13ms
   × literal pattern 1ms
     → Snapshot `literal pattern 1` mismatched
 ❯ src/v4/classic/tests/template-literal.test.ts (8 tests | 1 failed) 46ms
   × template literal parsing - failure - basic cases 4ms
     → expected [Function] to throw an error
 ✓  TS  src/v4/classic/tests/template-literal.test.ts (8 tests)
 ✓  TS  src/v4/classic/tests/literal.test.ts (10 tests)

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/v4/classic/tests/literal.test.ts > literal pattern
Error: Snapshot `literal pattern 1` mismatched

Expected: "/\^\(1\\\.1\)\$/"
Received: "/\^\(1\.1\)\$/"

 ❯ src/v4/classic/tests/literal.test.ts:95:39
     93| 
     94| test("literal pattern", () => {
     95|   expect(z.literal(1.1)._zod.pattern).toMatchInlineSnapshot(`/\\^\\(1\…
       |                                       ^
     96| 
     97|   expect(z.templateLiteral([z.literal(1.1)]).safeParse("1.1")).toMatch…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/v4/classic/tests/template-literal.test.ts > template literal parsing - failure - basic cases
AssertionError: expected [Function] to throw an error
 ❯ src/v4/classic/tests/template-literal.test.ts:386:42
    384|   expect(() => one.parse("12")).toThrow();
    385|   expect(() => one.parse("21")).toThrow();
    386|   expect(() => onePointOne.parse("1s1")).toThrow();
       |                                          ^
    387|   expect(() => two.parse("1")).toThrow();
    388|   expect(() => two.parse("21")).toThrow();

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯

  Snapshots  1 failed
 Test Files  2 failed | 2 passed (4)
      Tests  2 failed | 34 passed (36)
Type Errors  no errors
   Start at  15:51:11
   Duration  5.28s (transform 814ms, setup 0ms, collect 2.31s, tests 59ms, environment 0ms, prepare 338ms, typecheck 4.99s)


</test_output>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/literal.test.ts" lines="68-142">
        ],
        "path": [],
        "message": "Invalid input: expected \\"Tuna\\""
      }
    ]]
  `);
});

test("literal bigint default error message", () => {
  const result = z.literal(BigInt(12)).safeParse(BigInt(13));
  expect(result.success).toBe(false);

  expect(result.error!.issues.length).toEqual(1);
  expect(result.error!.issues[0].message).toEqual(`Invalid input: expected 12n`);
});

test(".value getter", () => {
  expect(z.literal("tuna").value).toEqual("tuna");
  expect(() => z.literal([1, 2, 3]).value).toThrow();
});

test("readonly", () => {
  const a = ["asdf"] as const;
  z.literal(a);
});

test("literal pattern", () => {
  expect(z.literal(1.1)._zod.pattern).toMatchInlineSnapshot(`/\\^\\(1\\\\\\.1\\)\\$/`);

  expect(z.templateLiteral([z.literal(1.1)]).safeParse("1.1")).toMatchInlineSnapshot(`
    {
      "data": "1.1",
      "success": true,
    }
  `);
  expect(z.templateLiteral([z.literal(1.1)]).safeParse("1n1")).toMatchInlineSnapshot(`
    {
      "error": [ZodError: [
      {
        "code": "invalid_format",
        "format": "template_literal",
        "pattern": "^(1\\\\.1)$",
        "path": [],
        "message": "Invalid input"
      }
    ]],
      "success": false,
    }
  `);
});
</test_snippet>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/template-literal.test.ts" lines="1-34">
import { expect, expectTypeOf, test } from "vitest";
import * as z from "zod/v4";

const empty = z.templateLiteral([]);
const hello = z.templateLiteral(["hello"]);
const world = z.templateLiteral(["", z.literal("world")]);
const one = z.templateLiteral([1]);
const two = z.templateLiteral(["", z.literal(2)]);
const onePointOne = z.templateLiteral([z.literal(1.1)]);
const truee = z.templateLiteral([true]);
const anotherTrue = z.templateLiteral(["", z.literal(true)]);
const falsee = z.templateLiteral([false]);
const anotherFalse = z.templateLiteral(["", z.literal(false)]);
const nulll = z.templateLiteral([null]);
const anotherNull = z.templateLiteral(["", z.null()]);
const undefinedd = z.templateLiteral([undefined]);
const anotherUndefined = z.templateLiteral(["", z.undefined()]);
const anyString = z.templateLiteral(["", z.string()]);
const lazyString = z.templateLiteral(["", z.lazy(() => z.string())]);
const anyNumber = z.templateLiteral(["", z.number()]);
const anyInt = z.templateLiteral(["", z.number().int()]);
// const anyFiniteNumber = z.templateLiteral(["", z.number().finite()]);
// const anyNegativeNumber = z.templateLiteral(["", z.number().negative()]);
// const anyPositiveNumber = z.templateLiteral(["", z.number().positive()]);
// const zeroButInADumbWay = z.templateLiteral(["", z.number().nonnegative().nonpositive()]);
// const finiteButInADumbWay = z.templateLiteral(["", z.number().min(5).max(10)]);
const bool = z.templateLiteral(["", z.boolean()]);
const bigone = z.templateLiteral(["", z.literal(BigInt(1))]);
const anyBigint = z.templateLiteral(["", z.bigint()]);
const nullableYo = z.templateLiteral(["", z.nullable(z.literal("yo"))]);
const nullableString = z.templateLiteral(["", z.nullable(z.string())]);
const optionalYeah = z.templateLiteral(["", z.literal("yeah").optional()]);

const optionalString = z.templateLiteral(["", z.string().optional()]);
</test_snippet>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/template-literal.test.ts" lines="268-318">
  ).toThrow();
  expect(() =>
    // @ts-expect-error
    z.templateLiteral([z.object({}).brand("brand")])
  ).toThrow();

  // these constraints aren't enforced but they shouldn't throw
  z.templateLiteral([z.number().multipleOf(2)]);
  z.templateLiteral([z.string().emoji()]);
  z.templateLiteral([z.string().url()]);
  z.templateLiteral([z.string().url()]);
  z.templateLiteral([z.string().trim()]);
  z.templateLiteral([z.string().includes("train")]);
  z.templateLiteral([z.string().toLowerCase()]);
  z.templateLiteral([z.string().toUpperCase()]);
});

test("template literal parsing - success - basic cases", () => {
  expect(() => z.templateLiteral([]).parse(7)).toThrow();

  empty.parse("");
  hello.parse("hello");
  world.parse("world");
  one.parse("1");
  two.parse("2");
  onePointOne.parse("1.1");
  truee.parse("true");
  anotherTrue.parse("true");
  falsee.parse("false");
  anotherFalse.parse("false");
  nulll.parse("null");
  anotherNull.parse("null");
  undefinedd.parse("undefined");
  anotherUndefined.parse("undefined");
  anyString.parse("blahblahblah");
  anyString.parse("");
  lazyString.parse("blahblahblah");
  lazyString.parse("");
  anyNumber.parse("123");
  anyNumber.parse("1.23");
  anyNumber.parse("0");
  anyNumber.parse("-1.23");
  anyNumber.parse("-123");
  // anyNumber.parse("Infinity");
  // anyNumber.parse("-Infinity");
  anyInt.parse("123");
  // anyInt.parse("-123");
  // anyFiniteNumber.parse("123");
  // anyFiniteNumber.parse("1.23");
  // anyFiniteNumber.parse("0");
  // anyFiniteNumber.parse("-1.23");
</test_snippet>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/template-literal.test.ts" lines="361-411">
  // ip.parse("c359:f57c:21e5:39eb:1187:e501:f936:b452");
  ipv4.parse("213.174.246.205");
  ipv6.parse("c359:f57c:21e5:39eb:1187:e501:f936:b452");
  ulid.parse("01GW3D2QZJBYB6P1Z1AE997VPW");
  uuid.parse("808989fd-3a6e-4af2-b607-737323a176f6");
  stringAToZ.parse("asudgaskhdgashd");
  stringStartsWith.parse("hello world");
  stringEndsWith.parse("hello world");
  stringMax5.parse("hello");
  stringMin5.parse("hello");
  stringLen5.parse("hello");
  stringMin5Max10.parse("hello worl");
  stringStartsWithMax5.parse("hello");
  brandedString.parse("branded string");
});

test("template literal parsing - failure - basic cases", () => {
  expect(() => empty.parse("a")).toThrow();
  expect(() => hello.parse("hello!")).toThrow();
  expect(() => hello.parse("!hello")).toThrow();
  expect(() => world.parse("world!")).toThrow();
  expect(() => world.parse("!world")).toThrow();
  expect(() => one.parse("2")).toThrow();
  expect(() => one.parse("12")).toThrow();
  expect(() => one.parse("21")).toThrow();
  expect(() => onePointOne.parse("1s1")).toThrow();
  expect(() => two.parse("1")).toThrow();
  expect(() => two.parse("21")).toThrow();
  expect(() => two.parse("12")).toThrow();
  expect(() => truee.parse("false")).toThrow();
  expect(() => truee.parse("1true")).toThrow();
  expect(() => truee.parse("true1")).toThrow();
  expect(() => anotherTrue.parse("false")).toThrow();
  expect(() => anotherTrue.parse("1true")).toThrow();
  expect(() => anotherTrue.parse("true1")).toThrow();
  expect(() => falsee.parse("true")).toThrow();
  expect(() => falsee.parse("1false")).toThrow();
  expect(() => falsee.parse("false1")).toThrow();
  expect(() => anotherFalse.parse("true")).toThrow();
  expect(() => anotherFalse.parse("1false")).toThrow();
  expect(() => anotherFalse.parse("false1")).toThrow();
  expect(() => nulll.parse("123")).toThrow();
  expect(() => nulll.parse("null1")).toThrow();
  expect(() => nulll.parse("1null")).toThrow();
  expect(() => anotherNull.parse("123")).toThrow();
  expect(() => anotherNull.parse("null1")).toThrow();
  expect(() => anotherNull.parse("1null")).toThrow();
  expect(() => undefinedd.parse("123")).toThrow();
  expect(() => undefinedd.parse("undefined1")).toThrow();
  expect(() => undefinedd.parse("1undefined")).toThrow();
  expect(() => anotherUndefined.parse("123")).toThrow();
</test_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/schemas.ts" lines="2773-2823">
export interface $ZodLiteralDef<T extends util.Literal> extends $ZodTypeDef {
  type: "literal";
  values: T[];
}

export interface $ZodLiteralInternals<T extends util.Literal = util.Literal> extends $ZodTypeInternals<T, T> {
  def: $ZodLiteralDef<T>;
  values: Set<T>;
  pattern: RegExp;
  isst: errors.$ZodIssueInvalidValue;
}

export interface $ZodLiteral<T extends util.Literal = util.Literal> extends $ZodType {
  _zod: $ZodLiteralInternals<T>;
}

export const $ZodLiteral: core.$constructor<$ZodLiteral> = /*@__PURE__*/ core.$constructor(
  "$ZodLiteral",
  (inst, def) => {
    $ZodType.init(inst, def);

    inst._zod.values = new Set<util.Literal>(def.values);
    inst._zod.pattern = new RegExp(
      `^(${def.values

        .map((o) => (typeof o === "string" ? util.escapeRegex(o) : o ? o.toString() : String(o)))
        .join("|")})$`
    );

    inst._zod.parse = (payload, _ctx) => {
      const input = payload.value;
      if (inst._zod.values.has(input)) {
        return payload;
      }
      payload.issues.push({
        code: "invalid_value",
        values: def.values,
        input,
        inst,
      });
      return payload;
    };
  }
);

////////////////////////////////////////
////////////////////////////////////////
//////////                    //////////
//////////      $ZodConst      //////////
//////////                    //////////
////////////////////////////////////////
</production_snippet>
