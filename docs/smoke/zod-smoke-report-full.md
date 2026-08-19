# Zod test generation·survival·repair smoke test — Full report (2026-08-week3-smoke)

This is the authoritative record; the summary report is an excerpt of it. All numbers are
identical between the two documents.

## 1. Environment and verification

- Clone: `colinhacks/zod` with `--filter=blob:none`; work in `git worktree add ../wt 45afab0f`.
- t = v4.0.5 = `45afab0f` verified via tag; window = `git rev-list --reverse v4.0.5..3c9ca1d9 -- packages/zod`
  = exactly 316 commits; HEAD at clone time `3c9ca1d9` (2026-08-17).
- At t: `pnpm install --frozen-lockfile --ignore-scripts`; full upstream suite green
  (281 files / 2,757 tests, no type errors, 59 s). Re-verified again immediately before this
  experiment's generation call (2,757 green, 50 s).
- Harness: `experiments/vitest.smoke.mts` (resolve.conditions `["@zod/source"]`, include
  `experiments/generated-tests/**/*.test.ts`, typecheck off), `experiments/vitest.canary.mts`
  (same, include `experiments/canary/`). Upstream configs untouched. Relative-import
  resolution pre-verified at t with a probe test (removed before the run).
- Reinstall rule: `pnpm-lock.yaml` md5 change vs the previously visited commit → reinstall.
  Triggered at 20 of 316 commits (32 s total).

## 2. Target file selection

`packages/zod/src/v4/core/util.ts`. Full basis, including LOC screening of all v4 production
files and the diff-verified list of changed functions with commits: `target-file-selection.md`.

## 3. Generation call

