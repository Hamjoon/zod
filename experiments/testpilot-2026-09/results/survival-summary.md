# Stage S survival analysis

All tests are frozen at v4.0.5. LLM denominator is 139; developer denominator is 888 runtime cases. Harness failures are unavailable, never test failures. Developer file-load failures inherit the baseline cases as failed. Test-file A/M/D counts describe ignored upstream edits only.

| Tag | Commit | Date | Build | Probe | LLM P/F/load/timeout/other | LLM survival | Dev loaded/passed/failed/skipped | Dev survival | Dev A/M/D |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v4.0.5 | 45afab0f846dffd591362b6f770017507eb185b5 | 2025-07-10 | ok | ok | 139/0/0/0/0 | 139/139 (100.00%) | 81/888/0/0 | 888/888 (100.00%) | 0/0/0 |
| v4.1.0 | 2ca716d6313dcfab425d3555ac8bf85929bc57a4 | 2025-08-23 | ok | ok | 139/0/0/0/0 | 139/139 (100.00%) | 81/871/17/0 | 871/888 (98.09%) | 5/36/0 |
| v4.2.0 | dcef9734f55fc1c8e73795a2be80c60fa7a4a568 | 2025-12-14 | ok | ok | 139/0/0/0/0 | 139/139 (100.00%) | 81/868/19/1 | 868/888 (97.75%) | 16/42/0 |
| v4.3.0 | 1899684fc34d149ebb5d6f9fd95a588e94f27053 | 2025-12-30 | ok | ok | 139/0/0/0/0 | 139/139 (100.00%) | 81/864/23/1 | 864/888 (97.30%) | 20/49/0 |
| v4.4.0 | d05f026e9e6eae0e1e6c2efbf11c89007ca40494 | 2026-04-29 | ok | ok | 139/0/0/0/0 | 139/139 (100.00%) | 81/853/34/1 | 853/888 (96.06%) | 27/51/0 |
| v4.5.0 | 0a69bcb3d9554c6ec382ea9ba6b43c2421f3fa78 | 2026-08-28 | ok | ok | 138/1/0/0/0 | 138/139 (99.28%) | 81/838/49/1 | 838/888 (94.37%) | 49/61/0 |
| v4.6.0 | 1c51cbe0fe23d09f8d520b31487d50a01588fae5 | 2026-09-09 | ok | ok | 138/1/0/0/0 | 138/139 (99.28%) | 81/834/53/1 | 834/888 (93.92%) | 55/62/0 |

## Per stratum

| Stratum | Tests in S | v4.0.5 | v4.1.0 | v4.2.0 | v4.3.0 | v4.4.0 | v4.5.0 | v4.6.0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S | 88 | 88/88 (100.00%) | 88/88 (100.00%) | 88/88 (100.00%) | 88/88 (100.00%) | 88/88 (100.00%) | 88/88 (100.00%) | 88/88 (100.00%) |
| C | 36 | 36/36 (100.00%) | 36/36 (100.00%) | 36/36 (100.00%) | 36/36 (100.00%) | 36/36 (100.00%) | 36/36 (100.00%) | 36/36 (100.00%) |
| Q | 15 | 15/15 (100.00%) | 15/15 (100.00%) | 15/15 (100.00%) | 15/15 (100.00%) | 15/15 (100.00%) | 14/15 (93.33%) | 14/15 (93.33%) |

## Per function

| Function | Tests in S | v4.1.0 | v4.2.0 | v4.3.0 | v4.4.0 | v4.5.0 | v4.6.0 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| zod.z.discriminatedUnion | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.file | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.nullish | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.readonly | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.map | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.cidrv4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.cidrv6 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.strictObject | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.date | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.base64 | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.tuple | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.guid | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.nanoid | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.uuidv6 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.array | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.int64 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.any | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.ulid | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.nullable | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.never | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.email | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.looseObject | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.symbol | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.uuidv7 | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.uuid | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.prefault | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.cuid2 | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.unknown | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.uint32 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.keyof | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.catch | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.nonoptional | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.boolean | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.check | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.uppercase | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.minLength | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.negative | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.gte | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.endsWith | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.multipleOf | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.lt | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.trim | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.transform | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.positive | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.overwrite | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.preprocess | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.nonpositive | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.iso.duration | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.safeParse | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.parseAsync | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.coerce.number | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.coerce.boolean | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.parse | 3 | 3 | 3 | 3 | 3 | 2 | 2 |
| zod.z.iso.time | 2 | 2 | 2 | 2 | 2 | 2 | 2 |

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
| correctness | 0 |
| timeout | 0 |
| other | 0 |

