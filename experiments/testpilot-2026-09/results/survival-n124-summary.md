# Stage S survival analysis

All tests are frozen at v4.0.5. LLM denominator is 266; developer denominator is 888 runtime cases. Harness failures are unavailable, never test failures. Developer file-load failures inherit the baseline cases as failed. Test-file A/M/D counts describe ignored upstream edits only.

| Tag | Commit | Date | Build | Probe | LLM P/F/load/timeout/other | LLM survival | Dev loaded/passed/failed/skipped | Dev survival | Dev A/M/D |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v4.0.5 | 45afab0f846dffd591362b6f770017507eb185b5 | 2025-07-10 | ok | ok | 266/0/0/0/0 | 266/266 (100.00%) | 81/888/0/0 | 888/888 (100.00%) | 0/0/0 |
| v4.1.0 | 2ca716d6313dcfab425d3555ac8bf85929bc57a4 | 2025-08-23 | ok | ok | 265/1/0/0/0 | 265/266 (99.62%) | 81/871/17/0 | 871/888 (98.09%) | 5/36/0 |
| v4.2.0 | dcef9734f55fc1c8e73795a2be80c60fa7a4a568 | 2025-12-14 | ok | ok | 266/0/0/0/0 | 266/266 (100.00%) | 81/868/19/1 | 868/888 (97.75%) | 16/42/0 |
| v4.3.0 | 1899684fc34d149ebb5d6f9fd95a588e94f27053 | 2025-12-30 | ok | ok | 263/3/0/0/0 | 263/266 (98.87%) | 81/864/23/1 | 864/888 (97.30%) | 20/49/0 |
| v4.4.0 | d05f026e9e6eae0e1e6c2efbf11c89007ca40494 | 2026-04-29 | ok | ok | 263/3/0/0/0 | 263/266 (98.87%) | 81/853/34/1 | 853/888 (96.06%) | 27/51/0 |
| v4.5.0 | 0a69bcb3d9554c6ec382ea9ba6b43c2421f3fa78 | 2026-08-28 | ok | ok | 261/5/0/0/0 | 261/266 (98.12%) | 81/838/49/1 | 838/888 (94.37%) | 49/61/0 |
| v4.6.0 | 1c51cbe0fe23d09f8d520b31487d50a01588fae5 | 2026-09-09 | ok | ok | 258/8/0/0/0 | 258/266 (96.99%) | 81/834/53/1 | 834/888 (93.92%) | 55/62/0 |

## Per stratum

| Stratum | Tests in S | v4.0.5 | v4.1.0 | v4.2.0 | v4.3.0 | v4.4.0 | v4.5.0 | v4.6.0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S | 172 | 172/172 (100.00%) | 171/172 (99.42%) | 172/172 (100.00%) | 169/172 (98.26%) | 169/172 (98.26%) | 167/172 (97.09%) | 166/172 (96.51%) |
| C | 57 | 57/57 (100.00%) | 57/57 (100.00%) | 57/57 (100.00%) | 57/57 (100.00%) | 57/57 (100.00%) | 57/57 (100.00%) | 56/57 (98.25%) |
| Q | 37 | 37/37 (100.00%) | 37/37 (100.00%) | 37/37 (100.00%) | 37/37 (100.00%) | 37/37 (100.00%) | 37/37 (100.00%) | 36/37 (97.30%) |

## Per function

| Function | Tests in S | v4.1.0 | v4.2.0 | v4.3.0 | v4.4.0 | v4.5.0 | v4.6.0 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| zod.z.iso.datetime | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.iso.date | 3 | 3 | 3 | 3 | 3 | 3 | 2 |
| zod.z.iso.time | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.iso.duration | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.coerce.string | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.coerce.number | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.coerce.boolean | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.coerce.bigint | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.coerce.date | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.stringbool | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.string | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.email | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.guid | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.uuid | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.uuidv4 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.uuidv6 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.uuidv7 | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.url | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.emoji | 3 | 3 | 3 | 3 | 3 | 3 | 2 |
| zod.z.nanoid | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.cuid | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.cuid2 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.ulid | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.ksuid | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.ipv4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.ipv6 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.cidrv4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.cidrv6 | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.base64 | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.base64url | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.e164 | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.jwt | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.stringFormat | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.number | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.int | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.float32 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.float64 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.int32 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.uint32 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.boolean | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.bigint | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.int64 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.uint64 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.symbol | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.undefined | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.null | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.any | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.unknown | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.never | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.void | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.date | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.array | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.object | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.strictObject | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.looseObject | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.discriminatedUnion | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.intersection | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.tuple | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.record | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.partialRecord | 3 | 2 | 3 | 3 | 3 | 1 | 1 |
| zod.z.map | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.set | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.enum | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.nativeEnum | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.literal | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.transform | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.optional | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.nullable | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.nullish | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.prefault | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.nonoptional | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.success | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.catch | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.nan | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.readonly | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.templateLiteral | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.lazy | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.promise | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.check | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.custom | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.refine | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.superRefine | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.instanceof | 3 | 3 | 3 | 0 | 0 | 0 | 0 |
| zod.z.preprocess | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.lte | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.gt | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.gte | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.positive | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.negative | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.nonpositive | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.multipleOf | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.maxSize | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.minSize | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.size | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.maxLength | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.length | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.regex | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.lowercase | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.uppercase | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.includes | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.endsWith | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.overwrite | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.normalize | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.trim | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.toLowerCase | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.toUpperCase | 4 | 4 | 4 | 4 | 4 | 4 | 3 |
| zod.z.parse | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.parseAsync | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.safeParse | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.safeParseAsync | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.setErrorMap | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.getErrorMap | 1 | 1 | 1 | 1 | 1 | 1 | 1 |

## LLM failures: v4.0.5

| Category | Count |
| --- | --- |
| assertion | 0 |
| file-system | 0 |
| correctness | 0 |
| timeout | 0 |
| other | 0 |

| Error first line | Count |
| --- | --- |

## LLM failures: v4.1.0

| Category | Count |
| --- | --- |
| assertion | 0 |
| file-system | 0 |
| correctness | 1 |
| timeout | 0 |
| other | 0 |

| Error first line | Count |
| --- | --- |
| Cannot read properties of undefined (reading 'has') | 1 |

## LLM failures: v4.2.0

| Category | Count |
| --- | --- |
| assertion | 0 |
| file-system | 0 |
| correctness | 0 |
| timeout | 0 |
| other | 0 |

| Error first line | Count |
| --- | --- |

## LLM failures: v4.3.0

| Category | Count |
| --- | --- |
| assertion | 3 |
| file-system | 0 |
| correctness | 0 |
| timeout | 0 |
| other | 0 |

| Error first line | Count |
| --- | --- |
| Should throw default error when input is not an instance of MyClass | 1 |
| The input did not match the regular expression /Input not instance of Test/. Input: | 1 |
| Expected a ZodError with the default message for non‑instance input | 1 |

## LLM failures: v4.4.0

| Category | Count |
| --- | --- |
| assertion | 3 |
| file-system | 0 |
| correctness | 0 |
| timeout | 0 |
| other | 0 |

| Error first line | Count |
| --- | --- |
| Should throw default error when input is not an instance of MyClass | 1 |
| The input did not match the regular expression /Input not instance of Test/. Input: | 1 |
| Expected a ZodError with the default message for non‑instance input | 1 |

## LLM failures: v4.5.0

| Category | Count |
| --- | --- |
| assertion | 5 |
| file-system | 0 |
| correctness | 0 |
| timeout | 0 |
| other | 0 |

| Error first line | Count |
| --- | --- |
| The input did not match the regular expression /Invalid key/. Input: | 1 |
| The input did not match the regular expression /Invalid/. Input: | 1 |
| Should throw default error when input is not an instance of MyClass | 1 |
| The input did not match the regular expression /Input not instance of Test/. Input: | 1 |
| Expected a ZodError with the default message for non‑instance input | 1 |

## LLM failures: v4.6.0

| Category | Count |
| --- | --- |
| assertion | 7 |
| file-system | 0 |
| correctness | 1 |
| timeout | 0 |
| other | 0 |

| Error first line | Count |
| --- | --- |
| Result should be a Date object | 1 |
| Cannot read properties of undefined (reading 'some') | 1 |
| The input did not match the regular expression /Invalid key/. Input: | 1 |
| The input did not match the regular expression /Invalid/. Input: | 1 |
| Should throw default error when input is not an instance of MyClass | 1 |
| The input did not match the regular expression /Input not instance of Test/. Input: | 1 |
| Expected a ZodError with the default message for non‑instance input | 1 |
| Expected values to be strictly equal: | 1 |

## First breaks and returns to passing

Developer identity is file + fullName + one-based occurrence in the frozen declaration order. All available runs must preserve the baseline identities. Unavailable releases are not evidence of survival; never-break counts mean no observed break in available runs. Todo is neither a break nor a survival and is ignored in rebound transitions. First breaks include the control; non-passing baseline observations are retained. A return to passing is any later pass following a non-pass.

| Corpus | No observed break (available releases only) | Break then pass again |
| --- | --- | --- |
| LLM | 257 | 1 |
| Dev | 832 | 3 |

| LLM test | API | First break | Pass again |
| --- | --- | --- | --- |
| gen-n124-run2/test_0.js | zod.z.iso.datetime | never | False |
| gen-n124-run2/test_1.js | zod.z.iso.datetime | never | False |
| gen-n124-run2/test_7.js | zod.z.iso.date | never | False |
| gen-n124-run2/test_9.js | zod.z.iso.date | never | False |
| gen-n124-run2/test_10.js | zod.z.iso.date | v4.6.0 | False |
| gen-n124-run2/test_13.js | zod.z.iso.time | never | False |
| gen-n124-run2/test_16.js | zod.z.iso.time | never | False |
| gen-n124-run2/test_17.js | zod.z.iso.time | never | False |
| gen-n124-run2/test_18.js | zod.z.iso.duration | never | False |
| gen-n124-run2/test_20.js | zod.z.iso.duration | never | False |
| gen-n124-run2/test_22.js | zod.z.iso.duration | never | False |
| gen-n124-run2/test_27.js | zod.z.coerce.string | never | False |
| gen-n124-run2/test_28.js | zod.z.coerce.string | never | False |
| gen-n124-run2/test_31.js | zod.z.coerce.string | never | False |
| gen-n124-run2/test_33.js | zod.z.coerce.number | never | False |
| gen-n124-run2/test_34.js | zod.z.coerce.number | never | False |
| gen-n124-run2/test_43.js | zod.z.coerce.boolean | never | False |
| gen-n124-run2/test_44.js | zod.z.coerce.boolean | never | False |
| gen-n124-run2/test_45.js | zod.z.coerce.bigint | never | False |
| gen-n124-run2/test_47.js | zod.z.coerce.bigint | never | False |
| gen-n124-run2/test_48.js | zod.z.coerce.bigint | never | False |
| gen-n124-run2/test_50.js | zod.z.coerce.bigint | never | False |
| gen-n124-run2/test_51.js | zod.z.coerce.date | never | False |
| gen-n124-run2/test_55.js | zod.z.coerce.date | never | False |
| gen-n124-run2/test_57.js | zod.z.coerce.date | never | False |
| gen-n124-run2/test_62.js | zod.z.stringbool | never | False |
| gen-n124-run2/test_63.js | zod.z.stringbool | never | False |
| gen-n124-run2/test_65.js | zod.z.stringbool | never | False |
| gen-n124-run2/test_69.js | zod.z.string | never | False |
| gen-n124-run2/test_70.js | zod.z.string | never | False |
| gen-n124-run2/test_72.js | zod.z.string | never | False |
| gen-n124-run2/test_74.js | zod.z.email | never | False |
| gen-n124-run2/test_81.js | zod.z.guid | never | False |
| gen-n124-run2/test_84.js | zod.z.guid | never | False |
| gen-n124-run2/test_87.js | zod.z.uuid | never | False |
| gen-n124-run2/test_95.js | zod.z.uuidv4 | never | False |
| gen-n124-run2/test_96.js | zod.z.uuidv4 | never | False |
| gen-n124-run2/test_98.js | zod.z.uuidv4 | never | False |
| gen-n124-run2/test_99.js | zod.z.uuidv6 | never | False |
| gen-n124-run2/test_100.js | zod.z.uuidv6 | never | False |
| gen-n124-run2/test_102.js | zod.z.uuidv6 | never | False |
| gen-n124-run2/test_105.js | zod.z.uuidv7 | never | False |
| gen-n124-run2/test_106.js | zod.z.uuidv7 | never | False |
| gen-n124-run2/test_107.js | zod.z.uuidv7 | never | False |
| gen-n124-run2/test_108.js | zod.z.uuidv7 | never | False |
| gen-n124-run2/test_111.js | zod.z.url | never | False |
| gen-n124-run2/test_116.js | zod.z.emoji | never | False |
| gen-n124-run2/test_117.js | zod.z.emoji | v4.6.0 | False |
| gen-n124-run2/test_119.js | zod.z.emoji | never | False |
| gen-n124-run2/test_126.js | zod.z.nanoid | never | False |
| gen-n124-run2/test_127.js | zod.z.cuid | never | False |
| gen-n124-run2/test_131.js | zod.z.cuid | never | False |
| gen-n124-run2/test_133.js | zod.z.cuid2 | never | False |
| gen-n124-run2/test_139.js | zod.z.ulid | never | False |
| gen-n124-run2/test_140.js | zod.z.ulid | never | False |
| gen-n124-run2/test_150.js | zod.z.ksuid | never | False |
| gen-n124-run2/test_152.js | zod.z.ipv4 | never | False |
| gen-n124-run2/test_153.js | zod.z.ipv4 | never | False |
| gen-n124-run2/test_154.js | zod.z.ipv4 | never | False |
| gen-n124-run2/test_156.js | zod.z.ipv4 | never | False |
| gen-n124-run2/test_157.js | zod.z.ipv6 | never | False |
| gen-n124-run2/test_161.js | zod.z.ipv6 | never | False |
| gen-n124-run2/test_163.js | zod.z.ipv6 | never | False |
| gen-n124-run2/test_164.js | zod.z.cidrv4 | never | False |
| gen-n124-run2/test_165.js | zod.z.cidrv4 | never | False |
| gen-n124-run2/test_166.js | zod.z.cidrv4 | never | False |
| gen-n124-run2/test_167.js | zod.z.cidrv4 | never | False |
| gen-n124-run2/test_168.js | zod.z.cidrv6 | never | False |
| gen-n124-run2/test_169.js | zod.z.cidrv6 | never | False |
| gen-n124-run2/test_170.js | zod.z.cidrv6 | never | False |
| gen-n124-run2/test_171.js | zod.z.cidrv6 | never | False |
| gen-n124-run2/test_172.js | zod.z.base64 | never | False |
| gen-n124-run2/test_173.js | zod.z.base64 | never | False |
| gen-n124-run2/test_174.js | zod.z.base64 | never | False |
| gen-n124-run2/test_175.js | zod.z.base64 | never | False |
| gen-n124-run2/test_176.js | zod.z.base64url | never | False |
| gen-n124-run2/test_179.js | zod.z.base64url | never | False |
| gen-n124-run2/test_181.js | zod.z.base64url | never | False |
| gen-n124-run2/test_182.js | zod.z.e164 | never | False |
| gen-n124-run2/test_183.js | zod.z.e164 | never | False |
| gen-n124-run2/test_184.js | zod.z.e164 | never | False |
| gen-n124-run2/test_185.js | zod.z.e164 | never | False |
| gen-n124-run2/test_187.js | zod.z.jwt | never | False |
| gen-n124-run2/test_188.js | zod.z.jwt | never | False |
| gen-n124-run2/test_190.js | zod.z.jwt | never | False |
| gen-n124-run2/test_191.js | zod.z.stringFormat | never | False |
| gen-n124-run2/test_192.js | zod.z.stringFormat | never | False |
| gen-n124-run2/test_194.js | zod.z.number | never | False |
| gen-n124-run2/test_195.js | zod.z.number | never | False |
| gen-n124-run2/test_197.js | zod.z.number | never | False |
| gen-n124-run2/test_198.js | zod.z.int | never | False |
| gen-n124-run2/test_199.js | zod.z.int | never | False |
| gen-n124-run2/test_202.js | zod.z.int | never | False |
| gen-n124-run2/test_204.js | zod.z.float32 | never | False |
| gen-n124-run2/test_207.js | zod.z.float32 | never | False |
| gen-n124-run2/test_211.js | zod.z.float64 | never | False |
| gen-n124-run2/test_214.js | zod.z.float64 | never | False |
| gen-n124-run2/test_218.js | zod.z.int32 | never | False |
| gen-n124-run2/test_219.js | zod.z.int32 | never | False |
| gen-n124-run2/test_226.js | zod.z.uint32 | never | False |
| gen-n124-run2/test_228.js | zod.z.uint32 | never | False |
| gen-n124-run2/test_233.js | zod.z.boolean | never | False |
| gen-n124-run2/test_236.js | zod.z.boolean | never | False |
| gen-n124-run2/test_239.js | zod.z.bigint | never | False |
| gen-n124-run2/test_240.js | zod.z.bigint | never | False |
| gen-n124-run2/test_242.js | zod.z.bigint | never | False |
| gen-n124-run2/test_244.js | zod.z.int64 | never | False |
| gen-n124-run2/test_247.js | zod.z.int64 | never | False |
| gen-n124-run2/test_248.js | zod.z.int64 | never | False |
| gen-n124-run2/test_254.js | zod.z.uint64 | never | False |
| gen-n124-run2/test_255.js | zod.z.uint64 | never | False |
| gen-n124-run2/test_256.js | zod.z.symbol | never | False |
| gen-n124-run2/test_257.js | zod.z.symbol | never | False |
| gen-n124-run2/test_258.js | zod.z.symbol | never | False |
| gen-n124-run2/test_259.js | zod.z.symbol | never | False |
| gen-n124-run2/test_262.js | zod.z.undefined | never | False |
| gen-n124-run2/test_263.js | zod.z.undefined | never | False |
| gen-n124-run2/test_265.js | zod.z.undefined | never | False |
| gen-n124-run2/test_267.js | zod.z.null | never | False |
| gen-n124-run2/test_268.js | zod.z.null | never | False |
| gen-n124-run2/test_272.js | zod.z.any | never | False |
| gen-n124-run2/test_273.js | zod.z.any | never | False |
| gen-n124-run2/test_274.js | zod.z.any | never | False |
| gen-n124-run2/test_275.js | zod.z.any | never | False |
| gen-n124-run2/test_276.js | zod.z.unknown | never | False |
| gen-n124-run2/test_277.js | zod.z.unknown | never | False |
| gen-n124-run2/test_278.js | zod.z.unknown | never | False |
| gen-n124-run2/test_279.js | zod.z.unknown | never | False |
| gen-n124-run2/test_280.js | zod.z.never | never | False |
| gen-n124-run2/test_281.js | zod.z.never | never | False |
| gen-n124-run2/test_282.js | zod.z.never | never | False |
| gen-n124-run2/test_288.js | zod.z.void | never | False |
| gen-n124-run2/test_290.js | zod.z.void | never | False |
| gen-n124-run2/test_297.js | zod.z.date | never | False |
| gen-n124-run2/test_299.js | zod.z.array | never | False |
| gen-n124-run2/test_314.js | zod.z.object | never | False |
| gen-n124-run2/test_319.js | zod.z.object | never | False |
| gen-n124-run2/test_323.js | zod.z.strictObject | never | False |
| gen-n124-run2/test_324.js | zod.z.strictObject | never | False |
| gen-n124-run2/test_326.js | zod.z.strictObject | never | False |
| gen-n124-run2/test_328.js | zod.z.looseObject | never | False |
| gen-n124-run2/test_329.js | zod.z.looseObject | never | False |
| gen-n124-run2/test_330.js | zod.z.looseObject | never | False |
| gen-n124-run2/test_331.js | zod.z.looseObject | never | False |
| gen-n124-run2/test_340.js | zod.z.discriminatedUnion | never | False |
| gen-n124-run2/test_342.js | zod.z.discriminatedUnion | never | False |
| gen-n124-run2/test_345.js | zod.z.discriminatedUnion | never | False |
| gen-n124-run2/test_348.js | zod.z.intersection | never | False |
| gen-n124-run2/test_355.js | zod.z.tuple | never | False |
| gen-n124-run2/test_358.js | zod.z.tuple | never | False |
| gen-n124-run2/test_360.js | zod.z.record | never | False |
| gen-n124-run2/test_366.js | zod.z.partialRecord | v4.1.0 | True |
| gen-n124-run2/test_370.js | zod.z.partialRecord | v4.5.0 | False |
| gen-n124-run2/test_371.js | zod.z.partialRecord | v4.5.0 | False |
| gen-n124-run2/test_374.js | zod.z.map | never | False |
| gen-n124-run2/test_375.js | zod.z.map | never | False |
| gen-n124-run2/test_379.js | zod.z.set | never | False |
| gen-n124-run2/test_380.js | zod.z.set | never | False |
| gen-n124-run2/test_389.js | zod.z.enum | never | False |
| gen-n124-run2/test_393.js | zod.z.nativeEnum | never | False |
| gen-n124-run2/test_399.js | zod.z.literal | never | False |
| gen-n124-run2/test_400.js | zod.z.literal | never | False |
| gen-n124-run2/test_401.js | zod.z.literal | never | False |
| gen-n124-run2/test_402.js | zod.z.literal | never | False |
| gen-n124-run2/test_414.js | zod.z.transform | never | False |
| gen-n124-run2/test_415.js | zod.z.transform | never | False |
| gen-n124-run2/test_418.js | zod.z.optional | never | False |
| gen-n124-run2/test_422.js | zod.z.optional | never | False |
| gen-n124-run2/test_424.js | zod.z.optional | never | False |
| gen-n124-run2/test_425.js | zod.z.nullable | never | False |
| gen-n124-run2/test_427.js | zod.z.nullable | never | False |
| gen-n124-run2/test_428.js | zod.z.nullable | never | False |
| gen-n124-run2/test_430.js | zod.z.nullable | never | False |
| gen-n124-run2/test_431.js | zod.z.nullish | never | False |
| gen-n124-run2/test_434.js | zod.z.nullish | never | False |
| gen-n124-run2/test_435.js | zod.z.nullish | never | False |
| gen-n124-run2/test_439.js | zod.z.prefault | never | False |
| gen-n124-run2/test_440.js | zod.z.prefault | never | False |
| gen-n124-run2/test_441.js | zod.z.prefault | never | False |
| gen-n124-run2/test_443.js | zod.z.nonoptional | never | False |
| gen-n124-run2/test_448.js | zod.z.nonoptional | never | False |
| gen-n124-run2/test_451.js | zod.z.success | never | False |
| gen-n124-run2/test_452.js | zod.z.success | never | False |
| gen-n124-run2/test_453.js | zod.z.catch | never | False |
| gen-n124-run2/test_454.js | zod.z.catch | never | False |
| gen-n124-run2/test_459.js | zod.z.nan | never | False |
| gen-n124-run2/test_460.js | zod.z.nan | never | False |
| gen-n124-run2/test_474.js | zod.z.readonly | never | False |
| gen-n124-run2/test_475.js | zod.z.readonly | never | False |
| gen-n124-run2/test_476.js | zod.z.readonly | never | False |
| gen-n124-run2/test_480.js | zod.z.templateLiteral | never | False |
| gen-n124-run2/test_482.js | zod.z.templateLiteral | never | False |
| gen-n124-run2/test_486.js | zod.z.lazy | never | False |
| gen-n124-run2/test_487.js | zod.z.lazy | never | False |
| gen-n124-run2/test_488.js | zod.z.lazy | never | False |
| gen-n124-run2/test_489.js | zod.z.lazy | never | False |
| gen-n124-run2/test_490.js | zod.z.promise | never | False |
| gen-n124-run2/test_493.js | zod.z.promise | never | False |
| gen-n124-run2/test_499.js | zod.z.check | never | False |
| gen-n124-run2/test_501.js | zod.z.check | never | False |
| gen-n124-run2/test_502.js | zod.z.custom | never | False |
| gen-n124-run2/test_503.js | zod.z.custom | never | False |
| gen-n124-run2/test_504.js | zod.z.custom | never | False |
| gen-n124-run2/test_510.js | zod.z.refine | never | False |
| gen-n124-run2/test_512.js | zod.z.refine | never | False |
| gen-n124-run2/test_513.js | zod.z.superRefine | never | False |
| gen-n124-run2/test_514.js | zod.z.superRefine | never | False |
| gen-n124-run2/test_515.js | zod.z.superRefine | never | False |
| gen-n124-run2/test_518.js | zod.z.instanceof | v4.3.0 | False |
| gen-n124-run2/test_521.js | zod.z.instanceof | v4.3.0 | False |
| gen-n124-run2/test_522.js | zod.z.instanceof | v4.3.0 | False |
| gen-n124-run2/test_527.js | zod.z.preprocess | never | False |
| gen-n124-run2/test_528.js | zod.z.preprocess | never | False |
| gen-n124-run2/test_529.js | zod.z.preprocess | never | False |
| gen-n124-run2/test_530.js | zod.z.preprocess | never | False |
| gen-n124-run2/test_546.js | zod.z.lte | never | False |
| gen-n124-run2/test_547.js | zod.z.gt | never | False |
| gen-n124-run2/test_551.js | zod.z.gt | never | False |
| gen-n124-run2/test_559.js | zod.z.gte | never | False |
| gen-n124-run2/test_563.js | zod.z.positive | never | False |
| gen-n124-run2/test_564.js | zod.z.positive | never | False |
| gen-n124-run2/test_566.js | zod.z.positive | never | False |
| gen-n124-run2/test_571.js | zod.z.negative | never | False |
| gen-n124-run2/test_579.js | zod.z.nonpositive | never | False |
| gen-n124-run2/test_580.js | zod.z.nonpositive | never | False |
| gen-n124-run2/test_582.js | zod.z.nonpositive | never | False |
| gen-n124-run2/test_594.js | zod.z.multipleOf | never | False |
| gen-n124-run2/test_596.js | zod.z.multipleOf | never | False |
| gen-n124-run2/test_601.js | zod.z.maxSize | never | False |
| gen-n124-run2/test_604.js | zod.z.maxSize | never | False |
| gen-n124-run2/test_611.js | zod.z.minSize | never | False |
| gen-n124-run2/test_617.js | zod.z.size | never | False |
| gen-n124-run2/test_619.js | zod.z.size | never | False |
| gen-n124-run2/test_625.js | zod.z.maxLength | never | False |
| gen-n124-run2/test_626.js | zod.z.maxLength | never | False |
| gen-n124-run2/test_635.js | zod.z.length | never | False |
| gen-n124-run2/test_649.js | zod.z.regex | never | False |
| gen-n124-run2/test_650.js | zod.z.lowercase | never | False |
| gen-n124-run2/test_662.js | zod.z.uppercase | never | False |
| gen-n124-run2/test_663.js | zod.z.uppercase | never | False |
| gen-n124-run2/test_664.js | zod.z.includes | never | False |
| gen-n124-tail/test_11.js | zod.z.endsWith | never | False |
| gen-n124-tail/test_27.js | zod.z.overwrite | never | False |
| gen-n124-tail/test_32.js | zod.z.overwrite | never | False |
| gen-n124-tail/test_35.js | zod.z.normalize | never | False |
| gen-n124-tail/test_39.js | zod.z.trim | never | False |
| gen-n124-tail/test_40.js | zod.z.trim | never | False |
| gen-n124-tail/test_44.js | zod.z.toLowerCase | never | False |
| gen-n124-tail/test_47.js | zod.z.toLowerCase | never | False |
| gen-n124-tail/test_49.js | zod.z.toLowerCase | never | False |
| gen-n124-tail/test_50.js | zod.z.toUpperCase | v4.6.0 | False |
| gen-n124-tail/test_52.js | zod.z.toUpperCase | never | False |
| gen-n124-tail/test_54.js | zod.z.toUpperCase | never | False |
| gen-n124-tail/test_55.js | zod.z.toUpperCase | never | False |
| gen-n124-tail/test_56.js | zod.z.parse | never | False |
| gen-n124-tail/test_59.js | zod.z.parse | never | False |
| gen-n124-tail/test_63.js | zod.z.parseAsync | never | False |
| gen-n124-tail/test_66.js | zod.z.parseAsync | never | False |
| gen-n124-tail/test_67.js | zod.z.parseAsync | never | False |
| gen-n124-tail/test_68.js | zod.z.safeParse | never | False |
| gen-n124-tail/test_75.js | zod.z.safeParseAsync | never | False |
| gen-n124-tail/test_76.js | zod.z.safeParseAsync | never | False |
| gen-n124-tail/test_77.js | zod.z.safeParseAsync | never | False |
| gen-n124-tail/test_78.js | zod.z.safeParseAsync | never | False |
| gen-n124-tail/test_79.js | zod.z.setErrorMap | never | False |
| gen-n124-tail/test_84.js | zod.z.getErrorMap | never | False |

