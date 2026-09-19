# Stage S handover

All scheduled release attempts are recorded; survival is measurable only where the harness ran. Developer results exist only for v4.0.5 and v4.1.0; v4.2.0–v4.6.0 are unavailable. LLM results exist through v4.5.0; v4.6.0 is unavailable. No model calls; frozen generated tests and testpilot2 unchanged. No report or archive branch created.

| Tag | Commit | Date | Build | Probe | LLM P/F/load/timeout/other | LLM survival | Dev loaded/passed/failed | Dev survival | Dev A/M/D |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v4.0.5 | 45afab0f846dffd591362b6f770017507eb185b5 | 2025-07-10 | ok | ok | 139/0/0/0/0 | 139/139 (100.00%) | 81/888/0 | 888/888 (100.00%) | 0/0/0 |
| v4.1.0 | 2ca716d6313dcfab425d3555ac8bf85929bc57a4 | 2025-08-23 | ok | ok | 139/0/0/0/0 | 139/139 (100.00%) | 81/871/17 | 871/888 (98.09%) | 5/36/0 |
| v4.2.0 | dcef9734f55fc1c8e73795a2be80c60fa7a4a568 | 2025-12-14 | ok | ok | 139/0/0/0/0 | 139/139 (100.00%) | unavailable | unavailable | 16/42/0 |
| v4.3.0 | 1899684fc34d149ebb5d6f9fd95a588e94f27053 | 2025-12-30 | ok | ok | 139/0/0/0/0 | 139/139 (100.00%) | unavailable | unavailable | 20/49/0 |
| v4.4.0 | d05f026e9e6eae0e1e6c2efbf11c89007ca40494 | 2026-04-29 | ok | ok | 139/0/0/0/0 | 139/139 (100.00%) | unavailable | unavailable | 27/51/0 |
| v4.5.0 | 0a69bcb3d9554c6ec382ea9ba6b43c2421f3fa78 | 2026-08-28 | ok | ok | 138/1/0/0/0 | 138/139 (99.28%) | unavailable | unavailable | 49/61/0 |
| v4.6.0 | 1c51cbe0fe23d09f8d520b31487d50a01588fae5 | 2026-09-09 | failed | not-run | unavailable | unavailable | unavailable | unavailable | 55/62/0 |

## Developer harness failures

| Release | Startup error |
| --- | --- |
| v4.2.0 | Error: No projects were found. Make sure your configuration is correct. The projects definition: [ |
| v4.3.0 | Error: No projects were found. Make sure your configuration is correct. The projects definition: [ |
| v4.4.0 | Error: No projects were found. Make sure your configuration is correct. The projects definition: [ |
| v4.5.0 | Error: Projects definition references a non-existing file or a directory: /work/zod-versions/v4.5.0/packages/zod/vitest.compile.config.ts |
| v4.6.0 | npm error npx canceled due to missing packages and no YES option: ["vitest@5.0.1"] |

## Commands and deviations

Validator: `/work/testpilot2/node_modules/.bin/nyc --cwd=$W --exclude=test-XXXXXX --reporter=json --report-dir=$coverageDir --temp-dir=$coverageDir /work/testpilot2/node_modules/.bin/mocha --full-trace --exit --allow-uncaught=false --reporter=json --reporter-option output=$reportFile -- $testFile`.

Runner: `/work/testpilot2/node_modules/.bin/mocha --full-trace --exit --allow-uncaught=false --reporter=json --reporter-option output=/dev/stdout -- $W/test-s/$basename`.

D-10 not needed: all tags found. D-11 removes nyc, as prescribed; identical Mocha flags, JSON destination changed to stdout; 5000 ms SIGKILL timeout. D-12 preserves a byte-identical frozen test-directory snapshot before the control replacement to avoid the instruction’s destructive self-copy. D-13 records an incorrectly selected no-frozen-lockfile retry at v4.6.0 (command text matched by the helper); no install or test occurred. D-14 records the corrected COREPACK_ENABLE_STRICT=0 fallback, which also fails with Unsupported package manager specification (nub@0.8.3). v4.6.0 build/probe are unavailable; no manager substitution or source edits made. D-15: continuation fixes the invalid helper uniqueness assumption using a one-based occurrence ordinal within each file/name; reprocessed the successful baseline JSON without rerunning tests. D-16: npm_config_yes=false prevents downloading an unpinned Vitest if the release-local runner is missing; v4.6.0 dev harness cannot start. v4.2.0 through v4.5.0 also fail during Vitest project configuration, before tests load; these are unavailable, not failed developer cases. Pre-existing untracked Claude outputs/ is retained as documented in Stage G.

Vitest: `npx vitest run src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=$R/dev-run.json`, cwd each release packages/zod.

| Release | Install/build fallbacks | Vitest typecheck flag | Dev harness |
| --- | --- | --- | --- |
| v4.0.5 | [] | True | ok |
| v4.1.0 | [] | True | ok |
| v4.2.0 | [] | True | failed |
| v4.3.0 | [] | True | failed |
| v4.4.0 | [] | True | failed |
| v4.5.0 | [] | True | failed |
| v4.6.0 | ['--no-frozen-lockfile (mis-selected; D-13)', 'COREPACK_ENABLE_STRICT=0 (unsupported nub remains; D-14)'] | None | failed |

Control: LLM 139/139; dev 81 files, 888/888 passed.

| Release | Install/build/env seconds | LLM seconds | Dev seconds | Total seconds |
| --- | --- | --- | --- | --- |
| v4.0.5 | 54.629 | 30.22 | 6.212 | 91.061 |
| v4.1.0 | 33.954 | 25.962 | 6.436 | 66.353 |
| v4.2.0 | 40.189 | 28.009 | 0.563 | 68.761 |
| v4.3.0 | 39.627 | 30.278 | 0.413 | 70.317 |
| v4.4.0 | 38.491 | 28.187 | 0.422 | 67.1 |
| v4.5.0 | 53.668 | 28.831 | 0.491 | 82.99 |
| v4.6.0 | 0.057 | 0 | 0.507 | 0.564 |

Recorded per-release stage total (excludes original setup, script work, corrective v4.6.0 commands, and cleanup): 447.146 seconds. See command log for setup and cleanup.

## Unmatched functions

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

## Manual second-pass questions

Which failing assertions depend on error-message strings or internal structures instead of a public contract? The following are unclassified assertion-error candidates, selected only by the existing error predicate; inspect their unchanged sources manually.

| Release | Test | API | Error text |
| --- | --- | --- | --- |
| v4.5.0 | test_353.js | zod.z.parse | Got unwanted exception. Actual message: "[   {     "origin": "string",     "code": "invalid_format",     "format": "datetime",     "pattern": "/^(?:(?:\\d\\d[2468][048]\|\\d\\d[13579][26]\|\\d\\d0[48]\|[02468][048]00\|[13579][26]00)-02-29\|\\d{4}-(?:(?:0[13578]\|1[02])-(?:0[1-9]\|[12]\\d\|3[01])\|(?:0[469]\|1 |

## Cleanup and verification

Wrapper restored to ../../../../../packages/zod and verified at 4.0.5; scratch test-s absent. Export trees and their node_modules retained outside the repository. Retained exports and snapshot occupy 2.3G after continuation. Integrity checks are recorded in docs/log-stage-s.md.
