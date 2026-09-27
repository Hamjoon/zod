# Prompt identity: gen-n124-run2 + gen-n124-tail vs gen-n60

Scope: the 60 functions of `api-sample-n60-s20260919.json`. Non-retry prompts are those whose recorded provenance contains no `RetryWithError` step. Comparison is of exact prompt file text, as multisets per function. Prompt IDs are written `<run>:<id>`.

Mapping method: testpilot2 generates functions one at a time in `api.json` order, and each function's prompts begin with its Base prompt (empty provenance). Each prompt is assigned to the function whose block contains it (walk prompts in id order, advance to the next function at each Base prompt). The script asserts that this agrees with the tool's `tests[].api` for the first prompt ID of every test; it does in every run used here. `tests[].api` alone is not used because the tool merges identical tests across functions (in gen-n124-run2 the seven empty completions of seven functions form one test, `test_110.js`, recorded under `zod.z.url`), and prompt-text matching is ambiguous.

## Non-retry prompts

| Measure | Value |
| --- | ---: |
| Non-retry prompts, gen-n60 | 236 |
| Non-retry prompts, gen-n124-run2 + gen-n124-tail | 236 |
| Identical (multiset intersection) | 232 |
| Functions with identical multisets | 58 of 60 |

Result: **MISMATCH**.

### First three mismatches

#### zod.z.nullish

Only in gen-n60: [('gen-n60:25', 'FunctionBodyIncluder+SnippetIncluder'), ('gen-n60:27', 'SnippetIncluder')]; only in gen-n124-run2 + gen-n124-tail: [('gen-n124-run2:437', 'FunctionBodyIncluder+SnippetIncluder'), ('gen-n124-run2:438', 'SnippetIncluder')]