| Dev file | Case | Occurrence | First break | Pass again |
| --- | --- | --- | --- | --- |
| core/tests/index.test.ts | test | 1 | never | False |
| core/tests/index.test.ts | test2 | 1 | never | False |
| core/tests/index.test.ts | async validation | 1 | never | False |
| classic/tests/anyunknown.test.ts | check any inference | 1 | never | False |
| classic/tests/anyunknown.test.ts | check unknown inference | 1 | never | False |
| classic/tests/anyunknown.test.ts | check never inference | 1 | never | False |
| classic/tests/array.test.ts | type inference | 1 | never | False |
| classic/tests/array.test.ts | array min/max | 1 | never | False |
| classic/tests/array.test.ts | array length | 1 | v4.5.0 | False |
| classic/tests/array.test.ts | array.nonempty() | 1 | never | False |
| classic/tests/array.test.ts | array.nonempty().max() | 1 | never | False |
| classic/tests/array.test.ts | parse empty array in nonempty | 1 | never | False |
| classic/tests/array.test.ts | get element | 1 | never | False |
| classic/tests/array.test.ts | continue parsing despite array size error | 1 | never | False |
| classic/tests/array.test.ts | parse should fail given sparse array | 1 | never | False |
| classic/tests/assignability.test.ts | assignability | 1 | never | False |
| classic/tests/assignability.test.ts | checks | 1 | never | False |
| classic/tests/assignability.test.ts | assignability to $ZodType | 1 | never | False |
| classic/tests/assignability.test.ts | assignability with narrowing | 1 | never | False |
| classic/tests/assignability.test.ts | generic assignability in objects | 1 | never | False |
| classic/tests/async-parsing.test.ts | string async parse | 1 | never | False |
| classic/tests/async-parsing.test.ts | number async parse | 1 | never | False |
| classic/tests/async-parsing.test.ts | bigInt async parse | 1 | never | False |
| classic/tests/async-parsing.test.ts | boolean async parse | 1 | never | False |
| classic/tests/async-parsing.test.ts | date async parse | 1 | never | False |
| classic/tests/async-parsing.test.ts | undefined async parse | 1 | never | False |
| classic/tests/async-parsing.test.ts | null async parse | 1 | never | False |
| classic/tests/async-parsing.test.ts | any async parse | 1 | never | False |
| classic/tests/async-parsing.test.ts | unknown async parse | 1 | never | False |
| classic/tests/async-parsing.test.ts | void async parse | 1 | never | False |
| classic/tests/async-parsing.test.ts | array async parse | 1 | never | False |
| classic/tests/async-parsing.test.ts | object async parse | 1 | never | False |
| classic/tests/async-parsing.test.ts | union async parse | 1 | never | False |
| classic/tests/async-parsing.test.ts | record async parse | 1 | never | False |
| classic/tests/async-parsing.test.ts | literal async parse | 1 | never | False |
| classic/tests/async-parsing.test.ts | enum async parse | 1 | never | False |
| classic/tests/async-parsing.test.ts | nativeEnum async parse | 1 | never | False |
| classic/tests/async-parsing.test.ts | promise async parse good | 1 | never | False |
| classic/tests/async-parsing.test.ts | promise async parse bad | 1 | never | False |
| classic/tests/async-parsing.test.ts | async validation non-empty strings | 1 | never | False |
| classic/tests/async-parsing.test.ts | async validation multiple errors 1 | 1 | never | False |
| classic/tests/async-parsing.test.ts | async validation multiple errors 2 | 1 | never | False |
| classic/tests/async-parsing.test.ts | ensure early async failure prevents follow-up refinement checks | 1 | never | False |
| classic/tests/async-refinements.test.ts | async refine .parse() | 1 | never | False |
| classic/tests/async-refinements.test.ts | async refine | 1 | never | False |
| classic/tests/async-refinements.test.ts | async refine with Promises | 1 | never | False |
| classic/tests/async-refinements.test.ts | async refine that uses value | 1 | never | False |
| classic/tests/base.test.ts | test this binding | 1 | never | False |
| classic/tests/bigint.test.ts | passing validations | 1 | never | False |
| classic/tests/bigint.test.ts | failing validations | 1 | never | False |
| classic/tests/bigint.test.ts | min max getters | 1 | never | False |
| classic/tests/brand.test.ts | branded types | 1 | never | False |
| classic/tests/brand.test.ts | $branded | 1 | never | False |
| classic/tests/brand.test.ts | branded record | 1 | never | False |
| classic/tests/catch.test.ts | basic catch | 1 | never | False |
| classic/tests/catch.test.ts | catch fn does not run when parsing succeeds | 1 | never | False |
| classic/tests/catch.test.ts | basic catch async | 1 | never | False |
| classic/tests/catch.test.ts | catch replace wrong types | 1 | never | False |
| classic/tests/catch.test.ts | catch with transform | 1 | never | False |
| classic/tests/catch.test.ts | catch on existing optional | 1 | never | False |
| classic/tests/catch.test.ts | optional on catch | 1 | never | False |
| classic/tests/catch.test.ts | complex chain example | 1 | never | False |
| classic/tests/catch.test.ts | removeCatch | 1 | never | False |
| classic/tests/catch.test.ts | nested | 1 | never | False |
| classic/tests/catch.test.ts | chained catch | 1 | never | False |
| classic/tests/catch.test.ts | native enum | 1 | v4.4.0 | True |
| classic/tests/catch.test.ts | enum | 1 | v4.4.0 | True |
| classic/tests/catch.test.ts | reported issues with nested usage | 1 | never | False |
| classic/tests/catch.test.ts | catch error | 1 | never | False |
| classic/tests/catch.test.ts | ctx.input | 1 | never | False |
| classic/tests/coalesce.test.ts | coalesce | 1 | never | False |
| classic/tests/coerce.test.ts | string coercion | 1 | never | False |
| classic/tests/coerce.test.ts | number coercion | 1 | never | False |
| classic/tests/coerce.test.ts | boolean coercion | 1 | never | False |
| classic/tests/coerce.test.ts | bigint coercion | 1 | never | False |
| classic/tests/coerce.test.ts | date coercion | 1 | never | False |
| classic/tests/coerce.test.ts | override input type | 1 | never | False |
| classic/tests/continuability.test.ts | continuability | 1 | v4.1.0 | False |
| classic/tests/custom.test.ts | passing validations | 1 | never | False |
| classic/tests/custom.test.ts | string params | 1 | never | False |
| classic/tests/custom.test.ts | instanceof | 1 | never | False |
| classic/tests/custom.test.ts | non-continuable by default | 1 | never | False |
| classic/tests/date.test.ts | passing validations | 1 | never | False |
| classic/tests/date.test.ts | failing validations | 1 | never | False |
| classic/tests/date.test.ts | min max getters | 1 | never | False |
| classic/tests/datetime.test.ts | basic datetime parsing | 1 | never | False |
| classic/tests/datetime.test.ts | datetime parsing with precision -1 | 1 | never | False |
| classic/tests/datetime.test.ts | datetime parsing with precision 0 | 1 | never | False |
| classic/tests/datetime.test.ts | datetime parsing with precision 3 | 1 | never | False |
| classic/tests/datetime.test.ts | datetime parsing with offset | 1 | never | False |
| classic/tests/datetime.test.ts | datetime parsing with offset and precision 0 | 1 | never | False |
| classic/tests/datetime.test.ts | datetime parsing with offset and precision 4 | 1 | never | False |
| classic/tests/datetime.test.ts | datetime offset normalization | 1 | never | False |
| classic/tests/datetime.test.ts | datetime parsing with local option | 1 | never | False |
| classic/tests/datetime.test.ts | datetime parsing with local and offset | 1 | v4.5.0 | False |
| classic/tests/datetime.test.ts | date parsing | 1 | never | False |
| classic/tests/datetime.test.ts | time parsing | 1 | never | False |
| classic/tests/datetime.test.ts | duration | 1 | never | False |
| classic/tests/datetime.test.ts | redos checker | 1 | never | False |
| classic/tests/default.test.ts | basic defaults | 1 | never | False |
| classic/tests/default.test.ts | default with optional | 1 | never | False |
| classic/tests/default.test.ts | default with transform | 1 | never | False |
| classic/tests/default.test.ts | default on existing optional | 1 | never | False |
| classic/tests/default.test.ts | optional on default | 1 | never | False |
| classic/tests/default.test.ts | removeDefault | 1 | never | False |
| classic/tests/default.test.ts | apply default at output | 1 | never | False |
| classic/tests/default.test.ts | nested | 1 | never | False |
| classic/tests/default.test.ts | chained defaults | 1 | never | False |
| classic/tests/default.test.ts | object optionality | 1 | never | False |
| classic/tests/default.test.ts | nested prefault/default | 1 | never | False |
| classic/tests/default.test.ts | failing default | 1 | never | False |
| classic/tests/default.test.ts | partial should not clobber defaults | 1 | never | False |
| classic/tests/description.test.ts | .describe | 1 | never | False |
| classic/tests/description.test.ts | adding description with z.globalRegistry | 1 | never | False |
| classic/tests/discriminated-unions.test.ts | _values | 1 | never | False |
| classic/tests/discriminated-unions.test.ts | valid parse - object | 1 | never | False |
| classic/tests/discriminated-unions.test.ts | valid - include discriminator key (deprecated) | 1 | never | False |
| classic/tests/discriminated-unions.test.ts | valid - optional discriminator (object) | 1 | never | False |
| classic/tests/discriminated-unions.test.ts | valid - discriminator value of various primitive types | 1 | never | False |
| classic/tests/discriminated-unions.test.ts | invalid - null | 1 | never | False |
| classic/tests/discriminated-unions.test.ts | invalid discriminator value | 1 | v4.1.0 | False |
| classic/tests/discriminated-unions.test.ts | invalid discriminator value - unionFallback | 1 | never | False |
| classic/tests/discriminated-unions.test.ts | valid discriminator value, invalid data | 1 | never | False |
| classic/tests/discriminated-unions.test.ts | wrong schema - missing discriminator | 1 | never | False |
| classic/tests/discriminated-unions.test.ts | async - valid | 1 | never | False |
| classic/tests/discriminated-unions.test.ts | async - invalid | 1 | never | False |
| classic/tests/discriminated-unions.test.ts | valid - literals with .default or .pipe | 1 | never | False |
| classic/tests/discriminated-unions.test.ts | enum and nativeEnum | 1 | never | False |
| classic/tests/discriminated-unions.test.ts | branded | 1 | never | False |
| classic/tests/discriminated-unions.test.ts | optional and nullable | 1 | never | False |
| classic/tests/discriminated-unions.test.ts | multiple discriminators | 1 | never | False |
| classic/tests/discriminated-unions.test.ts | single element union | 1 | never | False |
| classic/tests/discriminated-unions.test.ts | nested discriminated unions | 1 | never | False |
| classic/tests/discriminated-unions.test.ts | readonly literal discriminator | 1 | never | False |
| classic/tests/discriminated-unions.test.ts | pipes | 1 | never | False |
| classic/tests/enum.test.ts | enum from string array | 1 | never | False |
| classic/tests/enum.test.ts | enum from const object | 1 | never | False |
| classic/tests/enum.test.ts | enum from native enum | 1 | never | False |
| classic/tests/enum.test.ts | enum from native enum with numeric keys | 1 | never | False |
| classic/tests/enum.test.ts | issue metadata | 1 | never | False |
| classic/tests/enum.test.ts | enum from non-const inputs | 1 | never | False |
| classic/tests/enum.test.ts | get options | 1 | never | False |
| classic/tests/enum.test.ts | readonly enum | 1 | never | False |
| classic/tests/enum.test.ts | error map | 1 | never | False |
| classic/tests/enum.test.ts | type signatures | 1 | never | False |
| classic/tests/enum.test.ts | extract | 1 | never | False |
| classic/tests/enum.test.ts | exclude | 1 | never | False |
| classic/tests/enum.test.ts | error map inheritance | 1 | never | False |
| classic/tests/enum.test.ts | readonly in ZodEnumDef | 1 | never | False |
| classic/tests/enum.test.ts | enum error message, invalid enum elementstring | 1 | never | False |
| classic/tests/enum.test.ts | enum error message, invalid type | 1 | never | False |
| classic/tests/enum.test.ts | nativeEnum default error message | 1 | never | False |
| classic/tests/enum.test.ts | enum with message returns the custom error message | 1 | never | False |
| classic/tests/enum.test.ts | enum with diagonal keys | 1 | never | False |
| classic/tests/error-utils.test.ts | regular error | 1 | never | False |
| classic/tests/error-utils.test.ts | .flatten() | 1 | never | False |
| classic/tests/error-utils.test.ts | custom .flatten() | 1 | never | False |
| classic/tests/error-utils.test.ts | .format() | 1 | never | False |
| classic/tests/error-utils.test.ts | custom .format() | 1 | never | False |
| classic/tests/error-utils.test.ts | all errors | 1 | never | False |
| classic/tests/error-utils.test.ts | z.treeifyError | 1 | never | False |
| classic/tests/error-utils.test.ts | z.treeifyError 2 | 1 | never | False |
| classic/tests/error-utils.test.ts | z.prettifyError | 1 | never | False |
| classic/tests/error-utils.test.ts | z.toDotPath | 1 | never | False |
| classic/tests/error-utils.test.ts | inheritance | 1 | never | False |
| classic/tests/error-utils.test.ts | disc union treeify/format | 1 | never | False |
| classic/tests/error.test.ts | error creation | 1 | never | False |
| classic/tests/error.test.ts | do not allow error and message together | 1 | never | False |
| classic/tests/error.test.ts | type error with custom error map | 1 | never | False |
| classic/tests/error.test.ts | refinement fail with params | 1 | never | False |
| classic/tests/error.test.ts | hard coded error  with custom errormap | 1 | never | False |
| classic/tests/error.test.ts | default error message | 1 | never | False |
| classic/tests/error.test.ts | override error in refine | 1 | never | False |
| classic/tests/error.test.ts | override error in refinement | 1 | never | False |
| classic/tests/error.test.ts | array minimum | 1 | never | False |
| classic/tests/error.test.ts | literal bigint default error message | 1 | never | False |
| classic/tests/error.test.ts | custom path in custom error map | 1 | never | False |
| classic/tests/error.test.ts | root level formatting | 1 | never | False |
| classic/tests/error.test.ts | custom path | 1 | never | False |
| classic/tests/error.test.ts | custom path | 2 | never | False |
| classic/tests/error.test.ts | no abort early on refinements | 1 | never | False |
| classic/tests/error.test.ts | detect issue with input fallback | 1 | never | False |
| classic/tests/error.test.ts | formatting | 1 | never | False |
| classic/tests/error.test.ts | formatting with nullable and optional fields | 1 | never | False |
| classic/tests/error.test.ts | inferFlattenedErrors | 1 | never | False |
| classic/tests/error.test.ts | schema-bound error map | 1 | never | False |
| classic/tests/error.test.ts | bound error map overrides contextual | 1 | never | False |
| classic/tests/error.test.ts | z.config customError  | 1 | v4.5.0 | False |
| classic/tests/error.test.ts | empty string error message | 1 | never | False |
| classic/tests/error.test.ts | dont short circuit on continuable errors | 1 | v4.5.0 | False |
| classic/tests/error.test.ts | string error params | 1 | never | False |
| classic/tests/error.test.ts | error inheritance | 1 | never | False |
| classic/tests/error.test.ts | error serialization | 1 | v4.5.0 | False |
| classic/tests/file.test.ts | passing validations | 1 | never | False |
| classic/tests/file.test.ts | failing validations | 1 | v4.1.0 | False |
| classic/tests/firstparty.test.ts | first party switch | 1 | never | False |
| classic/tests/firstparty.test.ts | $ZodSchemaTypes | 1 | never | False |
| classic/tests/function.test.ts | function parsing | 1 | never | False |
| classic/tests/function.test.ts | parsed function fail 1 | 1 | never | False |
| classic/tests/function.test.ts | parsed function fail 2 | 1 | never | False |
| classic/tests/function.test.ts | function inference 1 | 1 | never | False |
| classic/tests/function.test.ts | args method | 1 | never | False |
| classic/tests/function.test.ts | function inference 2 | 1 | never | False |
| classic/tests/function.test.ts | valid function run | 1 | never | False |
| classic/tests/function.test.ts | input validation error | 1 | v4.4.0 | False |
| classic/tests/function.test.ts | array inputs | 1 | never | False |
| classic/tests/function.test.ts | output validation error | 1 | never | False |
| classic/tests/function.test.ts | function with async refinements | 1 | never | False |
| classic/tests/function.test.ts | non async function with async refinements should fail | 1 | never | False |
| classic/tests/function.test.ts | extra parameters with rest | 1 | never | False |
| classic/tests/generics.test.ts | generics | 1 | never | False |
| classic/tests/generics.test.ts | generics with optional | 1 | never | False |
| classic/tests/generics.test.ts | nested no undefined | 1 | never | False |
| classic/tests/generics.test.ts | generic on output type | 1 | never | False |
| classic/tests/index.test.ts | z.boolean | 1 | never | False |
| classic/tests/index.test.ts | z.bigint | 1 | never | False |
| classic/tests/index.test.ts | z.symbol | 1 | never | False |
| classic/tests/index.test.ts | z.date | 1 | never | False |
| classic/tests/index.test.ts | z.coerce.string | 1 | never | False |
| classic/tests/index.test.ts | z.coerce.number | 1 | never | False |
| classic/tests/index.test.ts | z.coerce.boolean | 1 | never | False |
| classic/tests/index.test.ts | z.coerce.bigint | 1 | never | False |
| classic/tests/index.test.ts | z.coerce.date | 1 | never | False |
| classic/tests/index.test.ts | z.iso.datetime | 1 | never | False |
| classic/tests/index.test.ts | z.iso.date | 1 | never | False |
| classic/tests/index.test.ts | z.iso.time | 1 | never | False |
| classic/tests/index.test.ts | z.iso.duration | 1 | never | False |
| classic/tests/index.test.ts | z.undefined | 1 | never | False |
| classic/tests/index.test.ts | z.null | 1 | never | False |
| classic/tests/index.test.ts | z.any | 1 | never | False |
| classic/tests/index.test.ts | z.unknown | 1 | never | False |
| classic/tests/index.test.ts | z.never | 1 | never | False |
| classic/tests/index.test.ts | z.void | 1 | never | False |
| classic/tests/index.test.ts | z.array | 1 | never | False |
| classic/tests/index.test.ts | z.union | 1 | never | False |
| classic/tests/index.test.ts | z.intersection | 1 | never | False |
| classic/tests/index.test.ts | z.tuple | 1 | never | False |
| classic/tests/index.test.ts | z.record | 1 | never | False |
| classic/tests/index.test.ts | z.map | 1 | never | False |
| classic/tests/index.test.ts | z.map invalid_element | 1 | never | False |
| classic/tests/index.test.ts | z.map async | 1 | never | False |
| classic/tests/index.test.ts | z.set | 1 | never | False |
| classic/tests/index.test.ts | z.enum | 1 | never | False |
| classic/tests/index.test.ts | z.enum - native | 1 | never | False |
| classic/tests/index.test.ts | z.nativeEnum | 1 | never | False |
| classic/tests/index.test.ts | z.literal | 1 | never | False |
| classic/tests/index.test.ts | z.file | 1 | never | False |
| classic/tests/index.test.ts | z.transform | 1 | never | False |
| classic/tests/index.test.ts | z.transform async | 1 | never | False |
| classic/tests/index.test.ts | z.preprocess | 1 | never | False |
| classic/tests/index.test.ts | z.optional | 1 | never | False |
| classic/tests/index.test.ts | z.nullable | 1 | never | False |
| classic/tests/index.test.ts | z.default | 1 | never | False |
| classic/tests/index.test.ts | z.catch | 1 | never | False |
| classic/tests/index.test.ts | z.nan | 1 | never | False |
| classic/tests/index.test.ts | z.pipe | 1 | never | False |
| classic/tests/index.test.ts | z.readonly | 1 | never | False |
| classic/tests/index.test.ts | z.templateLiteral | 1 | never | False |
| classic/tests/index.test.ts | z.custom schema | 1 | never | False |
| classic/tests/index.test.ts | z.custom check | 1 | never | False |
| classic/tests/index.test.ts | z.check | 1 | never | False |
| classic/tests/index.test.ts | z.instanceof | 1 | never | False |
| classic/tests/index.test.ts | z.refine | 1 | never | False |
| classic/tests/index.test.ts | z.transform | 2 | never | False |
| classic/tests/index.test.ts | z.$brand() | 1 | never | False |
| classic/tests/index.test.ts | z.lazy | 1 | never | False |
| classic/tests/index.test.ts | z.json | 1 | never | False |
| classic/tests/index.test.ts | z.promise | 1 | never | False |
| classic/tests/index.test.ts | isPlainObject | 1 | never | False |
| classic/tests/index.test.ts | def typing | 1 | never | False |
| classic/tests/instanceof.test.ts | instanceof | 1 | never | False |
| classic/tests/instanceof.test.ts | instanceof fatal | 1 | never | False |
| classic/tests/intersection.test.ts | object intersection | 1 | never | False |
| classic/tests/intersection.test.ts | object intersection: loose | 1 | never | False |
| classic/tests/intersection.test.ts | object intersection: strict | 1 | v4.4.0 | False |
| classic/tests/intersection.test.ts | deep intersection | 1 | never | False |
| classic/tests/intersection.test.ts | deep intersection of arrays | 1 | never | False |
| classic/tests/intersection.test.ts | invalid intersection types | 1 | never | False |
| classic/tests/intersection.test.ts | invalid array merge (incompatible lengths) | 1 | never | False |
| classic/tests/intersection.test.ts | invalid array merge (incompatible elements) | 1 | never | False |
| classic/tests/intersection.test.ts | invalid object merge | 1 | never | False |
| classic/tests/intersection.test.ts | invalid deep merge of object and array combination | 1 | never | False |
| classic/tests/json.test.ts | <anonymous> | 1 | never | False |
| classic/tests/lazy.test.ts | opt passthrough | 1 | v4.5.0 | False |
| classic/tests/lazy.test.ts | schema getter | 1 | never | False |
| classic/tests/lazy.test.ts | lazy proxy | 1 | never | False |
| classic/tests/lazy.test.ts | recursion with z.lazy | 1 | never | False |
| classic/tests/lazy.test.ts | recursive union wit z.lazy | 1 | never | False |
| classic/tests/lazy.test.ts | mutual recursion with lazy | 1 | never | False |
| classic/tests/lazy.test.ts | mutual recursion with cyclical data | 1 | never | False |
| classic/tests/lazy.test.ts | complicated self-recursion | 1 | never | False |
| classic/tests/lazy.test.ts | lazy initialization | 1 | never | False |
| classic/tests/literal.test.ts | passing validations | 1 | never | False |
| classic/tests/literal.test.ts | failing validations | 1 | never | False |
| classic/tests/literal.test.ts | invalid_literal should have `input` field with data | 1 | never | False |
| classic/tests/literal.test.ts | invalid_literal should return default message | 1 | never | False |
| classic/tests/literal.test.ts | invalid_literal should return custom message | 1 | never | False |
| classic/tests/literal.test.ts | literal default error message | 1 | never | False |
| classic/tests/literal.test.ts | literal bigint default error message | 1 | never | False |
| classic/tests/literal.test.ts | .value getter | 1 | never | False |
| classic/tests/literal.test.ts | readonly | 1 | never | False |
| classic/tests/map.test.ts | type inference | 1 | never | False |
| classic/tests/map.test.ts | valid parse | 1 | never | False |
| classic/tests/map.test.ts | valid parse async | 1 | never | False |
| classic/tests/map.test.ts | throws when a Set is given | 1 | never | False |
| classic/tests/map.test.ts | throws when the given map has invalid key and invalid input | 1 | never | False |
| classic/tests/map.test.ts | throws when the given map has multiple invalid entries | 1 | never | False |
| classic/tests/map.test.ts | dirty | 1 | never | False |
| classic/tests/map.test.ts | map with object keys | 1 | never | False |
| classic/tests/nan.test.ts | passing validations | 1 | never | False |
| classic/tests/nan.test.ts | failing validations | 1 | never | False |
| classic/tests/nested-refine.test.ts | nested refinements | 1 | never | False |
| classic/tests/nonoptional.test.ts | nonoptional | 1 | never | False |
| classic/tests/nonoptional.test.ts | nonoptional with default | 1 | never | False |
| classic/tests/nonoptional.test.ts | nonoptional in object | 1 | never | False |
| classic/tests/nullable.test.ts | .nullable() | 1 | never | False |
| classic/tests/nullable.test.ts | .nullable unwrap | 1 | never | False |
| classic/tests/nullable.test.ts | z.null | 1 | never | False |
| classic/tests/number.test.ts | z.number() basic validation | 1 | never | False |
| classic/tests/number.test.ts | NaN validation | 1 | never | False |
| classic/tests/number.test.ts | Infinity validation | 1 | v4.5.0 | False |
| classic/tests/number.test.ts | .gt() validation | 1 | never | False |
| classic/tests/number.test.ts | .gte() validation | 1 | never | False |
| classic/tests/number.test.ts | .min() validation | 1 | never | False |
| classic/tests/number.test.ts | .lt() validation | 1 | never | False |
| classic/tests/number.test.ts | .lte() validation | 1 | never | False |
| classic/tests/number.test.ts | .max() validation | 1 | never | False |
| classic/tests/number.test.ts | .int() validation | 1 | never | False |
| classic/tests/number.test.ts | .positive() validation | 1 | never | False |
| classic/tests/number.test.ts | .negative() validation | 1 | never | False |
| classic/tests/number.test.ts | .nonpositive() validation | 1 | never | False |
| classic/tests/number.test.ts | .nonnegative() validation | 1 | never | False |
| classic/tests/number.test.ts | .multipleOf() with positive divisor | 1 | never | False |
| classic/tests/number.test.ts | .multipleOf() with negative divisor | 1 | never | False |
| classic/tests/number.test.ts | .step() validation | 1 | never | False |
| classic/tests/number.test.ts | .finite() validation | 1 | v4.5.0 | False |
| classic/tests/number.test.ts | .safe() validation | 1 | never | False |
| classic/tests/number.test.ts | min value getters | 1 | never | False |
| classic/tests/number.test.ts | max value getters | 1 | never | False |
| classic/tests/number.test.ts | int getter | 1 | never | False |
| classic/tests/number.test.ts | finite getter | 1 | never | False |
| classic/tests/number.test.ts | string format methods | 1 | never | False |
| classic/tests/number.test.ts | error customization | 1 | never | False |
| classic/tests/object.test.ts | object type inference | 1 | never | False |
| classic/tests/object.test.ts | unknown throw | 1 | never | False |
| classic/tests/object.test.ts | shape() should return schema of particular key | 1 | never | False |
| classic/tests/object.test.ts | correct parsing | 1 | never | False |
| classic/tests/object.test.ts | nonstrict by default | 1 | never | False |
| classic/tests/object.test.ts | parse optional keys  | 1 | never | False |
| classic/tests/object.test.ts | empty object | 1 | never | False |
| classic/tests/object.test.ts | strip by default | 1 | never | False |
| classic/tests/object.test.ts | unknownkeys override | 1 | never | False |
| classic/tests/object.test.ts | passthrough unknown | 1 | never | False |
| classic/tests/object.test.ts | strip unknown | 1 | never | False |
| classic/tests/object.test.ts | strict | 1 | never | False |
| classic/tests/object.test.ts | catchall inference | 1 | never | False |
| classic/tests/object.test.ts | catchall overrides strict | 1 | never | False |
| classic/tests/object.test.ts | catchall overrides strict | 2 | never | False |
| classic/tests/object.test.ts | optional keys are unset | 1 | never | False |
| classic/tests/object.test.ts | catchall parsing | 1 | never | False |
| classic/tests/object.test.ts | nonexistent keys | 1 | never | False |
| classic/tests/object.test.ts | test async union | 1 | never | False |
| classic/tests/object.test.ts | test inferred merged type | 1 | never | False |
| classic/tests/object.test.ts | inferred type with Record shape | 1 | never | False |
| classic/tests/object.test.ts | inferred merged object type with optional properties | 1 | never | False |
| classic/tests/object.test.ts | inferred unioned object type with optional properties | 1 | never | False |
| classic/tests/object.test.ts | inferred enum type | 1 | never | False |
| classic/tests/object.test.ts | inferred partial object type with optional properties | 1 | never | False |
| classic/tests/object.test.ts | inferred picked object type with optional properties | 1 | never | False |
| classic/tests/object.test.ts | inferred type for unknown/any keys | 1 | never | False |
| classic/tests/object.test.ts | strictObject | 1 | never | False |
| classic/tests/object.test.ts | object with refine | 1 | never | False |
| classic/tests/object.test.ts | intersection of object with date | 1 | never | False |
| classic/tests/object.test.ts | intersection of object with refine with date | 1 | never | False |
| classic/tests/object.test.ts | constructor key | 1 | never | False |
| classic/tests/object.test.ts | constructor key | 2 | never | False |
| classic/tests/object.test.ts | catchall | 1 | never | False |
| classic/tests/object.test.ts | unknownkeys merging | 1 | never | False |
| classic/tests/object.test.ts | extend() should return schema with new key | 1 | never | False |
| classic/tests/object.test.ts | extend() should have power to override existing key | 1 | never | False |
| classic/tests/object.test.ts | passthrough index signature | 1 | never | False |
| classic/tests/object.test.ts | assignability | 1 | never | False |
| classic/tests/object.test.ts | null prototype | 1 | never | False |
| classic/tests/object.test.ts | empty objects | 1 | never | False |
| classic/tests/object.test.ts | preserve key order | 1 | never | False |
| classic/tests/object.test.ts | empty shape | 1 | never | False |
| classic/tests/object.test.ts | zodtype assignability | 1 | never | False |
| classic/tests/object.test.ts | index signature in shape | 1 | never | False |
| classic/tests/optional.test.ts | .optional() | 1 | never | False |
| classic/tests/optional.test.ts | unwrap | 1 | never | False |
| classic/tests/optional.test.ts | optionality | 1 | v4.4.0 | False |
| classic/tests/optional.test.ts | pipe optionality | 1 | v4.5.0 | False |
| classic/tests/optional.test.ts | pipe optionality inside objects | 1 | never | False |
| classic/tests/partial.test.ts | shallow inference | 1 | never | False |
| classic/tests/partial.test.ts | shallow partial parse | 1 | never | False |
| classic/tests/partial.test.ts | required | 1 | never | False |
| classic/tests/partial.test.ts | required inference | 1 | never | False |
| classic/tests/partial.test.ts | required with mask | 1 | never | False |
| classic/tests/partial.test.ts | required with mask -- ignore falsy values | 1 | never | False |
| classic/tests/partial.test.ts | partial with mask | 1 | never | False |
| classic/tests/partial.test.ts | partial with mask -- ignore falsy values | 1 | never | False |
| classic/tests/pickomit.test.ts | pick type inference | 1 | never | False |
| classic/tests/pickomit.test.ts | pick parse - success | 1 | never | False |
| classic/tests/pickomit.test.ts | pick parse - fail | 1 | never | False |
| classic/tests/pickomit.test.ts | pick - remove optional | 1 | never | False |
| classic/tests/pickomit.test.ts | omit type inference | 1 | never | False |
| classic/tests/pickomit.test.ts | omit parse - success | 1 | never | False |
| classic/tests/pickomit.test.ts | omit parse - fail | 1 | never | False |
| classic/tests/pickomit.test.ts | omit - remove optional | 1 | never | False |
| classic/tests/pickomit.test.ts | nonstrict inference | 1 | never | False |
| classic/tests/pickomit.test.ts | nonstrict parsing - pass | 1 | never | False |
| classic/tests/pickomit.test.ts | nonstrict parsing - fail | 1 | never | False |
| classic/tests/pickomit.test.ts | pick/omit/required/partial - do not allow unknown keys | 1 | v4.1.0 | True |
| classic/tests/pipe.test.ts | string to number pipe | 1 | never | False |
| classic/tests/pipe.test.ts | string to number pipe async | 1 | never | False |
| classic/tests/pipe.test.ts | string with default fallback | 1 | never | False |
| classic/tests/pipe.test.ts | continue on non-fatal errors | 1 | v4.1.0 | False |
| classic/tests/pipe.test.ts | break on fatal errors | 1 | never | False |
| classic/tests/prefault.test.ts | basic prefault | 1 | never | False |
| classic/tests/prefault.test.ts | prefault inside object | 1 | never | False |
| classic/tests/preprocess.test.ts | preprocess | 1 | never | False |
| classic/tests/preprocess.test.ts | async preprocess | 1 | never | False |
| classic/tests/preprocess.test.ts | ctx.addIssue accepts string | 1 | never | False |
| classic/tests/preprocess.test.ts | preprocess ctx.addIssue with parse | 1 | never | False |
| classic/tests/preprocess.test.ts | preprocess ctx.addIssue non-fatal by default | 1 | v4.1.0 | False |
| classic/tests/preprocess.test.ts | preprocess ctx.addIssue fatal true | 1 | never | False |
| classic/tests/preprocess.test.ts | async preprocess ctx.addIssue with parseAsync | 1 | never | False |
| classic/tests/preprocess.test.ts | z.NEVER in preprocess | 1 | v4.1.0 | False |
| classic/tests/preprocess.test.ts | preprocess as the second property of object | 1 | never | False |
| classic/tests/preprocess.test.ts | preprocess validates with sibling errors | 1 | never | False |
| classic/tests/preprocess.test.ts | perform transform with non-fatal issues | 1 | v4.1.0 | False |
| classic/tests/primitive.test.ts | literal string schema | 1 | never | False |
| classic/tests/primitive.test.ts | literal number schema | 1 | never | False |
| classic/tests/primitive.test.ts | literal boolean schema | 1 | never | False |
| classic/tests/primitive.test.ts | literal bigint schema | 1 | never | False |
| classic/tests/primitive.test.ts | string schema | 1 | never | False |
| classic/tests/primitive.test.ts | number schema | 1 | never | False |
| classic/tests/primitive.test.ts | bigint schema | 1 | never | False |
| classic/tests/primitive.test.ts | boolean schema | 1 | never | False |
| classic/tests/primitive.test.ts | date schema | 1 | never | False |
| classic/tests/primitive.test.ts | symbol schema | 1 | never | False |
| classic/tests/primitive.test.ts | undefined schema | 1 | never | False |
| classic/tests/primitive.test.ts | null schema | 1 | never | False |
| classic/tests/primitive.test.ts | primitive inference | 1 | never | False |
| classic/tests/primitive.test.ts | get literal values | 1 | never | False |
| classic/tests/promise.test.ts | promise inference | 1 | never | False |
| classic/tests/promise.test.ts | promise parsing success | 1 | never | False |
| classic/tests/promise.test.ts | promise parsing fail | 1 | never | False |
| classic/tests/promise.test.ts | promise parsing fail 2 | 1 | never | False |
| classic/tests/promise.test.ts | promise parsing fail | 2 | never | False |
| classic/tests/promise.test.ts | sync promise parsing | 1 | never | False |
| classic/tests/promise.test.ts | async function pass | 1 | never | False |
| classic/tests/promise.test.ts | async function fail | 1 | never | False |
| classic/tests/promise.test.ts | async promise parsing | 1 | never | False |
| classic/tests/promise.test.ts | resolves | 1 | never | False |
| classic/tests/prototypes.test.ts | prototype extension | 1 | never | False |
| classic/tests/readonly.test.ts | flat inference | 1 | never | False |
| classic/tests/readonly.test.ts | object freezing | 1 | never | False |
| classic/tests/readonly.test.ts | async object freezing | 1 | never | False |
| classic/tests/readonly.test.ts | readonly inference | 1 | never | False |
| classic/tests/readonly.test.ts | readonly parse | 1 | never | False |
| classic/tests/readonly.test.ts | readonly parse with tuples | 1 | never | False |
| classic/tests/readonly.test.ts | readonly and the get method | 1 | never | False |
| classic/tests/record.test.ts | type inference | 1 | never | False |
| classic/tests/record.test.ts | enum exhaustiveness | 1 | never | False |
| classic/tests/record.test.ts | literal exhaustiveness | 1 | never | False |
| classic/tests/record.test.ts | pipe exhaustiveness | 1 | never | False |
| classic/tests/record.test.ts | union exhaustiveness | 1 | never | False |
| classic/tests/record.test.ts | string record parse - pass | 1 | never | False |
| classic/tests/record.test.ts | key and value getters | 1 | never | False |
| classic/tests/record.test.ts | is not vulnerable to prototype pollution | 1 | never | False |
| classic/tests/record.test.ts | dont remove undefined values | 1 | never | False |
| classic/tests/record.test.ts | allow undefined values | 1 | never | False |
| classic/tests/record.test.ts | async parsing | 1 | never | False |
| classic/tests/record.test.ts | async parsing | 2 | never | False |
| classic/tests/record.test.ts | partial record | 1 | never | False |
| classic/tests/recursive-types.test.ts | recursion with z.lazy | 1 | never | False |
| classic/tests/recursive-types.test.ts | recursion involving union type | 1 | never | False |
| classic/tests/recursive-types.test.ts | mutual recursion - native | 1 | never | False |
| classic/tests/recursive-types.test.ts | pick and omit with getter | 1 | never | False |
| classic/tests/recursive-types.test.ts | deferred self-recursion | 1 | never | False |
| classic/tests/recursive-types.test.ts | deferred mutual recursion | 1 | never | False |
| classic/tests/recursive-types.test.ts | mutual recursion with meta | 1 | never | False |
| classic/tests/recursive-types.test.ts | recursion compatibility | 1 | never | False |
| classic/tests/refine.test.ts | basic refinement functionality should create a new schema instance when refining | 1 | never | False |
| classic/tests/refine.test.ts | basic refinement functionality should validate according to refinement logic | 1 | never | False |
| classic/tests/refine.test.ts | basic refinement functionality should validate strict mode correctly | 1 | never | False |
| classic/tests/refine.test.ts | refinement with custom error messages should use custom error message when validation fails | 1 | never | False |
| classic/tests/refine.test.ts | async refinements should support async refinement functions | 1 | never | False |
| classic/tests/refine.test.ts | early termination options should abort early with continue: false | 1 | never | False |
| classic/tests/refine.test.ts | early termination options should abort early with fatal: true | 1 | never | False |
| classic/tests/refine.test.ts | early termination options should abort early with abort flag | 1 | never | False |
| classic/tests/refine.test.ts | custom error paths should use custom path in error message | 1 | never | False |
| classic/tests/refine.test.ts | superRefine functionality should support multiple validation rules | 1 | never | False |
| classic/tests/refine.test.ts | superRefine functionality should support async superRefine | 1 | never | False |
| classic/tests/refine.test.ts | superRefine functionality should accept string as shorthand for custom error message | 1 | never | False |
| classic/tests/refine.test.ts | superRefine functionality should respect fatal flag in superRefine | 1 | never | False |
| classic/tests/refine.test.ts | chained refinements should collect all validation errors when appropriate | 1 | never | False |
| classic/tests/refine.test.ts | when | 1 | never | False |
| classic/tests/registries.test.ts | globalRegistry | 1 | never | False |
| classic/tests/registries.test.ts | z.registry | 1 | never | False |
| classic/tests/registries.test.ts | z.registry no metadata | 1 | never | False |
| classic/tests/registries.test.ts | z.registry with schema constraints | 1 | never | False |
| classic/tests/registries.test.ts | output type in registry meta | 1 | never | False |
| classic/tests/registries.test.ts | output type in registry meta - objects and arrays | 1 | never | False |
| classic/tests/registries.test.ts | input type in registry meta | 1 | never | False |
| classic/tests/registries.test.ts | input type in registry meta - objects and arrays | 1 | never | False |
| classic/tests/registries.test.ts | .meta method | 1 | never | False |
| classic/tests/registries.test.ts | .meta metadata does not bubble up | 1 | never | False |
| classic/tests/registries.test.ts | .describe | 1 | never | False |
| classic/tests/registries.test.ts | inherit across clone | 1 | never | False |
| classic/tests/registries.test.ts | loose examples | 1 | never | False |
| classic/tests/registries.test.ts | function meta witout replacement | 1 | never | False |
| classic/tests/registries.test.ts | function meta with replacement | 1 | never | False |
| classic/tests/registries.test.ts | test .clear() | 1 | never | False |
| classic/tests/set.test.ts | type inference | 1 | never | False |
| classic/tests/set.test.ts | valid parse | 1 | never | False |
| classic/tests/set.test.ts | valid parse async | 1 | never | False |
| classic/tests/set.test.ts | valid parse: size-related methods | 1 | never | False |
| classic/tests/set.test.ts | failing when parsing empty set in nonempty  | 1 | never | False |
| classic/tests/set.test.ts | failing when set is smaller than min()  | 1 | never | False |
| classic/tests/set.test.ts | failing when set is bigger than max()  | 1 | never | False |
| classic/tests/set.test.ts | doesn’t throw when an empty set is given | 1 | never | False |
| classic/tests/set.test.ts | throws when a Map is given | 1 | never | False |
| classic/tests/set.test.ts | throws when the given set has invalid input | 1 | never | False |
| classic/tests/set.test.ts | throws when the given set has multiple invalid entries | 1 | never | False |
| classic/tests/set.test.ts | min/max | 1 | v4.1.0 | False |
| classic/tests/standard-schema.test.ts | length checks | 1 | never | False |
| classic/tests/standard-schema.test.ts | length checks | 2 | never | False |
| classic/tests/standard-schema.test.ts | length checks | 3 | never | False |
| classic/tests/standard-schema.test.ts | length checks | 4 | never | False |
| classic/tests/string-formats.test.ts | string format methods | 1 | never | False |
| classic/tests/string-formats.test.ts | z.stringFormat | 1 | never | False |
| classic/tests/string.test.ts | length checks | 1 | never | False |
| classic/tests/string.test.ts | includes | 1 | never | False |
| classic/tests/string.test.ts | startswith/endswith | 1 | never | False |
| classic/tests/string.test.ts | email validations | 1 | never | False |
| classic/tests/string.test.ts | base64 validations | 1 | never | False |
| classic/tests/string.test.ts | base64url validations | 1 | never | False |
| classic/tests/string.test.ts | big base64 and base64url | 1 | never | False |
| classic/tests/string.test.ts | jwt token | 1 | never | False |
| classic/tests/string.test.ts | url validations | 1 | never | False |
| classic/tests/string.test.ts | httpurl | 1 | never | False |
| classic/tests/string.test.ts | url error overrides | 1 | never | False |
| classic/tests/string.test.ts | emoji validations | 1 | never | False |
| classic/tests/string.test.ts | nanoid | 1 | never | False |
| classic/tests/string.test.ts | bad nanoid | 1 | never | False |
| classic/tests/string.test.ts | good uuid | 1 | never | False |
| classic/tests/string.test.ts | bad uuid | 1 | v4.1.0 | False |
| classic/tests/string.test.ts | good guid | 1 | never | False |
| classic/tests/string.test.ts | bad guid | 1 | never | False |
| classic/tests/string.test.ts | cuid | 1 | v4.4.0 | False |
| classic/tests/string.test.ts | cuid2 | 1 | never | False |
| classic/tests/string.test.ts | ulid | 1 | v4.5.0 | False |
| classic/tests/string.test.ts | xid | 1 | never | False |
| classic/tests/string.test.ts | ksuid | 1 | never | False |
| classic/tests/string.test.ts | regex | 1 | never | False |
| classic/tests/string.test.ts | regexp error message | 1 | never | False |
| classic/tests/string.test.ts | regexp error custom message | 1 | never | False |
| classic/tests/string.test.ts | regex lastIndex reset | 1 | never | False |
| classic/tests/string.test.ts | format | 1 | never | False |
| classic/tests/string.test.ts | min max getters | 1 | never | False |
| classic/tests/string.test.ts | trim | 1 | never | False |
| classic/tests/string.test.ts | lowerCase | 1 | never | False |
| classic/tests/string.test.ts | IPv4 validation | 1 | never | False |
| classic/tests/string.test.ts | IPv6 validation | 1 | never | False |
| classic/tests/string.test.ts | CIDR v4 validation | 1 | never | False |
| classic/tests/string.test.ts | CIDR v6 validation | 1 | never | False |
| classic/tests/string.test.ts | E.164 validation | 1 | never | False |
| classic/tests/stringbool.test.ts | z.stringbool | 1 | never | False |
| classic/tests/stringbool.test.ts | custom values | 1 | never | False |
| classic/tests/stringbool.test.ts | custom values - case sensitive | 1 | never | False |
| classic/tests/stringbool.test.ts | z.stringbool with custom error messages | 1 | never | False |
| classic/tests/template-literal.test.ts | template literal type inference | 1 | never | False |
| classic/tests/template-literal.test.ts | template literal unsupported args | 1 | never | False |
| classic/tests/template-literal.test.ts | template literal parsing - success - basic cases | 1 | never | False |
| classic/tests/template-literal.test.ts | template literal parsing - failure - basic cases | 1 | v4.4.0 | False |
| classic/tests/template-literal.test.ts | regexes | 1 | v4.1.0 | False |
| classic/tests/template-literal.test.ts | template literal parsing - success - complex cases | 1 | never | False |
| classic/tests/template-literal.test.ts | template literal parsing - failure - complex cases | 1 | v4.2.0 | False |
| classic/tests/template-literal.test.ts | template literal parsing - failure - issue format | 1 | v4.2.0 | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema primitive types | 1 | v4.1.0 | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema unsupported schema types | 1 | never | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema string formats | 1 | v4.1.0 | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema string patterns | 1 | v4.5.0 | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema number constraints | 1 | never | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema arrays | 1 | never | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema unions | 1 | v4.5.0 | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema intersections | 1 | v4.5.0 | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema record | 1 | never | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema tuple | 1 | v4.5.0 | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema promise | 1 | never | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema lazy | 1 | never | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema enum | 1 | never | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema literal | 1 | never | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema pipe | 1 | never | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema simple objects | 1 | never | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema additionalproperties in z.object | 1 | never | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema catchall objects | 1 | never | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema optional fields - object | 1 | never | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema recursive object | 1 | never | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema simple interface | 1 | never | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema catchall interface | 1 | never | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema recursive interface schemas | 1 | never | False |
| classic/tests/to-json-schema.test.ts | toJSONSchema mutually recursive interface schemas | 1 | never | False |
| classic/tests/to-json-schema.test.ts | override | 1 | never | False |
| classic/tests/to-json-schema.test.ts | override: do not run on references | 1 | v4.3.0 | False |
| classic/tests/to-json-schema.test.ts | override with refs | 1 | never | False |
| classic/tests/to-json-schema.test.ts | override execution order | 1 | v4.5.0 | False |
| classic/tests/to-json-schema.test.ts | override with path | 1 | never | False |
| classic/tests/to-json-schema.test.ts | pipe | 1 | never | False |
| classic/tests/to-json-schema.test.ts | passthrough schemas | 1 | never | False |
| classic/tests/to-json-schema.test.ts | extract schemas with id | 1 | v4.4.0 | False |
| classic/tests/to-json-schema.test.ts | unrepresentable literal values are ignored | 1 | never | False |
| classic/tests/to-json-schema.test.ts | describe with id | 1 | v4.4.0 | False |
| classic/tests/to-json-schema.test.ts | overwrite id | 1 | v4.4.0 | False |
| classic/tests/to-json-schema.test.ts | overwrite descriptions | 1 | never | False |
| classic/tests/to-json-schema.test.ts | top-level readonly | 1 | v4.4.0 | False |
| classic/tests/to-json-schema.test.ts | basic registry | 1 | never | False |
| classic/tests/to-json-schema.test.ts | _ref | 1 | never | False |
| classic/tests/to-json-schema.test.ts | defaults/prefaults | 1 | never | False |
| classic/tests/to-json-schema.test.ts | input type | 1 | v4.1.0 | False |
| classic/tests/to-json-schema.test.ts | examples on pipe | 1 | never | False |
| classic/tests/to-json-schema.test.ts | use output type for preprocess | 1 | never | False |
| classic/tests/to-json-schema.test.ts | flatten simple intersections | 1 | v4.5.0 | False |
| classic/tests/to-json-schema.test.ts | z.file() | 1 | v4.3.0 | False |
| classic/tests/to-json-schema.test.ts | custom toJSONSchema | 1 | never | False |
| classic/tests/to-json-schema.test.ts | cycle detection - root | 1 | never | False |
| classic/tests/to-json-schema.test.ts | cycle detection - mutual recursion | 1 | never | False |
| classic/tests/transform.test.ts | transform ctx.addIssue with parse | 1 | never | False |
| classic/tests/transform.test.ts | transform ctx.addIssue with parseAsync | 1 | never | False |
| classic/tests/transform.test.ts | z.NEVER in transform | 1 | never | False |
| classic/tests/transform.test.ts | basic transformations | 1 | never | False |
| classic/tests/transform.test.ts | coercion | 1 | never | False |
| classic/tests/transform.test.ts | async coercion | 1 | never | False |
| classic/tests/transform.test.ts | sync coercion async error | 1 | never | False |
| classic/tests/transform.test.ts | default | 1 | never | False |
| classic/tests/transform.test.ts | dynamic default | 1 | never | False |
| classic/tests/transform.test.ts | default when property is null or undefined | 1 | never | False |
| classic/tests/transform.test.ts | default with falsy values | 1 | never | False |
| classic/tests/transform.test.ts | object typing | 1 | never | False |
| classic/tests/transform.test.ts | transform method overloads | 1 | never | False |
| classic/tests/transform.test.ts | multiple transformers | 1 | never | False |
| classic/tests/transform.test.ts | short circuit on dirty | 1 | never | False |
| classic/tests/transform.test.ts | async short circuit on dirty | 1 | never | False |
| classic/tests/tuple.test.ts | successful validation | 1 | v4.1.0 | False |
| classic/tests/tuple.test.ts | async validation | 1 | v4.1.0 | False |
| classic/tests/tuple.test.ts | tuple with optional elements | 1 | never | False |
| classic/tests/tuple.test.ts | tuple with optional elements followed by required | 1 | never | False |
| classic/tests/tuple.test.ts | tuple with rest schema | 1 | never | False |
| classic/tests/tuple.test.ts | sparse array input | 1 | never | False |
| classic/tests/union.test.ts | function parsing | 1 | never | False |
| classic/tests/union.test.ts | union 2 | 1 | never | False |
| classic/tests/union.test.ts | return valid over invalid | 1 | never | False |
| classic/tests/union.test.ts | return errors from both union arms | 1 | v4.1.0 | False |
| classic/tests/union.test.ts | options getter | 1 | never | False |
| classic/tests/union.test.ts | readonly union | 1 | never | False |
| classic/tests/union.test.ts | union inferred types | 1 | never | False |
| classic/tests/union.test.ts | union values | 1 | never | False |
| classic/tests/validations.test.ts | string length | 1 | v4.5.0 | False |
| classic/tests/validations.test.ts | string min/max | 1 | never | False |
| classic/tests/validations.test.ts | string max | 1 | never | False |
| classic/tests/validations.test.ts | number min | 1 | never | False |
| classic/tests/validations.test.ts | number gte | 1 | never | False |
| classic/tests/validations.test.ts | number gt | 1 | never | False |
| classic/tests/validations.test.ts | number max | 1 | never | False |
| classic/tests/validations.test.ts | number lte | 1 | never | False |
| classic/tests/validations.test.ts | number lt | 1 | never | False |
| classic/tests/validations.test.ts | number nonnegative | 1 | never | False |
| classic/tests/validations.test.ts | number nonpositive | 1 | never | False |
| classic/tests/validations.test.ts | number negative | 1 | never | False |
| classic/tests/validations.test.ts | number positive | 1 | never | False |
| classic/tests/void.test.ts | void | 1 | never | False |
| mini/tests/assignability.test.ts | assignability | 1 | never | False |
| mini/tests/assignability.test.ts | assignability with type narrowing | 1 | never | False |
| mini/tests/brand.test.ts | branded types | 1 | never | False |
| mini/tests/checks.test.ts | z.lt | 1 | never | False |
| mini/tests/checks.test.ts | z.lte | 1 | never | False |
| mini/tests/checks.test.ts | z.max | 1 | never | False |
| mini/tests/checks.test.ts | z.gt | 1 | never | False |
| mini/tests/checks.test.ts | z.gte | 1 | never | False |
| mini/tests/checks.test.ts | z.min | 1 | never | False |
| mini/tests/checks.test.ts | z.maxLength | 1 | never | False |
| mini/tests/checks.test.ts | z.minLength | 1 | never | False |
| mini/tests/checks.test.ts | z.length | 1 | never | False |
| mini/tests/checks.test.ts | z.regex | 1 | never | False |
| mini/tests/checks.test.ts | z.includes | 1 | never | False |
| mini/tests/checks.test.ts | z.startsWith | 1 | never | False |
| mini/tests/checks.test.ts | z.endsWith | 1 | never | False |
| mini/tests/checks.test.ts | z.lowercase | 1 | never | False |
| mini/tests/checks.test.ts | z.uppercase | 1 | never | False |
| mini/tests/checks.test.ts | z.overwrite | 1 | never | False |
| mini/tests/checks.test.ts | abort early | 1 | never | False |
| mini/tests/computed.test.ts | min/max | 1 | v4.6.0 | False |
| mini/tests/computed.test.ts | multipleOf | 1 | v4.6.0 | False |
| mini/tests/computed.test.ts | int64 format | 1 | v4.6.0 | False |
| mini/tests/computed.test.ts | int32 format | 1 | v4.6.0 | False |
| mini/tests/computed.test.ts | array size | 1 | v4.6.0 | False |
| mini/tests/error.test.ts | no locale by default | 1 | never | False |
| mini/tests/error.test.ts | error inheritance | 1 | never | False |
| mini/tests/functions.test.ts | z.function | 1 | never | False |
| mini/tests/index.test.ts | z.boolean | 1 | never | False |
| mini/tests/index.test.ts | z.bigint | 1 | never | False |
| mini/tests/index.test.ts | z.symbol | 1 | never | False |
| mini/tests/index.test.ts | z.date | 1 | never | False |
| mini/tests/index.test.ts | z.coerce.string | 1 | never | False |
| mini/tests/index.test.ts | z.coerce.number | 1 | never | False |
| mini/tests/index.test.ts | z.coerce.boolean | 1 | never | False |
| mini/tests/index.test.ts | z.coerce.bigint | 1 | never | False |
| mini/tests/index.test.ts | z.coerce.date | 1 | never | False |
| mini/tests/index.test.ts | z.iso.datetime | 1 | never | False |
| mini/tests/index.test.ts | z.iso.date | 1 | never | False |
| mini/tests/index.test.ts | z.iso.time | 1 | never | False |
| mini/tests/index.test.ts | z.iso.duration | 1 | never | False |
| mini/tests/index.test.ts | z.undefined | 1 | never | False |
| mini/tests/index.test.ts | z.null | 1 | never | False |
| mini/tests/index.test.ts | z.any | 1 | never | False |
| mini/tests/index.test.ts | z.unknown | 1 | never | False |
| mini/tests/index.test.ts | z.never | 1 | never | False |
| mini/tests/index.test.ts | z.void | 1 | never | False |
| mini/tests/index.test.ts | z.array | 1 | never | False |
| mini/tests/index.test.ts | z.union | 1 | never | False |
| mini/tests/index.test.ts | z.intersection | 1 | never | False |
| mini/tests/index.test.ts | z.tuple | 1 | never | False |
| mini/tests/index.test.ts | z.record | 1 | never | False |
| mini/tests/index.test.ts | z.map | 1 | never | False |
| mini/tests/index.test.ts | z.map invalid_element | 1 | never | False |
| mini/tests/index.test.ts | z.map async | 1 | never | False |
| mini/tests/index.test.ts | z.set | 1 | never | False |
| mini/tests/index.test.ts | z.enum | 1 | never | False |
| mini/tests/index.test.ts | z.enum - native | 1 | never | False |
| mini/tests/index.test.ts | z.nativeEnum | 1 | never | False |
| mini/tests/index.test.ts | z.literal | 1 | never | False |
| mini/tests/index.test.ts | z.file | 1 | never | False |
| mini/tests/index.test.ts | z.transform | 1 | never | False |
| mini/tests/index.test.ts | z.transform async | 1 | never | False |
| mini/tests/index.test.ts | z.preprocess | 1 | never | False |
| mini/tests/index.test.ts | z.optional | 1 | never | False |
| mini/tests/index.test.ts | z.nullable | 1 | never | False |
| mini/tests/index.test.ts | z.default | 1 | never | False |
| mini/tests/index.test.ts | z.catch | 1 | never | False |
| mini/tests/index.test.ts | z.nan | 1 | never | False |
| mini/tests/index.test.ts | z.pipe | 1 | never | False |
| mini/tests/index.test.ts | z.readonly | 1 | never | False |
| mini/tests/index.test.ts | z.templateLiteral | 1 | never | False |
| mini/tests/index.test.ts | z.custom | 1 | never | False |
| mini/tests/index.test.ts | z.check | 1 | never | False |
| mini/tests/index.test.ts | z.instanceof | 1 | never | False |
| mini/tests/index.test.ts | z.refine | 1 | never | False |
| mini/tests/index.test.ts | z.transform | 2 | never | False |
| mini/tests/index.test.ts | z.$brand() | 1 | never | False |
| mini/tests/index.test.ts | z.lazy | 1 | never | False |
| mini/tests/index.test.ts | z.json | 1 | never | False |
| mini/tests/index.test.ts | z.stringbool | 1 | never | False |
| mini/tests/index.test.ts | z.promise | 1 | never | False |
| mini/tests/index.test.ts | z.pipe type enforcement | 1 | never | False |
| mini/tests/index.test.ts | def typing | 1 | never | False |
| mini/tests/number.test.ts | z.number | 1 | never | False |
| mini/tests/number.test.ts | z.number async | 1 | never | False |
| mini/tests/number.test.ts | z.int | 1 | never | False |
| mini/tests/number.test.ts | z.float32 | 1 | never | False |
| mini/tests/number.test.ts | z.float64 | 1 | never | False |
| mini/tests/number.test.ts | z.int32 | 1 | never | False |
| mini/tests/number.test.ts | z.uint32 | 1 | never | False |
| mini/tests/number.test.ts | z.int64 | 1 | never | False |
| mini/tests/number.test.ts | z.uint64 | 1 | never | False |
| mini/tests/object.test.ts | z.object | 1 | never | False |
| mini/tests/object.test.ts | z.object().check() | 1 | never | False |
| mini/tests/object.test.ts | z.strictObject | 1 | never | False |
| mini/tests/object.test.ts | z.looseObject | 1 | never | False |
| mini/tests/object.test.ts | z.keyof | 1 | never | False |
| mini/tests/object.test.ts | z.extend | 1 | never | False |
| mini/tests/object.test.ts | z.pick | 1 | never | False |
| mini/tests/object.test.ts | z.omit | 1 | never | False |
| mini/tests/object.test.ts | z.partial | 1 | never | False |
| mini/tests/object.test.ts | z.partial with mask | 1 | never | False |
| mini/tests/object.test.ts | z.catchall | 1 | never | False |
| mini/tests/prototypes.test.ts | prototype extension | 1 | never | False |
| mini/tests/prototypes.test.ts | prototype extension | 2 | never | False |
| mini/tests/recursive-types.test.ts | recursion with z.lazy | 1 | never | False |
| mini/tests/recursive-types.test.ts | recursion involving union type | 1 | never | False |
| mini/tests/recursive-types.test.ts | mutual recursion - native | 1 | never | False |
| mini/tests/recursive-types.test.ts | pick and omit with getter | 1 | never | False |
| mini/tests/recursive-types.test.ts | deferred self-recursion | 1 | never | False |
| mini/tests/recursive-types.test.ts | recursion compatibility | 1 | never | False |
| mini/tests/string.test.ts | z.string | 1 | never | False |
| mini/tests/string.test.ts | z.string with custom error | 1 | never | False |
| mini/tests/string.test.ts | inference in checks | 1 | never | False |
| mini/tests/string.test.ts | z.string async | 1 | never | False |
| mini/tests/string.test.ts | z.uuid | 1 | never | False |
| mini/tests/string.test.ts | z.email | 1 | never | False |
| mini/tests/string.test.ts | z.url | 1 | never | False |
| mini/tests/string.test.ts | z.url with optional hostname regex | 1 | never | False |
| mini/tests/string.test.ts | z.url - file urls | 1 | never | False |
| mini/tests/string.test.ts | z.url with optional protocol regex | 1 | never | False |
| mini/tests/string.test.ts | z.url with both hostname and protocol regexes | 1 | never | False |
| mini/tests/string.test.ts | z.url with invalid regex patterns | 1 | never | False |
| mini/tests/string.test.ts | z.emoji | 1 | never | False |
| mini/tests/string.test.ts | z.nanoid | 1 | never | False |
| mini/tests/string.test.ts | z.cuid | 1 | never | False |
| mini/tests/string.test.ts | z.cuid2 | 1 | never | False |
| mini/tests/string.test.ts | z.ulid | 1 | never | False |
| mini/tests/string.test.ts | z.xid | 1 | never | False |
| mini/tests/string.test.ts | z.ksuid | 1 | never | False |
| mini/tests/string.test.ts | z.ipv4 | 1 | never | False |
| mini/tests/string.test.ts | z.ipv6 | 1 | never | False |
| mini/tests/string.test.ts | z.base64 | 1 | never | False |
| mini/tests/string.test.ts | z.e164 | 1 | never | False |
| mini/tests/string.test.ts | z.jwt | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules array pluralization correctly pluralizes 1 array | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules array pluralization correctly pluralizes 2 array | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules array pluralization correctly pluralizes 5 array | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules array pluralization correctly pluralizes 11 array | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules array pluralization correctly pluralizes 21 array | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules array pluralization correctly pluralizes 22 array | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules array pluralization correctly pluralizes 25 array | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules array pluralization correctly pluralizes 101 array | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules array pluralization correctly pluralizes 111 array | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules set pluralization correctly pluralizes 1 set | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules set pluralization correctly pluralizes 2 set | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules set pluralization correctly pluralizes 5 set | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules set pluralization correctly pluralizes 11 set | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules set pluralization correctly pluralizes 21 set | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules set pluralization correctly pluralizes 22 set | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules set pluralization correctly pluralizes 25 set | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules set pluralization correctly pluralizes 101 set | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules set pluralization correctly pluralizes 111 set | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules string pluralization correctly pluralizes 1 string | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules string pluralization correctly pluralizes 2 string | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules string pluralization correctly pluralizes 5 string | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules string pluralization correctly pluralizes 11 string | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules string pluralization correctly pluralizes 21 string | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules string pluralization correctly pluralizes 22 string | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules string pluralization correctly pluralizes 25 string | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules file pluralization correctly pluralizes 0 file | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules file pluralization correctly pluralizes 1 file | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules file pluralization correctly pluralizes 2 file | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules file pluralization correctly pluralizes 5 file | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules file pluralization correctly pluralizes 11 file | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules file pluralization correctly pluralizes 21 file | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules file pluralization correctly pluralizes 22 file | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules file pluralization correctly pluralizes 25 file | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules file pluralization correctly pluralizes 101 file | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules file pluralization correctly pluralizes 110 file | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules handles negative numbers correctly | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules handles zero correctly | 1 | never | False |
| core/tests/locales/be.test.ts | Belarusian localization pluralization rules handles bigint values correctly | 1 | never | False |
| core/tests/locales/en.test.ts | parsedType | 1 | v4.3.0 | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules array pluralization correctly pluralizes 1 array | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules array pluralization correctly pluralizes 2 array | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules array pluralization correctly pluralizes 5 array | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules array pluralization correctly pluralizes 11 array | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules array pluralization correctly pluralizes 21 array | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules array pluralization correctly pluralizes 22 array | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules array pluralization correctly pluralizes 25 array | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules array pluralization correctly pluralizes 101 array | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules array pluralization correctly pluralizes 111 array | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules set pluralization correctly pluralizes 1 set | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules set pluralization correctly pluralizes 2 set | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules set pluralization correctly pluralizes 5 set | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules set pluralization correctly pluralizes 11 set | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules set pluralization correctly pluralizes 21 set | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules set pluralization correctly pluralizes 22 set | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules set pluralization correctly pluralizes 25 set | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules set pluralization correctly pluralizes 101 set | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules set pluralization correctly pluralizes 111 set | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules string pluralization correctly pluralizes 1 string | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules string pluralization correctly pluralizes 2 string | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules string pluralization correctly pluralizes 5 string | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules string pluralization correctly pluralizes 11 string | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules string pluralization correctly pluralizes 21 string | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules string pluralization correctly pluralizes 22 string | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules string pluralization correctly pluralizes 25 string | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules file pluralization correctly pluralizes 0 file | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules file pluralization correctly pluralizes 1 file | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules file pluralization correctly pluralizes 2 file | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules file pluralization correctly pluralizes 5 file | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules file pluralization correctly pluralizes 11 file | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules file pluralization correctly pluralizes 21 file | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules file pluralization correctly pluralizes 22 file | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules file pluralization correctly pluralizes 25 file | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules file pluralization correctly pluralizes 101 file | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules file pluralization correctly pluralizes 110 file | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules handles negative numbers correctly | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules handles zero correctly | 1 | never | False |
| core/tests/locales/ru.test.ts | Russian localization pluralization rules handles bigint values correctly | 1 | never | False |
| core/tests/locales/tr.test.ts | parsedType | 1 | v4.3.0 | False |
| core/tests/locales/tr.test.ts | locales - tr | 1 | never | False |