| Error first line | Count |
| --- | --- |

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
| assertion | 0 |
| file-system | 0 |
| correctness | 0 |
| timeout | 0 |
| other | 0 |

| Error first line | Count |
| --- | --- |

## LLM failures: v4.4.0

| Category | Count |
| --- | --- |
| assertion | 0 |
| file-system | 0 |
| correctness | 0 |
| timeout | 0 |
| other | 0 |

| Error first line | Count |
| --- | --- |

## LLM failures: v4.5.0

| Category | Count |
| --- | --- |
| assertion | 1 |
| file-system | 0 |
| correctness | 0 |
| timeout | 0 |
| other | 0 |

| Error first line | Count |
| --- | --- |
| Got unwanted exception. | 1 |

## LLM failures: v4.6.0

| Category | Count |
| --- | --- |
| assertion | 1 |
| file-system | 0 |
| correctness | 0 |
| timeout | 0 |
| other | 0 |

| Error first line | Count |
| --- | --- |
| Got unwanted exception. | 1 |

## First breaks and returns to passing

Developer identity is file + fullName + one-based occurrence in the frozen declaration order. All available runs must preserve the baseline identities. Unavailable releases are not evidence of survival; never-break counts mean no observed break in available runs. Todo is neither a break nor a survival and is ignored in rebound transitions. First breaks include the control; non-passing baseline observations are retained. A return to passing is any later pass following a non-pass.

| Corpus | No observed break (available releases only) | Break then pass again |
| --- | --- | --- |
| LLM | 138 | 0 |
| Dev | 832 | 3 |

