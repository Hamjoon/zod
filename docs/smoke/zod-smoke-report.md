# Zod test generation·survival·repair smoke test — Report (2026-08-week3-smoke-v3)

## Experiment question

Can the full pipeline — LLM test generation at a fixed past commit, survival tracking of those
tests across 13 months of upstream history, stale judgment at first red, and LLM repair —
run end to end on a real repository, reaching the repair step at least once?

## Setup

- Repository: `colinhacks/zod`, tested from source (no build step in the loop).
- Anchor **t = v4.0.5** (`45afab0f`, 2025-07-10); all 2,757 upstream tests green at t.
- Observation window: 316 commits touching `packages/zod`, t → `3c9ca1d9` (2026-08-17).
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
| green at t | 16 / 18 | entered survival tracking |
| red at generation (dropped, unmodified) | 2 | `getEnumValues` (misread filtering rule), `isPlainObject` (misread prototype-chain semantics) |
| red during window | 1 / 16 | `floatSafeRemainder` case: first red at `5b7ed214` (2026-04-27), commit 200/316 — survived 199 commits |
| censored (green through window end) | 15 / 16 | includes a `defineLazy` case whose function changed semantically but only outside the asserted path |
| stale vs bug at first red | stale (human-confirmed) | intentional rewrite of multipleOf float validation changed the function's return contract |
| repair requested / green / scope-ok | 1 / 1 / 1 | repaired test passes at the red commit; diff confined to the broken case |

Headline: **the full cycle closed.** One naturally-arising red was judged stale and repaired
by the model in one shot: it updated only the assertion pinned to the old return contract,
preserved the still-valid assertion, and did not weaken the test's intent.

## Observations

- Survival is governed by assertion coverage, not function choice: of 18 chosen functions,
  3 changed semantically in the window, but only the one whose *asserted values* intersected
  the change went red.
- Both generation-time failures were comprehension errors about edge-case semantics, caught
  immediately by the green-at-t gate — evidence the gate is doing its filtering job.
- The repair kept intent under a changed numeric contract, and hedged a sign it was unsure of
  (`Math.abs`) — the hedge happened to absorb a floating-point subtlety the model got wrong.
- Cost/latency were negligible: generation $0.0006 / 63 s; repair $0.0007 / 16 s; the full
  316-commit loop ran in ≈10 minutes of working time.

## Limitations

- Single file, single model, single generation sample at temperature 0 — no variance estimate.
- One red total, so stale-vs-bug judgment was exercised once; the production-bug branch of the
  protocol was not exercised.
- The public-entry-point canary lost resolution from commit 102 onward (upstream test-runner
  major upgrade interacting with the canary harness); it is diagnostic-only and did not affect
  results, but needs a fix before scale-up.
- Censoring is right-censoring at the window end; survival beyond 2026-08-17 is unknown.

Full protocol records, per-case data, prompts, raw model responses, and per-commit timing:
see the companion detailed report (`zod-smoke-v3-report-full.md`).