## Developer failures by file: v4.0.5

| File | Failed cases | First message |
| --- | --- | --- |

## Developer failures by file: v4.1.0

| File | Failed cases | First message |
| --- | --- | --- |
| classic/tests/continuability.test.ts | 1 | Error: Snapshot `continuability 2` mismatched |
| classic/tests/discriminated-unions.test.ts | 1 | Error: Snapshot `invalid discriminator value 1` mismatched |
| classic/tests/file.test.ts | 1 | Error: Snapshot `failing validations 1` mismatched |
| classic/tests/pickomit.test.ts | 1 | AssertionError: expected [Function] to throw an error |
| classic/tests/pipe.test.ts | 1 | Error: Snapshot `continue on non-fatal errors 1` mismatched |
| classic/tests/preprocess.test.ts | 3 | AssertionError: expected [ { code: 'custom', …(2) } ] to have a length of 2 but got 1 |
| classic/tests/set.test.ts | 1 | Error: Snapshot `min/max 1` mismatched |
| classic/tests/string.test.ts | 1 | AssertionError: expected { success: true, …(1) } to match object { success: false } |
| classic/tests/template-literal.test.ts | 1 | Error: Snapshot `regexes 36` mismatched |
| classic/tests/to-json-schema.test.ts | 3 | Error: Snapshot `toJSONSchema > primitive types 16` mismatched |
| classic/tests/tuple.test.ts | 2 | Error: Snapshot `successful validation 2` mismatched |
| classic/tests/union.test.ts | 1 | Error: Snapshot `return errors from both union arms 1` mismatched |