| LLM test | API | First break | Pass again |
| --- | --- | --- | --- |
| test_1.js | zod.z.discriminatedUnion | never | False |
| test_5.js | zod.z.discriminatedUnion | never | False |
| test_19.js | zod.z.file | never | False |
| test_24.js | zod.z.nullish | never | False |
| test_25.js | zod.z.nullish | never | False |
| test_26.js | zod.z.nullish | never | False |
| test_27.js | zod.z.nullish | never | False |
| test_28.js | zod.z.readonly | never | False |
| test_29.js | zod.z.readonly | never | False |
| test_37.js | zod.z.map | never | False |
| test_39.js | zod.z.map | never | False |
| test_40.js | zod.z.cidrv4 | never | False |
| test_41.js | zod.z.cidrv4 | never | False |
| test_42.js | zod.z.cidrv4 | never | False |
| test_43.js | zod.z.cidrv4 | never | False |
| test_44.js | zod.z.cidrv6 | never | False |
| test_54.js | zod.z.strictObject | never | False |
| test_56.js | zod.z.strictObject | never | False |
| test_58.js | zod.z.date | never | False |
| test_61.js | zod.z.date | never | False |
| test_64.js | zod.z.base64 | never | False |
| test_65.js | zod.z.base64 | never | False |
| test_66.js | zod.z.base64 | never | False |
| test_67.js | zod.z.base64 | never | False |
| test_68.js | zod.z.tuple | never | False |
| test_75.js | zod.z.guid | never | False |
| test_76.js | zod.z.guid | never | False |
| test_77.js | zod.z.guid | never | False |
| test_83.js | zod.z.nanoid | never | False |
| test_85.js | zod.z.nanoid | never | False |
| test_86.js | zod.z.uuidv6 | never | False |
| test_87.js | zod.z.uuidv6 | never | False |
| test_89.js | zod.z.uuidv6 | never | False |
| test_98.js | zod.z.array | never | False |
| test_100.js | zod.z.int64 | never | False |
| test_102.js | zod.z.int64 | never | False |
| test_104.js | zod.z.int64 | never | False |
| test_105.js | zod.z.any | never | False |
| test_106.js | zod.z.any | never | False |
| test_107.js | zod.z.any | never | False |
| test_108.js | zod.z.any | never | False |
| test_109.js | zod.z.ulid | never | False |
| test_110.js | zod.z.ulid | never | False |
| test_111.js | zod.z.ulid | never | False |
| test_112.js | zod.z.ulid | never | False |
| test_121.js | zod.z.nullable | never | False |
| test_122.js | zod.z.nullable | never | False |
| test_123.js | zod.z.nullable | never | False |
| test_124.js | zod.z.nullable | never | False |
| test_132.js | zod.z.never | never | False |
| test_134.js | zod.z.never | never | False |
| test_136.js | zod.z.email | never | False |
| test_137.js | zod.z.email | never | False |
| test_143.js | zod.z.looseObject | never | False |
| test_146.js | zod.z.looseObject | never | False |
| test_147.js | zod.z.looseObject | never | False |
| test_150.js | zod.z.symbol | never | False |
| test_151.js | zod.z.symbol | never | False |
| test_153.js | zod.z.symbol | never | False |
| test_154.js | zod.z.uuidv7 | never | False |
| test_155.js | zod.z.uuidv7 | never | False |
| test_156.js | zod.z.uuidv7 | never | False |
| test_157.js | zod.z.uuidv7 | never | False |
| test_158.js | zod.z.uuid | never | False |
| test_159.js | zod.z.uuid | never | False |
| test_164.js | zod.z.prefault | never | False |
| test_167.js | zod.z.prefault | never | False |
| test_168.js | zod.z.prefault | never | False |
| test_169.js | zod.z.cuid2 | never | False |
| test_170.js | zod.z.cuid2 | never | False |
| test_171.js | zod.z.cuid2 | never | False |
| test_172.js | zod.z.cuid2 | never | False |
| test_173.js | zod.z.unknown | never | False |
| test_174.js | zod.z.unknown | never | False |
| test_175.js | zod.z.unknown | never | False |
| test_176.js | zod.z.unknown | never | False |
| test_177.js | zod.z.uint32 | never | False |
| test_178.js | zod.z.uint32 | never | False |
| test_180.js | zod.z.uint32 | never | False |
| test_185.js | zod.z.keyof | never | False |
| test_191.js | zod.z.catch | never | False |
| test_192.js | zod.z.catch | never | False |
| test_199.js | zod.z.nonoptional | never | False |
| test_200.js | zod.z.nonoptional | never | False |
| test_202.js | zod.z.nonoptional | never | False |
| test_204.js | zod.z.boolean | never | False |
| test_205.js | zod.z.boolean | never | False |
| test_207.js | zod.z.boolean | never | False |
| test_209.js | zod.z.check | never | False |
| test_210.js | zod.z.check | never | False |
| test_211.js | zod.z.check | never | False |
| test_212.js | zod.z.check | never | False |
| test_219.js | zod.z.uppercase | never | False |
| test_227.js | zod.z.minLength | never | False |
| test_231.js | zod.z.negative | never | False |
| test_232.js | zod.z.negative | never | False |
| test_234.js | zod.z.negative | never | False |
| test_241.js | zod.z.gte | never | False |
| test_250.js | zod.z.endsWith | never | False |
| test_253.js | zod.z.endsWith | never | False |
| test_255.js | zod.z.endsWith | never | False |
| test_262.js | zod.z.multipleOf | never | False |
| test_263.js | zod.z.multipleOf | never | False |
| test_265.js | zod.z.multipleOf | never | False |
| test_274.js | zod.z.lt | never | False |
| test_276.js | zod.z.lt | never | False |
| test_279.js | zod.z.lt | never | False |
| test_281.js | zod.z.trim | never | False |
| test_283.js | zod.z.trim | never | False |
| test_284.js | zod.z.trim | never | False |
| test_285.js | zod.z.trim | never | False |
| test_286.js | zod.z.transform | never | False |
| test_287.js | zod.z.transform | never | False |
| test_294.js | zod.z.positive | never | False |
| test_295.js | zod.z.positive | never | False |
| test_302.js | zod.z.overwrite | never | False |
| test_304.js | zod.z.overwrite | never | False |
| test_305.js | zod.z.preprocess | never | False |
| test_306.js | zod.z.preprocess | never | False |
| test_307.js | zod.z.preprocess | never | False |
| test_308.js | zod.z.preprocess | never | False |
| test_311.js | zod.z.nonpositive | never | False |
| test_313.js | zod.z.nonpositive | never | False |
| test_314.js | zod.z.nonpositive | never | False |
| test_319.js | zod.z.iso.duration | never | False |
| test_325.js | zod.z.safeParse | never | False |
| test_326.js | zod.z.safeParse | never | False |
| test_327.js | zod.z.safeParse | never | False |
| test_328.js | zod.z.safeParse | never | False |
| test_330.js | zod.z.parseAsync | never | False |
| test_331.js | zod.z.parseAsync | never | False |
| test_333.js | zod.z.parseAsync | never | False |
| test_335.js | zod.z.coerce.number | never | False |
| test_346.js | zod.z.coerce.boolean | never | False |
| test_349.js | zod.z.parse | never | False |
| test_350.js | zod.z.parse | never | False |
| test_353.js | zod.z.parse | v4.5.0 | False |
| test_357.js | zod.z.iso.time | never | False |
| test_359.js | zod.z.iso.time | never | False |

