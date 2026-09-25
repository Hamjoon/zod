# Survival: n124 vs n60

Descriptive only. n60: `results/survival` with `results/gen-n60-passing.json` (139 tests); n124: `results/survival-n124` with `results/gen-n124-passing.json` (266 tests). A test survives a release when its status there is `pass`. The developer corpus (888 frozen v4.0.5 cases) is run in both.

## Release table

| Release | n60 LLM survivors | n124 LLM survivors | n60 dev passed | n124 dev passed |
| --- | ---: | ---: | ---: | ---: |
| v4.0.5 | 139/139 (100.00%) | 266/266 (100.00%) | 888/888 | 888/888 |
| v4.1.0 | 139/139 (100.00%) | 265/266 (99.62%) | 871/888 | 871/888 |
| v4.2.0 | 139/139 (100.00%) | 266/266 (100.00%) | 868/888 | 868/888 |
| v4.3.0 | 139/139 (100.00%) | 263/266 (98.87%) | 864/888 | 864/888 |
| v4.4.0 | 139/139 (100.00%) | 263/266 (98.87%) | 853/888 | 853/888 |
| v4.5.0 | 138/139 (99.28%) | 261/266 (98.12%) | 838/888 | 838/888 |
| v4.6.0 | 138/139 (99.28%) | 258/266 (96.99%) | 834/888 | 834/888 |

## The 60 shared functions

Survivors per release (survivors / tests of the function in S). "First break" is the first release at which any of the function's tests does not pass (the control v4.0.5 included). Functions whose first break differs between the runs: **10** (marked **≠**).

| Function | Run | v4.0.5 | v4.1.0 | v4.2.0 | v4.3.0 | v4.4.0 | v4.5.0 | v4.6.0 | First break | |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| zod.z.any | n60 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.any | n124 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.array | n60 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never |  |
| zod.z.array | n124 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never |  |
| zod.z.base64 | n60 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.base64 | n124 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.boolean | n60 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.boolean | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.catch | n60 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.catch | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.check | n60 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.check | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.cidrv4 | n60 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.cidrv4 | n124 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.cidrv6 | n60 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never |  |
| zod.z.cidrv6 | n124 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.coerce.boolean | n60 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never |  |
| zod.z.coerce.boolean | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.coerce.number | n60 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never |  |
| zod.z.coerce.number | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.cuid2 | n60 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.cuid2 | n124 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never |  |
| zod.z.date | n60 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.date | n124 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never |  |
| zod.z.discriminatedUnion | n60 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.discriminatedUnion | n124 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.email | n60 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.email | n124 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never |  |
| zod.z.endsWith | n60 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.endsWith | n124 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never |  |
| zod.z.file | n60 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never |  |
| zod.z.file | n124 | – | – | – | – | – | – | – | no tests in S | **≠** |
| zod.z.gte | n60 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never |  |
| zod.z.gte | n124 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never |  |
| zod.z.guid | n60 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.guid | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.int64 | n60 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.int64 | n124 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.iso.duration | n60 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never |  |
| zod.z.iso.duration | n124 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.iso.time | n60 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.iso.time | n124 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.keyof | n60 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never |  |
| zod.z.keyof | n124 | – | – | – | – | – | – | – | no tests in S | **≠** |
| zod.z.ksuid | n60 | – | – | – | – | – | – | – | no tests in S |  |
| zod.z.ksuid | n124 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never | **≠** |
| zod.z.looseObject | n60 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.looseObject | n124 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.lt | n60 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.lt | n124 | – | – | – | – | – | – | – | no tests in S | **≠** |
| zod.z.map | n60 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.map | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.maxSize | n60 | – | – | – | – | – | – | – | no tests in S |  |
| zod.z.maxSize | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never | **≠** |
| zod.z.minLength | n60 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never |  |
| zod.z.minLength | n124 | – | – | – | – | – | – | – | no tests in S | **≠** |
| zod.z.multipleOf | n60 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.multipleOf | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.nanoid | n60 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.nanoid | n124 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never |  |
| zod.z.negative | n60 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.negative | n124 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never |  |
| zod.z.never | n60 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.never | n124 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.nonoptional | n60 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.nonoptional | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.nonpositive | n60 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.nonpositive | n124 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.nullable | n60 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.nullable | n124 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.nullish | n60 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.nullish | n124 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.number | n60 | – | – | – | – | – | – | – | no tests in S |  |
| zod.z.number | n124 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never | **≠** |
| zod.z.overwrite | n60 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.overwrite | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.parse | n60 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 2/3 | 2/3 | v4.5.0 |  |
| zod.z.parse | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never | **≠** |
| zod.z.parseAsync | n60 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.parseAsync | n124 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.positive | n60 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.positive | n124 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.prefault | n60 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.prefault | n124 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.preprocess | n60 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.preprocess | n124 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.property | n60 | – | – | – | – | – | – | – | no tests in S |  |
| zod.z.property | n124 | – | – | – | – | – | – | – | no tests in S |  |
| zod.z.readonly | n60 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.readonly | n124 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.safeParse | n60 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.safeParse | n124 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never |  |
| zod.z.size | n60 | – | – | – | – | – | – | – | no tests in S |  |
| zod.z.size | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never | **≠** |
| zod.z.strictObject | n60 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.strictObject | n124 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.symbol | n60 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.symbol | n124 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.templateLiteral | n60 | – | – | – | – | – | – | – | no tests in S |  |
| zod.z.templateLiteral | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never | **≠** |
| zod.z.transform | n60 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.transform | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.trim | n60 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.trim | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.tuple | n60 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never |  |
| zod.z.tuple | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.uint32 | n60 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.uint32 | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.ulid | n60 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.ulid | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.unknown | n60 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.unknown | n124 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.uppercase | n60 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never |  |
| zod.z.uppercase | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.uuid | n60 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never |  |
| zod.z.uuid | n124 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never |  |
| zod.z.uuidv6 | n60 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.uuidv6 | n124 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never |  |
| zod.z.uuidv7 | n60 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |
| zod.z.uuidv7 | n124 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | never |  |