## Developer failures by file: v4.2.0

| File | Failed cases | First message |
| --- | --- | --- |
| classic/tests/continuability.test.ts | 1 | Error: Snapshot `continuability 2` mismatched |
| classic/tests/discriminated-unions.test.ts | 1 | Error: Snapshot `invalid discriminator value 1` mismatched |
| classic/tests/file.test.ts | 1 | Error: Snapshot `failing validations 1` mismatched |
| classic/tests/pickomit.test.ts | 1 | AssertionError: expected [Function] to throw an error |
| classic/tests/pipe.test.ts | 1 | Error: Snapshot `continue on non-fatal errors 1` mismatched |
| classic/tests/preprocess.test.ts | 3 | AssertionError: expected [ { code: 'custom', …(2) } ] to have a length of 2 but got 1 |
| classic/tests/set.test.ts | 1 | Error: Snapshot `min/max 1` mismatched |
| classic/tests/string.test.ts | 1 | AssertionError: expected { success: true, …(1) } to match object { success: false } |
| classic/tests/template-literal.test.ts | 3 | Error: Snapshot `regexes 17` mismatched |
| classic/tests/to-json-schema.test.ts | 3 | Error: Snapshot `toJSONSchema > primitive types 15` mismatched |
| classic/tests/tuple.test.ts | 2 | Error: Snapshot `successful validation 2` mismatched |
| classic/tests/union.test.ts | 1 | Error: Snapshot `return errors from both union arms 1` mismatched |

