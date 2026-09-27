# zod × TestPilot Survival Experiment: Full Report

Canonical record of the September 2026 week-3 track (B) experiment: generate unit tests for zod 4.0.5 with a TestPilot-family tool, then run the generated tests, unchanged, against six later zod releases alongside the developers' own test suite, also unchanged. Date: 2026-09-20. The summary for readers outside the project is `testpilot-zod-survival-report.md`; every figure there is taken from this document.

Repository: `Hamjoon/zod`, branch `experiment/2026-09-week3-testpilot-zod`, head `5734f13c`, everything under `experiments/testpilot-2026-09/`. Tool fork: `Hamjoon/testpilot2`, branch `experiment/2026-09-week3-zod`, head `31c01799`. Stage handovers written by the executing agent (Codex CLI) are under `docs/` (`handover-stage0-explore.md`, `handover-stage-g.md`, `handover-stage-s.md`) with command logs `log-stage0-explore.md`, `log-stage-g.md`, `log-stage-s.md`.

## 1. Question

When an LLM-generated test suite passes at time t, how much of it still passes at later releases t+n, and how does that compare with the developers' own suite frozen at t? The comparison is between two corpora run on identical code: generated tests (LLM corpus) and developer tests (dev corpus), both fixed at v4.0.5 and never edited.

This is a different kind of staleness from the summer experiments. There, tests became stale because the code under them changed commit by commit. Here, the generated tests were already stale at generation time in a large fraction of cases (the model wrote zod v3 idioms against zod v4; see 4.4), and the survival stage measures what happens to the ones that were valid at t.

## 2. Materials

### 2.1 Subject

zod, TypeScript schema validation library, monorepo `colinhacks/zod`. Anchor t = v4.0.5 (commit `45afab0f`, 2025-07-10). Later points are the six minor releases v4.1.0 through v4.6.0. Patch releases are not used (38 patch tags lie between v4.0.5 and v4.6.0).

| Tag | Commit | Date | Commits since previous point (`packages/zod`, no merges) | Commits, whole repository | Patch tags in between |
|---|---|---|---:|---:|---:|
| v4.0.5 | `45afab0f` | 2025-07-10 | | | |
| v4.1.0 | `2ca716d6` | 2025-08-23 | 45 | 88 | 12 |
| v4.2.0 | `dcef9734` | 2025-12-14 | 72 | 139 | 12 |
| v4.3.0 | `1899684f` | 2025-12-30 | 35 | 43 | 1 |
| v4.4.0 | `d05f026e` | 2026-04-29 | 78 | 118 | 6 |
| v4.5.0 | `0a69bcb3` | 2026-08-28 | 145 | 223 | 3 |
| v4.6.0 | `1c51cbe0` | 2026-09-09 | 46 | 95 | 4 |
| total | | | 421 | 706 | 38 |

### 2.2 Tool

testpilot2 (`githubnext/testpilot` follow-up adapted to chat models), upstream base `79c3b626`. One change was made (D-08): a single sentence appended to `templates/template-singletest.hb` asking the model to put the three scaffold `require` lines first in the code block, with no leading comment or file name, and to emit exactly one `it` block. Without it every completion from the chosen model started with a `// test-xxx.js` comment, the tool's first-line `require` check failed, the scaffold imports were added a second time and every test died with `let mocha` redeclared (`Invalid syntax`, 16/16 in the first smoke run). No tool source was patched.

Model: `openai/gpt-oss-120b` via OpenRouter, temperature 0, `top_p` 1, `max_tokens` 4000, one completion per prompt (the tool sends no `n`, so this is its effective behaviour regardless of `--numCompletions`), `--nrAttempts 3`, `--snippets doc --numSnippets 3 --snippetLength 20`. Provider routing behind OpenRouter is not pinned and not recorded (L-02).

