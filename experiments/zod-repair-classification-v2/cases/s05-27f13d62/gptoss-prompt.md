You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/classic/tests/template-literal.test.ts, packages/zod/src/v4/classic/tests/to-json-schema.test.ts, packages/zod/src/v4/core/regexes.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/core/regexes.ts b/packages/zod/src/v4/core/regexes.ts
index 1b7892ea..00b5cccc 100644
--- a/packages/zod/src/v4/core/regexes.ts
+++ b/packages/zod/src/v4/core/regexes.ts
@@ -44,7 +44,7 @@ export const rfc5322Email =
 
 /** A loose regex that allows Unicode characters, enforces length limits, and that's about it. */
 export const unicodeEmail = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u;
-export const idnEmail = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u;
+export const idnEmail = unicodeEmail;
 
 export const browserEmail: RegExp =
   /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
@@ -58,7 +58,7 @@ export function emoji(): RegExp {
 export const ipv4: RegExp =
   /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
 export const ipv6: RegExp =
-  /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})$/;
+  /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
 
 export const cidrv4: RegExp =
   /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
@@ -123,13 +123,13 @@ export const string = (params?: { minimum?: number | undefined; maximum?: number
   return new RegExp(`^${regex}$`);
 };
 
-export const bigint: RegExp = /^\d+n?$/;
-export const integer: RegExp = /^\d+$/;
-export const number: RegExp = /^-?\d+(?:\.\d+)?/i;
-export const boolean: RegExp = /true|false/i;
-const _null: RegExp = /null/i;
+export const bigint: RegExp = /^-?\d+n?$/;
+export const integer: RegExp = /^-?\d+$/;
+export const number: RegExp = /^-?\d+(?:\.\d+)?/;
+export const boolean: RegExp = /^(?:true|false)$/i;
+const _null: RegExp = /^null$/i;
 export { _null as null };
-const _undefined: RegExp = /undefined/i;
+const _undefined: RegExp = /^undefined$/i;
 export { _undefined as undefined };
 
 // regex for string with no uppercase letters
@@ -148,7 +148,7 @@ function fixedBase64(bodyLength: number, padding: "" | "=" | "=="): RegExp {
 
 // Helper function to create base64url regex with exact length (no padding)
 function fixedBase64url(length: number): RegExp {
-  return new RegExp(`^[A-Za-z0-9-_]{${length}}$`);
+  return new RegExp(`^[A-Za-z0-9_-]{${length}}$`);
 }
 
 // MD5 (16 bytes): base64 = 24 chars total (22 + "==")

</recent_change_diff>

Current test results:
<test_output>
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v2.1.9 /Users/donggi/_projects/etc-projects/zod-thesis/.worktrees/s05-27f13d62/packages/zod

 ❯ src/v4/classic/tests/template-literal.test.ts (8 tests | 3 failed) 34ms
   × regexes 8ms
     → Snapshot `regexes 17` mismatched
   × template literal parsing - failure - complex cases 2ms
     → expected [Function] to throw an error
   × template literal parsing - failure - issue format 1ms
     → Snapshot `template literal parsing - failure - issue format 4` mismatched
 ❯ src/v4/classic/tests/to-json-schema.test.ts (61 tests | 2 failed) 123ms
   × toJSONSchema > primitive types 15ms
     → Snapshot `toJSONSchema > primitive types 15` mismatched
   × toJSONSchema > string formats 2ms
     → Snapshot `toJSONSchema > string formats 8` mismatched
 ✓  TS  src/v4/classic/tests/to-json-schema.test.ts (61 tests)
 ✓  TS  src/v4/classic/tests/template-literal.test.ts (8 tests)

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 5 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/v4/classic/tests/template-literal.test.ts > regexes
Error: Snapshot `regexes 17` mismatched

Expected: ""^\d+$""
Received: ""^-?\d+$""

 ❯ src/v4/classic/tests/template-literal.test.ts:537:38
    535|   expect(lazyString._zod.pattern.source).toMatchInlineSnapshot(`"^[\\s…
    536|   expect(anyNumber._zod.pattern.source).toMatchInlineSnapshot(`"^-?\\d…
    537|   expect(anyInt._zod.pattern.source).toMatchInlineSnapshot(`"^\\d+$"`);
       |                                      ^
    538|   // expect(anyFiniteNumber._zod.pattern.source).toMatchInlineSnapshot…
    539|   // expect(anyNegativeNumber._zod.pattern.source).toMatchInlineSnapsh…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/5]⎯

 FAIL  src/v4/classic/tests/template-literal.test.ts > template literal parsing - failure - complex cases
AssertionError: expected [Function] to throw an error
 ❯ src/v4/classic/tests/template-literal.test.ts:676:64
    674|   expect(() => connectionString.parse("mongodb://host:d234")).toThrow(…
    675|   expect(() => connectionString.parse("mongodb://host:12.34")).toThrow…
    676|   expect(() => connectionString.parse("mongodb://host:-1234")).toThrow…
       |                                                                ^
    677|   expect(() => connectionString.parse("mongodb://host:-12.34")).toThro…
    678|   expect(() => connectionString.parse("mongodb://host:")).toThrow();

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/5]⎯

 FAIL  src/v4/classic/tests/template-literal.test.ts > template literal parsing - failure - issue format
Error: Snapshot `template literal parsing - failure - issue format 4` mismatched

- Expected
+ Received

@@ -1,11 +1,11 @@
  {
    "error": [ZodError: [
    {
      "code": "invalid_format",
      "format": "template_literal",
-     "pattern": "^mongodb:\\/\\/(\\w+:\\w+@)?\\w+:\\d+(\\/(\\w+)?(\\?(\\w+=\\w+(&\\w+=\\w+)*)?)?)?$",
+     "pattern": "^mongodb:\\/\\/(\\w+:\\w+@)?\\w+:-?\\d+(\\/(\\w+)?(\\?(\\w+=\\w+(&\\w+=\\w+)*)?)?)?$",
      "path": [],
      "message": "Invalid input"
    }
  ]],
    "success": false,

 ❯ src/v4/classic/tests/template-literal.test.ts:732:91
    730|     }
    731|   `);
    732|   expect(connectionString.safeParse("mongodb://host:1234/defaultauthdb…
       |                                                                                           ^
    733|     {
    734|       "error": [ZodError: [

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/5]⎯

 FAIL  src/v4/classic/tests/to-json-schema.test.ts > toJSONSchema > primitive types
Error: Snapshot `toJSONSchema > primitive types 15` mismatched

- Expected
+ Received

  {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "format": "ipv6",
-   "pattern": "^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})$",
+   "pattern": "^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$",
    "type": "string",
  }

 ❯ src/v4/classic/tests/to-json-schema.test.ts:127:38
    125|       }
    126|     `);
    127|     expect(z.toJSONSchema(z.ipv6())).toMatchInlineSnapshot(`
       |                                      ^
    128|       {
    129|         "$schema": "https://json-schema.org/draft/2020-12/schema",

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/5]⎯

 FAIL  src/v4/classic/tests/to-json-schema.test.ts > toJSONSchema > string formats
Error: Snapshot `toJSONSchema > string formats 8` mismatched

- Expected
+ Received

  {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "format": "ipv6",
-   "pattern": "^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})$",
+   "pattern": "^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$",
    "type": "string",
  }

 ❯ src/v4/classic/tests/to-json-schema.test.ts:351:38
    349|     `);
    350| 
    351|     expect(z.toJSONSchema(z.ipv6())).toMatchInlineSnapshot(`
       |                                      ^
    352|       {
    353|         "$schema": "https://json-schema.org/draft/2020-12/schema",

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/5]⎯

  Snapshots  4 failed
 Test Files  2 failed | 2 passed (4)
      Tests  5 failed | 133 passed (138)
Type Errors  no errors
   Start at  15:51:42
   Duration  5.90s (transform 379ms, setup 23ms, collect 1.37s, tests 157ms, environment 0ms, prepare 293ms, typecheck 5.56s)


</test_output>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/template-literal.test.ts" lines="512-611">
  expect(() => stringMin5Max10.parse("12345678901")).toThrow();

  // the "startswith" overrides the max length
  // expect(() => stringStartsWithMax5.parse("hello1")).toThrow();
  expect(() => stringStartsWithMax5.parse("1hell")).toThrow();
  expect(() => brandedString.parse("")).toThrow();
});

test("regexes", () => {
  expect(empty._zod.pattern.source).toMatchInlineSnapshot(`"^$"`);
  expect(hello._zod.pattern.source).toMatchInlineSnapshot(`"^hello$"`);
  expect(world._zod.pattern.source).toMatchInlineSnapshot(`"^(world)$"`);
  expect(one._zod.pattern.source).toMatchInlineSnapshot(`"^1$"`);
  expect(two._zod.pattern.source).toMatchInlineSnapshot(`"^(2)$"`);
  expect(truee._zod.pattern.source).toMatchInlineSnapshot(`"^true$"`);
  expect(anotherTrue._zod.pattern.source).toMatchInlineSnapshot(`"^(true)$"`);
  expect(falsee._zod.pattern.source).toMatchInlineSnapshot(`"^false$"`);
  expect(anotherFalse._zod.pattern.source).toMatchInlineSnapshot(`"^(false)$"`);
  expect(nulll._zod.pattern.source).toMatchInlineSnapshot(`"^null$"`);
  expect(anotherNull._zod.pattern.source).toMatchInlineSnapshot(`"^null$"`);
  expect(undefinedd._zod.pattern.source).toMatchInlineSnapshot(`"^undefined$"`);
  expect(anotherUndefined._zod.pattern.source).toMatchInlineSnapshot(`"^undefined$"`);
  expect(anyString._zod.pattern.source).toMatchInlineSnapshot(`"^[\\s\\S]{0,}$"`);
  expect(lazyString._zod.pattern.source).toMatchInlineSnapshot(`"^[\\s\\S]{0,}$"`);
  expect(anyNumber._zod.pattern.source).toMatchInlineSnapshot(`"^-?\\d+(?:\\.\\d+)?$"`);
  expect(anyInt._zod.pattern.source).toMatchInlineSnapshot(`"^\\d+$"`);
  // expect(anyFiniteNumber._zod.pattern.source).toMatchInlineSnapshot(`"^-?\\d+(?:\\.\\d+)?$"`);
  // expect(anyNegativeNumber._zod.pattern.source).toMatchInlineSnapshot(`"^-?\\d+(?:\\.\\d+)?$"`);
  // expect(anyPositiveNumber._zod.pattern.source).toMatchInlineSnapshot(`"^-?\\d+(?:\\.\\d+)?$"`);
  // expect(zeroButInADumbWay._zod.pattern.source).toMatchInlineSnapshot(`"^-?\\d+(?:\\.\\d+)?$"`);
  // expect(finiteButInADumbWay._zod.pattern.source).toMatchInlineSnapshot(`"^-?\\d+(?:\\.\\d+)?$"`);
  expect(bool._zod.pattern.source).toMatchInlineSnapshot(`"^true|false$"`);
  expect(bigone._zod.pattern.source).toMatchInlineSnapshot(`"^(1)$"`);
  expect(anyBigint._zod.pattern.source).toMatchInlineSnapshot(`"^\\d+n?$"`);
  expect(nullableYo._zod.pattern.source).toMatchInlineSnapshot(`"^((yo)|null)$"`);
  expect(nullableString._zod.pattern.source).toMatchInlineSnapshot(`"^([\\s\\S]{0,}|null)$"`);
  expect(optionalYeah._zod.pattern.source).toMatchInlineSnapshot(`"^((yeah))?$"`);
  expect(optionalString._zod.pattern.source).toMatchInlineSnapshot(`"^([\\s\\S]{0,})?$"`);
  expect(optionalNumber._zod.pattern.source).toMatchInlineSnapshot(`"^(-?\\d+(?:\\.\\d+)?)?$"`);
  expect(nullishBruh._zod.pattern.source).toMatchInlineSnapshot(`"^(((bruh)|null))?$"`);
  expect(nullishString._zod.pattern.source).toMatchInlineSnapshot(`"^(([\\s\\S]{0,}|null))?$"`);
  expect(cuid._zod.pattern.source).toMatchInlineSnapshot(`"^[cC][^\\s-]{8,}$"`);
  expect(cuidZZZ._zod.pattern.source).toMatchInlineSnapshot(`"^[cC][^\\s-]{8,}ZZZ$"`);
  expect(cuid2._zod.pattern.source).toMatchInlineSnapshot(`"^[0-9a-z]+$"`);
  expect(datetime._zod.pattern.source).toMatchInlineSnapshot(
    `"^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z))$"`
  );
  expect(email._zod.pattern.source).toMatchInlineSnapshot(
    `"^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$"`
  );
  // expect(ip._zod.pattern.source).toMatchInlineSnapshot(
  //   `"^(^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$)|(^(([a-fA-F0-9]{1,4}:){7}|::([a-fA-F0-9]{1,4}:){0,6}|([a-fA-F0-9]{1,4}:){1}:([a-fA-F0-9]{1,4}:){0,5}|([a-fA-F0-9]{1,4}:){2}:([a-fA-F0-9]{1,4}:){0,4}|([a-fA-F0-9]{1,4}:){3}:([a-fA-F0-9]{1,4}:){0,3}|([a-fA-F0-9]{1,4}:){4}:([a-fA-F0-9]{1,4}:){0,2}|([a-fA-F0-9]{1,4}:){5}:([a-fA-F0-9]{1,4}:){0,1})([a-fA-F0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$)$"`
  // );
  expect(ipv4._zod.pattern.source).toMatchInlineSnapshot(
    `"^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$"`
  );
  expect(ipv6._zod.pattern.source).toMatchInlineSnapshot(
    `"^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})$"`
  );
  expect(ulid._zod.pattern.source).toMatchInlineSnapshot(`"^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$"`);
  expect(uuid._zod.pattern.source).toMatchInlineSnapshot(
    `"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"`
  );
  expect(stringAToZ._zod.pattern.source).toMatchInlineSnapshot(`"^[a-z]+$"`);
  expect(stringStartsWith._zod.pattern.source).toMatchInlineSnapshot(`"^hello.*$"`);
  expect(stringEndsWith._zod.pattern.source).toMatchInlineSnapshot(`"^.*world$"`);
  expect(stringMax5._zod.pattern.source).toMatchInlineSnapshot(`"^[\\s\\S]{0,5}$"`);
  expect(stringMin5._zod.pattern.source).toMatchInlineSnapshot(`"^[\\s\\S]{5,}$"`);
  expect(stringLen5._zod.pattern.source).toMatchInlineSnapshot(`"^[\\s\\S]{5,5}$"`);
  expect(stringMin5Max10._zod.pattern.source).toMatchInlineSnapshot(`"^[\\s\\S]{5,10}$"`);
  expect(brandedString._zod.pattern.source).toMatchInlineSnapshot(`"^[\\s\\S]{1,}$"`);
  expect(url._zod.pattern.source).toMatchInlineSnapshot(`"^https:\\/\\/\\w+\\.(com|net)$"`);
  expect(measurement._zod.pattern.source).toMatchInlineSnapshot(`"^-?\\d+(?:\\.\\d+)?((px|em|rem|vh|vw|vmin|vmax))?$"`);
  expect(connectionString._zod.pattern.source).toMatchInlineSnapshot(
    `"^mongodb:\\/\\/(\\w+:\\w+@)?\\w+:\\d+(\\/(\\w+)?(\\?(\\w+=\\w+(&\\w+=\\w+)*)?)?)?$"`
  );
});

test("template literal parsing - success - complex cases", () => {
  url.parse("https://example.com");
  url.parse("https://speedtest.net");

  // measurement.parse(1);
  // measurement.parse(1.1);
  // measurement.parse(0);
  // measurement.parse(-1.1);
  // measurement.parse(-1);
  measurement.parse("1");
  measurement.parse("1.1");
  measurement.parse("0");
  measurement.parse("-1");
  measurement.parse("-1.1");
  measurement.parse("1px");
  measurement.parse("1.1px");
  measurement.parse("0px");
  measurement.parse("-1px");
  measurement.parse("-1.1px");
  measurement.parse("1em");
  measurement.parse("1.1em");
  measurement.parse("0em");
</test_snippet>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/template-literal.test.ts" lines="651-702">
  connectionString.parse(
    "mongodb://username:password@host:1234/defaultauthdb?authSource=admin&connectTimeoutMS=300000"
  );
  connectionString.parse("mongodb://username:password@host:1234/?authSource=admin");
  connectionString.parse("mongodb://username:password@host:1234/?authSource=admin&connectTimeoutMS=300000");
});

test("template literal parsing - failure - complex cases", () => {
  expect(() => url.parse("http://example.com")).toThrow();
  expect(() => url.parse("https://.com")).toThrow();
  expect(() => url.parse("https://examplecom")).toThrow();
  expect(() => url.parse("https://example.org")).toThrow();
  expect(() => url.parse("https://example.net.il")).toThrow();

  expect(() => measurement.parse("1.1.1")).toThrow();
  expect(() => measurement.parse("Infinity")).toThrow();
  expect(() => measurement.parse("-Infinity")).toThrow();
  expect(() => measurement.parse("NaN")).toThrow();
  expect(() => measurement.parse("1%")).toThrow();

  expect(() => connectionString.parse("mongod://host:1234")).toThrow();
  expect(() => connectionString.parse("mongodb://:1234")).toThrow();
  expect(() => connectionString.parse("mongodb://host1234")).toThrow();
  expect(() => connectionString.parse("mongodb://host:d234")).toThrow();
  expect(() => connectionString.parse("mongodb://host:12.34")).toThrow();
  expect(() => connectionString.parse("mongodb://host:-1234")).toThrow();
  expect(() => connectionString.parse("mongodb://host:-12.34")).toThrow();
  expect(() => connectionString.parse("mongodb://host:")).toThrow();
  expect(() => connectionString.parse("mongodb://:password@host:1234")).toThrow();
  expect(() => connectionString.parse("mongodb://usernamepassword@host:1234")).toThrow();
  expect(() => connectionString.parse("mongodb://username:@host:1234")).toThrow();
  expect(() => connectionString.parse("mongodb://@host:1234")).toThrow();
  expect(() => connectionString.parse("mongodb://host:1234/defaultauthdb?authSourceadmin")).toThrow();
  expect(() => connectionString.parse("mongodb://host:1234/?authSourceadmin")).toThrow();
  expect(() => connectionString.parse("mongodb://host:1234/defaultauthdb?&authSource=admin")).toThrow();
  expect(() => connectionString.parse("mongodb://host:1234/?&authSource=admin")).toThrow();
});

test("template literal parsing - failure - issue format", () => {
  expect(anotherNull.safeParse("1null")).toMatchInlineSnapshot(`
    {
      "error": [ZodError: [
      {
        "code": "invalid_format",
        "format": "template_literal",
        "pattern": "^null$",
        "path": [],
        "message": "Invalid input"
      }
    ]],
      "success": false,
    }
</test_snippet>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/template-literal.test.ts" lines="713-763">
      }
    ]],
      "success": false,
    }
  `);
  expect(stringMin5Max10.safeParse("1234")).toMatchInlineSnapshot(`
    {
      "error": [ZodError: [
      {
        "code": "invalid_format",
        "format": "template_literal",
        "pattern": "^[\\\\s\\\\S]{5,10}$",
        "path": [],
        "message": "Invalid input"
      }
    ]],
      "success": false,
    }
  `);
  expect(connectionString.safeParse("mongodb://host:1234/defaultauthdb?authSourceadmin")).toMatchInlineSnapshot(`
    {
      "error": [ZodError: [
      {
        "code": "invalid_format",
        "format": "template_literal",
        "pattern": "^mongodb:\\\\/\\\\/(\\\\w+:\\\\w+@)?\\\\w+:\\\\d+(\\\\/(\\\\w+)?(\\\\?(\\\\w+=\\\\w+(&\\\\w+=\\\\w+)*)?)?)?$",
        "path": [],
        "message": "Invalid input"
      }
    ]],
      "success": false,
    }
  `);

  expect(stringStartsWithMax5.safeParse("1hell")).toMatchInlineSnapshot(`
    {
      "error": [ZodError: [
      {
        "code": "invalid_format",
        "format": "template_literal",
        "pattern": "^hello.*$",
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
<test_snippet path="packages/zod/src/v4/classic/tests/to-json-schema.test.ts" lines="106-156">
        "format": "time",
        "pattern": "^(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?$",
        "type": "string",
      }
    `);
    expect(z.toJSONSchema(z.iso.duration())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "format": "duration",
        "pattern": "^P(?:(\\d+W)|(?!.*W)(?=\\d|T\\d)(\\d+Y)?(\\d+M)?(\\d+D)?(T(?=\\d)(\\d+H)?(\\d+M)?(\\d+([.,]\\d+)?S)?)?)$",
        "type": "string",
      }
    `);
    expect(z.toJSONSchema(z.ipv4())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "format": "ipv4",
        "pattern": "^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$",
        "type": "string",
      }
    `);
    expect(z.toJSONSchema(z.ipv6())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "format": "ipv6",
        "pattern": "^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})$",
        "type": "string",
      }
    `);
    expect(z.toJSONSchema(z.uuid())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "format": "uuid",
        "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$",
        "type": "string",
      }
    `);
    expect(z.toJSONSchema(z.guid())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "format": "uuid",
        "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$",
        "type": "string",
      }
    `);
    expect(z.toJSONSchema(z.url())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "format": "uri",
        "type": "string",
      }
