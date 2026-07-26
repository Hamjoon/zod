You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/classic/tests/string.test.ts, packages/zod/src/v4/mini/tests/string.test.ts, packages/zod/src/v4/core/schemas.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/classic/tests/string.test.ts b/packages/zod/src/v4/classic/tests/string.test.ts
index 186bc2b5..4528beb8 100644
--- a/packages/zod/src/v4/classic/tests/string.test.ts
+++ b/packages/zod/src/v4/classic/tests/string.test.ts
@@ -217,6 +217,16 @@ test("base64 validations", () => {
     "?QmFzZTY0IGVuY29kaW5nIGlzIGZ1bg==", // Invalid character '?'
     ".MTIzND2Nzg5MC4=", // Invalid character '.'
     "QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVo", // Missing padding
+    // Whitespace is not part of canonical base64 (RFC 4648 §3.3) — atob() strips
+    // whitespace internally before validating, so the length check alone would
+    // accept "123 " etc.
+    "123 ", // bypasses length-mod-4 via trailing whitespace
+    "SGVsbG8gV29ybGQ= ", // trailing space
+    " SGVsbG8gV29ybGQ=", // leading space
+    "SGVsbG8gV29ybGQ=\n", // trailing newline
+    "SGVs bG8gV29ybGQ=", // internal space
+    "SGVs\nbG8gV29ybGQ=", // internal newline
+    "SGVs\tbG8gV29ybGQ=", // internal tab
   ];
 
   for (const str of invalidBase64Strings) {
diff --git a/packages/zod/src/v4/mini/tests/string.test.ts b/packages/zod/src/v4/mini/tests/string.test.ts
index 61be8f92..55cbd860 100644
--- a/packages/zod/src/v4/mini/tests/string.test.ts
+++ b/packages/zod/src/v4/mini/tests/string.test.ts
@@ -282,6 +282,11 @@ test("z.base64", () => {
   expect(() => z.parse(a, "SGVsbG8gd29ybGQ")).toThrow();
   expect(() => z.parse(a, "U29tZSBvdGhlciBzdHJpbmc")).toThrow();
   expect(() => z.parse(a, "hello")).toThrow();
+  // whitespace is not allowed (atob would otherwise strip it)
+  expect(() => z.parse(a, "123 ")).toThrow();
+  expect(() => z.parse(a, "SGVsbG8gd29ybGQ= ")).toThrow();
+  expect(() => z.parse(a, "SGVsbG8gd29ybGQ=\n")).toThrow();
+  expect(() => z.parse(a, "SGVs bG8gd29ybGQ=")).toThrow();
   // wrong type
   expect(() => z.parse(a, 123)).toThrow();
 });

</recent_change_diff>

Current test results:
<test_output>
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v4.0.10 <worktree>/p07-584b1089

 ❯  zod  src/v4/mini/tests/string.test.ts (27 tests | 1 failed) 16ms
   ✓ z.string 4ms
   ✓ z.string with custom error 0ms
   ✓ inference in checks 1ms
   ✓ z.string async 0ms
   ✓ z.uuid 1ms
   ✓ z.email 0ms
   ✓ z.url 1ms
   ✓ z.url with optional hostname regex 0ms
   ✓ z.url - file urls 0ms
   ✓ z.url with optional protocol regex 0ms
   ✓ z.url with both hostname and protocol regexes 0ms
   ✓ z.url with invalid regex patterns 0ms
   ✓ z.emoji 0ms
   ✓ z.nanoid 0ms
   ✓ z.cuid 0ms
   ✓ z.cuid2 0ms
   ✓ z.ulid 0ms
   ✓ z.xid 0ms
   ✓ z.ksuid 0ms
   ✓ z.ipv4 1ms
   ✓ z.ipv6 0ms
   ✓ z.mac 0ms
   ✓ z.mac with custom delimiter 0ms
   × z.base64 3ms
   ✓ z.e164 0ms
   ✓ z.jwt 0ms
   ✓ z.hash generic format 0ms
 ❯  zod  src/v4/classic/tests/string.test.ts (47 tests | 1 failed) 87ms
   ✓ length checks 1ms
   ✓ includes 0ms
   ✓ includes with string error message 4ms
   ✓ startswith/endswith 0ms
   ✓ email validations 1ms
   × base64 validations 3ms
   ✓ base64url validations 1ms
   ✓ big base64 and base64url 61ms
   ✓ jwt token 1ms
   ✓ url validations 0ms
   ✓ url preserves original input 0ms
   ✓ url trims whitespace 0ms
   ✓ url normalize flag 0ms
   ✓ url normalize with hostname and protocol constraints 0ms
   ✓ httpurl 1ms
   ✓ url error overrides 0ms
   ✓ emoji validations 1ms
   ✓ nanoid 1ms
   ✓ bad nanoid 0ms
   ✓ good uuid 0ms
   ✓ bad uuid 0ms
   ✓ good guid 0ms
   ✓ bad guid 0ms
   ✓ cuid 0ms
   ✓ cuid2 0ms
   ✓ ulid 0ms
   ✓ xid 0ms
   ✓ ksuid 0ms
   ✓ regex 0ms
   ✓ regexp error message 0ms
   ✓ regexp error custom message 0ms
   ✓ regex lastIndex reset 0ms
   ✓ format 1ms
   ✓ min max getters 0ms
   ✓ boundary cases with zero length 0ms
   ✓ trim 0ms
   ✓ lowerCase 0ms
   ✓ slugify 1ms
   ✓ IPv4 validation 0ms
   ✓ IPv6 validation 0ms
   ✓ MAC validation 0ms
   ✓ MAC validation with custom delimiter 0ms
   ✓ CIDR v4 validation 0ms
   ✓ CIDR v6 validation 0ms
   ✓ E.164 validation 0ms
   ✓ hostname 1ms
   ✓ hash validation 1ms
 ✓  zod   TS  src/v4/classic/tests/string.test.ts (47 tests)
 ✓  zod   TS  src/v4/mini/tests/string.test.ts (27 tests)

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL   zod  src/v4/mini/tests/string.test.ts > z.base64
AssertionError: expected [Function] to throw an error
 ❯ src/v4/mini/tests/string.test.ts:286:36
    284|   expect(() => z.parse(a, "hello")).toThrow();
    285|   // whitespace is not allowed (atob would otherwise strip it)
    286|   expect(() => z.parse(a, "123 ")).toThrow();
       |                                    ^
    287|   expect(() => z.parse(a, "SGVsbG8gd29ybGQ= ")).toThrow();
    288|   expect(() => z.parse(a, "SGVsbG8gd29ybGQ=\n")).toThrow();

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL   zod  src/v4/classic/tests/string.test.ts > base64 validations
AssertionError: expected '123 true' to be '123 false' // Object.is equality

Expected: "123 false"
Received: "123 true"

 ❯ src/v4/classic/tests/string.test.ts:233:62
    231| 
    232|   for (const str of invalidBase64Strings) {
    233|     expect(str + z.string().base64().safeParse(str).success).toBe(`${s…
       |                                                              ^
    234|   }
    235| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  2 failed | 2 passed (4)
      Tests  2 failed | 146 passed (148)
Type Errors  no errors
   Start at  15:52:57
   Duration  7.07s (transform 1.14s, setup 45ms, collect 1.43s, tests 103ms, environment 0ms, prepare 5ms, typecheck 6.13s)


</test_output>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/string.test.ts" lines="195-254">
  const validBase64Strings = [
    "SGVsbG8gV29ybGQ=", // "Hello World"
    "VGhpcyBpcyBhbiBlbmNvZGVkIHN0cmluZw==", // "This is an encoded string"
    "TWFueSBoYW5kcyBtYWtlIGxpZ2h0IHdvcms=", // "Many hands make light work"
    "UGF0aWVuY2UgaXMgdGhlIGtleSB0byBzdWNjZXNz", // "Patience is the key to success"
    "QmFzZTY0IGVuY29kaW5nIGlzIGZ1bg==", // "Base64 encoding is fun"
    "MTIzNDU2Nzg5MA==", // "1234567890"
    "YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXo=", // "abcdefghijklmnopqrstuvwxyz"
    "QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVo=", // "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "ISIkJSMmJyonKCk=", // "!\"#$%&'()*"
    "", // Empty string is technically a valid base64
  ];

  for (const str of validBase64Strings) {
    expect(str + z.string().base64().safeParse(str).success).toBe(`${str}true`);
  }

  const invalidBase64Strings = [
    "12345", // Not padded correctly, not a multiple of 4 characters
    "SGVsbG8gV29ybGQ", // Missing padding
    "VGhpcyBpcyBhbiBlbmNvZGVkIHN0cmluZw", // Missing padding
    "!UGF0aWVuY2UgaXMgdGhlIGtleSB0byBzdWNjZXNz", // Invalid character '!'
    "?QmFzZTY0IGVuY29kaW5nIGlzIGZ1bg==", // Invalid character '?'
    ".MTIzND2Nzg5MC4=", // Invalid character '.'
    "QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVo", // Missing padding
    // Whitespace is not part of canonical base64 (RFC 4648 §3.3) — atob() strips
    // whitespace internally before validating, so the length check alone would
    // accept "123 " etc.
    "123 ", // bypasses length-mod-4 via trailing whitespace
    "SGVsbG8gV29ybGQ= ", // trailing space
    " SGVsbG8gV29ybGQ=", // leading space
    "SGVsbG8gV29ybGQ=\n", // trailing newline
    "SGVs bG8gV29ybGQ=", // internal space
    "SGVs\nbG8gV29ybGQ=", // internal newline
    "SGVs\tbG8gV29ybGQ=", // internal tab
  ];

  for (const str of invalidBase64Strings) {
    expect(str + z.string().base64().safeParse(str).success).toBe(`${str}false`);
  }
});

test("base64url validations", () => {
  const base64url = z.string().base64url();

  const validBase64URLStrings = [
    "SGVsbG8gV29ybGQ", // "Hello World"

    "VGhpcyBpcyBhbiBlbmNvZGVkIHN0cmluZw", // "This is an encoded string"

    "TWFueSBoYW5kcyBtYWtlIGxpZ2h0IHdvcms", // "Many hands make light work"

    "UGF0aWVuY2UgaXMgdGhlIGtleSB0byBzdWNjZXNz", // "Patience is the key to success"
    "QmFzZTY0IGVuY29kaW5nIGlzIGZ1bg", // "Base64 encoding is fun"

    "MTIzNDU2Nzg5MA", // "1234567890"

    "YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXo", // "abcdefghijklmnopqrstuvwxyz"

    "QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVo", // "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
</test_snippet>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/mini/tests/string.test.ts" lines="260-314">
  expect(z.parse(a, "00:1A:2B:3C:4D:5E")).toEqual("00:1A:2B:3C:4D:5E");
  // invalid mac with dash
  expect(() => z.parse(a, "00-1A-2B-3C-4D-5E")).toThrow();

  const b = z.mac({ delimiter: "-" });
  // valid mac with dash
  expect(z.parse(b, "00-1A-2B-3C-4D-5E")).toEqual("00-1A-2B-3C-4D-5E");
  // invalid mac with colon
  expect(() => z.parse(b, "00:1A:2B:3C:4D:5E")).toThrow();

  const c = z.mac({ delimiter: ":" });
  // colon-only mac
  expect(z.parse(c, "00:1A:2B:3C:4D:5E")).toEqual("00:1A:2B:3C:4D:5E");
  expect(() => z.parse(c, "00-1A-2B-3C-4D-5E")).toThrow();
});

test("z.base64", () => {
  const a = z.base64();
  // valid base64
  expect(z.parse(a, "SGVsbG8gd29ybGQ=")).toEqual("SGVsbG8gd29ybGQ=");
  expect(z.parse(a, "U29tZSBvdGhlciBzdHJpbmc=")).toEqual("U29tZSBvdGhlciBzdHJpbmc=");
  // invalid base64
  expect(() => z.parse(a, "SGVsbG8gd29ybGQ")).toThrow();
  expect(() => z.parse(a, "U29tZSBvdGhlciBzdHJpbmc")).toThrow();
  expect(() => z.parse(a, "hello")).toThrow();
  // whitespace is not allowed (atob would otherwise strip it)
  expect(() => z.parse(a, "123 ")).toThrow();
  expect(() => z.parse(a, "SGVsbG8gd29ybGQ= ")).toThrow();
  expect(() => z.parse(a, "SGVsbG8gd29ybGQ=\n")).toThrow();
  expect(() => z.parse(a, "SGVs bG8gd29ybGQ=")).toThrow();
  // wrong type
  expect(() => z.parse(a, 123)).toThrow();
});

// test("z.jsonString", () => {
//   const a = z.jsonString();
//   // valid JSON string
//   expect(z.parse(a, '{"key":"value"}')).toEqual('{"key":"value"}');
//   expect(z.parse(a, '["item1", "item2"]')).toEqual('["item1", "item2"]');
//   // invalid JSON string
//   expect(() => z.parse(a, '{"key":value}')).toThrow();
//   expect(() => z.parse(a, '["item1", "item2"')).toThrow();
//   expect(() => z.parse(a, "hello")).toThrow();
//   // wrong type
//   expect(() => z.parse(a, 123)).toThrow();
// });

test("z.e164", () => {
  const a = z.e164();
  // valid e164
  expect(z.parse(a, "+1234567890")).toEqual("+1234567890");
  expect(z.parse(a, "+19876543210")).toEqual("+19876543210");
  // invalid e164
  expect(() => z.parse(a, "1234567890")).toThrow();
  expect(() => z.parse(a, "+12345")).toThrow();
</test_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/schemas.ts" lines="864-914">
      const parts = payload.value.split("/");
      try {
        if (parts.length !== 2) throw new Error();
        const [address, prefix] = parts;
        if (!prefix) throw new Error();
        const prefixNum = Number(prefix);
        if (`${prefixNum}` !== prefix) throw new Error();
        if (prefixNum < 0 || prefixNum > 128) throw new Error();
        // @ts-ignore
        new URL(`http://[${address}]`);
      } catch {
        payload.issues.push({
          code: "invalid_format",
          format: "cidrv6",
          input: payload.value,
          inst,
          continue: !def.abort,
        });
      }
    };
  }
);

//////////////////////////////   ZodBase64   //////////////////////////////
export function isValidBase64(data: string): boolean {
  if (data === "") return true;
  if (data.length % 4 !== 0) return false;
  try {
    // @ts-ignore
    atob(data);
    return true;
  } catch {
    return false;
  }
}

export interface $ZodBase64Def extends $ZodStringFormatDef<"base64"> {}
export interface $ZodBase64Internals extends $ZodStringFormatInternals<"base64"> {}

export interface $ZodBase64 extends $ZodType {
  _zod: $ZodBase64Internals;
}

export const $ZodBase64: core.$constructor<$ZodBase64> = /*@__PURE__*/ core.$constructor(
  "$ZodBase64",
  (inst, def): void => {
    def.pattern ??= regexes.base64;
    $ZodStringFormat.init(inst, def);

    inst._zod.bag.contentEncoding = "base64";

</production_snippet>
