You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/classic/tests/string.test.ts, packages/zod/src/v4/classic/schemas.ts, packages/zod/src/v4/core/regexes.ts, packages/zod/src/v4/core/schemas.ts, packages/zod/src/v4/mini/schemas.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/classic/tests/string.test.ts b/packages/zod/src/v4/classic/tests/string.test.ts
index 509f497b..186bc2b5 100644
--- a/packages/zod/src/v4/classic/tests/string.test.ts
+++ b/packages/zod/src/v4/classic/tests/string.test.ts
@@ -454,6 +454,12 @@ test("httpurl", () => {
   ).toThrow();
   expect(() => httpUrl.parse("http://asdf.c")).toThrow();
   expect(() => httpUrl.parse("mailto:asdf@lckj.com")).toThrow();
+  // missing // after protocol
+  expect(() => httpUrl.parse("http:example.com")).toThrow();
+  expect(() => httpUrl.parse("https:example.com")).toThrow();
+  // missing one /
+  expect(() => httpUrl.parse("https:/www.google.com")).toThrow();
+  expect(() => httpUrl.parse("http:/example.com")).toThrow();
 });
 
 test("url error overrides", () => {

</recent_change_diff>

Current test results:
<test_output>
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.
Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v4.0.10 /Users/donggi/_projects/etc-projects/zod-thesis/.worktrees/p06-3cd45ebc

 ❯  zod  src/v4/classic/tests/string.test.ts (47 tests | 1 failed) 105ms
   ✓ length checks 2ms
   ✓ includes 0ms
   ✓ includes with string error message 5ms
   ✓ startswith/endswith 0ms
   ✓ email validations 1ms
   ✓ base64 validations 1ms
   ✓ base64url validations 0ms
   ✓ big base64 and base64url 75ms
   ✓ jwt token 1ms
   ✓ url validations 0ms
   ✓ url preserves original input 4ms
   ✓ url trims whitespace 0ms
   ✓ url normalize flag 0ms
   ✓ url normalize with hostname and protocol constraints 0ms
   × httpurl 1ms
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
   ✓ regexp error message 1ms
   ✓ regexp error custom message 0ms
   ✓ regex lastIndex reset 0ms
   ✓ format 2ms
   ✓ min max getters 0ms
   ✓ boundary cases with zero length 0ms
   ✓ trim 0ms
   ✓ lowerCase 0ms
   ✓ slugify 1ms
   ✓ IPv4 validation 1ms
   ✓ IPv6 validation 0ms
   ✓ MAC validation 0ms
   ✓ MAC validation with custom delimiter 0ms
   ✓ CIDR v4 validation 0ms
   ✓ CIDR v6 validation 0ms
   ✓ E.164 validation 0ms
   ✓ hostname 1ms
   ✓ hash validation 1ms
 ✓  zod   TS  src/v4/classic/tests/string.test.ts (47 tests)

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL   zod  src/v4/classic/tests/string.test.ts > httpurl
AssertionError: expected [Function] to throw an error
 ❯ src/v4/classic/tests/string.test.ts:458:51
    456|   expect(() => httpUrl.parse("mailto:asdf@lckj.com")).toThrow();
    457|   // missing // after protocol
    458|   expect(() => httpUrl.parse("http:example.com")).toThrow();
       |                                                   ^
    459|   expect(() => httpUrl.parse("https:example.com")).toThrow();
    460|   // missing one /

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 93 passed (94)
Type Errors  no errors
   Start at  15:52:37
   Duration  6.68s (transform 1.23s, setup 27ms, collect 1.52s, tests 105ms, environment 0ms, prepare 5ms, typecheck 4.86s)


</test_output>

Relevant test snippet:
<test_snippet path="packages/zod/src/v4/classic/tests/string.test.ts" lines="432-487">
  httpUrl.parse("https://sub.example.com");
  httpUrl.parse("http://sub.example.com");
  // paths
  httpUrl.parse("https://example.com/path/to/resource");
  httpUrl.parse("http://example.com/path/to/resource");
  // query parameters
  httpUrl.parse("https://example.com/path?query=param");
  httpUrl.parse("http://example.com/path?query=param");
  // fragment identifiers
  httpUrl.parse("https://example.com/path#fragment");
  httpUrl.parse("http://example.com/path#fragment");
  // fails
  expect(() => httpUrl.parse("ftp://example.com")).toThrow();
  expect(() => httpUrl.parse("shttp://example.com")).toThrow();
  expect(() => httpUrl.parse("httpz://example.com")).toThrow();
  expect(() => httpUrl.parse("http://")).toThrow();
  expect(() => httpUrl.parse("http://localhost")).toThrow();
  expect(() => httpUrl.parse("http://-asdf.com")).toThrow();
  expect(() =>
    httpUrl.parse(
      "http://asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf.com"
    )
  ).toThrow();
  expect(() => httpUrl.parse("http://asdf.c")).toThrow();
  expect(() => httpUrl.parse("mailto:asdf@lckj.com")).toThrow();
  // missing // after protocol
  expect(() => httpUrl.parse("http:example.com")).toThrow();
  expect(() => httpUrl.parse("https:example.com")).toThrow();
  // missing one /
  expect(() => httpUrl.parse("https:/www.google.com")).toThrow();
  expect(() => httpUrl.parse("http:/example.com")).toThrow();
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

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/classic/schemas.ts" lines="494-544">
  return core._uuidv6(ZodUUID, params);
}

// ZodUUIDv7

export function uuidv7(params?: string | core.$ZodUUIDv7Params): ZodUUID {
  return core._uuidv7(ZodUUID, params);
}

// ZodURL
export interface ZodURL extends ZodStringFormat<"url"> {
  _zod: core.$ZodURLInternals;
}
export const ZodURL: core.$constructor<ZodURL> = /*@__PURE__*/ core.$constructor("ZodURL", (inst, def) => {
  // ZodStringFormat.init(inst, def);
  core.$ZodURL.init(inst, def);
  ZodStringFormat.init(inst, def);
});

export function url(params?: string | core.$ZodURLParams): ZodURL {
  return core._url(ZodURL, params);
}

export function httpUrl(params?: string | Omit<core.$ZodURLParams, "protocol" | "hostname">): ZodURL {
  return core._url(ZodURL, {
    protocol: /^https?$/,
    hostname: core.regexes.domain,
    ...util.normalizeParams(params),
  });
}

// ZodEmoji
export interface ZodEmoji extends ZodStringFormat<"emoji"> {
  _zod: core.$ZodEmojiInternals;
}
export const ZodEmoji: core.$constructor<ZodEmoji> = /*@__PURE__*/ core.$constructor("ZodEmoji", (inst, def) => {
  // ZodStringFormat.init(inst, def);
  core.$ZodEmoji.init(inst, def);
  ZodStringFormat.init(inst, def);
});

export function emoji(params?: string | core.$ZodEmojiParams): ZodEmoji {
  return core._emoji(ZodEmoji, params);
}

// ZodNanoID
export interface ZodNanoID extends ZodStringFormat<"nanoid"> {
  _zod: core.$ZodNanoIDInternals;
}
export const ZodNanoID: core.$constructor<ZodNanoID> = /*@__PURE__*/ core.$constructor("ZodNanoID", (inst, def) => {
  // ZodStringFormat.init(inst, def);
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/regexes.ts" lines="58-108">
}

export const ipv4: RegExp =
  /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
export const ipv6: RegExp =
  /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
export const mac = (delimiter?: string): RegExp => {
  const escapedDelim = util.escapeRegex(delimiter ?? ":");
  return new RegExp(`^(?:[0-9A-F]{2}${escapedDelim}){5}[0-9A-F]{2}$|^(?:[0-9a-f]{2}${escapedDelim}){5}[0-9a-f]{2}$`);
};
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
// E.164: leading digit must be 1-9; total digits (excluding '+') between 7-15
export const e164: RegExp = /^\+[1-9]\d{6,14}$/;

// const dateSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
export const date: RegExp = /*@__PURE__*/ new RegExp(`^${dateSource}$`);

function timeSource(args: { precision?: number | null | undefined }) {
  const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
  const regex =
    typeof args.precision === "number"
      ? args.precision === -1
        ? `${hhmm}`
        : args.precision === 0
          ? `${hhmm}:[0-5]\\d`
          : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}`
      : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
  return regex;
}
export function time(args: {
  precision?: number | null;
  // local?: boolean;
}): RegExp {
  return new RegExp(`^${timeSource(args)}$`);
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/schemas.ts" lines="455-505">
    def.pattern ??= regexes.email;
    $ZodStringFormat.init(inst, def);
  }
);

//////////////////////////////   ZodURL   //////////////////////////////

export interface $ZodURLDef extends $ZodStringFormatDef<"url"> {
  hostname?: RegExp | undefined;
  protocol?: RegExp | undefined;
  normalize?: boolean | undefined;
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
      // Trim whitespace from input
      const trimmed = payload.value.trim();
      // @ts-ignore
      const url = new URL(trimmed);

      if (def.hostname) {
        def.hostname.lastIndex = 0;
        if (!def.hostname.test(url.hostname)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid hostname",
            pattern: def.hostname.source,
            input: payload.value,
            inst,
            continue: !def.abort,
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
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/mini/schemas.ts" lines="178-228">

// ZodMiniUUIDv7

// @__NO_SIDE_EFFECTS__
export function uuidv7(params?: string | core.$ZodUUIDv7Params): ZodMiniUUID {
  return core._uuidv7(ZodMiniUUID, params);
}

// ZodMiniURL
export interface ZodMiniURL extends _ZodMiniString<core.$ZodURLInternals> {
  // _zod: core.$ZodURLInternals;
}
export const ZodMiniURL: core.$constructor<ZodMiniURL> = /*@__PURE__*/ core.$constructor("ZodMiniURL", (inst, def) => {
  core.$ZodURL.init(inst, def);
  ZodMiniStringFormat.init(inst, def);
});

// @__NO_SIDE_EFFECTS__
export function url(params?: string | core.$ZodURLParams): ZodMiniURL {
  return core._url(ZodMiniURL, params);
}

// @__NO_SIDE_EFFECTS__
export function httpUrl(params?: string | Omit<core.$ZodURLParams, "protocol" | "hostname">): ZodMiniURL {
  return core._url(ZodMiniURL, {
    protocol: /^https?$/,
    hostname: core.regexes.domain,
    ...util.normalizeParams(params),
  });
}

// ZodMiniEmoji
export interface ZodMiniEmoji extends _ZodMiniString<core.$ZodEmojiInternals> {
  // _zod: core.$ZodEmojiInternals;
}
export const ZodMiniEmoji: core.$constructor<ZodMiniEmoji> = /*@__PURE__*/ core.$constructor(
  "ZodMiniEmoji",
  (inst, def) => {
    core.$ZodEmoji.init(inst, def);
    ZodMiniStringFormat.init(inst, def);
  }
);

// @__NO_SIDE_EFFECTS__
export function emoji(params?: string | core.$ZodEmojiParams): ZodMiniEmoji {
  return core._emoji(ZodMiniEmoji, params);
}

// ZodMiniNanoID
export interface ZodMiniNanoID extends _ZodMiniString<core.$ZodNanoIDInternals> {
  // _zod: core.$ZodNanoIDInternals;
</production_snippet>
