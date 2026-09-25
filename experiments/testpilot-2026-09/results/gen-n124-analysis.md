# Generation analysis

All figures derive from recorded artifacts; no tests are regenerated. Passing rates use tests as the denominator. Refiner combinations are the distinct immediate provenance labels recorded for a prompt; deduplicated tests may trace to multiple prompts and combinations, so refiner counts overlap.

Runs combined: `gen-n124-run2`, `gen-n124-tail`. Prompt IDs are written `<run>:<id>`; test names repeat across runs, so each test is identified by its run and test name.

| Metric | Value |
| --- | --- |
| functions | 124 |
| functionsWithTests | 124 |
| functionsWithPasses | 112 |
| prompts | 763 |
| emptyCompletionPrompts | 7 |
| multipleItPrompts | 1 |
| tests | 757 |
| statuses | {"PASSED": 266, "FAILED": 491} |

| Stratum | Functions | Tests | Passing | Pass rate |
| --- | --- | --- | --- | --- |
| S | 74 | 438 | 172 | 39.27% |
| C | 35 | 231 | 57 | 24.68% |
| Q | 15 | 88 | 37 | 42.05% |

## Per function

| API | Tests | Passing | Failing | First failing message |
| --- | --- | --- | --- | --- |
| zod.z.any | 4 | 4 | 0 |  |
| zod.z.array | 7 | 1 | 6 | Cannot read properties of undefined (reading 'onattach') |
| zod.z.base64 | 4 | 4 | 0 |  |
| zod.z.base64url | 6 | 3 | 3 | Got unwanted exception: Valid Base64URL string should not throw Actual message: "Expected values to be strictly equal: + |
| zod.z.bigint | 6 | 3 | 3 | parse should throw on non‑bigint values |
| zod.z.boolean | 8 | 2 | 6 | The input did not match the regular expression /Expected boolean/. Input:  '[\n' +   '  {\n' +   '    "expected": "boole |
| zod.z.catch | 6 | 2 | 4 | The expression evaluated to a falsy value:    assert(ctx.error instanceof zod.ZodError)  |
| zod.z.check | 6 | 2 | 4 | Missing expected exception: zod.z.check did not throw for a non‑function |
| zod.z.cidrv4 | 4 | 4 | 0 |  |
| zod.z.cidrv6 | 4 | 4 | 0 |  |
| zod.z.coerce.bigint | 6 | 4 | 2 | Parsing a non‑numeric string should throw a ZodError |
| zod.z.coerce.boolean | 7 | 2 | 5 | Expected values to be strictly equal:  true !== false  |
| zod.z.coerce.date | 7 | 3 | 4 | The input did not match the regular expression /Invalid date/. Input:  '[\n' +   '  {\n' +   '    "expected": "date",\n' |
| zod.z.coerce.number | 6 | 2 | 4 | The input did not match the regular expression /Expected number/. Input:  '[\n' +   '  {\n' +   '    "expected": "number |
| zod.z.coerce.string | 7 | 3 | 4 | Missing expected exception. |
| zod.z.cuid | 5 | 2 | 3 | Valid CUID should be returned unchanged + actual - expected  + ZodCUID { +   '~standard': { +     validate: [Function: v |
| zod.z.cuid2 | 7 | 1 | 6 | Missing expected exception. |
| zod.z.custom | 5 | 3 | 2 | Cannot read properties of undefined (reading '0') |
| zod.z.date | 7 | 1 | 6 | Missing expected exception. |
| zod.z.discriminatedUnion | 7 | 3 | 4 | The input did not match the regular expression /required/. Input:  '[\n' +   '  {\n' +   '    "code": "invalid_union",\n |
| zod.z.e164 | 4 | 4 | 0 |  |
| zod.z.email | 7 | 1 | 6 | Missing expected exception: Invalid email did not throw an error |
| zod.z.emoji | 5 | 3 | 2 | Error should contain validation issues |
| zod.z.endsWith | 8 | 1 | 7 | The input did not match the regular expression /Invalid input/. Input:  '[\n' +   '  {\n' +   '    "origin": "string",\n |
| zod.z.enum | 8 | 1 | 7 | Cannot read properties of undefined (reading 'map') |
| zod.z.file | 8 | 0 | 8 | [   {     "expected": "file",     "code": "invalid_type",     "path": [],     "message": "Invalid input: expected file,  |
| zod.z.float32 | 7 | 2 | 5 | Got unwanted exception. Actual message: "float32Validator is not a function" |
| zod.z.float64 | 7 | 2 | 5 | Expected values to be strictly equal:  'object' !== 'number'  |
| zod.z.getErrorMap | 4 | 1 | 3 | Expected values to be strictly equal: + actual - expected  + 'undefined' - 'function'  |
| zod.z.gt | 7 | 2 | 5 | check type should be "greater_than" + actual - expected  + undefined - 'greater_than'  |
| zod.z.gte | 7 | 1 | 6 | Got unwanted exception: 5 should be valid (equal to 5) Actual message: "No known validation method on schema" |
| zod.z.guid | 7 | 2 | 5 | Expected values to be strictly equal:  'object' !== 'string'  |
| zod.z.includes | 7 | 1 | 6 | check type should be string_format + actual - expected  + undefined - 'string_format'  |
| zod.z.instanceof | 5 | 3 | 2 | Expected ZodError to contain an errors array |
| zod.z.int | 5 | 3 | 2 | The input did not match the regular expression /Expected integer/. Input:  '[\n' +   '  {\n' +   '    "expected": "int", |
| zod.z.int32 | 6 | 2 | 4 | The input did not match the regular expression /Invalid/. Input:  '[\n' +   '  {\n' +   '    "origin": "number",\n' +    |
| zod.z.int64 | 6 | 3 | 3 | Got unwanted exception. Actual message: "[   {     "expected": "bigint",     "code": "invalid_type",     "path": [],     |
| zod.z.intersection | 6 | 1 | 5 | zod.object(...).intersection is not a function |
| zod.z.ipv4 | 5 | 4 | 1 | Expected values to be strictly deep-equal: + actual - expected  + ZodIPv4 { +   '~standard': { +     validate: [Function |
| zod.z.ipv6 | 7 | 3 | 4 | Missing expected exception: Invalid IPv6 address did not throw |
| zod.z.iso.date | 7 | 3 | 4 | Result should be a Date object |
| zod.z.iso.datetime | 6 | 2 | 4 | Cannot read properties of undefined (reading '0') |
| zod.z.iso.duration | 7 | 3 | 4 | The input did not match the regular expression /ZodError/. Input:  '[\n' +   '  {\n' +   '    "origin": "string",\n' +   |
| zod.z.iso.time | 5 | 3 | 2 | Expected "12:34:56Z" to be valid  false !== true  |
| zod.z.json | 4 | 0 | 4 | Invalid syntax |
| zod.z.jwt | 5 | 3 | 2 | [   {     "code": "invalid_format",     "format": "jwt",     "path": [],     "message": "Invalid JWT"   } ] |
| zod.z.keyof | 8 | 0 | 8 | keyof should return a ZodEnum |
| zod.z.ksuid | 3 | 1 | 2 | KSUID should be a string  'object' !== 'string'  |
| zod.z.lazy | 4 | 4 | 0 |  |
| zod.z.length | 7 | 1 | 6 | Expected values to be strictly equal: + actual - expected  + undefined - 'length_equals'  |
| zod.z.literal | 4 | 4 | 0 |  |
| zod.z.looseObject | 5 | 4 | 1 | The input did not match the regular expression /Expected string/. Input:  '[\n' +   '  {\n' +   '    "expected": "string |
| zod.z.lowercase | 7 | 1 | 6 | Expected values to be strictly equal: + actual - expected  + undefined - 'string_format'  |
| zod.z.lt | 8 | 0 | 8 | 3 < 5 should be true + actual - expected  + $ZodCheckLessThan {} - true  |
| zod.z.lte | 8 | 1 | 7 | 3 <= 5 should be true + actual - expected  + $ZodCheckLessThan {} - true  |
| zod.z.map | 7 | 2 | 5 | Should reject map with non‑number value |
| zod.z.maxLength | 7 | 2 | 5 | zod.string(...).maxLength is not a function |
| zod.z.maxSize | 8 | 2 | 6 | zod.z.string(...).maxSize is not a function |
| zod.z.mime | 8 | 0 | 8 | Expected values to be strictly equal: + actual - expected  + $ZodCheckMimeType {} - 'text/plain'  |
| zod.z.minLength | 8 | 0 | 8 | validator.safeParse is not a function |
| zod.z.minSize | 7 | 1 | 6 | zod.z.set(...).minSize is not a function |
| zod.z.multipleOf | 6 | 2 | 4 | Expected values to be strictly equal: + actual - expected  + $ZodCheckMultipleOf {} - true  |
| zod.z.nan | 6 | 2 | 4 | Cannot read properties of undefined (reading '0') |
| zod.z.nanoid | 7 | 1 | 6 | nanoid should return a string  'object' !== 'string'  |
| zod.z.nativeEnum | 6 | 1 | 5 | The input did not match the regular expression /Invalid enum value/. Input:  '[\n' +   '  {\n' +   '    "code": "invalid |
| zod.z.negative | 8 | 1 | 7 | schema.parse is not a function |
| zod.z.never | 4 | 3 | 1 |  TypeError: Cannot read properties of undefined (reading 'describe')     at exports.describe (/work/zod/node_modules/.pn |
| zod.z.nonnegative | 8 | 0 | 8 | Got unwanted exception. Actual message: "schema.parse is not a function" |
| zod.z.nonoptional | 7 | 2 | 5 | The input did not match the regular expression /Required/. Input:  '[\n' +   '  {\n' +   '    "expected": "string",\n' + |
| zod.z.nonpositive | 8 | 3 | 5 | Missing expected exception. |
| zod.z.normalize | 4 | 1 | 3 | Expected values to be strictly deep-equal: + actual - expected  + $ZodCheckOverwrite {} - { -   age: 30, -   name: 'Alic |
| zod.z.null | 6 | 2 | 4 | Cannot read properties of undefined (reading '0') |
| zod.z.nullable | 6 | 4 | 2 | inner type should be string  ... Skipped lines ZodString {   '~standard': {     validate: [Function: validate],     vend |
| zod.z.nullish | 5 | 3 | 2 | The input did not match the regular expression /Expected string/. Input:  '[\n' +   '  {\n' +   '    "expected": "string |
| zod.z.number | 5 | 3 | 2 | Cannot read properties of undefined (reading 'some') |
| zod.z.object | 7 | 2 | 5 | Cannot read properties of undefined (reading 'some') |
| zod.z.optional | 7 | 3 | 4 | Parsing null should throw a validation error |
| zod.z.overwrite | 6 | 2 | 4 | check property should be "overwrite" + actual - expected  + undefined - 'overwrite'  |
| zod.z.parse | 6 | 2 | 4 | Expected $ZodAsyncError for async schema + actual - expected  + 'Error' - '$ZodAsyncError'  |
| zod.z.parseAsync | 6 | 3 | 3 | Cannot read properties of undefined (reading 'map') |
| zod.z.partialRecord | 6 | 3 | 3 | Missing expected exception. |
| zod.z.pipe | 8 | 0 | 8 | Pipe should reject non‑integer numbers |
| zod.z.positive | 6 | 3 | 3 | Got unwanted exception. Actual message: "schema.parse is not a function" |
| zod.z.prefault | 6 | 3 | 3 | [   {     "origin": "string",     "code": "too_small",     "minimum": 3,     "inclusive": true,     "path": [],     "mes |
| zod.z.preprocess | 4 | 4 | 0 |  |
| zod.z.promise | 6 | 2 | 4 | Timeout of 2000ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it reso |
| zod.z.property | 4 | 0 | 4 | Got unwanted exception. Actual message: "ageSchema.parse is not a function" |
| zod.z.readonly | 6 | 3 | 3 | Expected values to be strictly equal: + actual - expected  + undefined - 'ZodReadonly'  |
| zod.z.record | 7 | 1 | 6 | Error should be a ZodError with an errors array |
| zod.z.refine | 6 | 2 | 4 | Expected a ZodError with an errors array |
| zod.z.regex | 8 | 1 | 7 | schema.parse is not a function |
| zod.z.safeParse | 7 | 1 | 6 | should throw a ZodAsyncError for async schemas |
| zod.z.safeParseAsync | 4 | 4 | 0 |  |
| zod.z.set | 6 | 2 | 4 | Parsing a Set with wrong element type should throw |
| zod.z.setErrorMap | 3 | 1 | 2 | Cannot read properties of undefined (reading '0') |
| zod.z.size | 8 | 2 | 6 | sizeValidator.validate is not a function |
| zod.z.startsWith | 7 | 0 | 7 | Cannot read properties of undefined (reading '0') |
| zod.z.strictObject | 7 | 3 | 4 | The input did not match the regular expression /Required\|missing/i. Input:  '[\n' +   '  {\n' +   '    "expected": "numb |
| zod.z.string | 7 | 3 | 4 | The input did not match the regular expression /Expected string/. Input:  '[\n' +   '  {\n' +   '    "expected": "string |
| zod.z.stringFormat | 2 | 2 | 0 |  |
| zod.z.stringbool | 8 | 3 | 5 | [   {     "expected": "string",     "code": "invalid_type",     "path": [],     "message": "Invalid input: expected stri |
| zod.z.success | 4 | 2 | 2 | Expected values to be strictly deep-equal: + actual - expected  + ZodSuccess { +   '~standard': { +     validate: [Funct |
| zod.z.superRefine | 5 | 3 | 2 | Cannot read properties of undefined (reading 'map') |
| zod.z.symbol | 4 | 4 | 0 |  |
| zod.z.templateLiteral | 7 | 2 | 5 | Got unwanted exception. Actual message: "[   {     "code": "invalid_format",     "format": "template_literal",     "patt |
| zod.z.toLowerCase | 6 | 3 | 3 | schema.parse is not a function |
| zod.z.toUpperCase | 6 | 4 | 2 | upper is not a function |
| zod.z.transform | 7 | 2 | 5 | Expected a ZodError to be thrown |
| zod.z.trim | 7 | 2 | 5 | The input did not match the regular expression /Expected string/. Input:  '[\n' +   '  {\n' +   '    "expected": "string |
| zod.z.tuple | 7 | 2 | 5 | Tuple should reject input with wrong length |
| zod.z.uint32 | 6 | 2 | 4 | The input did not match the regular expression /Invalid/. Input:  '[\n' +   '  {\n' +   '    "origin": "number",\n' +    |
| zod.z.uint64 | 7 | 2 | 5 | Expected values to be strictly equal:  false !== true  |
| zod.z.ulid | 6 | 2 | 4 | Invalid ULID should cause a ZodError |
| zod.z.undefined | 6 | 3 | 3 | Parsing null should throw |
| zod.z.union | 7 | 0 | 7 | Cannot read properties of undefined (reading '0') |
| zod.z.unknown | 4 | 4 | 0 |  |
| zod.z.uppercase | 7 | 2 | 5 | Missing expected exception. |
| zod.z.url | 6 | 1 | 5 | Invalid syntax |
| zod.z.uuid | 7 | 1 | 6 | The input did not match the regular expression /Invalid uuid/. Input:  '[\n' +   '  {\n' +   '    "origin": "string",\n' |
| zod.z.uuidv4 | 5 | 3 | 2 | uuid should be a string |
| zod.z.uuidv6 | 6 | 3 | 3 | Got unwanted exception: Parsing a valid UUID v6 should not throw Actual message: "[   {     "origin": "string",     "cod |
| zod.z.uuidv7 | 4 | 4 | 0 |  |
| zod.z.void | 7 | 2 | 5 | The input did not match the regular expression /Expected void/. Input:  '[\n' +   '  {\n' +   '    "expected": "void",\n |
| zod.z.xid | 4 | 0 | 4 | Expected values to be strictly equal:  'object' !== 'string'  |

## Failure categories

| Category | Count |
| --- | --- |
| assertion | 331 |
| file-system | 0 |
| correctness | 140 |
| timeout | 3 |
| other | 17 |

First three other messages:

- [
  {
    "expected": "string",
    "code": "invalid_type",
    "path": [],
    "message": "Invalid input: expected string, received boolean"
  }
]
- [
  {
    "expected": "string",
    "code": "invalid_type",
    "path": [],
    "message": "Invalid input: expected string, received boolean"
  }
]
- 
Error: Cannot find module 'uuid'
Require stack:
- /path/to/test/test_104.js
    at Function._resolveFilename (node:internal/modules/cjs/loader:1430:15)
    at defaultResolveImpl (node:internal/modules/cjs/loader:1040:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1045:22)
    at Function._load (node:internal/modules/cjs/loader:1216:25)
    at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)
    at Module.require (node:internal/modules/cjs/loader:1527:12)
    at require (node:internal/modules/helpers:147:16)
    at Object.<anonymous> (/path/to/test/test_104.js:6:24)
    at Module._compile (node:internal/modules/cjs/loader:1781:14)
    at Module.replacementCompile (/work/testpilot2/node_modules/append-transform/index.js:60:13)
    at node:internal/modules/cjs/loader:1913:10
    at Object.<anonymous> (/work/testpilot2/node_modules/append-transform/index.js:64:4)
    at Module.load (node:internal/modules/cjs/loader:1505:32)
    at Function._load (node:internal/modules/cjs/loader:1309:12)
    at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)
    at loadCJSModuleWithModuleLoad (node:internal/modules/esm/translators:335:3)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/translators:235:7)
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async formattedImport (/work/testpilot2/node_modules/mocha/lib/nodejs/esm-utils.js:7:14)
    at async exports.requireOrImport (/work/testpilot2/node_modules/mocha/lib/nodejs/esm-utils.js:38:28)
    at async exports.loadFilesAsync (/work/testpilot2/node_modules/mocha/lib/nodejs/esm-utils.js:91:20)
    at async singleRun (/work/testpilot2/node_modules/mocha/lib/cli/run-helpers.js:125:3)
    at async exports.handler (/work/testpilot2/node_modules/mocha/lib/cli/run.js:370:5)


## Refiner effects

| Recorded refiner combination | Prompts | Passing tests tracing here |
| --- | --- | --- |
| Base | 124 | 49 |
| FunctionBodyIncluder | 124 | 47 |
| FunctionBodyIncluder+SnippetIncluder | 115 | 50 |
| RetryWithError | 285 | 78 |
| SnippetIncluder | 115 | 42 |

## Prompt lengths

| Min chars | Median | Max |
| --- | --- | --- |
| 187 | 1283 | 4147 |

| Length | Prompt ID | API |
| --- | --- | --- |
| 4147 | gen-n124-run2:454 | zod.z.success |
| 3787 | gen-n124-run2:347 | zod.z.discriminatedUnion |
| 3733 | gen-n124-run2:344 | zod.z.discriminatedUnion |

Prompts whose completion contains more than one `it(` (whitespace allowed): 1. IDs: ['gen-n124-run2:24']
Empty completion prompt IDs: ['gen-n124-run2:110', 'gen-n124-run2:131', 'gen-n124-run2:284', 'gen-n124-run2:350', 'gen-n124-run2:490', 'gen-n124-run2:565', 'gen-n124-run2:611']