Execution package: zod's `packages/zod` declares `"type": "module"`, so testpilot2's CommonJS test files cannot `require` it (D-03). Generation and survival both use a one-line wrapper package `wrappers/zod` (`module.exports = require("zod")`, `node_modules/zod` symlinked to the zod package). The API explorer sees exactly the same 569 functions through the wrapper as through the package directly. The wrapper costs statement coverage: nyc does not instrument `node_modules`, so coverage output covers only the wrapper's `index.js` (L-01, confirmed on the probe's `coverage-final.json`). The generated tests therefore prompt on built JavaScript (`index.cjs` and friends), which is nearly comment-free (0 of 569 discovered functions carried a doc comment), not on the TypeScript source.

Environment: Docker `node:22-bookworm`, Node 22.23.2, npm 10.9.8, pnpm 10.12.1 (corepack), mocha 10.8.2, testpilot2's own nyc and mocha binaries.

### 2.3 Population and sample

The explorer found 569 functions under the main entry (all under `zod.z.*`). Population P = 124: top-level `zod.z.<name>` factories, checks and parse functions whose signature is neither `(def)` nor `(inst, def)` (those are `$constructor`-generated schema classes and their `init`, not user-callable; 115), plus `zod.z.coerce.*` (5) and `zod.z.iso.*` (4). Strata by role: S schema factories 74, C checks and refinements 35, Q parsing, coercion, formats and configuration 15. Sample N = 60 by stratified random draw, allocation 36/17/7, seed 20260919, one `random.Random` in S, C, Q order; byte-identical on re-run. `zod.z.string` and `zod.z.object` were not drawn. The `zod/mini` entry was explored (127 population, 97 mini-specific) but not sampled. The sampled access paths are listed in `docs/handover-stage0-explore.md`.

Documentation snippets: the package README plus 19 website pages (`packages/docs/content`, `.mdx` copied to `.md`) give 149 of 569 functions at least one snippet. `--numSnippets all` is infeasible (`string` has 807 snippets, `parse` 250), hence the cap of 3.

### 2.4 Developer corpus

`packages/zod/src/v4/{classic,core,mini}/tests/**/*.test.ts` at v4.0.5: 81 files (classic 64, core 5, mini 12), 888 runtime cases, all passing at t under vitest 2.1.9. Vitest reports each case twice when typechecking is on (runtime and typecheck projects); only runtime entries count. Case identity is (file, full name, one-based occurrence within the file), because nine cases share a name with another case in the same file (D-15).

## 3. Protocol

### 3.1 Generation at t (Stage G)