## Developer failures by file: v4.3.0

| File | Failed cases | First message |
| --- | --- | --- |
| classic/tests/continuability.test.ts | 1 | Error: Snapshot `continuability 2` mismatched |
| classic/tests/discriminated-unions.test.ts | 1 | Error: Snapshot `invalid discriminator value 1` mismatched |
| classic/tests/file.test.ts | 1 | Error: Snapshot `failing validations 1` mismatched |
| classic/tests/pickomit.test.ts | 1 | AssertionError: expected [Function] to throw an error |
| classic/tests/pipe.test.ts | 1 | Error: Snapshot `continue on non-fatal errors 1` mismatched |
| classic/tests/preprocess.test.ts | 3 | AssertionError: expected [ { code: 'custom', …(2) } ] to have a length of 2 but got 1 |
| classic/tests/set.test.ts | 1 | Error: Snapshot `min/max 1` mismatched |
| classic/tests/string.test.ts | 1 | AssertionError: expected { success: true, …(1) } to match object { success: false } |
| classic/tests/template-literal.test.ts | 3 | Error: Snapshot `regexes 17` mismatched |
| classic/tests/to-json-schema.test.ts | 5 | Error: Snapshot `toJSONSchema > primitive types 12` mismatched |
| classic/tests/tuple.test.ts | 2 | Error: Snapshot `successful validation 2` mismatched |
| classic/tests/union.test.ts | 1 | Error: Snapshot `return errors from both union arms 1` mismatched |
| core/tests/locales/en.test.ts | 1 | TypeError: (0 , __vite_ssr_import_1__.parsedType) is not a function |
| core/tests/locales/tr.test.ts | 1 | TypeError: (0 , __vite_ssr_import_2__.parsedType) is not a function |

## Developer failures by file: v4.4.0

