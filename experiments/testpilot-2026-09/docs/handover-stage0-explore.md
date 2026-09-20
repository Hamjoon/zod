# Stage 0 and E handover — complete, including Addendum 2 sample

## Outcome

Environment, five mock explorations, passing/failing wrapper probes, full API summary, and reproducible N=60 sample completed. No LLM API calls were made, no endpoint/auth variables were set, and every runner invocation used `--responses`. Test generation has not started. Use the main CommonJS wrapper as the generation package and `results/api-sample-n60-s20260919.json` as `--api` input; generation settings are a later stage.

## Revisions and builds

- zod base: `45afab0f846dffd591362b6f770017507eb185b5` (4.0.5).
- Existing experiment commits: `b1a2f115`, `6d07ec54`, `0fa5f8a72111d607449a2b66c8d1afbfc52a623e`, `6b98e82763829372cfb321fba01cdca25a84b423`. Final completion commit follows this document; obtain its hash with `git log -1` on `experiment/2026-09-week3-testpilot-zod`.
- testpilot2: `79c3b626edb541ca9eaf31c6994f40d1c7d5d042`, clean, origin Hamjoon/testpilot2.
- Docker Node v22.23.2, npm 10.9.8, pnpm 10.12.1. Node 22 worked; no Node 20/18 fallback attempts.
- testpilot2 build and npm dependency verification passed. zod frozen install, zshy build and biome postbuild passed; biome checked 244 files without fixes. Required CJS entries exist. Main exports: 210; mini: 209.
- zod commit timestamp is July 10 15:35:06 -0700, July 11 in Seoul.
- Built doc-comment marker counts: index.cjs 0, v4/classic/schemas.cjs 3, v4/core/schemas.cjs 1, mini/index.cjs 0. Explorer-attached nonempty docComment count: **0 main, 0 mini**.
- Mocha resolves from both package and wrapper to `/work/zod/node_modules/.pnpm/mocha@10.8.2/node_modules/mocha/index.js`.

## Exploration

| Condition | Wall seconds | Functions | Functions with snippets | Prompt files |
| --- | ---: | ---: | ---: | ---: |
| main-native | 0.669 | 569 | 16 | 569 |
| mini-native | 0.591 | 563 | 0 | 563 |
| main-docs | 0.872 | 569 | 149 | 569 |
| mini-docs | 0.769 | 563 | 149 | 563 |
| mainwrap-native | 0.733 | 569 | 0 | 569 |

All five reports have stats.nrTests = 0. Standalone raw counts match: main 569, mini 563. `jq length` independently confirms every api.json total. Main wrapper comparison: exactly 569 entries and identical accessPath sets, with no differences. Wrapper exports print `function function 210`.

Native main has only README.md; native wrappers have no Markdown. Docs conditions add 19 website Markdown/MDX files (converted to .md), with README also copied to mini. All temporary docs copies were removed. Source lists, stdout, API descriptors, snippet maps, prompts, and mock reports are committed. No extraction retry was needed. Wrapper-native supplies API facts; original native/doc runs supply the snippet comparison. Website docs are selected for generation.

## Probe results and coverage

| Probe | Exit | Passes | Failures | Wall seconds | Coverage bytes |
| --- | ---: | ---: | ---: | ---: | ---: |
| Passing wrapper probe | 0 | 1 | 0 | 0.907048 | 467 |
| Deliberately failing wrapper probe | 1 | 0 | 1 | 0.390769 | 467 |

The failing report contains err.name `AssertionError`, code `ERR_ASSERTION`, and err.message `Expected values to be strictly equal: 'abc' !== 'xyz'` (with newlines). Failure text reaches the report. Reports and timings are in results/probe/. Both wrapper test copies and the previous package test directory were removed.

**L-01:** coverage-final.json covers only `/work/zod/experiments/testpilot-2026-09/wrappers/zod/index.js`. Zod implementation statement coverage is not measured in this track. Coverage JSON is ignored and not committed. The 0.91 s smoke probe leaves approximately 4.09 s under the validator limit, but is not a guarantee for more complex generated tests.

## API summary and population

The full [API summary](../results/api-summary.md) covers constructor/async/comment counts, snippet distributions, access-depth/namespace distributions, top signatures, normalized implementation duplicates, implementation sizes, raw non-function types, and population definitions. [CSV](../results/api-functions.csv): 1,132 function rows.

Prompt examples (all base prompts with provenance []): [string](../results/prompt-examples/zod.z.string.js), [largest signature group `(def)`](../results/prompt-examples/zod.z.core.$ZodError.js), [constructor](../results/prompt-examples/zod.z.core.util.Class.js).

Main population = 124 (115 top-level + 5 coerce + 4 iso); 445 discovered functions excluded. Strata S/C/Q = 74/35/15. Signatures `(def)` and `(inst, def)` are excluded from top-level membership by the specified rule. Sample allocation 36/17/7, seed 20260919, one RNG in S/C/Q order; 60 unique entries, 64 remaining. Both runs produced byte-identical outputs; SHA-256 evidence is in [sample-reproducibility.json](../results/sample-reproducibility.json).

Mini population = 127, excluded = 436; S/C/Q = 81/33/13. Exactly 30 mini population members match a main population implementation string; 97 are mini-specific by this criterion, listed in [population-mini-specific.txt](../results/population-mini-specific.txt). Exact source equality is the requested comparison, not an independent runtime identity test. No mini sample was drawn.

### Sampled access paths