| Dev file | Case | Occurrence | First break | Pass again |
| --- | --- | --- | --- | --- |
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
| core/tests/index.test.ts | test | 1 | never | False |
| core/tests/index.test.ts | test2 | 1 | never | False |
| core/tests/index.test.ts | async validation | 1 | never | False |
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
| zod.z.discriminatedUnion | classic/tests/discriminated-unions.test.ts | 2 | 21 | 2 | 20 | 0 | 2 | 20 | 0 | 2 | 20 | 0 | 2 | 20 | 0 | 2 | 20 | 0 | 2 | 20 | 0 |
| zod.z.file | classic/tests/file.test.ts | 1 | 2 | 1 | 1 | 0 | 1 | 1 | 0 | 1 | 1 | 0 | 1 | 1 | 0 | 1 | 1 | 0 | 1 | 1 | 0 |
| zod.z.nullish |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched |
| zod.z.readonly | classic/tests/readonly.test.ts | 2 | 7 | 2 | 7 | 0 | 2 | 7 | 0 | 2 | 7 | 0 | 2 | 7 | 0 | 2 | 7 | 0 | 2 | 7 | 0 |
| zod.z.map | classic/tests/map.test.ts | 2 | 8 | 2 | 8 | 0 | 2 | 8 | 0 | 2 | 8 | 0 | 2 | 8 | 0 | 2 | 8 | 0 | 2 | 8 | 0 |
| zod.z.cidrv4 |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched |
| zod.z.cidrv6 |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.strictObject |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.date | classic/tests/date.test.ts | 2 | 3 | 2 | 3 | 0 | 2 | 3 | 0 | 2 | 3 | 0 | 2 | 3 | 0 | 2 | 3 | 0 | 2 | 3 | 0 |
| zod.z.base64 |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched |
| zod.z.tuple | classic/tests/tuple.test.ts | 1 | 6 | 1 | 4 | 0 | 1 | 4 | 0 | 1 | 4 | 0 | 1 | 4 | 0 | 1 | 4 | 0 | 1 | 4 | 0 |
| zod.z.guid |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.nanoid |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.uuidv6 |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.array | classic/tests/array.test.ts | 1 | 9 | 1 | 9 | 0 | 1 | 9 | 0 | 1 | 9 | 0 | 1 | 9 | 0 | 1 | 8 | 0 | 1 | 8 | 0 |
| zod.z.int64 |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.any |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched |
| zod.z.ulid |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched |
| zod.z.nullable | classic/tests/nullable.test.ts | 4 | 3 | 4 | 3 | 0 | 4 | 3 | 0 | 4 | 3 | 0 | 4 | 3 | 0 | 4 | 3 | 0 | 4 | 3 | 0 |
| zod.z.never |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.email |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.looseObject |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.symbol |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.uuidv7 |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched |
| zod.z.uuid |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.prefault | classic/tests/prefault.test.ts | 3 | 2 | 3 | 2 | 0 | 3 | 2 | 0 | 3 | 2 | 0 | 3 | 2 | 0 | 3 | 2 | 0 | 3 | 2 | 0 |
| zod.z.cuid2 |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched |
| zod.z.unknown |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched |
| zod.z.uint32 |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.keyof |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.catch | classic/tests/catch.test.ts | 2 | 16 | 2 | 16 | 0 | 2 | 16 | 0 | 2 | 16 | 0 | 2 | 14 | 0 | 2 | 16 | 0 | 2 | 16 | 0 |
| zod.z.nonoptional | classic/tests/nonoptional.test.ts | 3 | 3 | 3 | 3 | 0 | 3 | 3 | 0 | 3 | 3 | 0 | 3 | 3 | 0 | 3 | 3 | 0 | 3 | 3 | 0 |
| zod.z.boolean |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.check | mini/tests/checks.test.ts | 4 | 17 | 4 | 17 | 0 | 4 | 17 | 0 | 4 | 17 | 0 | 4 | 17 | 0 | 4 | 17 | 0 | 4 | 17 | 0 |
| zod.z.uppercase |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.minLength |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.negative |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.gte |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.endsWith |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.multipleOf |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.lt |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.trim |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched |
| zod.z.transform | classic/tests/transform.test.ts | 2 | 16 | 2 | 16 | 0 | 2 | 16 | 0 | 2 | 16 | 0 | 2 | 16 | 0 | 2 | 16 | 0 | 2 | 16 | 0 |
| zod.z.positive |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.overwrite |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.preprocess | classic/tests/preprocess.test.ts | 4 | 11 | 4 | 8 | 0 | 4 | 8 | 0 | 4 | 8 | 0 | 4 | 8 | 0 | 4 | 8 | 0 | 4 | 8 | 0 |
| zod.z.nonpositive |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.iso.duration |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.safeParse |  | 4 | 0 | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched | 4 | unmatched | unmatched |
| zod.z.parseAsync |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched |
| zod.z.coerce.number | classic/tests/number.test.ts; mini/tests/number.test.ts | 1 | 34 | 1 | 34 | 0 | 1 | 34 | 0 | 1 | 34 | 0 | 1 | 34 | 0 | 1 | 32 | 0 | 1 | 32 | 0 |
| zod.z.coerce.boolean |  | 1 | 0 | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched | 1 | unmatched | unmatched |
| zod.z.parse |  | 3 | 0 | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 3 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |
| zod.z.iso.time |  | 2 | 0 | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched | 2 | unmatched | unmatched |

