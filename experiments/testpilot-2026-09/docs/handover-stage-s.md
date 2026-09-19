# Stage S handover — stopped during control post-processing

**Stage S is incomplete.** The prescribed stop rule was applied to an unanticipated summarizer failure. No tests were retried, repaired, or skipped to make them pass. No model calls occurred. All generated tests and testpilot2 remain unchanged.

## Stop reason and exact error

The developer control ran successfully: Vitest reported 81 files and 888 runtime cases, all passed. The new summarizer incorrectly assumed that `(file, fullName)` uniquely identifies a case. It raised `AssertionError: Duplicate case identities` at scripts/summarize-dev-run.py:22 before writing dev-cases.json or dev-summary.json. This is an implementation error in the Stage S helper, not a developer-test failure or a failed baseline test gate.

The supplied instructions, Ground rule 5, say: “On an unanticipated failure, record the exact error and follow the fallback for that step; with no fallback, stop and write the handover.” There is no prescribed fallback for this post-processing failure. The orchestrator exited 1, later developer runs were not started, and Step 6 was not executed. The exact traceback is in log-stage-s.md.

The baseline contains these repeated names (they are distinct runtime cases):

| File | fullName | Occurrences |
| --- | --- | --- |
| classic/tests/error.test.ts | custom path | 2 |
| classic/tests/index.test.ts | z.transform | 2 |
| classic/tests/object.test.ts | catchall overrides strict | 2 |
| classic/tests/object.test.ts | constructor key | 2 |
| classic/tests/promise.test.ts | promise parsing fail | 2 |
| classic/tests/record.test.ts | async parsing | 2 |
| classic/tests/standard-schema.test.ts | length checks | 4 |
| mini/tests/index.test.ts | z.transform | 2 |
| mini/tests/prototypes.test.ts | prototype extension | 2 |

A continuation needs stable case identities that preserve all occurrences, e.g. file + fullName + occurrence ordinal in frozen source order. Fix both summarize-dev-run.py and analyze-survival.py (whose dictionary currently also assumes uniqueness). Reprocess the existing v4.0.5/dev-run.json; the successful control does not need rerunning. Confirm 888 preserved cases, then run only the unexecuted developer releases. replay-survival.py is not resumable: do not rerun it wholesale because that would rerun the completed LLM experiments and collide with existing raw output/snapshot directories. These are handover actions, not actions performed after the stop.

## Recorded release results

Unavailable and not-run entries are not test failures. Developer upstream A/M/D counts are context only.

| Tag | Commit | Date | Build | Probe | LLM pass/fail/load/timeout/other | LLM survival | Dev files/passed/failed | Dev survival | Upstream dev A/M/D |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v4.0.5 | 45afab0f846dffd591362b6f770017507eb185b5 | 2025-07-10 | ok | ok | 139/0/0/0/0 | 139/139 (100.00%) | 81 / 888 / 0 | 888/888 (100.00%) | 0/0/0 |
| v4.1.0 | 2ca716d6313dcfab425d3555ac8bf85929bc57a4 | 2025-08-23 | ok | ok | 139/0/0/0/0 | 139/139 (100.00%) | not run (stopped) | unavailable | 5/36/0 |
| v4.2.0 | dcef9734f55fc1c8e73795a2be80c60fa7a4a568 | 2025-12-14 | ok | ok | 139/0/0/0/0 | 139/139 (100.00%) | not run (stopped) | unavailable | 16/42/0 |
| v4.3.0 | 1899684fc34d149ebb5d6f9fd95a588e94f27053 | 2025-12-30 | ok | ok | 139/0/0/0/0 | 139/139 (100.00%) | not run (stopped) | unavailable | 20/49/0 |
| v4.4.0 | d05f026e9e6eae0e1e6c2efbf11c89007ca40494 | 2026-04-29 | ok | ok | 139/0/0/0/0 | 139/139 (100.00%) | not run (stopped) | unavailable | 27/51/0 |
| v4.5.0 | 0a69bcb3d9554c6ec382ea9ba6b43c2421f3fa78 | 2026-08-28 | ok | ok | 138/1/0/0/0 | 138/139 (99.28%) | not run (stopped) | unavailable | 49/61/0 |
| v4.6.0 | 1c51cbe0fe23d09f8d520b31487d50a01588fae5 | 2026-09-09 | failed | not-run | not run (build failed) | unavailable | not run (stopped) | unavailable | 55/62/0 |

## Commands and deviations

| Validator | Stage S runner |
| --- | --- |
| `/work/testpilot2/node_modules/.bin/nyc --cwd=$W --exclude=test-XXXXXX --reporter=json --report-dir=$coverageDir --temp-dir=$coverageDir /work/testpilot2/node_modules/.bin/mocha --full-trace --exit --allow-uncaught=false --reporter=json --reporter-option output=$reportFile -- $testFile` | `/work/testpilot2/node_modules/.bin/mocha --full-trace --exit --allow-uncaught=false --reporter=json --reporter-option output=/dev/stdout -- $W/test-s/$basename` |