| File | Failed cases | First message |
| --- | --- | --- |
| classic/tests/catch.test.ts | 2 | ZodError: [ |
| classic/tests/continuability.test.ts | 1 | Error: Snapshot `continuability 2` mismatched |
| classic/tests/discriminated-unions.test.ts | 1 | Error: Snapshot `invalid discriminator value 1` mismatched |
| classic/tests/file.test.ts | 1 | Error: Snapshot `failing validations 1` mismatched |
| classic/tests/function.test.ts | 1 | Error: Snapshot `input validation error 1` mismatched |
| classic/tests/intersection.test.ts | 1 | AssertionError: expected true to deeply equal false |
| classic/tests/optional.test.ts | 1 | AssertionError: expected undefined to deeply equal 'optional' |
| classic/tests/pickomit.test.ts | 1 | AssertionError: expected [Function] to throw an error |
| classic/tests/pipe.test.ts | 1 | Error: Snapshot `continue on non-fatal errors 1` mismatched |
| classic/tests/preprocess.test.ts | 3 | AssertionError: expected [ { code: 'custom', …(2) } ] to have a length of 2 but got 1 |
| classic/tests/set.test.ts | 1 | Error: Snapshot `min/max 1` mismatched |
| classic/tests/string.test.ts | 2 | AssertionError: expected { success: true, …(1) } to match object { success: false } |
| classic/tests/template-literal.test.ts | 4 | AssertionError: expected [Function] to throw an error |
| classic/tests/to-json-schema.test.ts | 9 | Error: Snapshot `toJSONSchema > primitive types 12` mismatched |
| classic/tests/tuple.test.ts | 2 | Error: Snapshot `successful validation 2` mismatched |
| classic/tests/union.test.ts | 1 | Error: Snapshot `return errors from both union arms 1` mismatched |
| core/tests/locales/en.test.ts | 1 | TypeError: (0 , __vite_ssr_import_1__.parsedType) is not a function |
| core/tests/locales/tr.test.ts | 1 | TypeError: (0 , __vite_ssr_import_2__.parsedType) is not a function |

## Developer failures by file: v4.5.0

| File | Failed cases | First message |
| --- | --- | --- |
| classic/tests/array.test.ts | 1 | Error: Snapshot `array length 1` mismatched |
| classic/tests/continuability.test.ts | 1 | Error: Snapshot `continuability 2` mismatched |
| classic/tests/datetime.test.ts | 1 | ZodError: [ |
| classic/tests/discriminated-unions.test.ts | 1 | Error: Snapshot `invalid discriminator value 1` mismatched |
| classic/tests/error.test.ts | 3 | Error: Snapshot `z.config customError  1` mismatched |
| classic/tests/file.test.ts | 1 | Error: Snapshot `failing validations 1` mismatched |
| classic/tests/function.test.ts | 1 | Error: Snapshot `input validation error 1` mismatched |
| classic/tests/intersection.test.ts | 1 | AssertionError: expected true to deeply equal false |
| classic/tests/lazy.test.ts | 1 | AssertionError: expected 'defaulted' to deeply equal 'optional' |
| classic/tests/number.test.ts | 2 | Error: Snapshot `Infinity validation 1` mismatched |
| classic/tests/optional.test.ts | 2 | AssertionError: expected 'defaulted' to deeply equal 'optional' |
| classic/tests/pickomit.test.ts | 1 | AssertionError: expected [Function] to throw an error |
| classic/tests/pipe.test.ts | 1 | Error: Snapshot `continue on non-fatal errors 1` mismatched |
| classic/tests/preprocess.test.ts | 3 | AssertionError: expected [ { code: 'custom', …(2) } ] to have a length of 2 but got 1 |
| classic/tests/set.test.ts | 1 | Error: Snapshot `min/max 1` mismatched |
| classic/tests/string.test.ts | 3 | AssertionError: expected { success: true, …(1) } to match object { success: false } |
| classic/tests/template-literal.test.ts | 4 | AssertionError: expected [Function] to throw an error |
| classic/tests/to-json-schema.test.ts | 15 | Error: Snapshot `toJSONSchema > primitive types 10` mismatched |
| classic/tests/tuple.test.ts | 2 | Error: Snapshot `successful validation 2` mismatched |
| classic/tests/union.test.ts | 1 | Error: Snapshot `return errors from both union arms 1` mismatched |
| classic/tests/validations.test.ts | 1 | Error: Snapshot `string length 1` mismatched |
| core/tests/locales/en.test.ts | 1 | TypeError: (0 , __vite_ssr_import_1__.parsedType) is not a function |
| core/tests/locales/tr.test.ts | 1 | TypeError: (0 , __vite_ssr_import_2__.parsedType) is not a function |

## Developer failures by file: v4.6.0

| File | Failed cases | First message |
| --- | --- | --- |
| classic/tests/array.test.ts | 1 | Error: Snapshot `array length 1` mismatched |
| classic/tests/continuability.test.ts | 1 | Error: Snapshot `continuability 1` mismatched |
| classic/tests/datetime.test.ts | 1 | ZodError: [ |
| classic/tests/discriminated-unions.test.ts | 1 | Error: Snapshot `invalid discriminator value 1` mismatched |
| classic/tests/error.test.ts | 3 | Error: Snapshot `z.config customError  1` mismatched |
| classic/tests/file.test.ts | 1 | Error: Snapshot `failing validations 1` mismatched |
| classic/tests/function.test.ts | 1 | Error: Snapshot `input validation error 1` mismatched |
| classic/tests/intersection.test.ts | 1 | AssertionError: expected true to deeply equal false |
| classic/tests/lazy.test.ts | 1 | AssertionError: expected 'defaulted' to deeply equal 'optional' |
| classic/tests/number.test.ts | 2 | Error: Snapshot `Infinity validation 1` mismatched |
| classic/tests/optional.test.ts | 2 | AssertionError: expected 'defaulted' to deeply equal 'optional' |
| classic/tests/pipe.test.ts | 1 | Error: Snapshot `continue on non-fatal errors 1` mismatched |
| classic/tests/preprocess.test.ts | 3 | AssertionError: expected [ { code: 'custom', …(2) } ] to have a length of 2 but got 1 |
| classic/tests/set.test.ts | 1 | Error: Snapshot `min/max 1` mismatched |
| classic/tests/string.test.ts | 3 | AssertionError: expected { success: true, …(1) } to match object { success: false } |
| classic/tests/template-literal.test.ts | 4 | AssertionError: expected [Function] to throw an error |
| classic/tests/to-json-schema.test.ts | 15 | Error: Snapshot `toJSONSchema > primitive types 9` mismatched |
| classic/tests/tuple.test.ts | 2 | Error: Snapshot `successful validation 2` mismatched |
| classic/tests/union.test.ts | 1 | Error: Snapshot `return errors from both union arms 1` mismatched |
| classic/tests/validations.test.ts | 1 | Error: Snapshot `string length 1` mismatched |
| core/tests/locales/en.test.ts | 1 | TypeError: (0 , __vite_ssr_import_1__.parsedType) is not a function |
| core/tests/locales/tr.test.ts | 1 | TypeError: (0 , __vite_ssr_import_2__.parsedType) is not a function |
| mini/tests/computed.test.ts | 5 | AssertionError: expected undefined to deeply equal 7 |

## Automatic file-name pairing

Matches are filename-based; counts sum all exact/lowercase/kebab/plural matches across classic, core, and mini. This does not establish semantic equivalence between corpora.

| Function | Dev files | LLM baseline | Dev baseline | v4.1.0 LLM survivors | v4.1.0 dev passed | v4.1.0 dev skipped | v4.2.0 LLM survivors | v4.2.0 dev passed | v4.2.0 dev skipped | v4.3.0 LLM survivors | v4.3.0 dev passed | v4.3.0 dev skipped | v4.4.0 LLM survivors | v4.4.0 dev passed | v4.4.0 dev skipped | v4.5.0 LLM survivors | v4.5.0 dev passed | v4.5.0 dev skipped | v4.6.0 LLM survivors | v4.6.0 dev passed | v4.6.0 dev skipped |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| zod.z.iso.datetime | classic/tests/datetime.test.ts | 2 | 14 | 2 | 14 | 0 | 2 | 14 | 0 | 2 | 14 | 0 | 2 | 14 | 0 | 2 | 13 | 0 | 2 | 13 | 0 |
| zod.z.iso.date | classic/tests/date.test.ts | 3 | 3 | 3 | 3 | 0 | 3 | 3 | 0 | 3 | 3 | 0 | 3 | 3 | 0 | 3 | 3 | 0 | 2 | 3 | 0 |
| zod.z.iso.time |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.iso.duration |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.coerce.string | classic/tests/string.test.ts; mini/tests/string.test.ts | 3 | 60 | 3 | 59 | 0 | 3 | 59 | 0 | 3 | 59 | 0 | 3 | 58 | 0 | 3 | 57 | 0 | 3 | 57 | 0 |
| zod.z.coerce.number | classic/tests/number.test.ts; mini/tests/number.test.ts | 2 | 34 | 2 | 34 | 0 | 2 | 34 | 0 | 2 | 34 | 0 | 2 | 34 | 0 | 2 | 32 | 0 | 2 | 32 | 0 |
| zod.z.coerce.boolean |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.coerce.bigint | classic/tests/bigint.test.ts | 4 | 3 | 4 | 3 | 0 | 4 | 3 | 0 | 4 | 3 | 0 | 4 | 3 | 0 | 4 | 3 | 0 | 4 | 3 | 0 |
| zod.z.coerce.date | classic/tests/date.test.ts | 3 | 3 | 3 | 3 | 0 | 3 | 3 | 0 | 3 | 3 | 0 | 3 | 3 | 0 | 3 | 3 | 0 | 3 | 3 | 0 |
| zod.z.stringbool | classic/tests/stringbool.test.ts | 3 | 4 | 3 | 4 | 0 | 3 | 4 | 0 | 3 | 4 | 0 | 3 | 4 | 0 | 3 | 4 | 0 | 3 | 4 | 0 |
| zod.z.string | classic/tests/string.test.ts; mini/tests/string.test.ts | 3 | 60 | 3 | 59 | 0 | 3 | 59 | 0 | 3 | 59 | 0 | 3 | 58 | 0 | 3 | 57 | 0 | 3 | 57 | 0 |
| zod.z.email |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.guid |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.uuid |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.uuidv4 |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.uuidv6 |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.uuidv7 |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched |
| zod.z.url |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.emoji |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.nanoid |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.cuid |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.cuid2 |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.ulid |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.ksuid |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.ipv4 |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched |
| zod.z.ipv6 |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.cidrv4 |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched |
| zod.z.cidrv6 |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched |
| zod.z.base64 |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched |
| zod.z.base64url |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.e164 |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched |
| zod.z.jwt |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.stringFormat | classic/tests/string-formats.test.ts | 2 | 2 | 2 | 2 | 0 | 2 | 2 | 0 | 2 | 2 | 0 | 2 | 2 | 0 | 2 | 2 | 0 | 2 | 2 | 0 |
| zod.z.number | classic/tests/number.test.ts; mini/tests/number.test.ts | 3 | 34 | 3 | 34 | 0 | 3 | 34 | 0 | 3 | 34 | 0 | 3 | 34 | 0 | 3 | 32 | 0 | 3 | 32 | 0 |
| zod.z.int |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.float32 |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.float64 |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.int32 |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.uint32 |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.boolean |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.bigint | classic/tests/bigint.test.ts | 3 | 3 | 3 | 3 | 0 | 3 | 3 | 0 | 3 | 3 | 0 | 3 | 3 | 0 | 3 | 3 | 0 | 3 | 3 | 0 |
| zod.z.int64 |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.uint64 |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.symbol |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched |
| zod.z.undefined |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.null |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.any |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched |
| zod.z.unknown |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched |
| zod.z.never |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.void | classic/tests/void.test.ts | 2 | 1 | 2 | 1 | 0 | 2 | 1 | 0 | 2 | 1 | 0 | 2 | 1 | 0 | 2 | 1 | 0 | 2 | 1 | 0 |
| zod.z.date | classic/tests/date.test.ts | 1 | 3 | 1 | 3 | 0 | 1 | 3 | 0 | 1 | 3 | 0 | 1 | 3 | 0 | 1 | 3 | 0 | 1 | 3 | 0 |
| zod.z.array | classic/tests/array.test.ts | 1 | 9 | 1 | 9 | 0 | 1 | 9 | 0 | 1 | 9 | 0 | 1 | 9 | 0 | 1 | 8 | 0 | 1 | 8 | 0 |
| zod.z.object | classic/tests/object.test.ts; mini/tests/object.test.ts | 2 | 56 | 2 | 56 | 0 | 2 | 56 | 0 | 2 | 56 | 0 | 2 | 56 | 0 | 2 | 56 | 0 | 2 | 56 | 0 |
| zod.z.strictObject |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.looseObject |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched |
| zod.z.discriminatedUnion | classic/tests/discriminated-unions.test.ts | 3 | 21 | 3 | 20 | 0 | 3 | 20 | 0 | 3 | 20 | 0 | 3 | 20 | 0 | 3 | 20 | 0 | 3 | 20 | 0 |
| zod.z.intersection | classic/tests/intersection.test.ts | 1 | 10 | 1 | 10 | 0 | 1 | 10 | 0 | 1 | 10 | 0 | 1 | 9 | 0 | 1 | 9 | 0 | 1 | 9 | 0 |
| zod.z.tuple | classic/tests/tuple.test.ts | 2 | 6 | 2 | 4 | 0 | 2 | 4 | 0 | 2 | 4 | 0 | 2 | 4 | 0 | 2 | 4 | 0 | 2 | 4 | 0 |
| zod.z.record | classic/tests/record.test.ts | 1 | 13 | 1 | 13 | 0 | 1 | 13 | 0 | 1 | 13 | 0 | 1 | 13 | 0 | 1 | 13 | 0 | 1 | 13 | 0 |
| zod.z.partialRecord |  | 3 | 0 | 2 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.map | classic/tests/map.test.ts | 2 | 8 | 2 | 8 | 0 | 2 | 8 | 0 | 2 | 8 | 0 | 2 | 8 | 0 | 2 | 8 | 0 | 2 | 8 | 0 |
| zod.z.set | classic/tests/set.test.ts | 2 | 12 | 2 | 11 | 0 | 2 | 11 | 0 | 2 | 11 | 0 | 2 | 11 | 0 | 2 | 11 | 0 | 2 | 11 | 0 |
| zod.z.enum | classic/tests/enum.test.ts | 1 | 19 | 1 | 19 | 0 | 1 | 19 | 0 | 1 | 19 | 0 | 1 | 19 | 0 | 1 | 19 | 0 | 1 | 19 | 0 |
| zod.z.nativeEnum |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.literal | classic/tests/literal.test.ts | 4 | 9 | 4 | 9 | 0 | 4 | 9 | 0 | 4 | 9 | 0 | 4 | 9 | 0 | 4 | 9 | 0 | 4 | 9 | 0 |
| zod.z.transform | classic/tests/transform.test.ts | 2 | 16 | 2 | 16 | 0 | 2 | 16 | 0 | 2 | 16 | 0 | 2 | 16 | 0 | 2 | 16 | 0 | 2 | 16 | 0 |
| zod.z.optional | classic/tests/optional.test.ts | 3 | 5 | 3 | 5 | 0 | 3 | 5 | 0 | 3 | 5 | 0 | 3 | 4 | 0 | 3 | 3 | 0 | 3 | 3 | 0 |
| zod.z.nullable | classic/tests/nullable.test.ts | 4 | 3 | 4 | 3 | 0 | 4 | 3 | 0 | 4 | 3 | 0 | 4 | 3 | 0 | 4 | 3 | 0 | 4 | 3 | 0 |
| zod.z.nullish |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.prefault | classic/tests/prefault.test.ts | 3 | 2 | 3 | 2 | 0 | 3 | 2 | 0 | 3 | 2 | 0 | 3 | 2 | 0 | 3 | 2 | 0 | 3 | 2 | 0 |
| zod.z.nonoptional | classic/tests/nonoptional.test.ts | 2 | 3 | 2 | 3 | 0 | 2 | 3 | 0 | 2 | 3 | 0 | 2 | 3 | 0 | 2 | 3 | 0 | 2 | 3 | 0 |
| zod.z.success |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.catch | classic/tests/catch.test.ts | 2 | 16 | 2 | 16 | 0 | 2 | 16 | 0 | 2 | 16 | 0 | 2 | 14 | 0 | 2 | 16 | 0 | 2 | 16 | 0 |
| zod.z.nan | classic/tests/nan.test.ts | 2 | 2 | 2 | 2 | 0 | 2 | 2 | 0 | 2 | 2 | 0 | 2 | 2 | 0 | 2 | 2 | 0 | 2 | 2 | 0 |
| zod.z.readonly | classic/tests/readonly.test.ts | 3 | 7 | 3 | 7 | 0 | 3 | 7 | 0 | 3 | 7 | 0 | 3 | 7 | 0 | 3 | 7 | 0 | 3 | 7 | 0 |
| zod.z.templateLiteral | classic/tests/template-literal.test.ts | 2 | 8 | 2 | 7 | 0 | 2 | 5 | 0 | 2 | 5 | 0 | 2 | 4 | 0 | 2 | 4 | 0 | 2 | 4 | 0 |
| zod.z.lazy | classic/tests/lazy.test.ts | 4 | 9 | 4 | 9 | 0 | 4 | 9 | 0 | 4 | 9 | 0 | 4 | 9 | 0 | 4 | 8 | 0 | 4 | 8 | 0 |
| zod.z.promise | classic/tests/promise.test.ts | 2 | 10 | 2 | 10 | 0 | 2 | 10 | 0 | 2 | 10 | 0 | 2 | 10 | 0 | 2 | 10 | 0 | 2 | 10 | 0 |
| zod.z.check | mini/tests/checks.test.ts | 2 | 17 | 2 | 17 | 0 | 2 | 17 | 0 | 2 | 17 | 0 | 2 | 17 | 0 | 2 | 17 | 0 | 2 | 17 | 0 |
| zod.z.custom | classic/tests/custom.test.ts | 3 | 4 | 3 | 4 | 0 | 3 | 4 | 0 | 3 | 4 | 0 | 3 | 4 | 0 | 3 | 4 | 0 | 3 | 4 | 0 |
| zod.z.refine | classic/tests/refine.test.ts | 2 | 15 | 2 | 15 | 0 | 2 | 15 | 0 | 2 | 15 | 0 | 2 | 15 | 0 | 2 | 15 | 0 | 2 | 15 | 0 |
| zod.z.superRefine |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.instanceof | classic/tests/instanceof.test.ts | 3 | 2 | 3 | 2 | 0 | 3 | 2 | 0 | 0 | 2 | 0 | 0 | 2 | 0 | 0 | 2 | 0 | 0 | 2 | 0 |
| zod.z.preprocess | classic/tests/preprocess.test.ts | 4 | 11 | 4 | 8 | 0 | 4 | 8 | 0 | 4 | 8 | 0 | 4 | 8 | 0 | 4 | 8 | 0 | 4 | 8 | 0 |
| zod.z.lte |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.gt |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.gte |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.positive |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.negative |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.nonpositive |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.multipleOf |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.maxSize |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.minSize |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.size |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.maxLength |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.length |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.regex |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.lowercase |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.uppercase |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.includes |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.endsWith |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.overwrite |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.normalize |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.trim |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.toLowerCase |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.toUpperCase |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.parse |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.parseAsync |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.safeParse |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.safeParseAsync |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched |
| zod.z.setErrorMap |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.getErrorMap |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |

Functions with no automatic match:

- `zod.z.iso.time`
- `zod.z.iso.duration`
- `zod.z.coerce.boolean`
- `zod.z.email`
- `zod.z.guid`
- `zod.z.uuid`
- `zod.z.uuidv4`
- `zod.z.uuidv6`
- `zod.z.uuidv7`
- `zod.z.url`
- `zod.z.emoji`
- `zod.z.nanoid`
- `zod.z.cuid`
- `zod.z.cuid2`
- `zod.z.ulid`
- `zod.z.ksuid`
- `zod.z.ipv4`
- `zod.z.ipv6`
- `zod.z.cidrv4`
- `zod.z.cidrv6`
- `zod.z.base64`
- `zod.z.base64url`
- `zod.z.e164`
- `zod.z.jwt`
- `zod.z.int`
- `zod.z.float32`
- `zod.z.float64`
- `zod.z.int32`
- `zod.z.uint32`
- `zod.z.boolean`
- `zod.z.int64`
- `zod.z.uint64`
- `zod.z.symbol`
- `zod.z.undefined`
- `zod.z.null`
- `zod.z.any`
- `zod.z.unknown`
- `zod.z.never`
- `zod.z.strictObject`
- `zod.z.looseObject`
- `zod.z.partialRecord`
- `zod.z.nativeEnum`
- `zod.z.nullish`
- `zod.z.success`
- `zod.z.superRefine`
- `zod.z.lte`
- `zod.z.gt`
- `zod.z.gte`
- `zod.z.positive`
- `zod.z.negative`
- `zod.z.nonpositive`
- `zod.z.multipleOf`
- `zod.z.maxSize`
- `zod.z.minSize`
- `zod.z.size`
- `zod.z.maxLength`
- `zod.z.length`
- `zod.z.regex`
- `zod.z.lowercase`
- `zod.z.uppercase`
- `zod.z.includes`
- `zod.z.endsWith`
- `zod.z.overwrite`
- `zod.z.normalize`
- `zod.z.trim`
- `zod.z.toLowerCase`
- `zod.z.toUpperCase`
- `zod.z.parse`
- `zod.z.parseAsync`
- `zod.z.safeParse`
- `zod.z.safeParseAsync`
- `zod.z.setErrorMap`
- `zod.z.getErrorMap`

## Flaky at t

| Test | Status | Error |
| --- | --- | --- |

No exclusions; all 266 remain in the denominator.

## Measured wall times

| Release | Install/build/env seconds | LLM seconds | Dev seconds | Total seconds |
| --- | --- | --- | --- | --- |
| v4.0.5 | 54.629 | 55.229 | 8.445 | 118.302 |
| v4.1.0 | 33.954 | 61.172 | 10.094 | 105.22 |
| v4.2.0 | 40.189 | 67.918 | 8.848 | 116.955 |
| v4.3.0 | 39.627 | 68.722 | 8.919 | 117.268 |
| v4.4.0 | 38.491 | 57.896 | 8.749 | 105.136 |
| v4.5.0 | 53.668 | 53.264 | 7.055 | 113.987 |
| v4.6.0 | 8.386 | 58.651 | 9.709 | 76.745 |

Sum of recorded per-release stages (not end-to-end wall time): 753.613 seconds.

## Developer failure categories

Ordered predicates: snapshot (Snapshot and mismatched), load (file_load_failed), assertion (starts AssertionError), other. Snapshot flags are candidates for manual review, not a final contract classification.

| Release | Snapshot | Load | Assertion | Other |
| --- | --- | --- | --- | --- |
| v4.0.5 | 0 | 0 | 0 | 0 |
| v4.1.0 | 12 | 0 | 5 | 0 |
| v4.2.0 | 13 | 0 | 6 | 0 |
| v4.3.0 | 14 | 0 | 7 | 2 |
| v4.4.0 | 20 | 0 | 10 | 4 |
| v4.5.0 | 34 | 0 | 12 | 3 |
| v4.6.0 | 34 | 0 | 16 | 3 |

### Failed developer cases grouped by file: v4.0.5

| File | Case | Occurrence | Category | First message | Review flag |
| --- | --- | --- | --- | --- | --- |

### Matched-function cross table: v4.0.5

Developer counts sum only the files in the unchanged automatic pairing map.

| API | LLM baseline | LLM pass/fail/load/timeout/other | Dev baseline | Dev passed/failed/skipped |
| --- | --- | --- | --- | --- |
| zod.z.iso.datetime | 2 | 2/0/0/0/0 | 14 | 14/0/0 |
| zod.z.iso.date | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.coerce.string | 3 | 3/0/0/0/0 | 60 | 60/0/0 |
| zod.z.coerce.number | 2 | 2/0/0/0/0 | 34 | 34/0/0 |
| zod.z.coerce.bigint | 4 | 4/0/0/0/0 | 3 | 3/0/0 |
| zod.z.coerce.date | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.stringbool | 3 | 3/0/0/0/0 | 4 | 4/0/0 |
| zod.z.string | 3 | 3/0/0/0/0 | 60 | 60/0/0 |
| zod.z.stringFormat | 2 | 2/0/0/0/0 | 2 | 2/0/0 |
| zod.z.number | 3 | 3/0/0/0/0 | 34 | 34/0/0 |
| zod.z.bigint | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.void | 2 | 2/0/0/0/0 | 1 | 1/0/0 |
| zod.z.date | 1 | 1/0/0/0/0 | 3 | 3/0/0 |
| zod.z.array | 1 | 1/0/0/0/0 | 9 | 9/0/0 |
| zod.z.object | 2 | 2/0/0/0/0 | 56 | 56/0/0 |
| zod.z.discriminatedUnion | 3 | 3/0/0/0/0 | 21 | 21/0/0 |
| zod.z.intersection | 1 | 1/0/0/0/0 | 10 | 10/0/0 |
| zod.z.tuple | 2 | 2/0/0/0/0 | 6 | 6/0/0 |
| zod.z.record | 1 | 1/0/0/0/0 | 13 | 13/0/0 |
| zod.z.map | 2 | 2/0/0/0/0 | 8 | 8/0/0 |
| zod.z.set | 2 | 2/0/0/0/0 | 12 | 12/0/0 |
| zod.z.enum | 1 | 1/0/0/0/0 | 19 | 19/0/0 |
| zod.z.literal | 4 | 4/0/0/0/0 | 9 | 9/0/0 |
| zod.z.transform | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.optional | 3 | 3/0/0/0/0 | 5 | 5/0/0 |
| zod.z.nullable | 4 | 4/0/0/0/0 | 3 | 3/0/0 |
| zod.z.prefault | 3 | 3/0/0/0/0 | 2 | 2/0/0 |
| zod.z.nonoptional | 2 | 2/0/0/0/0 | 3 | 3/0/0 |
| zod.z.catch | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.nan | 2 | 2/0/0/0/0 | 2 | 2/0/0 |
| zod.z.readonly | 3 | 3/0/0/0/0 | 7 | 7/0/0 |
| zod.z.templateLiteral | 2 | 2/0/0/0/0 | 8 | 8/0/0 |
| zod.z.lazy | 4 | 4/0/0/0/0 | 9 | 9/0/0 |
| zod.z.promise | 2 | 2/0/0/0/0 | 10 | 10/0/0 |
| zod.z.check | 2 | 2/0/0/0/0 | 17 | 17/0/0 |
| zod.z.custom | 3 | 3/0/0/0/0 | 4 | 4/0/0 |
| zod.z.refine | 2 | 2/0/0/0/0 | 15 | 15/0/0 |
| zod.z.instanceof | 3 | 3/0/0/0/0 | 2 | 2/0/0 |
| zod.z.preprocess | 4 | 4/0/0/0/0 | 11 | 11/0/0 |

### Failed developer cases grouped by file: v4.1.0

| File | Case | Occurrence | Category | First message | Review flag |
| --- | --- | --- | --- | --- | --- |
| classic/tests/continuability.test.ts | continuability | 1 | snapshot | Error: Snapshot `continuability 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/discriminated-unions.test.ts | invalid discriminator value | 1 | snapshot | Error: Snapshot `invalid discriminator value 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/file.test.ts | failing validations | 1 | snapshot | Error: Snapshot `failing validations 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/pickomit.test.ts | pick/omit/required/partial - do not allow unknown keys | 1 | assertion | AssertionError: expected [Function] to throw an error | manual review required |
| classic/tests/pipe.test.ts | continue on non-fatal errors | 1 | snapshot | Error: Snapshot `continue on non-fatal errors 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/preprocess.test.ts | perform transform with non-fatal issues | 1 | assertion | AssertionError: expected [ { code: 'custom', path: [], …(1) } ] to have a length of 2 but got 1 | manual review required |
| classic/tests/preprocess.test.ts | preprocess ctx.addIssue non-fatal by default | 1 | assertion | AssertionError: expected [ { code: 'custom', …(2) } ] to have a length of 2 but got 1 | manual review required |
| classic/tests/preprocess.test.ts | z.NEVER in preprocess | 1 | assertion | AssertionError: expected [ { code: 'custom', …(2) } ] to have a length of 2 but got 1 | manual review required |
| classic/tests/set.test.ts | min/max | 1 | snapshot | Error: Snapshot `min/max 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/string.test.ts | bad uuid | 1 | assertion | AssertionError: expected { success: true, …(1) } to match object { success: false } | manual review required |
| classic/tests/template-literal.test.ts | regexes | 1 | snapshot | Error: Snapshot `regexes 36` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | input type | 1 | snapshot | Error: Snapshot `input type 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | toJSONSchema primitive types | 1 | snapshot | Error: Snapshot `toJSONSchema > primitive types 16` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | toJSONSchema string formats | 1 | snapshot | Error: Snapshot `toJSONSchema > string formats 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/tuple.test.ts | async validation | 1 | snapshot | Error: Snapshot `async validation 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/tuple.test.ts | successful validation | 1 | snapshot | Error: Snapshot `successful validation 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/union.test.ts | return errors from both union arms | 1 | snapshot | Error: Snapshot `return errors from both union arms 1` mismatched | likely non-contract assertion; manual review required |

### Matched-function cross table: v4.1.0

Developer counts sum only the files in the unchanged automatic pairing map.

| API | LLM baseline | LLM pass/fail/load/timeout/other | Dev baseline | Dev passed/failed/skipped |
| --- | --- | --- | --- | --- |
| zod.z.iso.datetime | 2 | 2/0/0/0/0 | 14 | 14/0/0 |
| zod.z.iso.date | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.coerce.string | 3 | 3/0/0/0/0 | 60 | 59/1/0 |
| zod.z.coerce.number | 2 | 2/0/0/0/0 | 34 | 34/0/0 |
| zod.z.coerce.bigint | 4 | 4/0/0/0/0 | 3 | 3/0/0 |
| zod.z.coerce.date | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.stringbool | 3 | 3/0/0/0/0 | 4 | 4/0/0 |
| zod.z.string | 3 | 3/0/0/0/0 | 60 | 59/1/0 |
| zod.z.stringFormat | 2 | 2/0/0/0/0 | 2 | 2/0/0 |
| zod.z.number | 3 | 3/0/0/0/0 | 34 | 34/0/0 |
| zod.z.bigint | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.void | 2 | 2/0/0/0/0 | 1 | 1/0/0 |
| zod.z.date | 1 | 1/0/0/0/0 | 3 | 3/0/0 |
| zod.z.array | 1 | 1/0/0/0/0 | 9 | 9/0/0 |
| zod.z.object | 2 | 2/0/0/0/0 | 56 | 56/0/0 |
| zod.z.discriminatedUnion | 3 | 3/0/0/0/0 | 21 | 20/1/0 |
| zod.z.intersection | 1 | 1/0/0/0/0 | 10 | 10/0/0 |
| zod.z.tuple | 2 | 2/0/0/0/0 | 6 | 4/2/0 |
| zod.z.record | 1 | 1/0/0/0/0 | 13 | 13/0/0 |
| zod.z.map | 2 | 2/0/0/0/0 | 8 | 8/0/0 |
| zod.z.set | 2 | 2/0/0/0/0 | 12 | 11/1/0 |
| zod.z.enum | 1 | 1/0/0/0/0 | 19 | 19/0/0 |
| zod.z.literal | 4 | 4/0/0/0/0 | 9 | 9/0/0 |
| zod.z.transform | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.optional | 3 | 3/0/0/0/0 | 5 | 5/0/0 |
| zod.z.nullable | 4 | 4/0/0/0/0 | 3 | 3/0/0 |
| zod.z.prefault | 3 | 3/0/0/0/0 | 2 | 2/0/0 |
| zod.z.nonoptional | 2 | 2/0/0/0/0 | 3 | 3/0/0 |
| zod.z.catch | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.nan | 2 | 2/0/0/0/0 | 2 | 2/0/0 |
| zod.z.readonly | 3 | 3/0/0/0/0 | 7 | 7/0/0 |
| zod.z.templateLiteral | 2 | 2/0/0/0/0 | 8 | 7/1/0 |
| zod.z.lazy | 4 | 4/0/0/0/0 | 9 | 9/0/0 |
| zod.z.promise | 2 | 2/0/0/0/0 | 10 | 10/0/0 |
| zod.z.check | 2 | 2/0/0/0/0 | 17 | 17/0/0 |
| zod.z.custom | 3 | 3/0/0/0/0 | 4 | 4/0/0 |
| zod.z.refine | 2 | 2/0/0/0/0 | 15 | 15/0/0 |
| zod.z.instanceof | 3 | 3/0/0/0/0 | 2 | 2/0/0 |
| zod.z.preprocess | 4 | 4/0/0/0/0 | 11 | 8/3/0 |

### Failed developer cases grouped by file: v4.2.0

| File | Case | Occurrence | Category | First message | Review flag |
| --- | --- | --- | --- | --- | --- |
| classic/tests/continuability.test.ts | continuability | 1 | snapshot | Error: Snapshot `continuability 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/discriminated-unions.test.ts | invalid discriminator value | 1 | snapshot | Error: Snapshot `invalid discriminator value 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/file.test.ts | failing validations | 1 | snapshot | Error: Snapshot `failing validations 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/pickomit.test.ts | pick/omit/required/partial - do not allow unknown keys | 1 | assertion | AssertionError: expected [Function] to throw an error | manual review required |
| classic/tests/pipe.test.ts | continue on non-fatal errors | 1 | snapshot | Error: Snapshot `continue on non-fatal errors 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/preprocess.test.ts | perform transform with non-fatal issues | 1 | assertion | AssertionError: expected [ { code: 'custom', path: [], …(1) } ] to have a length of 2 but got 1 | manual review required |
| classic/tests/preprocess.test.ts | preprocess ctx.addIssue non-fatal by default | 1 | assertion | AssertionError: expected [ { code: 'custom', …(2) } ] to have a length of 2 but got 1 | manual review required |
| classic/tests/preprocess.test.ts | z.NEVER in preprocess | 1 | assertion | AssertionError: expected [ { code: 'custom', …(2) } ] to have a length of 2 but got 1 | manual review required |
| classic/tests/set.test.ts | min/max | 1 | snapshot | Error: Snapshot `min/max 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/string.test.ts | bad uuid | 1 | assertion | AssertionError: expected { success: true, …(1) } to match object { success: false } | manual review required |
| classic/tests/template-literal.test.ts | regexes | 1 | snapshot | Error: Snapshot `regexes 17` mismatched | likely non-contract assertion; manual review required |
| classic/tests/template-literal.test.ts | template literal parsing - failure - complex cases | 1 | assertion | AssertionError: expected [Function] to throw an error | manual review required |
| classic/tests/template-literal.test.ts | template literal parsing - failure - issue format | 1 | snapshot | Error: Snapshot `template literal parsing - failure - issue format 4` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | input type | 1 | snapshot | Error: Snapshot `input type 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | toJSONSchema primitive types | 1 | snapshot | Error: Snapshot `toJSONSchema > primitive types 15` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | toJSONSchema string formats | 1 | snapshot | Error: Snapshot `toJSONSchema > string formats 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/tuple.test.ts | async validation | 1 | snapshot | Error: Snapshot `async validation 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/tuple.test.ts | successful validation | 1 | snapshot | Error: Snapshot `successful validation 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/union.test.ts | return errors from both union arms | 1 | snapshot | Error: Snapshot `return errors from both union arms 1` mismatched | likely non-contract assertion; manual review required |

### Matched-function cross table: v4.2.0

Developer counts sum only the files in the unchanged automatic pairing map.

| API | LLM baseline | LLM pass/fail/load/timeout/other | Dev baseline | Dev passed/failed/skipped |
| --- | --- | --- | --- | --- |
| zod.z.iso.datetime | 2 | 2/0/0/0/0 | 14 | 14/0/0 |
| zod.z.iso.date | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.coerce.string | 3 | 3/0/0/0/0 | 60 | 59/1/0 |
| zod.z.coerce.number | 2 | 2/0/0/0/0 | 34 | 34/0/0 |
| zod.z.coerce.bigint | 4 | 4/0/0/0/0 | 3 | 3/0/0 |
| zod.z.coerce.date | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.stringbool | 3 | 3/0/0/0/0 | 4 | 4/0/0 |
| zod.z.string | 3 | 3/0/0/0/0 | 60 | 59/1/0 |
| zod.z.stringFormat | 2 | 2/0/0/0/0 | 2 | 2/0/0 |
| zod.z.number | 3 | 3/0/0/0/0 | 34 | 34/0/0 |
| zod.z.bigint | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.void | 2 | 2/0/0/0/0 | 1 | 1/0/0 |
| zod.z.date | 1 | 1/0/0/0/0 | 3 | 3/0/0 |
| zod.z.array | 1 | 1/0/0/0/0 | 9 | 9/0/0 |
| zod.z.object | 2 | 2/0/0/0/0 | 56 | 56/0/0 |
| zod.z.discriminatedUnion | 3 | 3/0/0/0/0 | 21 | 20/1/0 |
| zod.z.intersection | 1 | 1/0/0/0/0 | 10 | 10/0/0 |
| zod.z.tuple | 2 | 2/0/0/0/0 | 6 | 4/2/0 |
| zod.z.record | 1 | 1/0/0/0/0 | 13 | 13/0/0 |
| zod.z.map | 2 | 2/0/0/0/0 | 8 | 8/0/0 |
| zod.z.set | 2 | 2/0/0/0/0 | 12 | 11/1/0 |
| zod.z.enum | 1 | 1/0/0/0/0 | 19 | 19/0/0 |
| zod.z.literal | 4 | 4/0/0/0/0 | 9 | 9/0/0 |
| zod.z.transform | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.optional | 3 | 3/0/0/0/0 | 5 | 5/0/0 |
| zod.z.nullable | 4 | 4/0/0/0/0 | 3 | 3/0/0 |
| zod.z.prefault | 3 | 3/0/0/0/0 | 2 | 2/0/0 |
| zod.z.nonoptional | 2 | 2/0/0/0/0 | 3 | 3/0/0 |
| zod.z.catch | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.nan | 2 | 2/0/0/0/0 | 2 | 2/0/0 |
| zod.z.readonly | 3 | 3/0/0/0/0 | 7 | 7/0/0 |
| zod.z.templateLiteral | 2 | 2/0/0/0/0 | 8 | 5/3/0 |
| zod.z.lazy | 4 | 4/0/0/0/0 | 9 | 9/0/0 |
| zod.z.promise | 2 | 2/0/0/0/0 | 10 | 10/0/0 |
| zod.z.check | 2 | 2/0/0/0/0 | 17 | 17/0/0 |
| zod.z.custom | 3 | 3/0/0/0/0 | 4 | 4/0/0 |
| zod.z.refine | 2 | 2/0/0/0/0 | 15 | 15/0/0 |
| zod.z.instanceof | 3 | 3/0/0/0/0 | 2 | 2/0/0 |
| zod.z.preprocess | 4 | 4/0/0/0/0 | 11 | 8/3/0 |

### Failed developer cases grouped by file: v4.3.0

| File | Case | Occurrence | Category | First message | Review flag |
| --- | --- | --- | --- | --- | --- |
| classic/tests/continuability.test.ts | continuability | 1 | snapshot | Error: Snapshot `continuability 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/discriminated-unions.test.ts | invalid discriminator value | 1 | snapshot | Error: Snapshot `invalid discriminator value 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/file.test.ts | failing validations | 1 | snapshot | Error: Snapshot `failing validations 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/pickomit.test.ts | pick/omit/required/partial - do not allow unknown keys | 1 | assertion | AssertionError: expected [Function] to throw an error | manual review required |
| classic/tests/pipe.test.ts | continue on non-fatal errors | 1 | snapshot | Error: Snapshot `continue on non-fatal errors 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/preprocess.test.ts | perform transform with non-fatal issues | 1 | assertion | AssertionError: expected [ { code: 'custom', path: [], …(1) } ] to have a length of 2 but got 1 | manual review required |
| classic/tests/preprocess.test.ts | preprocess ctx.addIssue non-fatal by default | 1 | assertion | AssertionError: expected [ { code: 'custom', …(2) } ] to have a length of 2 but got 1 | manual review required |
| classic/tests/preprocess.test.ts | z.NEVER in preprocess | 1 | assertion | AssertionError: expected [ { code: 'custom', …(2) } ] to have a length of 2 but got 1 | manual review required |
| classic/tests/set.test.ts | min/max | 1 | snapshot | Error: Snapshot `min/max 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/string.test.ts | bad uuid | 1 | assertion | AssertionError: expected { success: true, …(1) } to match object { success: false } | manual review required |
| classic/tests/template-literal.test.ts | regexes | 1 | snapshot | Error: Snapshot `regexes 17` mismatched | likely non-contract assertion; manual review required |
| classic/tests/template-literal.test.ts | template literal parsing - failure - complex cases | 1 | assertion | AssertionError: expected [Function] to throw an error | manual review required |
| classic/tests/template-literal.test.ts | template literal parsing - failure - issue format | 1 | snapshot | Error: Snapshot `template literal parsing - failure - issue format 4` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | input type | 1 | snapshot | Error: Snapshot `input type 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | override: do not run on references | 1 | assertion | AssertionError: expected 12 to be 6 // Object.is equality | manual review required |
| classic/tests/to-json-schema.test.ts | toJSONSchema primitive types | 1 | snapshot | Error: Snapshot `toJSONSchema > primitive types 12` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | toJSONSchema string formats | 1 | snapshot | Error: Snapshot `toJSONSchema > string formats 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | z.file() | 1 | snapshot | Error: Snapshot `z.file() 3` mismatched | likely non-contract assertion; manual review required |
| classic/tests/tuple.test.ts | async validation | 1 | snapshot | Error: Snapshot `async validation 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/tuple.test.ts | successful validation | 1 | snapshot | Error: Snapshot `successful validation 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/union.test.ts | return errors from both union arms | 1 | snapshot | Error: Snapshot `return errors from both union arms 1` mismatched | likely non-contract assertion; manual review required |
| core/tests/locales/en.test.ts | parsedType | 1 | other | TypeError: (0 , __vite_ssr_import_1__.parsedType) is not a function | manual review required |
| core/tests/locales/tr.test.ts | parsedType | 1 | other | TypeError: (0 , __vite_ssr_import_2__.parsedType) is not a function | manual review required |

### Matched-function cross table: v4.3.0

Developer counts sum only the files in the unchanged automatic pairing map.

| API | LLM baseline | LLM pass/fail/load/timeout/other | Dev baseline | Dev passed/failed/skipped |
| --- | --- | --- | --- | --- |
| zod.z.iso.datetime | 2 | 2/0/0/0/0 | 14 | 14/0/0 |
| zod.z.iso.date | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.coerce.string | 3 | 3/0/0/0/0 | 60 | 59/1/0 |
| zod.z.coerce.number | 2 | 2/0/0/0/0 | 34 | 34/0/0 |
| zod.z.coerce.bigint | 4 | 4/0/0/0/0 | 3 | 3/0/0 |
| zod.z.coerce.date | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.stringbool | 3 | 3/0/0/0/0 | 4 | 4/0/0 |
| zod.z.string | 3 | 3/0/0/0/0 | 60 | 59/1/0 |
| zod.z.stringFormat | 2 | 2/0/0/0/0 | 2 | 2/0/0 |
| zod.z.number | 3 | 3/0/0/0/0 | 34 | 34/0/0 |
| zod.z.bigint | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.void | 2 | 2/0/0/0/0 | 1 | 1/0/0 |
| zod.z.date | 1 | 1/0/0/0/0 | 3 | 3/0/0 |
| zod.z.array | 1 | 1/0/0/0/0 | 9 | 9/0/0 |
| zod.z.object | 2 | 2/0/0/0/0 | 56 | 56/0/0 |
| zod.z.discriminatedUnion | 3 | 3/0/0/0/0 | 21 | 20/1/0 |
| zod.z.intersection | 1 | 1/0/0/0/0 | 10 | 10/0/0 |
| zod.z.tuple | 2 | 2/0/0/0/0 | 6 | 4/2/0 |
| zod.z.record | 1 | 1/0/0/0/0 | 13 | 13/0/0 |
| zod.z.map | 2 | 2/0/0/0/0 | 8 | 8/0/0 |
| zod.z.set | 2 | 2/0/0/0/0 | 12 | 11/1/0 |
| zod.z.enum | 1 | 1/0/0/0/0 | 19 | 19/0/0 |
| zod.z.literal | 4 | 4/0/0/0/0 | 9 | 9/0/0 |
| zod.z.transform | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.optional | 3 | 3/0/0/0/0 | 5 | 5/0/0 |
| zod.z.nullable | 4 | 4/0/0/0/0 | 3 | 3/0/0 |
| zod.z.prefault | 3 | 3/0/0/0/0 | 2 | 2/0/0 |
| zod.z.nonoptional | 2 | 2/0/0/0/0 | 3 | 3/0/0 |
| zod.z.catch | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.nan | 2 | 2/0/0/0/0 | 2 | 2/0/0 |
| zod.z.readonly | 3 | 3/0/0/0/0 | 7 | 7/0/0 |
| zod.z.templateLiteral | 2 | 2/0/0/0/0 | 8 | 5/3/0 |
| zod.z.lazy | 4 | 4/0/0/0/0 | 9 | 9/0/0 |
| zod.z.promise | 2 | 2/0/0/0/0 | 10 | 10/0/0 |
| zod.z.check | 2 | 2/0/0/0/0 | 17 | 17/0/0 |
| zod.z.custom | 3 | 3/0/0/0/0 | 4 | 4/0/0 |
| zod.z.refine | 2 | 2/0/0/0/0 | 15 | 15/0/0 |
| zod.z.instanceof | 3 | 0/3/0/0/0 | 2 | 2/0/0 |
| zod.z.preprocess | 4 | 4/0/0/0/0 | 11 | 8/3/0 |

### Failed developer cases grouped by file: v4.4.0

| File | Case | Occurrence | Category | First message | Review flag |
| --- | --- | --- | --- | --- | --- |
| classic/tests/catch.test.ts | enum | 1 | other | ZodError: [ | manual review required |
| classic/tests/catch.test.ts | native enum | 1 | other | ZodError: [ | manual review required |
| classic/tests/continuability.test.ts | continuability | 1 | snapshot | Error: Snapshot `continuability 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/discriminated-unions.test.ts | invalid discriminator value | 1 | snapshot | Error: Snapshot `invalid discriminator value 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/file.test.ts | failing validations | 1 | snapshot | Error: Snapshot `failing validations 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/function.test.ts | input validation error | 1 | snapshot | Error: Snapshot `input validation error 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/intersection.test.ts | object intersection: strict | 1 | assertion | AssertionError: expected true to deeply equal false | manual review required |
| classic/tests/optional.test.ts | optionality | 1 | assertion | AssertionError: expected undefined to deeply equal 'optional' | manual review required |
| classic/tests/pickomit.test.ts | pick/omit/required/partial - do not allow unknown keys | 1 | assertion | AssertionError: expected [Function] to throw an error | manual review required |
| classic/tests/pipe.test.ts | continue on non-fatal errors | 1 | snapshot | Error: Snapshot `continue on non-fatal errors 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/preprocess.test.ts | perform transform with non-fatal issues | 1 | assertion | AssertionError: expected [ { code: 'custom', path: [], …(1) } ] to have a length of 2 but got 1 | manual review required |
| classic/tests/preprocess.test.ts | preprocess ctx.addIssue non-fatal by default | 1 | assertion | AssertionError: expected [ { code: 'custom', …(2) } ] to have a length of 2 but got 1 | manual review required |
| classic/tests/preprocess.test.ts | z.NEVER in preprocess | 1 | assertion | AssertionError: expected [ { code: 'custom', …(2) } ] to have a length of 2 but got 1 | manual review required |
| classic/tests/set.test.ts | min/max | 1 | snapshot | Error: Snapshot `min/max 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/string.test.ts | bad uuid | 1 | assertion | AssertionError: expected { success: true, …(1) } to match object { success: false } | manual review required |
| classic/tests/string.test.ts | cuid | 1 | snapshot | Error: Snapshot `cuid 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/template-literal.test.ts | regexes | 1 | snapshot | Error: Snapshot `regexes 17` mismatched | likely non-contract assertion; manual review required |
| classic/tests/template-literal.test.ts | template literal parsing - failure - basic cases | 1 | assertion | AssertionError: expected [Function] to throw an error | manual review required |
| classic/tests/template-literal.test.ts | template literal parsing - failure - complex cases | 1 | assertion | AssertionError: expected [Function] to throw an error | manual review required |
| classic/tests/template-literal.test.ts | template literal parsing - failure - issue format | 1 | snapshot | Error: Snapshot `template literal parsing - failure - issue format 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | describe with id | 1 | snapshot | Error: Snapshot `describe with id 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | extract schemas with id | 1 | snapshot | Error: Snapshot `extract schemas with id 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | input type | 1 | snapshot | Error: Snapshot `input type 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | override: do not run on references | 1 | assertion | AssertionError: expected 12 to be 6 // Object.is equality | manual review required |
| classic/tests/to-json-schema.test.ts | overwrite id | 1 | snapshot | Error: Snapshot `overwrite id 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | toJSONSchema primitive types | 1 | snapshot | Error: Snapshot `toJSONSchema > primitive types 12` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | toJSONSchema string formats | 1 | snapshot | Error: Snapshot `toJSONSchema > string formats 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | top-level readonly | 1 | snapshot | Error: Snapshot `top-level readonly 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | z.file() | 1 | snapshot | Error: Snapshot `z.file() 3` mismatched | likely non-contract assertion; manual review required |
| classic/tests/tuple.test.ts | async validation | 1 | snapshot | Error: Snapshot `async validation 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/tuple.test.ts | successful validation | 1 | snapshot | Error: Snapshot `successful validation 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/union.test.ts | return errors from both union arms | 1 | snapshot | Error: Snapshot `return errors from both union arms 1` mismatched | likely non-contract assertion; manual review required |
| core/tests/locales/en.test.ts | parsedType | 1 | other | TypeError: (0 , __vite_ssr_import_1__.parsedType) is not a function | manual review required |
| core/tests/locales/tr.test.ts | parsedType | 1 | other | TypeError: (0 , __vite_ssr_import_2__.parsedType) is not a function | manual review required |

### Matched-function cross table: v4.4.0

Developer counts sum only the files in the unchanged automatic pairing map.

| API | LLM baseline | LLM pass/fail/load/timeout/other | Dev baseline | Dev passed/failed/skipped |
| --- | --- | --- | --- | --- |
| zod.z.iso.datetime | 2 | 2/0/0/0/0 | 14 | 14/0/0 |
| zod.z.iso.date | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.coerce.string | 3 | 3/0/0/0/0 | 60 | 58/2/0 |
| zod.z.coerce.number | 2 | 2/0/0/0/0 | 34 | 34/0/0 |
| zod.z.coerce.bigint | 4 | 4/0/0/0/0 | 3 | 3/0/0 |
| zod.z.coerce.date | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.stringbool | 3 | 3/0/0/0/0 | 4 | 4/0/0 |
| zod.z.string | 3 | 3/0/0/0/0 | 60 | 58/2/0 |
| zod.z.stringFormat | 2 | 2/0/0/0/0 | 2 | 2/0/0 |
| zod.z.number | 3 | 3/0/0/0/0 | 34 | 34/0/0 |
| zod.z.bigint | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.void | 2 | 2/0/0/0/0 | 1 | 1/0/0 |
| zod.z.date | 1 | 1/0/0/0/0 | 3 | 3/0/0 |
| zod.z.array | 1 | 1/0/0/0/0 | 9 | 9/0/0 |
| zod.z.object | 2 | 2/0/0/0/0 | 56 | 56/0/0 |
| zod.z.discriminatedUnion | 3 | 3/0/0/0/0 | 21 | 20/1/0 |
| zod.z.intersection | 1 | 1/0/0/0/0 | 10 | 9/1/0 |
| zod.z.tuple | 2 | 2/0/0/0/0 | 6 | 4/2/0 |
| zod.z.record | 1 | 1/0/0/0/0 | 13 | 13/0/0 |
| zod.z.map | 2 | 2/0/0/0/0 | 8 | 8/0/0 |
| zod.z.set | 2 | 2/0/0/0/0 | 12 | 11/1/0 |
| zod.z.enum | 1 | 1/0/0/0/0 | 19 | 19/0/0 |
| zod.z.literal | 4 | 4/0/0/0/0 | 9 | 9/0/0 |
| zod.z.transform | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.optional | 3 | 3/0/0/0/0 | 5 | 4/1/0 |
| zod.z.nullable | 4 | 4/0/0/0/0 | 3 | 3/0/0 |
| zod.z.prefault | 3 | 3/0/0/0/0 | 2 | 2/0/0 |
| zod.z.nonoptional | 2 | 2/0/0/0/0 | 3 | 3/0/0 |
| zod.z.catch | 2 | 2/0/0/0/0 | 16 | 14/2/0 |
| zod.z.nan | 2 | 2/0/0/0/0 | 2 | 2/0/0 |
| zod.z.readonly | 3 | 3/0/0/0/0 | 7 | 7/0/0 |
| zod.z.templateLiteral | 2 | 2/0/0/0/0 | 8 | 4/4/0 |
| zod.z.lazy | 4 | 4/0/0/0/0 | 9 | 9/0/0 |
| zod.z.promise | 2 | 2/0/0/0/0 | 10 | 10/0/0 |
| zod.z.check | 2 | 2/0/0/0/0 | 17 | 17/0/0 |
| zod.z.custom | 3 | 3/0/0/0/0 | 4 | 4/0/0 |
| zod.z.refine | 2 | 2/0/0/0/0 | 15 | 15/0/0 |
| zod.z.instanceof | 3 | 0/3/0/0/0 | 2 | 2/0/0 |
| zod.z.preprocess | 4 | 4/0/0/0/0 | 11 | 8/3/0 |

### Failed developer cases grouped by file: v4.5.0

| File | Case | Occurrence | Category | First message | Review flag |
| --- | --- | --- | --- | --- | --- |
| classic/tests/array.test.ts | array length | 1 | snapshot | Error: Snapshot `array length 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/continuability.test.ts | continuability | 1 | snapshot | Error: Snapshot `continuability 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/datetime.test.ts | datetime parsing with local and offset | 1 | other | ZodError: [ | manual review required |
| classic/tests/discriminated-unions.test.ts | invalid discriminator value | 1 | snapshot | Error: Snapshot `invalid discriminator value 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/error.test.ts | dont short circuit on continuable errors | 1 | snapshot | Error: Snapshot `dont short circuit on continuable errors 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/error.test.ts | error serialization | 1 | snapshot | Error: Snapshot `error serialization 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/error.test.ts | z.config customError  | 1 | snapshot | Error: Snapshot `z.config customError  1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/file.test.ts | failing validations | 1 | snapshot | Error: Snapshot `failing validations 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/function.test.ts | input validation error | 1 | snapshot | Error: Snapshot `input validation error 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/intersection.test.ts | object intersection: strict | 1 | assertion | AssertionError: expected true to deeply equal false | manual review required |
| classic/tests/lazy.test.ts | opt passthrough | 1 | assertion | AssertionError: expected 'defaulted' to deeply equal 'optional' | manual review required |
| classic/tests/number.test.ts | .finite() validation | 1 | snapshot | Error: Snapshot `.finite() validation 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/number.test.ts | Infinity validation | 1 | snapshot | Error: Snapshot `Infinity validation 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/optional.test.ts | optionality | 1 | assertion | AssertionError: expected 'defaulted' to deeply equal 'optional' | manual review required |
| classic/tests/optional.test.ts | pipe optionality | 1 | assertion | AssertionError: expected 'defaulted' to deeply equal 'optional' | manual review required |
| classic/tests/pickomit.test.ts | pick/omit/required/partial - do not allow unknown keys | 1 | assertion | AssertionError: expected [Function] to throw an error | manual review required |
| classic/tests/pipe.test.ts | continue on non-fatal errors | 1 | snapshot | Error: Snapshot `continue on non-fatal errors 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/preprocess.test.ts | perform transform with non-fatal issues | 1 | assertion | AssertionError: expected [ { code: 'custom', path: [], …(1) } ] to have a length of 2 but got 1 | manual review required |
| classic/tests/preprocess.test.ts | preprocess ctx.addIssue non-fatal by default | 1 | assertion | AssertionError: expected [ { code: 'custom', …(2) } ] to have a length of 2 but got 1 | manual review required |
| classic/tests/preprocess.test.ts | z.NEVER in preprocess | 1 | assertion | AssertionError: expected [ { code: 'custom', …(2) } ] to have a length of 2 but got 1 | manual review required |
| classic/tests/set.test.ts | min/max | 1 | snapshot | Error: Snapshot `min/max 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/string.test.ts | bad uuid | 1 | assertion | AssertionError: expected { success: true, …(1) } to match object { success: false } | manual review required |
| classic/tests/string.test.ts | cuid | 1 | snapshot | Error: Snapshot `cuid 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/string.test.ts | ulid | 1 | snapshot | Error: Snapshot `ulid 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/template-literal.test.ts | regexes | 1 | snapshot | Error: Snapshot `regexes 17` mismatched | likely non-contract assertion; manual review required |
| classic/tests/template-literal.test.ts | template literal parsing - failure - basic cases | 1 | assertion | AssertionError: expected [Function] to throw an error | manual review required |
| classic/tests/template-literal.test.ts | template literal parsing - failure - complex cases | 1 | assertion | AssertionError: expected [Function] to throw an error | manual review required |
| classic/tests/template-literal.test.ts | template literal parsing - failure - issue format | 1 | snapshot | Error: Snapshot `template literal parsing - failure - issue format 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | describe with id | 1 | snapshot | Error: Snapshot `describe with id 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | extract schemas with id | 1 | snapshot | Error: Snapshot `extract schemas with id 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | flatten simple intersections | 1 | snapshot | Error: Snapshot `flatten simple intersections 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | input type | 1 | snapshot | Error: Snapshot `input type 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | override execution order | 1 | snapshot | Error: Snapshot `override execution order 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | override: do not run on references | 1 | assertion | AssertionError: expected 12 to be 6 // Object.is equality | manual review required |
| classic/tests/to-json-schema.test.ts | overwrite id | 1 | snapshot | Error: Snapshot `overwrite id 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | toJSONSchema intersections | 1 | snapshot | Error: Snapshot `toJSONSchema > intersections 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | toJSONSchema primitive types | 1 | snapshot | Error: Snapshot `toJSONSchema > primitive types 10` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | toJSONSchema string formats | 1 | snapshot | Error: Snapshot `toJSONSchema > string formats 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | toJSONSchema string patterns | 1 | snapshot | Error: Snapshot `toJSONSchema > string patterns 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | toJSONSchema tuple | 1 | snapshot | Error: Snapshot `toJSONSchema > tuple 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | toJSONSchema unions | 1 | snapshot | Error: Snapshot `toJSONSchema > unions 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | top-level readonly | 1 | snapshot | Error: Snapshot `top-level readonly 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | z.file() | 1 | snapshot | Error: Snapshot `z.file() 3` mismatched | likely non-contract assertion; manual review required |
| classic/tests/tuple.test.ts | async validation | 1 | snapshot | Error: Snapshot `async validation 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/tuple.test.ts | successful validation | 1 | snapshot | Error: Snapshot `successful validation 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/union.test.ts | return errors from both union arms | 1 | snapshot | Error: Snapshot `return errors from both union arms 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/validations.test.ts | string length | 1 | snapshot | Error: Snapshot `string length 1` mismatched | likely non-contract assertion; manual review required |
| core/tests/locales/en.test.ts | parsedType | 1 | other | TypeError: (0 , __vite_ssr_import_1__.parsedType) is not a function | manual review required |
| core/tests/locales/tr.test.ts | parsedType | 1 | other | TypeError: (0 , __vite_ssr_import_2__.parsedType) is not a function | manual review required |

### Matched-function cross table: v4.5.0

Developer counts sum only the files in the unchanged automatic pairing map.

| API | LLM baseline | LLM pass/fail/load/timeout/other | Dev baseline | Dev passed/failed/skipped |
| --- | --- | --- | --- | --- |
| zod.z.iso.datetime | 2 | 2/0/0/0/0 | 14 | 13/1/0 |
| zod.z.iso.date | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.coerce.string | 3 | 3/0/0/0/0 | 60 | 57/3/0 |
| zod.z.coerce.number | 2 | 2/0/0/0/0 | 34 | 32/2/0 |
| zod.z.coerce.bigint | 4 | 4/0/0/0/0 | 3 | 3/0/0 |
| zod.z.coerce.date | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.stringbool | 3 | 3/0/0/0/0 | 4 | 4/0/0 |
| zod.z.string | 3 | 3/0/0/0/0 | 60 | 57/3/0 |
| zod.z.stringFormat | 2 | 2/0/0/0/0 | 2 | 2/0/0 |
| zod.z.number | 3 | 3/0/0/0/0 | 34 | 32/2/0 |
| zod.z.bigint | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.void | 2 | 2/0/0/0/0 | 1 | 1/0/0 |
| zod.z.date | 1 | 1/0/0/0/0 | 3 | 3/0/0 |
| zod.z.array | 1 | 1/0/0/0/0 | 9 | 8/1/0 |
| zod.z.object | 2 | 2/0/0/0/0 | 56 | 56/0/0 |
| zod.z.discriminatedUnion | 3 | 3/0/0/0/0 | 21 | 20/1/0 |
| zod.z.intersection | 1 | 1/0/0/0/0 | 10 | 9/1/0 |
| zod.z.tuple | 2 | 2/0/0/0/0 | 6 | 4/2/0 |
| zod.z.record | 1 | 1/0/0/0/0 | 13 | 13/0/0 |
| zod.z.map | 2 | 2/0/0/0/0 | 8 | 8/0/0 |
| zod.z.set | 2 | 2/0/0/0/0 | 12 | 11/1/0 |
| zod.z.enum | 1 | 1/0/0/0/0 | 19 | 19/0/0 |
| zod.z.literal | 4 | 4/0/0/0/0 | 9 | 9/0/0 |
| zod.z.transform | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.optional | 3 | 3/0/0/0/0 | 5 | 3/2/0 |
| zod.z.nullable | 4 | 4/0/0/0/0 | 3 | 3/0/0 |
| zod.z.prefault | 3 | 3/0/0/0/0 | 2 | 2/0/0 |
| zod.z.nonoptional | 2 | 2/0/0/0/0 | 3 | 3/0/0 |
| zod.z.catch | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.nan | 2 | 2/0/0/0/0 | 2 | 2/0/0 |
| zod.z.readonly | 3 | 3/0/0/0/0 | 7 | 7/0/0 |
| zod.z.templateLiteral | 2 | 2/0/0/0/0 | 8 | 4/4/0 |
| zod.z.lazy | 4 | 4/0/0/0/0 | 9 | 8/1/0 |
| zod.z.promise | 2 | 2/0/0/0/0 | 10 | 10/0/0 |
| zod.z.check | 2 | 2/0/0/0/0 | 17 | 17/0/0 |
| zod.z.custom | 3 | 3/0/0/0/0 | 4 | 4/0/0 |
| zod.z.refine | 2 | 2/0/0/0/0 | 15 | 15/0/0 |
| zod.z.instanceof | 3 | 0/3/0/0/0 | 2 | 2/0/0 |
| zod.z.preprocess | 4 | 4/0/0/0/0 | 11 | 8/3/0 |

### Failed developer cases grouped by file: v4.6.0

| File | Case | Occurrence | Category | First message | Review flag |
| --- | --- | --- | --- | --- | --- |
| classic/tests/array.test.ts | array length | 1 | snapshot | Error: Snapshot `array length 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/continuability.test.ts | continuability | 1 | snapshot | Error: Snapshot `continuability 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/datetime.test.ts | datetime parsing with local and offset | 1 | other | ZodError: [ | manual review required |
| classic/tests/discriminated-unions.test.ts | invalid discriminator value | 1 | snapshot | Error: Snapshot `invalid discriminator value 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/error.test.ts | dont short circuit on continuable errors | 1 | snapshot | Error: Snapshot `dont short circuit on continuable errors 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/error.test.ts | error serialization | 1 | snapshot | Error: Snapshot `error serialization 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/error.test.ts | z.config customError  | 1 | snapshot | Error: Snapshot `z.config customError  1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/file.test.ts | failing validations | 1 | snapshot | Error: Snapshot `failing validations 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/function.test.ts | input validation error | 1 | snapshot | Error: Snapshot `input validation error 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/intersection.test.ts | object intersection: strict | 1 | assertion | AssertionError: expected true to deeply equal false | manual review required |
| classic/tests/lazy.test.ts | opt passthrough | 1 | assertion | AssertionError: expected 'defaulted' to deeply equal 'optional' | manual review required |
| classic/tests/number.test.ts | .finite() validation | 1 | snapshot | Error: Snapshot `.finite() validation 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/number.test.ts | Infinity validation | 1 | snapshot | Error: Snapshot `Infinity validation 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/optional.test.ts | optionality | 1 | assertion | AssertionError: expected 'defaulted' to deeply equal 'optional' | manual review required |
| classic/tests/optional.test.ts | pipe optionality | 1 | assertion | AssertionError: expected 'defaulted' to deeply equal 'optional' | manual review required |
| classic/tests/pipe.test.ts | continue on non-fatal errors | 1 | snapshot | Error: Snapshot `continue on non-fatal errors 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/preprocess.test.ts | perform transform with non-fatal issues | 1 | assertion | AssertionError: expected [ { code: 'custom', path: [], …(1) } ] to have a length of 2 but got 1 | manual review required |
| classic/tests/preprocess.test.ts | preprocess ctx.addIssue non-fatal by default | 1 | assertion | AssertionError: expected [ { code: 'custom', …(2) } ] to have a length of 2 but got 1 | manual review required |
| classic/tests/preprocess.test.ts | z.NEVER in preprocess | 1 | assertion | AssertionError: expected [ { code: 'custom', …(2) } ] to have a length of 2 but got 1 | manual review required |
| classic/tests/set.test.ts | min/max | 1 | snapshot | Error: Snapshot `min/max 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/string.test.ts | bad uuid | 1 | assertion | AssertionError: expected { success: true, …(1) } to match object { success: false } | manual review required |
| classic/tests/string.test.ts | cuid | 1 | snapshot | Error: Snapshot `cuid 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/string.test.ts | ulid | 1 | snapshot | Error: Snapshot `ulid 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/template-literal.test.ts | regexes | 1 | snapshot | Error: Snapshot `regexes 17` mismatched | likely non-contract assertion; manual review required |
| classic/tests/template-literal.test.ts | template literal parsing - failure - basic cases | 1 | assertion | AssertionError: expected [Function] to throw an error | manual review required |
| classic/tests/template-literal.test.ts | template literal parsing - failure - complex cases | 1 | assertion | AssertionError: expected [Function] to throw an error | manual review required |
| classic/tests/template-literal.test.ts | template literal parsing - failure - issue format | 1 | snapshot | Error: Snapshot `template literal parsing - failure - issue format 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | describe with id | 1 | snapshot | Error: Snapshot `describe with id 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | extract schemas with id | 1 | snapshot | Error: Snapshot `extract schemas with id 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | flatten simple intersections | 1 | snapshot | Error: Snapshot `flatten simple intersections 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | input type | 1 | snapshot | Error: Snapshot `input type 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | override execution order | 1 | snapshot | Error: Snapshot `override execution order 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | override: do not run on references | 1 | assertion | AssertionError: expected 12 to be 6 // Object.is equality | manual review required |
| classic/tests/to-json-schema.test.ts | overwrite id | 1 | snapshot | Error: Snapshot `overwrite id 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | toJSONSchema intersections | 1 | snapshot | Error: Snapshot `toJSONSchema > intersections 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | toJSONSchema primitive types | 1 | snapshot | Error: Snapshot `toJSONSchema > primitive types 9` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | toJSONSchema string formats | 1 | snapshot | Error: Snapshot `toJSONSchema > string formats 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | toJSONSchema string patterns | 1 | snapshot | Error: Snapshot `toJSONSchema > string patterns 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | toJSONSchema tuple | 1 | snapshot | Error: Snapshot `toJSONSchema > tuple 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | toJSONSchema unions | 1 | snapshot | Error: Snapshot `toJSONSchema > unions 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | top-level readonly | 1 | snapshot | Error: Snapshot `top-level readonly 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/to-json-schema.test.ts | z.file() | 1 | snapshot | Error: Snapshot `z.file() 3` mismatched | likely non-contract assertion; manual review required |
| classic/tests/tuple.test.ts | async validation | 1 | snapshot | Error: Snapshot `async validation 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/tuple.test.ts | successful validation | 1 | snapshot | Error: Snapshot `successful validation 2` mismatched | likely non-contract assertion; manual review required |
| classic/tests/union.test.ts | return errors from both union arms | 1 | snapshot | Error: Snapshot `return errors from both union arms 1` mismatched | likely non-contract assertion; manual review required |
| classic/tests/validations.test.ts | string length | 1 | snapshot | Error: Snapshot `string length 1` mismatched | likely non-contract assertion; manual review required |
| core/tests/locales/en.test.ts | parsedType | 1 | other | TypeError: (0 , __vite_ssr_import_1__.parsedType) is not a function | manual review required |
| core/tests/locales/tr.test.ts | parsedType | 1 | other | TypeError: (0 , __vite_ssr_import_2__.parsedType) is not a function | manual review required |
| mini/tests/computed.test.ts | array size | 1 | assertion | AssertionError: expected undefined to deeply equal 5 | manual review required |
| mini/tests/computed.test.ts | int32 format | 1 | assertion | AssertionError: expected undefined to deeply equal 'int32' | manual review required |
| mini/tests/computed.test.ts | int64 format | 1 | assertion | AssertionError: expected undefined to deeply equal 'int64' | manual review required |
| mini/tests/computed.test.ts | min/max | 1 | assertion | AssertionError: expected undefined to deeply equal 7 | manual review required |
| mini/tests/computed.test.ts | multipleOf | 1 | assertion | AssertionError: expected undefined to deeply equal 5 | manual review required |

### Matched-function cross table: v4.6.0

Developer counts sum only the files in the unchanged automatic pairing map.

| API | LLM baseline | LLM pass/fail/load/timeout/other | Dev baseline | Dev passed/failed/skipped |
| --- | --- | --- | --- | --- |
| zod.z.iso.datetime | 2 | 2/0/0/0/0 | 14 | 13/1/0 |
| zod.z.iso.date | 3 | 2/1/0/0/0 | 3 | 3/0/0 |
| zod.z.coerce.string | 3 | 3/0/0/0/0 | 60 | 57/3/0 |
| zod.z.coerce.number | 2 | 2/0/0/0/0 | 34 | 32/2/0 |
| zod.z.coerce.bigint | 4 | 4/0/0/0/0 | 3 | 3/0/0 |
| zod.z.coerce.date | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.stringbool | 3 | 3/0/0/0/0 | 4 | 4/0/0 |
| zod.z.string | 3 | 3/0/0/0/0 | 60 | 57/3/0 |
| zod.z.stringFormat | 2 | 2/0/0/0/0 | 2 | 2/0/0 |
| zod.z.number | 3 | 3/0/0/0/0 | 34 | 32/2/0 |
| zod.z.bigint | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.void | 2 | 2/0/0/0/0 | 1 | 1/0/0 |
| zod.z.date | 1 | 1/0/0/0/0 | 3 | 3/0/0 |
| zod.z.array | 1 | 1/0/0/0/0 | 9 | 8/1/0 |
| zod.z.object | 2 | 2/0/0/0/0 | 56 | 56/0/0 |
| zod.z.discriminatedUnion | 3 | 3/0/0/0/0 | 21 | 20/1/0 |
| zod.z.intersection | 1 | 1/0/0/0/0 | 10 | 9/1/0 |
| zod.z.tuple | 2 | 2/0/0/0/0 | 6 | 4/2/0 |
| zod.z.record | 1 | 1/0/0/0/0 | 13 | 13/0/0 |
| zod.z.map | 2 | 2/0/0/0/0 | 8 | 8/0/0 |
| zod.z.set | 2 | 2/0/0/0/0 | 12 | 11/1/0 |
| zod.z.enum | 1 | 1/0/0/0/0 | 19 | 19/0/0 |
| zod.z.literal | 4 | 4/0/0/0/0 | 9 | 9/0/0 |
| zod.z.transform | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.optional | 3 | 3/0/0/0/0 | 5 | 3/2/0 |
| zod.z.nullable | 4 | 4/0/0/0/0 | 3 | 3/0/0 |
| zod.z.prefault | 3 | 3/0/0/0/0 | 2 | 2/0/0 |
| zod.z.nonoptional | 2 | 2/0/0/0/0 | 3 | 3/0/0 |
| zod.z.catch | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.nan | 2 | 2/0/0/0/0 | 2 | 2/0/0 |
| zod.z.readonly | 3 | 3/0/0/0/0 | 7 | 7/0/0 |
| zod.z.templateLiteral | 2 | 2/0/0/0/0 | 8 | 4/4/0 |
| zod.z.lazy | 4 | 4/0/0/0/0 | 9 | 8/1/0 |
| zod.z.promise | 2 | 2/0/0/0/0 | 10 | 10/0/0 |
| zod.z.check | 2 | 2/0/0/0/0 | 17 | 17/0/0 |
| zod.z.custom | 3 | 3/0/0/0/0 | 4 | 4/0/0 |
| zod.z.refine | 2 | 2/0/0/0/0 | 15 | 15/0/0 |
| zod.z.instanceof | 3 | 0/3/0/0/0 | 2 | 2/0/0 |
| zod.z.preprocess | 4 | 4/0/0/0/0 | 11 | 8/3/0 |