- Prompt: full file source at t + instructions — cover the file's main logic; standard
  unit-test practice (one test per behavior, no forced case count, ~5 typical); exact relative
  import provided (`import * as util from "../../packages/zod/src/v4/core/util.js";`); public
  entry points forbidden; single ```ts fence only. Files: `llm/llm-prompt.md`, `llm/llm-request.json`.
- Call: `openai/gpt-oss-120b`, temperature 0, one shot (Gary's Mac → OpenRouter; provider
  CoreWeave). 63 s, prompt 6,561 tok / completion 2,268 tok (818 reasoning), $0.00058,
  finish_reason stop. Records: `llm/llm-run.json`, `llm/llm-usage.json`, raw: `llm/llm-raw-response.json`.
- Output: single fence, nothing outside; 18 `test()` cases, each targeting one exported helper;
  imports exactly `{ test, expect, vi }` + the prescribed path. Saved verbatim to
  `experiments/generated-tests/util-main.test.ts` (5,552 chars). Parsing record in `t-green-record.md`.

## 4. Green-at-t gate

16/18 pass; 2 dropped as red-at-generation (protocol: record, no modification, no regeneration):

- case1 `getEnumValues` — model's fixture has all-string values, so the reverse-numeric-key
  filter never triggers; expected `["a","b"]`, actual `["zero","one","a","b"]`. Comprehension error.
- case15 `isPlainObject` — model expected `Object.create({foo:1})` to be non-plain; the t
  implementation walks the inherited constructor and returns true. Comprehension error.

Details and observations: `t-green-record.md`; raw vitest JSON: `t-green-smoke.json`.

## 5. Survival tracking

Loop: per commit — checkout → conditional install → generated tests (JSON reporter) → canary.
Per-commit records (SHA, date, per-case 3-way classification, four timings): `survival-log.jsonl`.
Zero unclassifiable rows. Summary: `timing-summary.md` (~10.4 min working time for the loop).

Result: single red. case7 (`floatSafeRemainder handles decimal steps`) first red at
`5b7ed214`, 2026-04-27, commit index 200/316, type assertion-fail
(`expected 0.4999999999999929 to be close to 0.05`). Remaining 15 cases green through index
316 → censored. Full matrix: `results-table.md`.

## 6. Stale judgment (human-confirmed)

`5b7ed214` intentionally rewrote `floatSafeRemainder` from string-parsing decimal places to a
tolerance-based ratio comparison (fixes scientific-notation NaN, #5793/#5792). Return contract
changed from unit-remainder (`0.05`) to ratio residue (`0.4999…`); the sole call site
(multipleOf) only tests `!== 0`, so production semantics are intact. The test pinned the old
contract → **stale**. Session analysis + Gary's confirmation (2026-08-19): `repair/stale-judgment.md`.

## 7. Repair

- Prompt (protocol: broken test verbatim + red-commit diff + execution output + intent-preserving
  instruction): `repair/repair-prompt.md`, request `repair/repair-request.json`. Interpretation
  note: "깨진 test 전문" was read as the broken *case* in full (not the 18-case file), so scope
  verification stays crisp; the import block was supplied as unchangeable context.
- Call: same model/params, 16 s, $0.00069 (provider AkashML). Raw: `repair/repair-raw-response.json`.
- Output: single fence; repaired case + echoed (byte-identical) imports — noted as a minor
  protocol deviation; only the `test()` block was spliced.
- The repair: replaced `expect(rem).toBeCloseTo(0.05)` with `expect(Math.abs(rem)).toBeCloseTo(0.5)`,
  rewrote the explanatory comment, left the exact-multiple assertion byte-identical.
  Its reasoning mis-derived the residue's sign (assumed exact 55.5 → −0.5; IEEE754 gives
  55.4999… → +0.4999…) and self-hedged with `Math.abs` — wrong microscopic arithmetic, right
  intent, robust assertion.
- Verification at `5b7ed214`: case7 **green**; diff pre→post (`repair/util-main.test.ts.pre-repair`
  / `.post-repair`) confined to the case7 block; nothing outside the test file touched.
  repair_green = yes, repair_scope_ok = yes. Record: `repair/repair-validation.md`,
  raw run: `repair/repair-validation-smoke.json`.

## 8. Canary vs generated tests

`canary-vs-generated.md`. Canary green idx 1–101; from idx 102 (`f7910528`, upstream vitest
v2→v4) constant harness-level resolution failure ("Cannot find package 'zod/v4'") — a canary
config limitation, not entry-point death (generated tests stayed green across the same
commits; exports map intact). The one real red is fully explained by the production diff, not
by harness state. Canary config needs a vitest-4-compatible fix before scale-up.

## 9. Blocked points and deviations

`blockages.md` (none experiment-stopping). Derived decisions made by the execution session and
confirmed with Gary: single-case repair-prompt interpretation (§7); vitest-import wording in
the generation prompt strengthened to "import everything you use explicitly" after observing
an uninstantiable-mock failure in a discarded pilot. Two pilot generation runs executed under
the v1 instructions were **discarded** at Gary's direction when the instructions were revised
(artifacts quarantined under `_discarded/`, excluded from every number in both reports); the
deliverable item "generation prompts ×3" therefore resolves to one generation prompt + one
repair prompt in this experiment.

## 10. Open items for the preparation session

1. Case granularity: with free case counts the model wrote 18 single-function cases with
   multiple assertions each; partial-assertion survival is invisible at case granularity.
   Decide case-vs-assertion tracking unit (or per-behavior case guidance) before scale-up.
2. Canary harness fix for vitest ≥4 regions of history.
3. The production-bug and file-move branches of the repair protocol remain unexercised.
4. Push of `experiments/` + artifacts to branch `experiment/2026-08-week3-smoke` via Mac.

## File index (this bundle)

- `results-table.md` — deliverable 1
- `../target-file-selection.md` — deliverable 2
- `llm/llm-prompt.md`, `repair/repair-prompt.md` — deliverable 3
- `llm/llm-response.md`, `llm/llm-raw-response.json`, `repair/repair-response.md`, `repair/repair-raw-response.json` — deliverable 4
- `functions-vs-changes.md` — deliverable 5
- `survival-log.jsonl`, `timing-summary.md` — deliverable 6
- `blockages.md` — deliverable 7
- `canary-vs-generated.md` — deliverable 8
- `t-green-record.md`, `repair/stale-judgment.md`, `repair/repair-validation.md` — stage records
- `experiments/` harness + generated/repaired test live in the worktree; copies of pre/post repair test file under `repair/`
