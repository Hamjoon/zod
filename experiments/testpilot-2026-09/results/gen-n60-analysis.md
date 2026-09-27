# Generation analysis

All figures derive from recorded artifacts; no tests are regenerated. Passing rates use tests as the denominator. Refiner combinations are the distinct immediate provenance labels recorded for a prompt; deduplicated tests may trace to multiple prompts and combinations, so refiner counts overlap.

| Metric | Value |
| --- | --- |
| functions | 60 |
| functionsWithTests | 60 |
| functionsWithPasses | 54 |
| prompts | 360 |
| emptyCompletionPrompts | 0 |
| multipleItPrompts | 0 |
| tests | 360 |
| statuses | {"FAILED": 221, "PASSED": 139} |

| Stratum | Functions | Tests | Passing | Pass rate |
| --- | --- | --- | --- | --- |
| S | 36 | 208 | 88 | 42.31% |
| C | 17 | 109 | 36 | 33.03% |
| Q | 7 | 43 | 15 | 34.88% |

## Per function

| API | Tests | Passing | Failing | First failing message |
| --- | --- | --- | --- | --- |
| zod.z.any | 4 | 4 | 0 |  |
| zod.z.array | 7 | 1 | 6 | Non‑array input should trigger invalid_type_error |
| zod.z.base64 | 4 | 4 | 0 |  |
| zod.z.boolean | 5 | 3 | 2 | The input did not match the regular expression /ZodError/. Input:  '[\n' +   '  {\n' +   '    "expected": "boolean",\n'  |
| zod.z.catch | 6 | 2 | 4 | ctx.error must be a ZodError |
| zod.z.check | 5 | 4 | 1 | Missing expected exception. |
| zod.z.cidrv4 | 4 | 4 | 0 |  |
| zod.z.cidrv6 | 7 | 1 | 6 | Invalid CIDR should throw a ZodError |
| zod.z.coerce.boolean | 8 | 1 | 7 | Failed to coerce "false"  true !== false  |
| zod.z.coerce.number | 7 | 1 | 6 | Missing expected exception (ZodError). |
| zod.z.cuid2 | 4 | 4 | 0 |  |
| zod.z.date | 7 | 2 | 5 | Missing expected exception. |
| zod.z.discriminatedUnion | 6 | 2 | 4 | The input did not match the regular expression /Expected string/. Input:  '[\n' +   '  {\n' +   '    "expected": "string |
| zod.z.email | 6 | 2 | 4 | test@example.com should be considered a valid email + actual - expected  + ZodEmail { +   '~standard': { +     validate: |
| zod.z.endsWith | 6 | 3 | 3 | check type should be string_format + actual - expected  + undefined - 'string_format'  |
| zod.z.file | 8 | 1 | 7 | Got unwanted exception. Actual message: "[   {     "expected": "file",     "code": "invalid_type",     "path": [],     " |
| zod.z.gte | 7 | 1 | 6 | Valid values threw an error: schema.parse is not a function |
| zod.z.guid | 5 | 3 | 2 | type should be "string" + actual - expected  + undefined - 'string'  |
| zod.z.int64 | 6 | 3 | 3 | Got unwanted exception: 0 should be valid Actual message: "[   {     "expected": "bigint",     "code": "invalid_type",   |
| zod.z.iso.duration | 8 | 1 | 7 | Invalid duration should be rejected |
| zod.z.iso.time | 6 | 2 | 4 | Got unwanted exception: Expected "09:08:07Z" to be accepted as a valid ISO time Actual message: "[   {     "origin": "st |
| zod.z.keyof | 8 | 1 | 7 | Expected values to be strictly equal: + actual - expected  + undefined - 'ZodEnum'  |
| zod.z.ksuid | 4 | 0 | 4 | KSUID should be a string  'object' !== 'string'  |
| zod.z.looseObject | 7 | 3 | 4 | The input did not match the regular expression /Required/. Input:  '[\n' +   '  {\n' +   '    "expected": "string",\n' + |
| zod.z.lt | 6 | 3 | 3 | check type should be "less_than" + actual - expected  + undefined - 'less_than'  |
| zod.z.map | 6 | 2 | 4 | mapSchema.validate is not a function |
| zod.z.maxSize | 8 | 0 | 8 | zod.z.instanceof(...).maxSize is not a function |
| zod.z.minLength | 8 | 1 | 7 | zod.z.string(...).minLength is not a function |
| zod.z.multipleOf | 6 | 3 | 3 | 10 should be a multiple of 5 + actual - expected  + $ZodCheckMultipleOf {} - true  |
| zod.z.nanoid | 6 | 2 | 4 | Expected values to be strictly equal:  'object' !== 'string'  |
| zod.z.negative | 7 | 3 | 4 | Got unwanted exception. Actual message: "schema.parse is not a function" |
| zod.z.never | 6 | 2 | 4 | Cannot read properties of undefined (reading '0') |
| zod.z.nonoptional | 6 | 3 | 3 | Cannot read properties of undefined (reading '0') |
| zod.z.nonpositive | 8 | 3 | 5 | Got unwanted exception: Expected 0 to be accepted Actual message: "schema.parse is not a function" |
| zod.z.nullable | 4 | 4 | 0 |  |
| zod.z.nullish | 6 | 4 | 2 | The input did not match the regular expression /Expected string/. Input:  '[\n' +   '  {\n' +   '    "expected": "string |
| zod.z.number | 8 | 0 | 8 | Cannot read properties of undefined (reading 'some') |
| zod.z.overwrite | 6 | 2 | 4 | Result should equal the input transaction object + actual - expected  + $ZodCheckOverwrite {} - { -   amount: 1000, -    |
| zod.z.parse | 5 | 3 | 2 | The validation function is expected to return "true". Received false  Caught error:  Error: Encountered Promise during s |
| zod.z.parseAsync | 5 | 3 | 2 | Cannot read properties of undefined (reading '0') |
| zod.z.positive | 7 | 2 | 5 | Got unwanted exception: Positive number 1 should be valid Actual message: "schema.parse is not a function" |
| zod.z.prefault | 5 | 3 | 2 | type should be "prefault" + actual - expected  + undefined - 'prefault'  |
| zod.z.preprocess | 4 | 4 | 0 |  |
| zod.z.property | 4 | 0 | 4 | Got unwanted exception. Actual message: "nameSchema.parse is not a function" |
| zod.z.readonly | 6 | 2 | 4 | Mutating a readonly object should throw |
| zod.z.safeParse | 4 | 4 | 0 |  |
| zod.z.size | 8 | 0 | 8 | Got unwanted exception. Actual message: "sizeThreeSchema.parse is not a function" |
| zod.z.strictObject | 6 | 2 | 4 | Expected an error for missing required keys |
| zod.z.symbol | 6 | 3 | 3 | Cannot read properties of undefined (reading '0') |
| zod.z.templateLiteral | 8 | 0 | 8 | Got unwanted exception. Actual message: "[   {     "code": "invalid_format",     "format": "template_literal",     "patt |
| zod.z.transform | 6 | 2 | 4 | Pipe schema should reject short strings |
| zod.z.trim | 6 | 4 | 2 | Missing expected exception. |
| zod.z.tuple | 7 | 1 | 6 | The input did not match the regular expression /Expected number/. Input:  '[\n' +   '  {\n' +   '    "expected": "number |
| zod.z.uint32 | 6 | 3 | 3 | The input did not match the regular expression /ZodError/. Input:  '[\n' +   '  {\n' +   '    "origin": "number",\n' +   |
| zod.z.ulid | 4 | 4 | 0 |  |
| zod.z.unknown | 4 | 4 | 0 |  |
| zod.z.uppercase | 7 | 1 | 6 | Expected values to be strictly equal: + actual - expected  + $ZodCheckUpperCase {} - 'HELLO WORLD'  |
| zod.z.uuid | 6 | 2 | 4 | Schema should contain a UUID check |
| zod.z.uuidv6 | 6 | 3 | 3 | Invalid UUID version should throw |
| zod.z.uuidv7 | 4 | 4 | 0 |  |

## Failure categories

| Category | Count |
| --- | --- |
| assertion | 156 |
| file-system | 0 |
| correctness | 54 |
| timeout | 2 |
| other | 9 |

First three other messages:

- 
Error: Cannot find module 'zod-to-json-schema'
Require stack:
- /path/to/test/test_21.js
    at Function._resolveFilename (node:internal/modules/cjs/loader:1430:15)
    at defaultResolveImpl (node:internal/modules/cjs/loader:1040:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1045:22)
    at Function._load (node:internal/modules/cjs/loader:1216:25)
    at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)
    at Module.require (node:internal/modules/cjs/loader:1527:12)
    at require (node:internal/modules/helpers:147:16)
    at Object.<anonymous> (/path/to/test/test_21.js:4:27)
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

- 
Error: Cannot find module 'nanoid'
Require stack:
- /path/to/test/test_82.js
    at Function._resolveFilename (node:internal/modules/cjs/loader:1430:15)
    at defaultResolveImpl (node:internal/modules/cjs/loader:1040:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1045:22)
    at Function._load (node:internal/modules/cjs/loader:1216:25)
    at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)
    at Module.require (node:internal/modules/cjs/loader:1527:12)
    at require (node:internal/modules/helpers:147:16)
    at Object.<anonymous> (/path/to/test/test_82.js:4:18)
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

- 
Error: Cannot find module 'nanoid'
Require stack:
- /path/to/test/test_84.js
    at Function._resolveFilename (node:internal/modules/cjs/loader:1430:15)
    at defaultResolveImpl (node:internal/modules/cjs/loader:1040:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1045:22)
    at Function._load (node:internal/modules/cjs/loader:1216:25)
    at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)
    at Module.require (node:internal/modules/cjs/loader:1527:12)
    at require (node:internal/modules/helpers:147:16)
    at Object.<anonymous> (/path/to/test/test_84.js:3:18)
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
| Base | 60 | 23 |
| FunctionBodyIncluder | 60 | 27 |
| FunctionBodyIncluder+SnippetIncluder | 58 | 29 |
| RetryWithError | 124 | 27 |
| SnippetIncluder | 58 | 33 |

## Prompt lengths

| Min chars | Median | Max |
| --- | --- | --- |
| 604 | 1315.5 | 3840 |

| Length | Prompt ID | API |
| --- | --- | --- |
| 3840 | 143 | zod.z.looseObject |
| 3475 | 138 | zod.z.email |
| 3360 | 72 | zod.z.tuple |

Prompts whose completion contains more than one `it(` (whitespace allowed): 0. IDs: []
Empty completion prompt IDs: []
