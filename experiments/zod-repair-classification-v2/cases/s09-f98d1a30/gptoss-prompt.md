You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/classic/tests/string.test.ts, packages/zod/src/v4/mini/tests/string.test.ts, packages/docs/content/api.mdx, packages/zod/src/v4/core/regexes.ts, packages/zod/src/v4/core/schemas.ts, play.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/docs/content/api.mdx b/packages/docs/content/api.mdx
index 3a88d5c2..d31ae332 100644
--- a/packages/docs/content/api.mdx
+++ b/packages/docs/content/api.mdx
@@ -297,16 +297,15 @@ z.guid();
 
 ### URLs
 
-To validate any WHATWG-compatible URL.
+The validate any WHATWG-compatible URL. 
 
 ```ts
 const schema = z.url();
 
 schema.parse("https://example.com"); // ✅
 schema.parse("http://localhost"); // ✅
-
-schema.parse("mailto:noreply@zod.dev"); // ❌
-schema.parse("sup"); // ❌
+schema.parse("mailto:noreply@zod.dev"); // ✅
+schema.parse("sup"); // ✅
 ```
 
 > Internally this uses the `new URL()` constructor to perform validation. This may behave differently across platforms and runtimes but is generally the most rigorous way to validate URIs/URLs. 
@@ -329,6 +328,15 @@ schema.parse("https://example.com"); // ✅
 schema.parse("http://example.com"); // ❌
 ```
 
+Here is the recommended schema for validating HTTP URLs. It limits the protocol to `http`/`https` and ensures the hostname is a valid domain name.
+
+```ts
+const httpUrl = z.url({
+  protocol: /^https?$/,
+  hostname: z.regexes.domain 
+            // /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
+});
+```
 
 ### ISO datetimes
 
diff --git a/packages/zod/src/v4/core/regexes.ts b/packages/zod/src/v4/core/regexes.ts
index 62490d7f..7ecfed8a 100644
--- a/packages/zod/src/v4/core/regexes.ts
+++ b/packages/zod/src/v4/core/regexes.ts
@@ -74,6 +74,7 @@ export const base64url: RegExp = /^[A-Za-z0-9_-]*$/;
 // export const hostname: RegExp =
 //   /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
 export const hostname: RegExp = /^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+$/;
+export const domain: RegExp = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
 
 // https://blog.stevenlevithan.com/archives/validate-phone-number#r4-3 (regex sans spaces)
 export const e164: RegExp = /^\+(?:[0-9]){6,14}[0-9]$/;
diff --git a/packages/zod/src/v4/core/schemas.ts b/packages/zod/src/v4/core/schemas.ts
index a9ff9668..d378133e 100644
--- a/packages/zod/src/v4/core/schemas.ts
+++ b/packages/zod/src/v4/core/schemas.ts
@@ -426,18 +426,6 @@ export const $ZodURL: core.$constructor<$ZodURL> = /*@__PURE__*/ core.$construct
     try {
       const url = new URL(payload.value);
 
-      regexes.hostname.lastIndex = 0;
-      if (!regexes.hostname.test(url.hostname)) {
-        payload.issues.push({
-          code: "invalid_format",
-          format: "url",
-          note: "Invalid hostname",
-          pattern: regexes.hostname.source,
-          input: payload.value,
-          inst,
-        });
-      }
-
       if (def.hostname) {
         def.hostname.lastIndex = 0;
         if (!def.hostname.test(url.hostname)) {
@@ -445,7 +433,7 @@ export const $ZodURL: core.$constructor<$ZodURL> = /*@__PURE__*/ core.$construct
             code: "invalid_format",
             format: "url",
             note: "Invalid hostname",
-            pattern: def.hostname.source,
+            pattern: regexes.hostname.source,
             input: payload.value,
             inst,
           });
diff --git a/play.ts b/play.ts
index fcc1a10b..1470d54c 100644
--- a/play.ts
+++ b/play.ts
@@ -1,13 +1,29 @@
-import * as z from "zod/v4";
+import * as z from "zod/v3";
 
-export const a = z.object({
-  asdf: z.iso.datetime(),
+console.log({
+  href: new URL(import.meta.url).href,
+  hostname: new URL(import.meta.url).hostname,
+  pathname: new URL(import.meta.url).pathname,
 });
 
-const fn = z.function({
-  // input: z.tuple([z.string()], z.number()),
-  output: z.string(),
-});
+// z.
+// z.string.url({ hostname: /.*/ }).parse(import.meta.url);
+
+// const a = z.url({
+//   protocol: /^https?$/,
+// });
+const a = z.string().url();
+
+a.parse("https://example.com");
+a.parse("http://example.com");
+a.parse("htt://example.com");
+a.parse("c:");
+a.parse("mailto:noreply@zod.dev"); // ❌
+
+// const a = z.url();
 
-fn.def.output;
-fn.def.input;
+// a.parse("https://example.com"); // ✅
+// a.parse("http://localhost"); // ✅
+// a.parse("mailto:noreply@zod.dev"); // ❌
+// a.parse("sup"); // ❌
+/^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

</recent_change_diff>

Current test results:
<test_output>
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v2.1.9 /Users/donggi/_projects/etc-projects/zod-thesis/.worktrees/s09-f98d1a30/packages/zod

 ✓ src/v4/mini/tests/string.test.ts (23 tests) 9ms
 ❯ src/v4/classic/tests/string.test.ts (39 tests | 1 failed) 109ms
   × url validations 4ms
     → expected [Function] to throw an error
 ✓  TS  src/v4/classic/tests/string.test.ts (39 tests)
 ✓  TS  src/v4/mini/tests/string.test.ts (23 tests)

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/v4/classic/tests/string.test.ts > url validations
AssertionError: expected [Function] to throw an error
 ❯ src/v4/classic/tests/string.test.ts:343:56
    341| 
    342|   expect(() => url.parse("asdf")).toThrow();
    343|   expect(() => url.parse("http:.......///broken.com")).toThrow();
       |                                                        ^
    344|   expect(() => url.parse("c:")).toThrow();
    345|   expect(() => url.parse("WWW:WWW.COM")).toThrow();

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed | 3 passed (4)
      Tests  1 failed | 123 passed (124)
Type Errors  no errors
   Start at  15:52:45
   Duration  4.06s (transform 252ms, setup 0ms, collect 664ms, tests 117ms, environment 0ms, prepare 246ms, typecheck 3.68s)


</test_output>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/string.test.ts" lines="316-372">

  // expect(() => jwtSchema.parse(ONE_PART)).toThrow();
  // expect(() => jwtSchema.parse(NOT_BASE64)).toThrow();
  // expect(() => jwtSchema.parse(TYP_NOT_JWT)).toThrow();
  // expect(() => jwtSchema.parse(TYP_NOT_JWT)).toThrow();
  // expect(() => jwtSchema.parse(TYP_NOT_JWT)).toThrow();
  // expect(() => z.string().jwt({ alg: "ES256" }).parse(GOOD_JWT_HS256)).toThrow();
  // expect(() => z.string().jwt({ alg: "HS256" }).parse(GOOD_JWT_ES256)).toThrow();
  // //Success
  // jwtSchema.parse(NO_TYP); // allow no typ
  // expect(() => jwtSchema.parse(GOOD_JWT_HS256)).not.toThrow();
  // expect(() => jwtSchema.parse(GOOD_JWT_ES256)).not.toThrow();
  // expect(() => z.string().jwt({ alg: "HS256" }).parse(GOOD_JWT_HS256)).not.toThrow();
  // expect(() => z.string().jwt({ alg: "ES256" }).parse(GOOD_JWT_ES256)).not.toThrow();
});

test("url validations", () => {
  const url = z.string().url();
  url.parse("http://google.com");
  url.parse("https://google.com/asdf?asdf=ljk3lk4&asdf=234#asdf");
  url.parse("https://anonymous:flabada@developer.mozilla.org/en-US/docs/Web/API/URL/password");
  url.parse("https://localhost");
  url.parse("https://my.local");
  url.parse("http://aslkfjdalsdfkjaf");
  url.parse("http://localhost");

  expect(() => url.parse("asdf")).toThrow();
  expect(() => url.parse("http:.......///broken.com")).toThrow();
  expect(() => url.parse("c:")).toThrow();
  expect(() => url.parse("WWW:WWW.COM")).toThrow();
  expect(() => url.parse("https:/")).toThrow();
  expect(() => url.parse("asdfj@lkjsdf.com")).toThrow();
});

test("url error overrides", () => {
  try {
    z.string().url().parse("https");
  } catch (err) {
    expect((err as z.ZodError).issues[0].message).toEqual("Invalid URL");
  }
  try {
    z.string().url("badurl").parse("https");
  } catch (err) {
    expect((err as z.ZodError).issues[0].message).toEqual("badurl");
  }
  try {
    z.string().url({ message: "badurl" }).parse("https");
  } catch (err) {
    expect((err as z.ZodError).issues[0].message).toEqual("badurl");
  }
});

test("emoji validations", () => {
  const emoji = z.string().emoji();

  emoji.parse("👋👋👋👋");
  emoji.parse("🍺👩‍🚀🫡");
</test_snippet>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/mini/tests/string.test.ts" lines="98-148">
  expect(a.parse("https://localhost")).toEqual("https://localhost");
  expect(a.parse("http://localhost:3000")).toEqual("http://localhost:3000");
  expect(a.parse("https://localhost:3000")).toEqual("https://localhost:3000");

  // invalid URLs
  expect(() => a.parse("not-a-url")).toThrow();
  // expect(() => a.parse("http:/example.com")).toThrow();
  expect(() => a.parse("://example.com")).toThrow();
  expect(() => a.parse("http://")).toThrow();
  expect(() => a.parse("example.com")).toThrow();

  // wrong type
  expect(() => a.parse(123)).toThrow();
  expect(() => a.parse(null)).toThrow();
  expect(() => a.parse(undefined)).toThrow();
});

test("z.url with optional hostname regex", () => {
  const a = z.url({ hostname: /example\.com$/ });
  expect(a.parse("http://example.com")).toEqual("http://example.com");
  expect(a.parse("https://sub.example.com")).toEqual("https://sub.example.com");
  expect(() => a.parse("http://examples.com")).toThrow();
  expect(() => a.parse("http://example.org")).toThrow();
  expect(() => a.parse("asdf")).toThrow();
});

test("z.url with optional protocol regex", () => {
  const a = z.url({ protocol: /^https?$/ });
  expect(a.parse("http://example.com")).toEqual("http://example.com");
  expect(a.parse("https://example.com")).toEqual("https://example.com");
  expect(() => a.parse("ftp://example.com")).toThrow();
  expect(() => a.parse("mailto:example@example.com")).toThrow();
  expect(() => a.parse("asdf")).toThrow();
});

test("z.url with both hostname and protocol regexes", () => {
  const a = z.url({ hostname: /example\.com$/, protocol: /^https$/ });
  expect(a.parse("https://example.com")).toEqual("https://example.com");
  expect(a.parse("https://sub.example.com")).toEqual("https://sub.example.com");
  expect(() => a.parse("http://example.com")).toThrow();
  expect(() => a.parse("https://example.org")).toThrow();
  expect(() => a.parse("ftp://example.com")).toThrow();
  expect(() => a.parse("asdf")).toThrow();
});

test("z.url with invalid regex patterns", () => {
  const a = z.url({ hostname: /a+$/, protocol: /^ftp$/ });
  a.parse("ftp://a");
  a.parse("ftp://aaaaaaaa");
  expect(() => a.parse("http://aaa")).toThrow();
  expect(() => a.parse("https://example.com")).toThrow();
</test_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/regexes.ts" lines="52-102">
export const _emoji = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
export function emoji(): RegExp {
  return new RegExp(_emoji, "u");
}

export const ipv4: RegExp =
  /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
export const ipv6: RegExp =
  /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})$/;

export const cidrv4: RegExp =
  /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
export const cidrv6: RegExp =
  /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;

export const ip: RegExp = new RegExp(`(${ipv4.source})|(${ipv6.source})`);

// https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
export const base64: RegExp = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
export const base64url: RegExp = /^[A-Za-z0-9_-]*$/;

// based on https://stackoverflow.com/questions/106179/regular-expression-to-match-dns-hostname-or-ip-address
// export const hostname: RegExp =
//   /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
export const hostname: RegExp = /^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+$/;
export const domain: RegExp = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

// https://blog.stevenlevithan.com/archives/validate-phone-number#r4-3 (regex sans spaces)
export const e164: RegExp = /^\+(?:[0-9]){6,14}[0-9]$/;

const dateSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
export const date: RegExp = new RegExp(`^${dateSource}$`);

function timeSource(args: { precision?: number | null }) {
  // let regex = `\\d{2}:\\d{2}:\\d{2}`;
  let regex = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;

  if (args.precision) {
    regex = `${regex}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    regex = `${regex}(\\.\\d+)?`;
  }
  return regex;
}
export function time(args: {
  precision?: number | null;
}): RegExp {
  return new RegExp(`^${timeSource(args)}$`);
}

