# Evaluating LLM-Based Test Maintenance on Real Commit History: Decision Correctness, Repair Success, and Test Coverage — Full Report (Unified Protocol v2, 30 Cases)

> Revised edition (2026-07 week 4). This document reworks the week-3 report per advisor
> feedback: the report language is English, terminology is kept plain and spelled out,
> the repair outcome is reported as a binary judgment, mutation testing is removed from
> the signal criterion (coverage is retained), and the prompt template/variable
> structure is documented explicitly. All underlying measurements are unchanged from
> the week-3 run; no case was re-executed.

## Public artifacts

- Subject project: [colinhacks/zod](https://github.com/colinhacks/zod)
- Artifact repository: [Hamjoon/zod](https://github.com/Hamjoon/zod)
- Archive branch: [experiment/2026-07-week3-v2-30case-archive](https://github.com/Hamjoon/zod/tree/experiment/2026-07-week3-v2-30case-archive)
- Case selection and verification record: [zod-30case-verification-results.md](zod-30case-verification-results.md) (verification batch, 2026-07-15 — how these 30 cases were adopted)

## Terms used in this report

- **Recent change**: the single commit-derived diff applied on top of a base version of
  the repository to construct a case. It is the "most recent edit" the model is shown.
- **Fixture**: the prepared per-case source tree — the base version of the repository
  with the case's recent change applied. This is the state the model's repair is
  applied to and tested against.
- **Target tests**: the specific test file(s) each case is evaluated on.
- **Failing / passing**: whether the target tests fail or succeed when run. (These
  states are often called "red" and "green"; this report uses failing/passing.)
- **Upstream**: the original zod repository and its commit history, from which all
  cases were sampled.

## Experiment question

For 30 cases (10 per category) sampled from the upstream commit history, does
`gpt-oss-120b`, under a **single unified framing**, do the following?

1. Choose the correct response (`no_change` / `fix_tests` / `fix_production`) given only
   the recent-change diff and the current test state.
2. Produce a repair that actually succeeds — the target tests pass **and** the recent
   change is preserved in the repaired tree.
3. Keep the repaired tests covering the changed production code (coverage-based signal
   check).

Case categories (case IDs are prefixed `s`, `p`, `n` respectively):

- **Stale-test cases**: the production behavior was changed intentionally, so tests
  written for the old behavior now fail. The tests are outdated, not the code — the
  correct response is `fix_tests`.
- **Production-regression cases**: a newly added test reveals a bug in the production
  code, so the test fails. The test is right and the code is wrong — the correct
  response is `fix_production`.
- **Normal cases**: the test suite still passes after the production change. Nothing
  is broken — the correct response is `no_change`.

## Preconditions for reading this report

1. **The v2 numbers cannot be compared directly with v1 (2026-07 week 1).** In v1 the
   stale-test cases ran in a `test-maintenance` mode that itself forced test edits — a
   control condition. In v2 the stale-test cases are free-choice for the first time;
   the `fix_production` choices observed on them (5/10) were structurally impossible
   in v1.
2. **The classification metric is auxiliary.** The v2 prompt structure would allow the
   expected classification to be recovered from two surface cues alone — whether the
   recent diff touches a test file or a production file, and whether the tests
   currently fail. The primary metrics are therefore repair success, coverage signal,
   and the unnecessary-edit rate on normal cases; DECISION agreement is reported for
   reference. A counter-observation is recorded alongside: if the model had actually
   followed the surface cue ("whatever changed most recently is correct"), DECISION
   would be 30/30, but the measured result on stale-test cases was 5/10 — i.e., the
   model did not use the surface cue.
3. The upstream interval in which tests import zod from build outputs rather than from
   source is referred to uniformly as the **"dist-mode interval (2025-09 – 2025-12)"**.
   Among these 30 cases, exactly one case is in that interval — p03 (base `f97e80da`) —
   and its fixture construction, validation, and signal measurement were all performed
   on a rebuilt tree.

## Execution

All cases used the same runner in its `v2-unified` mode (the two pre-existing modes were
not modified).

- Runner: `scripts/run-gptoss-test-maintenance.py --mode v2-unified`
- Model: `openai/gpt-oss-120b` (OpenRouter; temperature 0; one request per case, no
  retries or follow-up turns)
- Signal runner: `scripts/run-zod-signal-eval.mjs`
- Case metadata: `experiments/zod-repair-classification-v2/cases.json`

## Prompt structure: template vs. per-case variables

The prompt sent to the model is assembled from a **fixed template** and **per-case
variables**. No part of the prompt names the case category, and every case uses the same
template.

### Fixed template (identical across all 30 cases)

Intro (verbatim):

```text
You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.
```

Constraints (verbatim; only the file list inside the third item varies per case):

```text
- The first line of your reply must be exactly one of: `DECISION: no_change`,
  `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a
  unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: <per-case file list>.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.
```

The response protocol is part of the template: the first line must be a `DECISION`, and a
unified diff follows only for `fix_tests` / `fix_production`.

### Per-case variables

| Variable | Content | Producer |
| --- | --- | --- |
| Allowed-files list | The case's test and production file paths (inserted into the fixed constraints block) | `cases.json` |
| `<recent_change_diff>` | The diff applied to the fixture (stale-test and normal cases: the upstream production diff; production-regression cases: the new-test diff) | fixture construction |
| `<test_output>` | The current test run output on the fixture (stale-test and production-regression cases: the failure log; normal cases: the passing summary) | `validate.sh` on the fixture |
| `<test_snippet>` / `<production_snippet>` | Code around the changed regions of the diff, ±25 lines of padding, at most 220 lines per file; each snippet is tagged with its `path` and `lines` attributes | snippet extractor in the runner |

Snippets reflect the fixture state: files modified by the fixture use the line numbers
after the change, untouched files use the line numbers before it. Every prompt actually
sent is archived per case as `gptoss-prompt.md`, so the exact template/variable
instantiation of any case can be inspected directly.

## Case-level pipeline

Each case runs through five stages. A case exits at the first stage it fails; the binary
repair judgment (below) is defined by how far a case gets.

1. **Decision** — the model's response to the single request; the first-line `DECISION`
   is compared with the expected response for the category.
2. **Patch apply** — the model's diff is applied to the case fixture
   (`apply-patch.py`, a context-match applier).
3. **Validation** — the target tests are run on the patched tree (`validate.sh`);
   the stage passes if they all pass.
4. **Preservation check** — a mechanical git-level check that the recent change is still
   present in the repaired tree (`git apply --reverse --check fixture.patch` succeeds).
   A passing tree that fails this check reached passing by reverting the intended
   change.
5. **Signal (coverage)** — for repairs that pass stages 2–4, the target tests are run
   with coverage to confirm they still execute the changed production file.

## Binary repair judgment

Per advisor feedback, the repair outcome is reported as a single binary judgment:

- **Repair = yes** ⇔ the target tests pass **and** the recent change is preserved
  (stages 2–4 all pass).
- **Repair = no** ⇔ anything else: the diff could not be applied, the tests still fail,
  or the tests only pass because the repair undid the recent change.

The preservation condition is part of the definition of success, not a separate
category: a repair that makes tests pass by undoing the intended production change is a
failed repair. The `Note` column in the matrices below records the failure reason for
internal traceability; the judgment itself is the binary column.

## Signal criterion (coverage; mutation removed)

Per advisor feedback, mutation testing is removed from the signal criterion at this
stage; coverage is retained. The signal check asks: **after the repair, do the target
tests still execute the changed production file?** It is measured as line coverage of
the changed production file (vitest), on the repaired tree, running only the target
tests. The signal check applies only to cases with Repair = yes.

Mutation-testing artifacts (StrykerJS) from the original week-3 run remain in the
archive branch (`signal/stryker/` per case) but are outside the scope of this report's
judgments.

## Case Matrix — stale-test cases (expected DECISION: fix_tests)

| ID | Base | Recent change | DECISION | Repair | Note |
| --- | --- | --- | --- | --- | --- |
| [s01](../experiments/zod-repair-classification-v2/cases/s01-0cf45896/) | [a410616b](https://github.com/colinhacks/zod/commit/a410616b) | [0cf45896](https://github.com/colinhacks/zod/commit/0cf45896) tuple→JSON Schema oneOf | fix_tests ✅ | **yes** | |
| [s02](../experiments/zod-repair-classification-v2/cases/s02-66bda749/) | [9443aab0](https://github.com/colinhacks/zod/commit/9443aab0) | [66bda749](https://github.com/colinhacks/zod/commit/66bda749) ZodMiniType `.refine()` removal | fix_production ❌ | no | patch apply failed |
| [s03](../experiments/zod-repair-classification-v2/cases/s03-3a8edd74/) | [103f69be](https://github.com/colinhacks/zod/commit/103f69be) | [3a8edd74](https://github.com/colinhacks/zod/commit/3a8edd74) preprocess output type revert | fix_production ❌ | no | tests pass by reverting the recent change |
| [s04](../experiments/zod-repair-classification-v2/cases/s04-6b13cc94/) | [39d84d03](https://github.com/colinhacks/zod/commit/39d84d03) | [6b13cc94](https://github.com/colinhacks/zod/commit/6b13cc94) JSON Schema pattern polish | fix_production ❌ | no | tests pass by reverting the recent change |
| [s05](../experiments/zod-repair-classification-v2/cases/s05-27f13d62/) | [845a230b](https://github.com/colinhacks/zod/commit/845a230b) | [27f13d62](https://github.com/colinhacks/zod/commit/27f13d62) regex precision improvement | fix_tests ✅ | no | patch apply failed |
| [s06](../experiments/zod-repair-classification-v2/cases/s06-6d47791b/) | [a2c98924](https://github.com/colinhacks/zod/commit/a2c98924) | [6d47791b](https://github.com/colinhacks/zod/commit/6d47791b) v.custom input type fix | fix_production ❌ | no | tests pass by reverting the recent change |
| [s07](../experiments/zod-repair-classification-v2/cases/s07-2529f827/) | [98c849de](https://github.com/colinhacks/zod/commit/98c849de) | [2529f827](https://github.com/colinhacks/zod/commit/2529f827) JSON Schema identifier correction | fix_tests ✅ | no | applied but still failing (37→17 failing) |
| [s08](../experiments/zod-repair-classification-v2/cases/s08-ad2fc5ee/) | [f97733ff](https://github.com/colinhacks/zod/commit/f97733ff) | [ad2fc5ee](https://github.com/colinhacks/zod/commit/ad2fc5ee) File schema JSON Schema | fix_production ❌ | no | patch apply failed |
| [s09](../experiments/zod-repair-classification-v2/cases/s09-f98d1a30/) | [592de8de](https://github.com/colinhacks/zod/commit/592de8de) | [f98d1a30](https://github.com/colinhacks/zod/commit/f98d1a30) URL behavior standardization | fix_tests ✅ | no | applied but still failing (1 failing) |
| [s10](../experiments/zod-repair-classification-v2/cases/s10-5fdece94/) | [a73a3b30](https://github.com/colinhacks/zod/commit/a73a3b30) | [5fdece94](https://github.com/colinhacks/zod/commit/5fdece94) min/maxLength inclusive | fix_tests ✅ | no | applied but still failing (10→11 failing) |

## Case Matrix — production-regression cases (expected DECISION: fix_production)

| ID | Base | Recent change | DECISION | Repair | Note |
| --- | --- | --- | --- | --- | --- |
| [p01](../experiments/zod-repair-classification-v2/cases/p01-7f789def/) | [2e5b23dc](https://github.com/colinhacks/zod/commit/2e5b23dc) | [7f789def](https://github.com/colinhacks/zod/commit/7f789def) record non-enumerable property skip | fix_production ✅ | **yes** | |
| [p02](../experiments/zod-repair-classification-v2/cases/p02-f75d8529/) | [17e7f3b4](https://github.com/colinhacks/zod/commit/17e7f3b4) | [f75d8529](https://github.com/colinhacks/zod/commit/f75d8529) `z.literal` decimal-point escape | fix_production ✅ | **yes** | |
| [p03](../experiments/zod-repair-classification-v2/cases/p03-002e01ad/) | [f97e80da](https://github.com/colinhacks/zod/commit/f97e80da) | [002e01ad](https://github.com/colinhacks/zod/commit/002e01ad) isPlainObject constructor handling (dist-mode interval) | fix_production ✅ | **yes** | |
| [p04](../experiments/zod-repair-classification-v2/cases/p04-3048d14b/) | [34b400a5](https://github.com/colinhacks/zod/commit/34b400a5) | [3048d14b](https://github.com/colinhacks/zod/commit/3048d14b) extend fix (#4961) | fix_production ✅ | **yes** | |
| [p05](../experiments/zod-repair-classification-v2/cases/p05-363c966b/) | [8506c352](https://github.com/colinhacks/zod/commit/8506c352) | [363c966b](https://github.com/colinhacks/zod/commit/363c966b) standard-schema toJSONSchema (#5560) | fix_production ✅ | no | applied but still failing (+ new type error) |
| [p06](../experiments/zod-repair-classification-v2/cases/p06-3cd45ebc/) | [3a818de1](https://github.com/colinhacks/zod/commit/3a818de1) | [3cd45ebc](https://github.com/colinhacks/zod/commit/3cd45ebc) httpUrl() strict validation | fix_production ✅ | no | patch apply failed |
| [p07](../experiments/zod-repair-classification-v2/cases/p07-584b1089/) | [15cafa13](https://github.com/colinhacks/zod/commit/15cafa13) | [584b1089](https://github.com/colinhacks/zod/commit/584b1089) base64 whitespace rejection | fix_production ✅ | **yes** | |
| [p08](../experiments/zod-repair-classification-v2/cases/p08-2be1c6ad/) | [8ab23742](https://github.com/colinhacks/zod/commit/8ab23742) | [2be1c6ad](https://github.com/colinhacks/zod/commit/2be1c6ad) generic assignability | fix_production ✅ | no | type-check still failing |
| [p09](../experiments/zod-repair-classification-v2/cases/p09-25a4c376/) | [e45e61b6](https://github.com/colinhacks/zod/commit/e45e61b6) | [25a4c376](https://github.com/colinhacks/zod/commit/25a4c376) openapi-3.0 record/tuple output | fix_production ✅ | **yes** | |
| [p10](../experiments/zod-repair-classification-v2/cases/p10-2e5b23dc/) | [518f15dd](https://github.com/colinhacks/zod/commit/518f15dd) | [2e5b23dc](https://github.com/colinhacks/zod/commit/2e5b23dc) invalid discriminator options | fix_production ✅ | no | applied but still failing (1 failing) |

## Case Matrix — normal cases (expected DECISION: no_change)

| ID | Base | Recent change | DECISION | Unnecessary edit |
| --- | --- | --- | --- | --- |
| [n01](../experiments/zod-repair-classification-v2/cases/n01-0d87aa4a/) | [ed933d91](https://github.com/colinhacks/zod/commit/ed933d91) | [0d87aa4a](https://github.com/colinhacks/zod/commit/0d87aa4a) Make id lazy | no_change ✅ | none |
| [n02](../experiments/zod-repair-classification-v2/cases/n02-592de8de/) | [5e4ff20b](https://github.com/colinhacks/zod/commit/5e4ff20b) | [592de8de](https://github.com/colinhacks/zod/commit/592de8de) Rollup comment warning | no_change ✅ | none |
| [n03](../experiments/zod-repair-classification-v2/cases/n03-5b574501/) | [65f1f404](https://github.com/colinhacks/zod/commit/65f1f404) | [5b574501](https://github.com/colinhacks/zod/commit/5b574501) refine abort+when | no_change ✅ | none |
| [n04](../experiments/zod-repair-classification-v2/cases/n04-5905a8d8/) | [b2592111](https://github.com/colinhacks/zod/commit/b2592111) | [5905a8d8](https://github.com/colinhacks/zod/commit/5905a8d8) check-versions script | no_change ✅ | none |
| [n05](../experiments/zod-repair-classification-v2/cases/n05-9712a670/) | [73b071d7](https://github.com/colinhacks/zod/commit/73b071d7) | [9712a670](https://github.com/colinhacks/zod/commit/9712a670) ~standard lazy init | no_change ✅ | none |
| [n06](../experiments/zod-repair-classification-v2/cases/n06-4975f3a0/) | [d589186c](https://github.com/colinhacks/zod/commit/d589186c) | [4975f3a0](https://github.com/colinhacks/zod/commit/4975f3a0) discriminator generic | no_change ✅ | none |
| [n07](../experiments/zod-repair-classification-v2/cases/n07-36c4ee35/) | [aab33566](https://github.com/colinhacks/zod/commit/aab33566) | [36c4ee35](https://github.com/colinhacks/zod/commit/36c4ee35) weakmap restoration | no_change ✅ | none |
| [n08](../experiments/zod-repair-classification-v2/cases/n08-195e8696/) | [285bde7f](https://github.com/colinhacks/zod/commit/285bde7f) | [195e8696](https://github.com/colinhacks/zod/commit/195e8696) `@__PURE__` annotation | no_change ✅ | none |
| [n09](../experiments/zod-repair-classification-v2/cases/n09-c5d9e7ce/) | [edc34778](https://github.com/colinhacks/zod/commit/edc34778) | [c5d9e7ce](https://github.com/colinhacks/zod/commit/c5d9e7ce) JWT alg arbitrary string | no_change ✅ | none |
| [n10](../experiments/zod-repair-classification-v2/cases/n10-b142ea8f/) | [f350a693](https://github.com/colinhacks/zod/commit/f350a693) | [b142ea8f](https://github.com/colinhacks/zod/commit/b142ea8f) Fix $strip | no_change ✅ | none |

**Unnecessary-edit rate on normal cases: 0/10 (0%).** All ten responses were
protocol-conforming `DECISION: no_change` with no diff.

## Headline numbers

- DECISION agreement: **25 / 30** (stale-test 5/10, production-regression 10/10,
  normal 10/10)
- Repair success (the 20 cases that required a fix): **7 / 20 yes**
  (stale-test 1/10, production-regression 6/10)
  - yes: s01, p01, p02, p03, p04, p07, p09
  - no (13): patch apply failed 4 · applied but still failing 6 · tests pass by
    reverting the recent change 3
- Coverage signal (7 successful repairs): **7 / 7 covered** — the repaired target tests
  execute the changed production file in every successful repair
- Unnecessary edits on normal cases: **0 / 10**

## Coverage signal detail (Repair = yes, 7 cases)

Line coverage of the changed production file, measured on the repaired tree with the
target tests only (vitest + v8 coverage).

| ID | Changed production file | Line coverage | Covered |
| --- | --- | --- | --- |
| [s01](../experiments/zod-repair-classification-v2/cases/s01-0cf45896/signal/) | `to-json-schema.ts` | 710/798 (88.97%) | yes |
| [p01](../experiments/zod-repair-classification-v2/cases/p01-7f789def/signal/) | `schemas.ts` | 231/1124 (20.55%) | yes |
| [p02](../experiments/zod-repair-classification-v2/cases/p02-f75d8529/signal/) | `schemas.ts` | 470/1713 (27.43%) | yes |
| [p03](../experiments/zod-repair-classification-v2/cases/p03-002e01ad/signal/) | `util.ts` | 95/280 (33.92%) | yes |
| [p04](../experiments/zod-repair-classification-v2/cases/p04-3048d14b/signal/) | `util.ts` | 165/530 (31.13%) | yes |
| [p07](../experiments/zod-repair-classification-v2/cases/p07-584b1089/signal/) | `schemas.ts` | 270/1128 (23.93%) | yes |
| [p09](../experiments/zod-repair-classification-v2/cases/p09-25a4c376/signal/) | `to-json-schema.ts` | 708/791 (89.5%) | yes |

Coverage percentages are file-level. They confirm the changed file is exercised by the
target tests; they do not by themselves measure how well the tests would detect future
bugs (see Limitations).

## Key finding: validation is incomplete without the preservation check

Three stale-test cases (s03, s04, s06) made the target tests pass, yet their repairs are
judged **no**: in each, the model's `fix_production` patch reverted the intended
production change, restoring the old behavior that the outdated tests expected. Looking
at the transition from failing to passing alone, these are indistinguishable from
correct repairs. The distinction is made mechanically by a single static check —
`git apply --reverse --check fixture.patch` on the repaired tree, which succeeds only if
the recent change is still present. Run retroactively over all 30 cases, the check
failed on exactly these 3, with zero false positives. **Recent-change preservation is
therefore a necessary component of target validation** in any protocol where the model
freely chooses what to modify; a passing-only definition of success over-counts reverts
as successes.

## Failure notes per case (Repair = no, 13 cases)

All five misclassified stale-test cases point in one direction — treating the tests as
the specification and the recent production change as the bug:

- **s02** (`.refine()` removal): the model tried to restore the removed `.refine()` in
  production code, but its diff expected to find lines that do not exist in the fixture
  (code from before the removal), so the patch could not be applied.
- **s03** (preprocess revert) — tests pass by reverting: the model rewrote the recent
  change's `isValid` return (`return base`) and `innerType` simplification in the
  opposite direction within the same code blocks, restoring the earlier behavior
  (`return INVALID` + transform-skip logic). A functional full revert in different
  code shape. Preservation check failed.
- **s04** (JSON Schema pattern polish) — tests pass by reverting: removed the recent
  change's `regex: ""` formatMap entry and `string | undefined` type on the same
  lines — a direct inversion of the core change. Preservation check failed.
- **s06** (v.custom input type) — tests pass by reverting: inverted the recent change's
  simplified `z.custom` signature (`custom<O>`, `data: unknown`) back to a two-generic
  form (`custom<O = unknown, I = O>`, `data: I`, a variant differing from the
  original's `data: O`). The rest of the recent change (errors.ts, docs) was
  preserved — a partial revert — but the edit that made the tests pass is itself a
  reversion. Preservation check failed.
- **s08** (File schema JSON Schema): the production patch assumed `to-json-schema.ts`
  content outside the provided snippet as the lines to be replaced; no contiguous
  match existed in the real file, so it could not be applied.

Applied but still failing (6):

- **s07** (37 → 17 failing): a large snapshot-correction case; the model's diff fixed
  roughly half of the outdated expectations — an incomplete repair. (Result from the
  response obtained after one transport retry; see Run notes.)
- **s09** (1 failing): missed one outdated `toThrow` expectation of the URL
  standardization — an incomplete repair.
- **s10** (10 → 11 failing): fixed the outdated array-side expectations but newly broke
  a previously passing validations test — an over-generalized edit.
- **p05** (failing + type error): the original test failure (`Non-representable type`)
  remained and the patch introduced a new `exactOptionalPropertyTypes` type error — an
  over-generalized edit.
- **p08** (type-check failing): failed to satisfy the type-level assignability
  expectations — an incomplete repair.
- **p10** (1 failing): the direction (adding `options` to the invalid-discriminator
  error) was right but fell short of the expected snapshot shape — an incomplete
  repair.

Patch apply failures (4): s02, s05, s08, p06. In all four, the model wrote its diff
against code it had not seen — it assumed content outside the provided snippet as the
lines to be replaced (s05: a nonexistent test block; p06: omitted context lines inside a
changed block) — so even context-matching application was impossible. In the
one-request-per-case protocol such diffs are final failures. Note also that all 14
successfully applied diffs were nonstandard diffs rejected by plain `git apply` (see Run
notes) — measured repair success is sensitive to the applier's tolerance.

## Run notes

- Model output diffs are not standard-format; they were applied with a context-match
  applier (`apply-patch.py`), and apply success/failure is defined by this applier.
- **s07 transport retry (1)**: the first call failed after ~14 minutes with a corrupted
  response body (JSONDecodeError); the identical prompt was re-sent once
  (temperature 0, not self-correction). The runner's timeout increase (120→600 s) and
  response-parsing tolerance were in place before this retry.
- **s04 re-verification (1)**: the initial response parser missed a fenced diff without
  a file header and mis-recorded `decision-without-diff`; re-verified after the parser
  fix (same for p02/p04/p05). The model responses themselves are unchanged.
- vitest runs default to the `packages/zod` working directory, falling back to the repo
  root on "No projects were found"; root-run failure judgment uses the "Tests N failed"
  count (ignoring unrelated sibling-package noise).

## Archive layout

Artifacts are preserved on an archive branch that does not inherit the zod source tree
(an orphan branch): 30 per-case packet commits (in adoption order) plus
report/runner/tooling commits, with post-hoc re-analysis commits added without
force-push. Each case packet contains:

- `fixture.patch` (the recent change applied to the base), `test-output.txt` (test
  state given to the model)
- `gptoss-prompt.md`, `gptoss-response.md`, `gptoss-usage.json`
- `gptoss-repair.patch` (model's raw diff), `applied-repair.diff` (normalized
  post-apply diff)
- `result.json`, `validation.log`, `signal/` (coverage results for successful repairs;
  archived mutation-testing artifacts are out of scope for this report)

## Usage

```json
{
  "prompt_tokens": 122352,
  "completion_tokens": 36315,
  "total_tokens": 158667,
  "cost": 0.02129815
}
```

(31 calls — 30 cases + 1 transport retry on s07.)

## Interpretation

1. **Classification is stable when the tests deserve trust.** All 20 cases on the
   production-regression and normal sides matched expectations, and zero unnecessary
   edits on normal cases shows the "if tests pass, don't touch anything" behavior
   holds under the unified framing.
2. **The stale-test side collapsed by half the moment it became free-choice.** The 6/6
   classification seen in v1 reflected a forced control on the stale-test side
   (Precondition 1). Under the unified framing the model chose `fix_production` —
   reverting the intended change — on half of the stale-test cases, and three of those
   reverts actually made the tests pass. Those three are caught only by the
   preservation check (Key finding).
3. **Repair success is the bottleneck.** Only 7 of the 20 fix-requiring cases produced
   a successful repair (tests pass + change preserved), and the asymmetry is stark:
   stale-test 1/10 vs production-regression 6/10.
4. **Diff format quality is a separate failure axis.** All four apply failures came from
   the model assuming code it had not seen, and even the applied diffs all required a
   tolerant applier. Measured repair success under the one-request protocol is
   sensitive to the applier's tolerance definition.

## Limitations

- **Surface-cue limitation of the classification metric.** The prompt structure would
  allow expected classifications to be recovered from surface cues (where the diff is +
  whether tests fail), so DECISION agreement is auxiliary — with the
  counter-observation that the measured 5/10 on stale-test cases shows the model did
  not in fact follow the surface cue.
- **Coverage is a weaker signal criterion than mutation testing.** File-level coverage
  confirms the changed file is executed, but cannot distinguish tests that would catch
  a future bug from tests that merely execute the code. Mutation testing was removed
  at this stage per advisor guidance and may be revisited later; the week-3 mutation
  artifacts remain in the archive.
- **Generalization.** Single model (`gpt-oss-120b`), single repository (zod).
- **No comparison with the pilot.** The earlier pilot forced test edits on stale-test
  cases via its execution mode, so its numbers are not comparable with this
  free-choice protocol (removing that forcing is why the protocol was unified).