## LLM tests that fail at any release

Every test of either run with a non-pass status at some release. The error line is the first line of the recorded error at the first break.

| Run | Test file | Function | First break | Status there | First error line |
| --- | --- | --- | --- | --- | --- |
| n60 | `results/gen-n60/tests/test_353.js` | zod.z.parse | v4.5.0 | fail | Got unwanted exception. |
| n124 | `results/gen-n124-run2/tests/test_10.js` | zod.z.iso.date | v4.6.0 | fail | Result should be a Date object |
| n124 | `results/gen-n124-run2/tests/test_117.js` | zod.z.emoji | v4.6.0 | fail | Cannot read properties of undefined (reading 'some') |
| n124 | `results/gen-n124-run2/tests/test_366.js` | zod.z.partialRecord | v4.1.0 | fail | Cannot read properties of undefined (reading 'has') |
| n124 | `results/gen-n124-run2/tests/test_370.js` | zod.z.partialRecord | v4.5.0 | fail | The input did not match the regular expression /Invalid key/. Input: |
| n124 | `results/gen-n124-run2/tests/test_371.js` | zod.z.partialRecord | v4.5.0 | fail | The input did not match the regular expression /Invalid/. Input: |
| n124 | `results/gen-n124-run2/tests/test_518.js` | zod.z.instanceof | v4.3.0 | fail | Should throw default error when input is not an instance of MyClass |
| n124 | `results/gen-n124-run2/tests/test_521.js` | zod.z.instanceof | v4.3.0 | fail | The input did not match the regular expression /Input not instance of Test/. Input: |
| n124 | `results/gen-n124-run2/tests/test_522.js` | zod.z.instanceof | v4.3.0 | fail | Expected a ZodError with the default message for non‑instance input |
| n124 | `results/gen-n124-tail/tests/test_50.js` | zod.z.toUpperCase | v4.6.0 | fail | Expected values to be strictly equal: |