// Adapted from https://stackoverflow.com/a/3143231
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/schemas.ts" lines="403-461">
  (inst, def): void => {
    def.pattern ??= regexes.email;
    $ZodStringFormat.init(inst, def);
  }
);

//////////////////////////////   ZodURL   //////////////////////////////

export interface $ZodURLDef extends $ZodStringFormatDef<"url"> {
  hostname?: RegExp | undefined;
  protocol?: RegExp | undefined;
}
export interface $ZodURLInternals extends $ZodStringFormatInternals<"url"> {
  def: $ZodURLDef;
}

export interface $ZodURL extends $ZodType {
  _zod: $ZodURLInternals;
}

export const $ZodURL: core.$constructor<$ZodURL> = /*@__PURE__*/ core.$constructor("$ZodURL", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    try {
      const url = new URL(payload.value);

      if (def.hostname) {
        def.hostname.lastIndex = 0;
        if (!def.hostname.test(url.hostname)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid hostname",
            pattern: regexes.hostname.source,
            input: payload.value,
            inst,
          });
        }
      }

      if (def.protocol) {
        def.protocol.lastIndex = 0;
        if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid protocol",
            pattern: def.protocol.source,
            input: payload.value,
            inst,
          });
        }
      }

      return;
    } catch (_) {
      payload.issues.push({
        code: "invalid_format",
        format: "url",
</production_snippet>