```diff
--- gen-n60:25
+++ gen-n124-run2:437
@@ -15,7 +15,7 @@
 // usage #1
 const stringOrNumber = z.string().or(z.number());``` */}{/* **Optional string validation:**To validate an optional form input, you can union the desired string validation with an empty string [literal](#literals).This example validates an input that is optional but needs to contain a [valid URL](#strings):```tsconst optionalUrl = z.union([z.string().url().nullish(), z.literal("")]);console.log(optionalUrl.safeParse(undefined).success); // trueconsole.log(optionalUrl.safeParse(null).success); // trueconsole.log(optionalUrl.safeParse("").success); // trueconsole.log(optionalUrl.safeParse("https://zod.dev").success); // trueconsole.log(optionalUrl.safeParse("not a valid url").success); // false
 // usage #2
-import * as z from "zod";const mySchema = z.string();// parsingmySchema.parse(data);mySchema.safeParse(data);mySchema.parseAsync(data);mySchema.safeParseAsync(data);// refinementsmySchema.refine(refinementFunc);mySchema.superRefine(refinementFunc); // deprecated, use `.check()`mySchema.overwrite(overwriteFunc);// wrappersmySchema.optional();mySchema.nonoptional();mySchema.nullable();
+const optionalUrl = z.union([z.string().url().nullish(), z.literal("")]);console.log(optionalUrl.safeParse(undefined).success); // trueconsole.log(optionalUrl.safeParse(null).success); // trueconsole.log(optionalUrl.safeParse("").success); // trueconsole.log(optionalUrl.safeParse("https://zod.dev").success); // trueconsole.log(optionalUrl.safeParse("not a valid url").success); // false
 // usage #3
 const nullishString = z.string().nullish(); // string | null | undefined// equivalent toz.string().nullable().optional();
 ```
```

#### zod.z.uppercase

Only in gen-n60: [('gen-n60:216', 'FunctionBodyIncluder+SnippetIncluder'), ('gen-n60:219', 'SnippetIncluder')]; only in gen-n124-run2 + gen-n124-tail: [('gen-n124-run2:666', 'FunctionBodyIncluder+SnippetIncluder'), ('gen-n124-run2:669', 'SnippetIncluder')]

```diff
--- gen-n60:216
+++ gen-n124-run2:666
@@ -17,11 +17,11 @@
 You may use the following examples to guide your implementation:
 ```
 // usage #1
+z.string().max(5);z.string().min(5);z.string().length(5);z.string().regex(/^[a-z]+$/);z.string().startsWith("aaa");z.string().endsWith("zzz");z.string().includes("---");z.string().uppercase();z.string().lowercase();
+// usage #2
+z.string().check(z.maxLength(5));z.string().check(z.minLength(5));z.string().check(z.length(5));z.string().check(z.regex(/^[a-z]+$/));z.string().check(z.startsWith("aaa"));z.string().check(z.endsWith("zzz"));z.string().check(z.includes("---"));z.string().check(z.uppercase());z.string().check(z.lowercase());
+// usage #3
 z.lt(value);z.lte(value); // alias: z.maximum()z.gt(value);z.gte(value); // alias: z.minimum()z.positive();z.negative();z.nonpositive();z.nonnegative();z.multipleOf(value);z.maxSize(value);z.minSize(value);z.size(value);z.maxLength(value);z.minLength(value);z.length(value);z.regex(regex);z.lowercase();z.uppercase();z.includes(value);z.startsWith(value);
-// usage #2
-import * as z from "zod/mini";// custom checksz.refine();// first-class checksz.lt(value);z.lte(value); // alias: z.maximum()z.gt(value);z.gte(value); // alias: z.minimum()z.positive();z.negative();z.nonpositive();z.nonnegative();z.multipleOf(value);z.maxSize(value);z.minSize(value);z.size(value);z.maxLength(value);z.minLength(value);
-// usage #3
-z.string().max(5);z.string().min(5);z.string().length(5);z.string().regex(/^[a-z]+$/);z.string().startsWith("aaa");z.string().endsWith("zzz");z.string().includes("---");z.string().uppercase();z.string().lowercase();
 ```
 
 Please proceed by modifying the following code fragment
```

## Per function

| API | Non-retry prompts gen-n60 | Non-retry prompts gen-n124-run2 + gen-n124-tail | Identical | Same multiset |
| --- | ---: | ---: | ---: | --- |
| zod.z.any | 4 | 4 | 4 | yes |
| zod.z.array | 4 | 4 | 4 | yes |
| zod.z.base64 | 4 | 4 | 4 | yes |
| zod.z.boolean | 4 | 4 | 4 | yes |
| zod.z.catch | 4 | 4 | 4 | yes |
| zod.z.check | 4 | 4 | 4 | yes |
| zod.z.cidrv4 | 4 | 4 | 4 | yes |
| zod.z.cidrv6 | 4 | 4 | 4 | yes |
| zod.z.coerce.boolean | 4 | 4 | 4 | yes |
| zod.z.coerce.number | 4 | 4 | 4 | yes |
| zod.z.cuid2 | 4 | 4 | 4 | yes |
| zod.z.date | 4 | 4 | 4 | yes |
| zod.z.discriminatedUnion | 4 | 4 | 4 | yes |
| zod.z.email | 4 | 4 | 4 | yes |
| zod.z.endsWith | 4 | 4 | 4 | yes |
| zod.z.file | 4 | 4 | 4 | yes |
| zod.z.gte | 4 | 4 | 4 | yes |
| zod.z.guid | 4 | 4 | 4 | yes |
| zod.z.int64 | 4 | 4 | 4 | yes |
| zod.z.iso.duration | 4 | 4 | 4 | yes |
| zod.z.iso.time | 4 | 4 | 4 | yes |
| zod.z.keyof | 4 | 4 | 4 | yes |
| zod.z.ksuid | 2 | 2 | 2 | yes |
| zod.z.looseObject | 4 | 4 | 4 | yes |
| zod.z.lt | 4 | 4 | 4 | yes |
| zod.z.map | 4 | 4 | 4 | yes |
| zod.z.maxSize | 4 | 4 | 4 | yes |
| zod.z.minLength | 4 | 4 | 4 | yes |
| zod.z.multipleOf | 4 | 4 | 4 | yes |
| zod.z.nanoid | 4 | 4 | 4 | yes |
| zod.z.negative | 4 | 4 | 4 | yes |
| zod.z.never | 4 | 4 | 4 | yes |
| zod.z.nonoptional | 4 | 4 | 4 | yes |
| zod.z.nonpositive | 4 | 4 | 4 | yes |
| zod.z.nullable | 4 | 4 | 4 | yes |
| zod.z.nullish | 4 | 4 | 2 | **no** |
| zod.z.number | 4 | 4 | 4 | yes |
| zod.z.overwrite | 4 | 4 | 4 | yes |
| zod.z.parse | 4 | 4 | 4 | yes |
| zod.z.parseAsync | 4 | 4 | 4 | yes |
| zod.z.positive | 4 | 4 | 4 | yes |
| zod.z.prefault | 4 | 4 | 4 | yes |
| zod.z.preprocess | 4 | 4 | 4 | yes |
| zod.z.property | 2 | 2 | 2 | yes |
| zod.z.readonly | 4 | 4 | 4 | yes |
| zod.z.safeParse | 4 | 4 | 4 | yes |
| zod.z.size | 4 | 4 | 4 | yes |
| zod.z.strictObject | 4 | 4 | 4 | yes |
| zod.z.symbol | 4 | 4 | 4 | yes |
| zod.z.templateLiteral | 4 | 4 | 4 | yes |
| zod.z.transform | 4 | 4 | 4 | yes |
| zod.z.trim | 4 | 4 | 4 | yes |
| zod.z.tuple | 4 | 4 | 4 | yes |
| zod.z.uint32 | 4 | 4 | 4 | yes |
| zod.z.ulid | 4 | 4 | 4 | yes |
| zod.z.unknown | 4 | 4 | 4 | yes |
| zod.z.uppercase | 4 | 4 | 2 | **no** |
| zod.z.uuid | 4 | 4 | 4 | yes |
| zod.z.uuidv6 | 4 | 4 | 4 | yes |
| zod.z.uuidv7 | 4 | 4 | 4 | yes |

## snippetMap.json

`snippetMap.json` is keyed by the function name without namespace (so `zod.z.number` and `zod.z.coerce.number` share the key `number`); for a multi-run side the maps are merged (the script asserts that runs agree on shared keys). Keys of the shared functions: 58; present in gen-n60: 58; present in gen-n124-run2 + gen-n124-tail: 58; identical entries: 56; differing: ['nullish', 'uppercase'].