```text
accessPath	stratum	signature	implLength	snippets_docs
zod.z.discriminatedUnion	S	(discriminator, options, params)	272	5
zod.z.number	S	(params)	79	168
zod.z.file	S	(params)	73	5
zod.z.nullish	S	(innerType)	73	7
zod.z.readonly	S	(innerType)	133	6
zod.z.map	S	(keyType, valueType, params)	213	6
zod.z.cidrv4	S	(params)	79	5
zod.z.cidrv6	S	(params)	79	5
zod.z.strictObject	S	(shape, params)	319	3
zod.z.date	S	(params)	73	78
zod.z.base64	S	(params)	79	2
zod.z.tuple	S	(items, _paramsOrRest, _params)	365	8
zod.z.guid	S	(params)	73	2
zod.z.nanoid	S	(params)	79	3
zod.z.uuidv6	S	(params)	77	1
zod.z.array	S	(element, params)	94	35
zod.z.int64	S	(params)	83	3
zod.z.any	S	()	56	3
zod.z.ulid	S	(params)	73	3
zod.z.templateLiteral	S	(parts, params)	196	3
zod.z.nullable	S	(innerType)	133	12
zod.z.ksuid	S	(params)	76	0
zod.z.never	S	(params)	76	1
zod.z.email	S	(params)	76	17
zod.z.looseObject	S	(shape, params)	320	2
zod.z.symbol	S	(params)	79	4
zod.z.uuidv7	S	(params)	77	2
zod.z.uuid	S	(params)	73	22
zod.z.prefault	S	(innerType, defaultValue)	274	3
zod.z.cuid2	S	(params)	76	3
zod.z.unknown	S	()	68	5
zod.z.uint32	S	(params)	85	1
zod.z.keyof	S	(schema)	107	3
zod.z.catch	S	(innerType, catchValue)	225	6
zod.z.nonoptional	S	(innerType, params)	202	1
zod.z.boolean	S	(params)	82	30
zod.z.check	C	(fn)	174	27
zod.z.uppercase	C	(params)	184	3
zod.z.minLength	C	(minimum, params)	178	10
zod.z.negative	C	(params)	57	8
zod.z.gte	C	(value, params)	197	8
zod.z.size	C	(size, params)	169	5
zod.z.endsWith	C	(suffix, params)	206	4
zod.z.property	C	(property, schema, params)	200	0
zod.z.multipleOf	C	(value, params)	177	8
zod.z.maxSize	C	(maximum, params)	172	4
zod.z.lt	C	(value, params)	191	8
zod.z.trim	C	()	68	9
zod.z.transform	C	(fn)	122	27
zod.z.positive	C	(params)	57	9
zod.z.overwrite	C	(tx)	118	2
zod.z.preprocess	C	(fn, schema)	75	1
zod.z.nonpositive	C	(params)	61	8
zod.z.iso.duration	Q	(params)	91	3
zod.z.safeParse	Q	(schema, value, _ctx)	500	60
zod.z.parseAsync	Q	(schema, value, _ctx, params)	498	14
zod.z.coerce.number	Q	(params)	86	168
zod.z.coerce.boolean	Q	(params)	89	30
zod.z.parse	Q	(schema, value, _ctx, _params)	517	250
zod.z.iso.time	Q	(params)	79	16

```

## Deviations, decisions, and remaining questions

- D-01: mocha@10 installed at workspace root; package.json and pnpm-lock.yaml restored, local modules retained.
- D-02: install activated Husky; untracked experiment logs blocked initial commit/push. Addendum 1 authorized clone-local core.hooksPath=/dev/null, applied without tracked hook changes. User authorized leaving Claude outputs/ untracked.
- D-03: initial CommonJS .js probe failed in zod's ESM scope (exit 1, 0.51954 s). Addendum 2 resolved this using the main wrapper without changing the probe source, tool, or zod tracked files.
- L-01: wrapper-only statement coverage, as above.
- Earlier sandbox network/Docker access failures were resolved by required escalation; a socket denial on the wrapper probe launch was similarly retried. Existing orphan containers were left untouched. Dependency warnings were recorded without upgrades.
- Doc-comment template question is closed: zero attached comments.
- Website-docs question is closed: yes for generation. `--numSnippets all` is unusable for main string (807) and parse (250); generation instructions must choose a cap.
- Remaining questions for Gary: what snippet cap and generation settings to use; whether/when to run the remaining 64 main functions; whether/how to add the 97 mini-specific functions; whether representative generated tests leave enough of the 5-second timeout budget. Population exclusions and N=60 allocation are fixed by Addendum 2 for this stage.

## Files and publication

[committed-files-stage0.txt](committed-files-stage0.txt) inventories every experiment file in the completed branch. It includes docs, scripts, both wrappers, mock fixtures, all five exploration runs, raw API dumps, summary/CSV, prompt examples, population/sample files and two probe reports/timings. Coverage and wrapper node_modules symlinks are excluded. The older ignored-files-stage0.txt captures installation/build artifacts at Stage 0.

The only nonignored untracked directory is the user-owned `Claude outputs/`, left untouched except reading the explicitly supplied Addendum 2. Its file inventory is in [untracked-files-stage0.txt](untracked-files-stage0.txt). Ignored local files include dependency/build outputs, wrapper node_modules symlinks, and probe coverage. No temporary docs or test-probe directories remain. All tracked changes stay under experiments/; testpilot2 remains clean. Final commit and push synchronize the branch; git status -sb should show tracking with no ahead count, plus the authorized untracked directory.