Functions with no automatic match:

- `zod.z.nullish`
- `zod.z.cidrv4`
- `zod.z.cidrv6`
- `zod.z.strictObject`
- `zod.z.base64`
- `zod.z.guid`
- `zod.z.nanoid`
- `zod.z.uuidv6`
- `zod.z.int64`
- `zod.z.any`
- `zod.z.ulid`
- `zod.z.never`
- `zod.z.email`
- `zod.z.looseObject`
- `zod.z.symbol`
- `zod.z.uuidv7`
- `zod.z.uuid`
- `zod.z.cuid2`
- `zod.z.unknown`
- `zod.z.uint32`
- `zod.z.keyof`
- `zod.z.boolean`
- `zod.z.uppercase`
- `zod.z.minLength`
- `zod.z.negative`
- `zod.z.gte`
- `zod.z.endsWith`
- `zod.z.multipleOf`
- `zod.z.lt`
- `zod.z.trim`
- `zod.z.positive`
- `zod.z.overwrite`
- `zod.z.nonpositive`
- `zod.z.iso.duration`
- `zod.z.safeParse`
- `zod.z.parseAsync`
- `zod.z.coerce.boolean`
- `zod.z.parse`
- `zod.z.iso.time`

## Flaky at t

| Test | Status | Error |
| --- | --- | --- |

No exclusions; all 139 remain in the denominator.

## Measured wall times

| Release | Install/build/env seconds | LLM seconds | Dev seconds | Total seconds |
| --- | --- | --- | --- | --- |
| v4.0.5 | 54.629 | 30.22 | 8.327 | 93.175 |
| v4.1.0 | 33.954 | 25.962 | 8.95 | 68.867 |
| v4.2.0 | 40.189 | 28.009 | 11.821 | 80.02 |
| v4.3.0 | 39.627 | 30.278 | 13.684 | 83.589 |
| v4.4.0 | 38.491 | 28.187 | 13.393 | 80.071 |
| v4.5.0 | 53.668 | 28.831 | 11.882 | 94.381 |
| v4.6.0 | 8.386 | 30.036 | 12.496 | 50.918 |