</test_snippet>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/to-json-schema.test.ts" lines="330-380">
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "format": "duration",
        "pattern": "^P(?:(\\d+W)|(?!.*W)(?=\\d|T\\d)(\\d+Y)?(\\d+M)?(\\d+D)?(T(?=\\d)(\\d+H)?(\\d+M)?(\\d+([.,]\\d+)?S)?)?)$",
        "type": "string",
      }
    `);
    // expect(z.toJSONSchema(z.string().ip())).toMatchInlineSnapshot(`
    //   {
    //     "pattern": /\\(\\^\\(\\?:\\(\\?:25\\[0-5\\]\\|2\\[0-4\\]\\[0-9\\]\\|1\\[0-9\\]\\[0-9\\]\\|\\[1-9\\]\\[0-9\\]\\|\\[0-9\\]\\)\\\\\\.\\)\\{3\\}\\(\\?:25\\[0-5\\]\\|2\\[0-4\\]\\[0-9\\]\\|1\\[0-9\\]\\[0-9\\]\\|\\[1-9\\]\\[0-9\\]\\|\\[0-9\\]\\)\\$\\)\\|\\(\\^\\(\\(\\[a-fA-F0-9\\]\\{1,4\\}:\\)\\{7\\}\\|::\\(\\[a-fA-F0-9\\]\\{1,4\\}:\\)\\{0,6\\}\\|\\(\\[a-fA-F0-9\\]\\{1,4\\}:\\)\\{1\\}:\\(\\[a-fA-F0-9\\]\\{1,4\\}:\\)\\{0,5\\}\\|\\(\\[a-fA-F0-9\\]\\{1,4\\}:\\)\\{2\\}:\\(\\[a-fA-F0-9\\]\\{1,4\\}:\\)\\{0,4\\}\\|\\(\\[a-fA-F0-9\\]\\{1,4\\}:\\)\\{3\\}:\\(\\[a-fA-F0-9\\]\\{1,4\\}:\\)\\{0,3\\}\\|\\(\\[a-fA-F0-9\\]\\{1,4\\}:\\)\\{4\\}:\\(\\[a-fA-F0-9\\]\\{1,4\\}:\\)\\{0,2\\}\\|\\(\\[a-fA-F0-9\\]\\{1,4\\}:\\)\\{5\\}:\\(\\[a-fA-F0-9\\]\\{1,4\\}:\\)\\{0,1\\}\\)\\(\\[a-fA-F0-9\\]\\{1,4\\}\\|\\(\\(\\(25\\[0-5\\]\\)\\|\\(2\\[0-4\\]\\[0-9\\]\\)\\|\\(1\\[0-9\\]\\{2\\}\\)\\|\\(\\[0-9\\]\\{1,2\\}\\)\\)\\\\\\.\\)\\{3\\}\\(\\(25\\[0-5\\]\\)\\|\\(2\\[0-4\\]\\[0-9\\]\\)\\|\\(1\\[0-9\\]\\{2\\}\\)\\|\\(\\[0-9\\]\\{1,2\\}\\)\\)\\)\\$\\)/,
    //     "type": "string",
    //   }
    // `);
    expect(z.toJSONSchema(z.ipv4())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "format": "ipv4",
        "pattern": "^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$",
        "type": "string",
      }
    `);

    expect(z.toJSONSchema(z.ipv6())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "format": "ipv6",
        "pattern": "^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})$",
        "type": "string",
      }
    `);

    expect(z.toJSONSchema(z.base64())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "contentEncoding": "base64",
        "format": "base64",
        "pattern": "^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$",
        "type": "string",
      }
    `);
    expect(z.toJSONSchema(z.url())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "format": "uri",
        "type": "string",
      }
    `);
    expect(z.toJSONSchema(z.guid())).toMatchInlineSnapshot(`
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "format": "uuid",
        "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$",
</test_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/regexes.ts" lines="22-86">
export const uuid = (version?: number | undefined): RegExp => {
  if (!version)
    return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
  return new RegExp(
    `^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`
  );
};
export const uuid4: RegExp = /*@__PURE__*/ uuid(4);
export const uuid6: RegExp = /*@__PURE__*/ uuid(6);
export const uuid7: RegExp = /*@__PURE__*/ uuid(7);

/** Practical email validation */
export const email: RegExp =
  /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

/** Equivalent to the HTML5 input[type=email] validation implemented by browsers. Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email */
export const html5Email: RegExp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/** The classic emailregex.com regex for RFC 5322-compliant emails */
export const rfc5322Email =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/** A loose regex that allows Unicode characters, enforces length limits, and that's about it. */
export const unicodeEmail = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u;
export const idnEmail = unicodeEmail;

export const browserEmail: RegExp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression

const _emoji: string = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
export function emoji(): RegExp {
  return new RegExp(_emoji, "u");
}

export const ipv4: RegExp =
  /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
export const ipv6: RegExp =
  /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;

export const cidrv4: RegExp =
  /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
export const cidrv6: RegExp =
  /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;

// https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
export const base64: RegExp = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
export const base64url: RegExp = /^[A-Za-z0-9_-]*$/;

// based on https://stackoverflow.com/questions/106179/regular-expression-to-match-dns-hostname-or-ip-address
// export const hostname: RegExp = /^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+$/;
export const hostname: RegExp =
  /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/;

export const domain: RegExp = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

// https://blog.stevenlevithan.com/archives/validate-phone-number#r4-3 (regex sans spaces)
export const e164: RegExp = /^\+(?:[0-9]){6,14}[0-9]$/;

// const dateSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
export const date: RegExp = /*@__PURE__*/ new RegExp(`^${dateSource}$`);

function timeSource(args: { precision?: number | null | undefined }) {
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/regexes.ts" lines="101-176">
}): RegExp {
  return new RegExp(`^${timeSource(args)}$`);
}

// Adapted from https://stackoverflow.com/a/3143231
export function datetime(args: {
  precision?: number | null;
  offset?: boolean;
  local?: boolean;
}): RegExp {
  const time = timeSource({ precision: args.precision });
  const opts = ["Z"];
  if (args.local) opts.push("");
  // if (args.offset) opts.push(`([+-]\\d{2}:\\d{2})`);
  if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
  const timeRegex = `${time}(?:${opts.join("|")})`;

  return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}

export const string = (params?: { minimum?: number | undefined; maximum?: number | undefined }): RegExp => {
  const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
  return new RegExp(`^${regex}$`);
};

export const bigint: RegExp = /^-?\d+n?$/;
export const integer: RegExp = /^-?\d+$/;
export const number: RegExp = /^-?\d+(?:\.\d+)?/;
export const boolean: RegExp = /^(?:true|false)$/i;
const _null: RegExp = /^null$/i;
export { _null as null };
const _undefined: RegExp = /^undefined$/i;
export { _undefined as undefined };

// regex for string with no uppercase letters
export const lowercase: RegExp = /^[^A-Z]*$/;
// regex for string with no lowercase letters
export const uppercase: RegExp = /^[^a-z]*$/;

// regex for hexadecimal strings (any length)
export const hex: RegExp = /^[0-9a-fA-F]*$/;

// Hash regexes for different algorithms and encodings
// Helper function to create base64 regex with exact length and padding
function fixedBase64(bodyLength: number, padding: "" | "=" | "=="): RegExp {
  return new RegExp(`^[A-Za-z0-9+/]{${bodyLength}}${padding}$`);
}

// Helper function to create base64url regex with exact length (no padding)
function fixedBase64url(length: number): RegExp {
  return new RegExp(`^[A-Za-z0-9_-]{${length}}$`);
}

// MD5 (16 bytes): base64 = 24 chars total (22 + "==")
export const md5_hex: RegExp = /^[0-9a-fA-F]{32}$/;
export const md5_base64: RegExp = /*@__PURE__*/ fixedBase64(22, "==");
export const md5_base64url: RegExp = /*@__PURE__*/ fixedBase64url(22);

// SHA1 (20 bytes): base64 = 28 chars total (27 + "=")
export const sha1_hex: RegExp = /^[0-9a-fA-F]{40}$/;
export const sha1_base64: RegExp = /*@__PURE__*/ fixedBase64(27, "=");
export const sha1_base64url: RegExp = /*@__PURE__*/ fixedBase64url(27);

// SHA256 (32 bytes): base64 = 44 chars total (43 + "=")
export const sha256_hex: RegExp = /^[0-9a-fA-F]{64}$/;
export const sha256_base64: RegExp = /*@__PURE__*/ fixedBase64(43, "=");
export const sha256_base64url: RegExp = /*@__PURE__*/ fixedBase64url(43);

// SHA384 (48 bytes): base64 = 64 chars total (no padding)
export const sha384_hex: RegExp = /^[0-9a-fA-F]{96}$/;
export const sha384_base64: RegExp = /*@__PURE__*/ fixedBase64(64, "");
export const sha384_base64url: RegExp = /*@__PURE__*/ fixedBase64url(64);

// SHA512 (64 bytes): base64 = 88 chars total (86 + "==")
export const sha512_hex: RegExp = /^[0-9a-fA-F]{128}$/;
export const sha512_base64: RegExp = /*@__PURE__*/ fixedBase64(86, "==");
</production_snippet>