All Mocha flags retained; the JSON destination is stdout. Same 5000 ms timeout, SIGKILL on expiry. Only the validator's exact single-quoted `require('zod')` to `require('..')` replacement was applied in scratch copies.

- D-10 not needed: all requested tags present; base commit, package versions and increasing release dates validated.
- D-11: nyc omitted as prescribed (L-01).
- D-12: preserve a byte-identical test-directory snapshot outside the repo before replacing control directories. The literal Step 5 commands would delete their own T0 source. Only the control replacement was reached; its files match the snapshot by SHA256.
- D-13: v4.6.0 fallback selector erroneously matched `lockfile` in its logged command and tried `pnpm install --no-frozen-lockfile`. It failed before installation with the same unsupported-manager error. Both attempts retained; helper predicate corrected to inspect error lines rather than command lines.
- D-14: v4.6.0 `HUSKY=0 COREPACK_ENABLE_STRICT=0 pnpm install --frozen-lockfile` also failed: `Unsupported package manager specification (nub@0.8.3)`. `pnpm build` failed with that error too. No different package manager installed and no release manifests changed. Build/probe unavailable. The planned developer attempt was not reached before the stop.
- `npx --no-install vitest --version` was used for environment inspection to avoid installing a missing runner. v4.6.0 reports missing vitest (npm canceled), not a test result.
- The pre-existing untracked Claude outputs/ directory is retained, as documented in Stage G; all task changes are under experiments/.

Install/build commands were `HUSKY=0 pnpm install --frozen-lockfile` and `HUSKY=0 pnpm build`. No fallback needed for v4.0.5 through v4.5.0. Release build logs and environment outputs are retained in full.

Vitest control command (cwd packages/zod):

```text
npx vitest run src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=$R/dev-run.json
```

The typecheck flag was accepted at v4.0.5; exactly 81 runtime testResults entries and 888 assertions. It was not tested at other releases. LLM control: 139/139 passed, no flaky-at-t cases. Each completed LLM release has 139 results and 278 raw files.

## Measured stage wall time

| Release | Install/build/env seconds | LLM seconds | Dev execution seconds |
| --- | --- | --- | --- |
| v4.0.5 | 54.629 | 30.22 | 6.212 |
| v4.1.0 | 33.954 | 25.962 | 0 |
| v4.2.0 | 40.189 | 28.009 | 0 |
| v4.3.0 | 39.627 | 30.278 | 0 |
| v4.4.0 | 38.491 | 28.187 | 0 |
| v4.5.0 | 53.668 | 28.831 | 0 |
| v4.6.0 | 0.057 | 0 | 0 |

Sum of recorded stages: 438.314 seconds. v4.6.0 corrective fallback, environment checks, setup, script authoring and cleanup are outside that measured sum. See command log timestamps; no claim of a fully measured end-to-end experiment time.

## Manual second-pass question

Which failing generated tests assert error-message strings or internal structures instead of a public contract? The recorded assertion failure below is a candidate for manual inspection, not classified here:

| Release | Test | API | Recorded error (first 300 characters) |
| --- | --- | --- | --- |
| v4.5.0 | test_353.js | zod.z.parse | Got unwanted exception. Actual message: "[   {     "origin": "string",     "code": "invalid_format",     "format": "datetime",     "pattern": "/^(?:(?:\\d\\d[2468][048]\|\\d\\d[13579][26]\|\\d\\d0[48]\|[02468][048]00\|[13579][26]00)-02-29\|\\d{4}-(?:(?:0[13578]\|1[02])-(?:0[1-9]\|[12]\\d\|3[01])\|(?:0[469]\|1 |

## Incomplete deliverables

The full survival analysis, matrices, automatic dev-file pairing and unmatched-function list have not been produced. analyze-survival.py is a draft and must not be run without fixing duplicate case handling. summarize-dev-run.py retains the failure for audit. No final cross-corpus comparison can be drawn from the partial run. results/survival-summary.md is explicitly a partial result table, not completed Step 6 analysis.

## Cleanup and retained state

Wrapper restored to original ../../../../../packages/zod; verified `4.0.5 object function`. Scratch test-s is absent. The seven release exports, node_modules, and frozen-v4.0.5-tests snapshot remain under ../zod-versions, outside the repository. Exported zod source/configuration/package-manager files were checked against tag archives and remain unchanged (source-integrity.json). No report or archive branch created.

Retained export size: `du -sh /work/zod-versions` reports **2.3G**.