Sum of recorded per-release stages (not end-to-end wall time): 551.021 seconds.

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
| zod.z.discriminatedUnion | 2 | 2/0/0/0/0 | 21 | 21/0/0 |
| zod.z.file | 1 | 1/0/0/0/0 | 2 | 2/0/0 |
| zod.z.readonly | 2 | 2/0/0/0/0 | 7 | 7/0/0 |
| zod.z.map | 2 | 2/0/0/0/0 | 8 | 8/0/0 |
| zod.z.date | 2 | 2/0/0/0/0 | 3 | 3/0/0 |
| zod.z.tuple | 1 | 1/0/0/0/0 | 6 | 6/0/0 |
| zod.z.array | 1 | 1/0/0/0/0 | 9 | 9/0/0 |
| zod.z.nullable | 4 | 4/0/0/0/0 | 3 | 3/0/0 |
| zod.z.prefault | 3 | 3/0/0/0/0 | 2 | 2/0/0 |
| zod.z.catch | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.nonoptional | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.check | 4 | 4/0/0/0/0 | 17 | 17/0/0 |
| zod.z.transform | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.preprocess | 4 | 4/0/0/0/0 | 11 | 11/0/0 |
| zod.z.coerce.number | 1 | 1/0/0/0/0 | 34 | 34/0/0 |

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
| zod.z.discriminatedUnion | 2 | 2/0/0/0/0 | 21 | 20/1/0 |
| zod.z.file | 1 | 1/0/0/0/0 | 2 | 1/1/0 |
| zod.z.readonly | 2 | 2/0/0/0/0 | 7 | 7/0/0 |
| zod.z.map | 2 | 2/0/0/0/0 | 8 | 8/0/0 |
| zod.z.date | 2 | 2/0/0/0/0 | 3 | 3/0/0 |
| zod.z.tuple | 1 | 1/0/0/0/0 | 6 | 4/2/0 |
| zod.z.array | 1 | 1/0/0/0/0 | 9 | 9/0/0 |
| zod.z.nullable | 4 | 4/0/0/0/0 | 3 | 3/0/0 |
| zod.z.prefault | 3 | 3/0/0/0/0 | 2 | 2/0/0 |
| zod.z.catch | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.nonoptional | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.check | 4 | 4/0/0/0/0 | 17 | 17/0/0 |
| zod.z.transform | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.preprocess | 4 | 4/0/0/0/0 | 11 | 8/3/0 |
| zod.z.coerce.number | 1 | 1/0/0/0/0 | 34 | 34/0/0 |

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
| zod.z.discriminatedUnion | 2 | 2/0/0/0/0 | 21 | 20/1/0 |
| zod.z.file | 1 | 1/0/0/0/0 | 2 | 1/1/0 |
| zod.z.readonly | 2 | 2/0/0/0/0 | 7 | 7/0/0 |
| zod.z.map | 2 | 2/0/0/0/0 | 8 | 8/0/0 |
| zod.z.date | 2 | 2/0/0/0/0 | 3 | 3/0/0 |
| zod.z.tuple | 1 | 1/0/0/0/0 | 6 | 4/2/0 |
| zod.z.array | 1 | 1/0/0/0/0 | 9 | 9/0/0 |
| zod.z.nullable | 4 | 4/0/0/0/0 | 3 | 3/0/0 |
| zod.z.prefault | 3 | 3/0/0/0/0 | 2 | 2/0/0 |
| zod.z.catch | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.nonoptional | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.check | 4 | 4/0/0/0/0 | 17 | 17/0/0 |
| zod.z.transform | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.preprocess | 4 | 4/0/0/0/0 | 11 | 8/3/0 |
| zod.z.coerce.number | 1 | 1/0/0/0/0 | 34 | 34/0/0 |

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
| zod.z.discriminatedUnion | 2 | 2/0/0/0/0 | 21 | 20/1/0 |
| zod.z.file | 1 | 1/0/0/0/0 | 2 | 1/1/0 |
| zod.z.readonly | 2 | 2/0/0/0/0 | 7 | 7/0/0 |
| zod.z.map | 2 | 2/0/0/0/0 | 8 | 8/0/0 |
| zod.z.date | 2 | 2/0/0/0/0 | 3 | 3/0/0 |
| zod.z.tuple | 1 | 1/0/0/0/0 | 6 | 4/2/0 |
| zod.z.array | 1 | 1/0/0/0/0 | 9 | 9/0/0 |
| zod.z.nullable | 4 | 4/0/0/0/0 | 3 | 3/0/0 |
| zod.z.prefault | 3 | 3/0/0/0/0 | 2 | 2/0/0 |
| zod.z.catch | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.nonoptional | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.check | 4 | 4/0/0/0/0 | 17 | 17/0/0 |
| zod.z.transform | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.preprocess | 4 | 4/0/0/0/0 | 11 | 8/3/0 |
| zod.z.coerce.number | 1 | 1/0/0/0/0 | 34 | 34/0/0 |

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
| zod.z.discriminatedUnion | 2 | 2/0/0/0/0 | 21 | 20/1/0 |
| zod.z.file | 1 | 1/0/0/0/0 | 2 | 1/1/0 |
| zod.z.readonly | 2 | 2/0/0/0/0 | 7 | 7/0/0 |
| zod.z.map | 2 | 2/0/0/0/0 | 8 | 8/0/0 |
| zod.z.date | 2 | 2/0/0/0/0 | 3 | 3/0/0 |
| zod.z.tuple | 1 | 1/0/0/0/0 | 6 | 4/2/0 |
| zod.z.array | 1 | 1/0/0/0/0 | 9 | 9/0/0 |
| zod.z.nullable | 4 | 4/0/0/0/0 | 3 | 3/0/0 |
| zod.z.prefault | 3 | 3/0/0/0/0 | 2 | 2/0/0 |
| zod.z.catch | 2 | 2/0/0/0/0 | 16 | 14/2/0 |
| zod.z.nonoptional | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.check | 4 | 4/0/0/0/0 | 17 | 17/0/0 |
| zod.z.transform | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.preprocess | 4 | 4/0/0/0/0 | 11 | 8/3/0 |
| zod.z.coerce.number | 1 | 1/0/0/0/0 | 34 | 34/0/0 |

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
| zod.z.discriminatedUnion | 2 | 2/0/0/0/0 | 21 | 20/1/0 |
| zod.z.file | 1 | 1/0/0/0/0 | 2 | 1/1/0 |
| zod.z.readonly | 2 | 2/0/0/0/0 | 7 | 7/0/0 |
| zod.z.map | 2 | 2/0/0/0/0 | 8 | 8/0/0 |
| zod.z.date | 2 | 2/0/0/0/0 | 3 | 3/0/0 |
| zod.z.tuple | 1 | 1/0/0/0/0 | 6 | 4/2/0 |
| zod.z.array | 1 | 1/0/0/0/0 | 9 | 8/1/0 |
| zod.z.nullable | 4 | 4/0/0/0/0 | 3 | 3/0/0 |
| zod.z.prefault | 3 | 3/0/0/0/0 | 2 | 2/0/0 |
| zod.z.catch | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.nonoptional | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.check | 4 | 4/0/0/0/0 | 17 | 17/0/0 |
| zod.z.transform | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.preprocess | 4 | 4/0/0/0/0 | 11 | 8/3/0 |
| zod.z.coerce.number | 1 | 1/0/0/0/0 | 34 | 32/2/0 |

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
| zod.z.discriminatedUnion | 2 | 2/0/0/0/0 | 21 | 20/1/0 |
| zod.z.file | 1 | 1/0/0/0/0 | 2 | 1/1/0 |
| zod.z.readonly | 2 | 2/0/0/0/0 | 7 | 7/0/0 |
| zod.z.map | 2 | 2/0/0/0/0 | 8 | 8/0/0 |
| zod.z.date | 2 | 2/0/0/0/0 | 3 | 3/0/0 |
| zod.z.tuple | 1 | 1/0/0/0/0 | 6 | 4/2/0 |
| zod.z.array | 1 | 1/0/0/0/0 | 9 | 8/1/0 |
| zod.z.nullable | 4 | 4/0/0/0/0 | 3 | 3/0/0 |
| zod.z.prefault | 3 | 3/0/0/0/0 | 2 | 2/0/0 |
| zod.z.catch | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.nonoptional | 3 | 3/0/0/0/0 | 3 | 3/0/0 |
| zod.z.check | 4 | 4/0/0/0/0 | 17 | 17/0/0 |
| zod.z.transform | 2 | 2/0/0/0/0 | 16 | 16/0/0 |
| zod.z.preprocess | 4 | 4/0/0/0/0 | 11 | 8/3/0 |
| zod.z.coerce.number | 1 | 1/0/0/0/0 | 34 | 32/2/0 |