`node benchmark/run.js --outputDir results/gen-n60 --api results/api-sample-n60-s20260919.json --package wrappers/zod --model openai/gpt-oss-120b --template templates/template-singletest.hb --retryTemplate templates/retry-template.hb --snippets doc --numSnippets 3 --snippetLength 20 --temperatures 0.0 --numCompletions 1 --maxTokens 4000 --nrAttempts 3`. The tool builds, per function, a base prompt (signature only) and refined prompts (function body, snippets, body plus snippets), assembles one Mocha test per completion, runs it under nyc + mocha with a 5000 ms process timeout (the tool's default; the paper used 2000 ms), and on failure sends the error back once as a retry prompt. Wall time 5004.9 s (83.4 min), 0 request errors, 0 empty completions, 0 completions with more than one `it`.

Prompt counts by provenance: base 60, body 60, snippets 58, body + snippets 58, retry 124; total 360, one test per prompt, no duplicates after normalisation.

Set S (survival input) = every test that passed at t: `results/gen-n60-passing.json`, 139 entries `{testName, api, testFile}`, files under `results/gen-n60/tests/`. Tests are never edited afterwards.

### 3.2 Survival at t+n (Stage S)

For each tag in v4.0.5 (control), v4.1.0 … v4.6.0:

1. Export the tree with `git archive <tag> | tar -x` into `$ROOT/zod-versions/<tag>/` (outside the repository, no `.git`, `HUSKY=0`), mounted into the container at `/work/zod-versions`.
2. `pnpm install --frozen-lockfile && pnpm build` (fallback chain in 5.2).
3. Point the wrapper's `node_modules/zod` at `/work/zod-versions/<tag>/packages/zod`, probe with a one-line `require('zod')` that prints the version.
4. LLM corpus: run each of the 139 files with mocha alone (D-11; nyc removed because it measures nothing here), same flags as the validator, same `require('zod')` → `require('..')` rewrite, 5000 ms SIGKILL timeout, one process per file. Status pass / fail / load-error / timeout / other. Output `results/survival/<tag>/llm-results.json`, raw reports in `llm-raw/`.
5. Dev corpus: delete `src/v4/**/tests/` in the exported tree and copy the v4.0.5 test directories in (a byte-identical snapshot `frozen-v4.0.5-tests` is kept, D-12). Run from the repository root `npx vitest run --project zod packages/zod/src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=…/dev-run.json` (D-19). Split runtime from typecheck entries by `assertionResults[].meta.typecheck` (D-21; the flag is accepted but ineffective, D-20). Record the developers' own changes to test files at that tag with `git diff --name-status` (not used further).
6. Gate: 81 files and 888 case identities must be present. Control must give 139/139 and 888/888.

Analysis `scripts/analyze-survival.py` produces `results/survival-summary.md`, `survival-llm-matrix.csv` (139 × 7 statuses, first break), `survival-dev-matrix.csv` (888 × 7), failure categories, and an automatic file-name pairing (`pair-map.json`, `survival-pairs.csv`).

Stage S ran as one instruction plus four continuations. Every stop was a harness or instruction defect; no experimental result was re-run after being obtained. Details in 5.2.

## 4. Results

### 4.1 Generation at t

| Stratum | Functions | Tests | Passing | Pass rate |
|---|---:|---:|---:|---:|
| S | 36 | 208 | 88 | 42.3% |
| C | 17 | 109 | 36 | 33.0% |
| Q | 7 | 43 | 15 | 34.9% |
| all | 60 | 360 | 139 | 38.6% |

54 of 60 functions have at least one passing test; none for `ksuid`, `maxSize`, `number`, `property`, `size`, `templateLiteral`. Passing tests per function range from 1 to 4 (13 functions at 4, 16 at 3, 14 at 2, 11 at 1).

Failures (221): assertion 156, correctness 54 (25 of them `Invalid syntax`), timeout 2, other 9 (the model imported `nanoid` or `zod-to-json-schema`, which are not installed). The dominant patterns in the assertion failures are zod v3 assumptions: `.minLength()` instead of `.min()`, calling `.parse()` on the return value of a check function such as `z.gte()` (in v4 that is a check object, not a schema), reading `err.errors` instead of `err.issues`, and matching v3-style error messages such as `/Expected string/` or `/Required/` against v4's JSON-formatted issue text.

Passing tests by the prompt they trace to (a test can trace to several): base 23/60, body 27/60, snippets 33/58, body + snippets 29/58, retry 27/124. Snippets help most, in line with the paper's RQ4 and RQ5.

Shape of the 139 passing tests: median 26 lines including scaffold; assertions are `strictEqual` (99 tests), `throws` (88 tests), `doesNotThrow` (54 tests), `deepStrictEqual` and `ok` in a few. Of the 88 tests using `assert.throws`, 30 match the error message with a regular expression; the others only check that an exception occurs or its class. 14 tests read `.issues` or `.message` directly.

### 4.2 Survival

Control (v4.0.5 through the same survival pipeline): LLM 139/139, dev 888/888. Every later release built and probed at the expected version.

| Release | Date | LLM pass / 139 | Dev passed / failed / skipped (of 888) | Dev survival | Dev failures: snapshot / assertion / other |
|---|---|---:|---:|---:|---:|
| v4.1.0 | 2025-08-23 | 139 (100.0%) | 871 / 17 / 0 | 98.1% | 12 / 5 / 0 |
| v4.2.0 | 2025-12-14 | 139 (100.0%) | 868 / 19 / 1 | 97.8% | 13 / 6 / 0 |
| v4.3.0 | 2025-12-30 | 139 (100.0%) | 864 / 23 / 1 | 97.3% | 14 / 7 / 2 |
| v4.4.0 | 2026-04-29 | 139 (100.0%) | 853 / 34 / 1 | 96.1% | 20 / 10 / 4 |
| v4.5.0 | 2026-08-28 | 138 (99.3%) | 838 / 49 / 1 | 94.4% | 34 / 12 / 3 |
| v4.6.0 | 2026-09-09 | 138 (99.3%) | 834 / 53 / 1 | 93.9% | 34 / 16 / 3 |

Dev survival is passed / 888. The one skipped case is the assertion-free `<anonymous>` case in `classic/tests/json.test.ts`: vitest 2 (v4.0.5, v4.1.0) reports it passed, vitest 4 reports it `todo`. It stays in the denominator and counts as neither a break nor a survival. LLM statuses other than pass and fail (load-error, timeout, other) were 0 at every release.

Failure categories are the automatic first pass from the paper's predicates: `snapshot` if the message says a snapshot mismatched, `assertion` if it starts with `AssertionError`, `other` otherwise (here: `ZodError` thrown unexpectedly, and `TypeError: parsedType is not a function`). No manual second-pass classification has been done (see 6).

### 4.3 The LLM failure

`test_353.js` (sample function `zod.z.parse`; the test actually exercises `z.iso.datetime()` and `z.stringbool()`) fails from v4.5.0 on. Its first assertion is `assert.doesNotThrow(() => zod.iso.datetime().parse("2020-01-01T06:15Z"))`, a datetime with a `Z` suffix and no seconds. Commit `036b39f4` (2026-08-24, between v4.4.0 and v4.5.0), titled `fix(v4)!: require seconds once a datetime carries a Z or an offset (#6457)`, made such strings invalid; the developers marked it breaking (`!`) and documented the migration. The same commit breaks the developer case `classic/tests/datetime.test.ts` "datetime parsing with local and offset" at v4.5.0. So the only generated-test break is a documented public-contract change that the developers' own test also caught. The test also matches `/invalid/` in later `assert.throws` calls, but the failure point is the `doesNotThrow`, not the message match.

### 4.4 Developer failures

Cumulative at v4.6.0: 53 failing cases in 23 files. 56 cases failed at some release; three recovered (4.5). By file at v4.6.0: `to-json-schema.test.ts` 15, `mini/tests/computed.test.ts` 5, `template-literal.test.ts` 4, `error.test.ts` 3, `preprocess.test.ts` 3, `string.test.ts` 3, `number.test.ts` 2, `optional.test.ts` 2, `tuple.test.ts` 2, and one each in `array`, `continuability`, `datetime`, `discriminated-unions`, `file`, `function`, `intersection`, `lazy`, `pipe`, `set`, `union`, `validations`, `core/tests/locales/en`, `core/tests/locales/tr`.

New non-snapshot failures by release (first break):

- v4.1.0: `preprocess.test.ts` three cases (non-fatal issue count 2 → 1: "perform transform with non-fatal issues", "preprocess ctx.addIssue non-fatal by default", "z.NEVER in preprocess"); `string.test.ts` "bad uuid" (an input the test expects to be rejected now parses); `pickomit.test.ts` "do not allow unknown keys" (no longer throws).
- v4.2.0: `template-literal.test.ts` "failure - complex cases" (no longer throws).
- v4.3.0: `to-json-schema.test.ts` "override: do not run on references" (count 12 vs 6); `core/tests/locales/en.test.ts` and `tr.test.ts` "parsedType" (the internal helper `parsedType` was removed from the locale module).
- v4.4.0: `catch.test.ts` "enum" and "native enum" (`ZodError` thrown); `intersection.test.ts` "object intersection: strict"; `optional.test.ts` "optionality" (`undefined` instead of `'optional'`); `template-literal.test.ts` "failure - basic cases".
- v4.5.0: `datetime.test.ts` "datetime parsing with local and offset" (4.3); `lazy.test.ts` "opt passthrough" and `optional.test.ts` "optionality", "pipe optionality" (`'defaulted'` instead of `'optional'`); `error.test.ts` three snapshot cases; `number.test.ts` ".finite() validation", "Infinity validation" (snapshots).
- v4.6.0: `mini/tests/computed.test.ts` five cases (`size`, `int32`, `int64`, `min/max`, `multipleOf` computed properties now `undefined`).

Snapshot failures (34 at v4.6.0) are `toMatchInlineSnapshot` mismatches, concentrated in `to-json-schema.test.ts` (JSON Schema output), `template-literal.test.ts` (regex text), `tuple.test.ts`, `union.test.ts`, `error.test.ts`, and issue-array snapshots elsewhere. Whether each snapshot change is a contract change or only a serialisation change has not been checked (6).

The full per-case list with messages is in `docs/handover-stage-s.md`, "Continuation 4", and in `results/survival-dev-matrix.csv`.

### 4.5 Non-monotonic cases

Three cases broke and later passed again, in two events: `catch.test.ts` "enum" and "native enum" fail at v4.4.0 only and pass at v4.5.0 and v4.6.0; `pickomit.test.ts` "do not allow unknown keys" fails from v4.1.0 through v4.5.0 and passes at v4.6.0. Release-level sampling therefore already shows transient breakage; commit-level sampling would show more (6).

### 4.6 Developers' own test changes (recorded, not used)

Files added / modified / deleted under `src/v4/**/tests/` relative to v4.0.5: v4.1.0 5/36/0, v4.2.0 16/42/0, v4.3.0 20/49/0, v4.4.0 27/51/0, v4.5.0 49/61/0, v4.6.0 55/62/0. These edits are what the developers did to keep their suite green; the frozen suite measures what would have broken without them.

### 4.7 Wall times

Per release (install/build/env, LLM run, dev run, total): v4.0.5 54.6 / 30.2 / 8.3 / 93.2 s; v4.1.0 34.0 / 26.0 / 9.0 / 68.9; v4.2.0 40.2 / 28.0 / 11.8 / 80.0; v4.3.0 39.6 / 30.3 / 13.7 / 83.6; v4.4.0 38.5 / 28.2 / 13.4 / 80.1; v4.5.0 53.7 / 28.8 / 11.9 / 94.4; v4.6.0 8.4 / 30.0 / 12.5 / 50.9 (v4.6.0 install/build time excludes the earlier failed attempts). Recorded stage sum 551.0 s. Setup, script work, reprocessing and cleanup are outside this sum. Exported trees with `node_modules` occupy 2.3 GB outside the repository.

## 5. Deviations, defects and environment notes

### 5.1 Deviation register

Stage 0 and G:

- D-01 `mocha@10` installed at the workspace root so that tests' `require('mocha')` resolves from the package directory; `package.json` and lockfile restored, modules kept.
- D-02 Husky hooks (activated by `pnpm install`) refuse commits with untracked files; disabled clone-locally (`core.hooksPath=/dev/null`).
- D-03 CommonJS wrapper package (2.2).
- D-04 one completion per prompt (tool behaviour).
- D-05 `maxTokens` 4000 (tool default 1000, paper 100). No completion was truncated; prompts are 604 to 3,840 characters.
- D-06 `numSnippets` 3, `snippetLength` 20 (paper: all).
- D-07 first smoke run failed the gate (16/16 `Invalid syntax`); artifacts kept.
- D-08 template sentence (2.2); second smoke 7/11 passing, 0 `Invalid syntax`.
- D-09 not applicable (`completeTest` source patch prepared but not needed).

Stage S:

- D-10 not needed (all tags present after fetching `refs/tags/v4.*` from upstream).
- D-11 nyc removed from the runner.
- D-12 byte-identical snapshot of the v4.0.5 test directories kept before replacement (the instruction's copy command would have deleted v4.0.5's own tests when run on v4.0.5).
- D-13 a `--no-frozen-lockfile` retry was mis-selected at v4.6.0 by the helper's string match; no install or test happened.
- D-14 `COREPACK_ENABLE_STRICT=0` fallback failed (`Unsupported package manager specification (nub@0.8.3)`).
- D-15 case identity (file, name, occurrence); the original helper assumed (file, name) unique and stopped after the control run.
- D-16 `npm_config_yes=false` so that `npx` never downloads an unpinned vitest.
- D-17 `COREPACK_ENABLE_PROJECT_SPEC=0` to bypass nub and use pnpm 10.12.1 at v4.6.0; frozen install then failed (`ERR_PNPM_LOCKFILE_MISSING_DEPENDENCY zod@4.5.4`).
- D-18 `--no-frozen-lockfile` retry failed (`ERR_PNPM_WORKSPACE_PKG_NOT_FOUND zod@workspace:*`).
- D-19 dev command moved to the repository root with `--project zod`. From v4.2.0 `packages/zod/vitest.config.ts` merges the root config's `projects: ["packages/*"]`, and that glob is empty when run inside `packages/zod` ("No projects were found"). Both gates (888/888 control, identical 17-case v4.1.0 failure set) re-passed under the new command.
- D-20 `--typecheck.enabled=false` accepted but ineffective; runtime and typecheck entries both appear (162 file entries).
- D-21 split rule: a file entry is typecheck if any assertion has `meta.typecheck` true. The earlier rule "entries with a duration" missed `json.test.ts` (one `todo` case, no duration) and marked v4.2.0 to v4.5.0 unavailable at 80/81; reprocessing the same JSON with D-21 recovered them without re-running.
- D-22 v4.6.0: added an export-only `pnpm-workspace.yaml` mirroring `package.json` workspaces and resolved dependencies afresh with `--no-frozen-lockfile` (1,274 packages; vitest 4.1.5, typescript 5.5.4, zshy 0.8.0, biome 1.9.4; lockfile kept as `results/survival/v4.6.0/pnpm-lock.resolved.yaml`). Install then failed in `packages/docs` postinstall (`nub: not found`).
- D-23 not applicable.
- D-24 `--ignore-scripts` skips the nub-based docs postinstall and husky prepare.
- D-25 `npx --no-install zshy --project tsconfig.build.json` run directly in `packages/zod`; root `pnpm build` and package postbuild (stub `package.json` writer, biome formatting) not run. `index.cjs`, `index.js`, `index.d.cts` produced and probed.

Limitations: L-01 coverage not measured (2.2); L-02 provider not pinned.

### 5.2 Stage S run history

| Run | Commits | What ran | Why it stopped |
|---|---|---|---|
| main instruction | `043638ab`, `1bc6cba9` | builds for six releases, LLM corpus at all six, dev control | summary helper assumed (file, name) unique; nine duplicate names |
| continuation 1 | `de072430`, `1fd2e532` | identity fix (D-15), dev at v4.1.0 (871/17) | vitest would not start from v4.2.0 ("No projects were found") |
| continuation 2 (addendum 2) | `98ef551e` | dev from repository root (D-19), control and v4.1.0 gates re-passed | duration-based split marked v4.2.0 to v4.5.0 unavailable (80/81); v4.6.0 install failed (D-17, D-18) |
| continuation 3 (addendum 3) | `0cfc947d` | split by `meta.typecheck` (D-21), v4.2.0 to v4.5.0 dev recovered from existing JSON | v4.6.0 install failed in `packages/docs` postinstall (D-22) |
| continuation 4 (addendum 4) | `5734f13c` | v4.6.0 install with `--ignore-scripts` (D-24), direct zshy build (D-25), LLM and dev at v4.6.0 | complete |

Continuation 1 was started by mistake with a "read the handover and continue" prompt rather than a written instruction; the agent used the handover's own continuation notes as its instruction. Its results were kept because they passed the same gates.

### 5.3 v4.6.0 environment

v4.6.0 switched the monorepo's package manager to `nub@0.8.3` and wrapped every script in a `nub` wrapper. Our build bypassed the wrapper (D-17, D-22, D-24, D-25), and the dependency versions are a fresh resolution, not the release's own lockfile. The LLM corpus is insensitive to this (it only needs `index.cjs`); the dev corpus ran under vitest 4.1.5 rather than whatever v4.6.0 pinned. Results for v4.6.0 should be read with this caveat.

## 6. Analyses not done in this report

- Function-level pairing of the two corpora (LLM tests for function f versus developer cases for f). `scripts/analyze-survival.py` pairs by file name and matched 15 of 54 functions with passing tests (`discriminatedUnion`, `file`, `readonly`, `map`, `date`, `tuple`, `array`, `nullable`, `prefault`, `catch`, `nonoptional`, `transform`, `preprocess`, `coerce.number`, and `check`, the last wrongly, to `mini/tests/checks.test.ts`). The other 39 have no file of their own; their developer cases sit inside type-level files (`string.test.ts`, 36 cases, holds 16 sampled string-format functions; `number.test.ts` holds the numeric checks; `object.test.ts` holds `strictObject`, `looseObject`, `keyof`) and in `classic/tests/index.test.ts`, whose 56 cases are named one per API (`z.boolean`, `z.symbol`, `z.never`, `z.iso.time`, `z.iso.duration`, `z.coerce.boolean`, `z.check`, …). File-level pairing would attribute every failure in `string.test.ts` to every string-format function, so the pairing has to be done at case level, which requires a per-function judgement of which cases test that function, and decisions on whether `mini` tests count. Deferred; to be settled with the advisor. Once a case-level map exists, the intended readout is a 2×2 per function and release: both corpora broke (a real change the generated test detected), dev only (the generated test missed it), LLM only (brittle generated test), neither (no information).
- Manual second-pass classification of the 53 developer failures and the one LLM failure into "public contract changed" versus "non-contract assertion" (message text, serialisation format, internal function). The rule to apply: if what a user can observe through the documented API changed (accepted input, output value, whether an exception is thrown), it is a contract change; if only message wording, object serialisation or an internal helper changed, it is not. The LLM failure is a contract change by this rule (4.3). `parsedType` removal is internal. The 34 snapshot cases need their diffs opened.
- Cause-commit bisection for the breaks (largest interval 145 commits, 8 builds) or extension to the 38 patch tags (44 points at roughly 80 s each).
- Coverage of the sampled functions by either corpus (L-01). Options: run the survival runner under c8 (V8 built-in coverage, no instrumentation, works on the built `.cjs` with source maps back to TypeScript); or nyc with `exclude-node-modules=false` and the wrapper's real path included; or move the LLM tests to a vitest runner against the TypeScript source as in the week-1 pilot, which changes the runner and would need pass/fail re-confirmed.
- Remaining 64 population functions and the 97 mini-specific functions.

## 7. Files

Under `experiments/testpilot-2026-09/`:

- `results/api-sample-n60-s20260919.json`, `results/population-main.json`, `results/api-summary.md`, `results/sample-reproducibility.json`
- `results/gen-n60/` (prompts, completions, 360 tests, `report.json`), `results/gen-n60-passing.json` (S), `results/gen-n60-tests.csv`, `results/gen-n60-analysis.md`, `results/gen-examples/` (three complete prompt/completion/test records), `results/gen-smoke/`, `results/gen-smoke-2/`
- `results/survival/<tag>/` (`llm-results.json`, `llm-raw/`, `dev-run.json`, `dev-run-unsplit.json` where applicable, `dev-cases.json`, `dev-summary.json`, `devtest-diff.txt`, `build.log`, `env.txt`, `dev-attempt1/`), `results/survival-summary.md`, `results/survival-llm-matrix.csv`, `results/survival-dev-matrix.csv`, `results/survival-pairs.csv`, `results/pair-map.json`
- `scripts/` (`analyze-survival.py`, `run-survival-llm.py`, `run-survival-dev.py`, `build-survival*.py`, `sample-api.py`, `summarize-api.py`, `explore.sh`, `run-generation.sh`, `probe*`)
- `docker/` (Dockerfile, compose; `.env` with the API key is ignored), `wrappers/zod`, `wrappers/zod-mini`, `mock/`
- `docs/` (stage instructions as executed, handovers, command logs, `run-notes.md`)

Exported version trees (`zod-versions/`, 2.3 GB) live outside the repository and are not archived.
