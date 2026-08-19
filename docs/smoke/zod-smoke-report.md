# Zod test generation·survival·repair smoke test: Report (2026-08-week3-smoke)

## Experiment question

Can the full pipeline: LLM test generation at a fixed past commit, survival tracking of those
tests across 13 months of upstream history, stale judgment at the first breakage, and LLM
repair, run end to end on a real repository, reaching the repair step at least once?

## Setup

- Repository: `colinhacks/zod`, tested from source (no build step in the loop).
- Anchor **t = v4.0.5** (`45afab0f`, 2025-07-10); all 2,757 upstream tests passing at t.
- Observation window: 316 commits touching `packages/zod`, t to `3c9ca1d9` (2026-08-17).
- Target file: `packages/zod/src/v4/core/util.ts` (775 LOC at t; 38 window commits; multiple
  verified function-level behavior changes). Selection rationale: separate document.
- Generator/repairer: `openai/gpt-oss-120b` (temperature 0, single shot, no retries). The
  model saw the full file source and chose what to test; no functions were prescribed.

## Case composition

The model produced one test file with **18 cases**, one per helper function, covering broad
utility logic (type guards, string/number helpers, lazy/caching utilities, path navigation).

## Results

| outcome | cases | detail |
|---|---|---|
| passing at t | 16 / 18 | entered survival tracking |
| failed at generation (dropped, unmodified) | 2 | `getEnumValues` (misread filtering rule), `isPlainObject` (misread prototype-chain semantics) |
| broke during window | 1 / 16 | `floatSafeRemainder` case: first failure at `5b7ed214` (2026-04-27), commit 200/316; survived 199 commits |
| censored (passing through window end) | 15 / 16 | includes a `defineLazy` case whose function changed semantically but only outside the asserted path |
| stale vs bug at first failure | stale (human-confirmed) | intentional rewrite of multipleOf float validation changed the function's return contract |
| repair requested / verified / scope-ok | 1 / 1 / 1 | repaired test passes at the breaking commit; diff confined to the broken case |

Headline: **the full cycle closed.** One naturally-arising breakage was judged stale and
repaired by the model in one shot: it updated only the assertion pinned to the old return
contract, preserved the still-valid assertion, and did not weaken the test's intent.

## Observations

- Survival is governed by assertion coverage, not function choice: of 18 chosen functions,
  3 changed semantically in the window, but only the one whose *asserted values* intersected
  the change actually broke.
- Both generation-time failures were the model misreading edge-case behavior of the code
  (not code changes); the pass-at-t gate caught them immediately, so every later breakage
  can be attributed to code evolution alone.
- The repair preserved the test's original intent while adapting it to the function's new
  return value. Notably, the model was unsure whether the result would be +0.5 or −0.5, so
  it wrapped the value in `Math.abs()`, and this safety net also covered up a floating-point
  detail the model actually got wrong (it predicted −0.5; the real value is +0.4999…).
- Cost/latency were negligible: generation $0.0006 / 63 s; repair $0.0007 / 16 s; the full
  316-commit loop ran in ≈10 minutes of working time.

## Limitations

- Single file, single model, single generation sample at temperature 0, so no variance estimate.
- Only one breakage in total, so the stale-vs-bug judgment was exercised once; the
  production-bug branch of the protocol was not exercised.
