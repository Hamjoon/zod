# gen-n124-run2 + gen-n124-tail vs gen-n60 on the 60 shared functions

Descriptive only; no statistical tests. Scope: the functions of `api-sample-n60-s20260919.json`. Prompts are assigned to functions by their generation block (see `scripts/genruns.py`); tests by the tool's recorded `api`. Passing means status `PASSED` in `report.json`.

## Totals

| Measure | gen-n60 | gen-n124-run2 + gen-n124-tail |
| --- | ---: | ---: |
| Prompts | 360 | 375 |
| Tests | 360 | 373 |
| Passing tests | 139 | 133 |
| Pass rate (tests) | 38.61% | 35.66% |
| Functions with at least one passing test | 54 | 55 |

## Passing tests per prompt provenance

Counted as in last week's analysis: the distinct refiner labels recorded in a prompt's provenance form its combination; a test is counted once per combination it traces to.

| Provenance | Prompts gen-n60 | Passing gen-n60 | Prompts gen-n124-run2 + gen-n124-tail | Passing gen-n124-run2 + gen-n124-tail |
| --- | ---: | ---: | ---: | ---: |
| base (`Base`) | 60 | 23 | 60 | 20 |
| body (`FunctionBodyIncluder`) | 60 | 27 | 60 | 26 |
| snippets (`SnippetIncluder`) | 58 | 33 | 58 | 24 |
| body + snippets (`FunctionBodyIncluder+SnippetIncluder`) | 58 | 29 | 58 | 27 |
| retry (`RetryWithError`) | 124 | 27 | 139 | 36 |

## Byte-identical test files

Generated test files (`tests/*.js`, as stored by the tool after `completeTest`) of one function that are byte-identical between the two results, counted as a multiset intersection per function: **1** (of 360 in gen-n60 and 373 in gen-n124-run2 + gen-n124-tail); functions with at least one identical file: 1.

## Per function

Functions whose passing count differs: **41** of 60 (marked **≠**).

| API | Tests gen-n60 | Passing gen-n60 | Tests gen-n124-run2 + gen-n124-tail | Passing gen-n124-run2 + gen-n124-tail | Identical files | Passing differs |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| zod.z.any | 4 | 4 | 4 | 4 | 0 |  |
| zod.z.array | 7 | 1 | 7 | 1 | 0 |  |
| zod.z.base64 | 4 | 4 | 4 | 4 | 0 |  |
| zod.z.boolean | 5 | 3 | 8 | 2 | 0 | **≠** |
| zod.z.catch | 6 | 2 | 6 | 2 | 0 |  |
| zod.z.check | 5 | 4 | 6 | 2 | 0 | **≠** |
| zod.z.cidrv4 | 4 | 4 | 4 | 4 | 0 |  |
| zod.z.cidrv6 | 7 | 1 | 4 | 4 | 0 | **≠** |
| zod.z.coerce.boolean | 8 | 1 | 7 | 2 | 0 | **≠** |
| zod.z.coerce.number | 7 | 1 | 6 | 2 | 0 | **≠** |
| zod.z.cuid2 | 4 | 4 | 7 | 1 | 0 | **≠** |
| zod.z.date | 7 | 2 | 7 | 1 | 0 | **≠** |
| zod.z.discriminatedUnion | 6 | 2 | 7 | 3 | 0 | **≠** |
| zod.z.email | 6 | 2 | 7 | 1 | 0 | **≠** |
| zod.z.endsWith | 6 | 3 | 8 | 1 | 0 | **≠** |
| zod.z.file | 8 | 1 | 8 | 0 | 0 | **≠** |
| zod.z.gte | 7 | 1 | 7 | 1 | 1 |  |
| zod.z.guid | 5 | 3 | 7 | 2 | 0 | **≠** |
| zod.z.int64 | 6 | 3 | 6 | 3 | 0 |  |
| zod.z.iso.duration | 8 | 1 | 7 | 3 | 0 | **≠** |
| zod.z.iso.time | 6 | 2 | 5 | 3 | 0 | **≠** |
| zod.z.keyof | 8 | 1 | 8 | 0 | 0 | **≠** |
| zod.z.ksuid | 4 | 0 | 3 | 1 | 0 | **≠** |
| zod.z.looseObject | 7 | 3 | 5 | 4 | 0 | **≠** |
| zod.z.lt | 6 | 3 | 8 | 0 | 0 | **≠** |
| zod.z.map | 6 | 2 | 7 | 2 | 0 |  |
| zod.z.maxSize | 8 | 0 | 8 | 2 | 0 | **≠** |
| zod.z.minLength | 8 | 1 | 8 | 0 | 0 | **≠** |
| zod.z.multipleOf | 6 | 3 | 6 | 2 | 0 | **≠** |
| zod.z.nanoid | 6 | 2 | 7 | 1 | 0 | **≠** |
| zod.z.negative | 7 | 3 | 8 | 1 | 0 | **≠** |
| zod.z.never | 6 | 2 | 4 | 3 | 0 | **≠** |
| zod.z.nonoptional | 6 | 3 | 7 | 2 | 0 | **≠** |
| zod.z.nonpositive | 8 | 3 | 8 | 3 | 0 |  |
| zod.z.nullable | 4 | 4 | 6 | 4 | 0 |  |
| zod.z.nullish | 6 | 4 | 5 | 3 | 0 | **≠** |
| zod.z.number | 8 | 0 | 5 | 3 | 0 | **≠** |
| zod.z.overwrite | 6 | 2 | 6 | 2 | 0 |  |
| zod.z.parse | 5 | 3 | 6 | 2 | 0 | **≠** |
| zod.z.parseAsync | 5 | 3 | 6 | 3 | 0 |  |
| zod.z.positive | 7 | 2 | 6 | 3 | 0 | **≠** |
| zod.z.prefault | 5 | 3 | 6 | 3 | 0 |  |
| zod.z.preprocess | 4 | 4 | 4 | 4 | 0 |  |
| zod.z.property | 4 | 0 | 4 | 0 | 0 |  |
| zod.z.readonly | 6 | 2 | 6 | 3 | 0 | **≠** |
| zod.z.safeParse | 4 | 4 | 7 | 1 | 0 | **≠** |
| zod.z.size | 8 | 0 | 8 | 2 | 0 | **≠** |
| zod.z.strictObject | 6 | 2 | 7 | 3 | 0 | **≠** |
| zod.z.symbol | 6 | 3 | 4 | 4 | 0 | **≠** |
| zod.z.templateLiteral | 8 | 0 | 7 | 2 | 0 | **≠** |
| zod.z.transform | 6 | 2 | 7 | 2 | 0 |  |
| zod.z.trim | 6 | 4 | 7 | 2 | 0 | **≠** |
| zod.z.tuple | 7 | 1 | 7 | 2 | 0 | **≠** |
| zod.z.uint32 | 6 | 3 | 6 | 2 | 0 | **≠** |
| zod.z.ulid | 4 | 4 | 6 | 2 | 0 | **≠** |
| zod.z.unknown | 4 | 4 | 4 | 4 | 0 |  |
| zod.z.uppercase | 7 | 1 | 7 | 2 | 0 | **≠** |
| zod.z.uuid | 6 | 2 | 7 | 1 | 0 | **≠** |
| zod.z.uuidv6 | 6 | 3 | 6 | 3 | 0 |  |
| zod.z.uuidv7 | 4 | 4 | 4 | 4 | 0 |  |
