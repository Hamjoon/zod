# Repair validation — case7 (floatSafeRemainder handles decimal steps)

- Repair model call: `openai/gpt-oss-120b`, temperature 0, 1 shot. 16s, prompt 952 tok /
  completion 1,339 tok (1,084 reasoning), cost $0.00069, provider AkashML, finish_reason=stop.
- Fence protocol: PASS — one ```ts fence, nothing outside.
- Note: the model echoed the two import lines although only the repaired test case was
  requested; the imports are byte-identical to the original, and only the `test()` block was
  spliced into the harness file.

## Verification at the red commit (`5b7ed214`)

- Worktree checked out at `5b7ed214`, `pnpm install --frozen-lockfile --ignore-scripts` re-run.
- `npx vitest run --config experiments/vitest.smoke.mts --reporter=json`:
  **case7 = PASS** (raw JSON: `repair-validation-smoke.json`).
  (The only failing cases in the file are case1/case15, the generation-time dropouts —
  they are outside the experiment and unaffected by the repair.)
- **repair_green: yes**

## Scope check

Diff pre-repair → post-repair (`util-main.test.ts.pre-repair` / `.post-repair`): the only
changed lines are inside the case7 `test()` block — one comment block and the first
assertion. No other test case, no import, and nothing outside the test file was touched.
Production code untouched by construction (repair applied only to the generated test file).

- **repair_scope_ok: yes**

## What the model actually did (recorded per protocol)

- Kept the second assertion (exact multiple → `0`) unchanged — the part of the old contract
  that still holds.
- Updated the first assertion from the old unit-remainder contract (`0.05`) to the new
  ratio-residue contract, asserting `Math.abs(rem) ≈ 0.5`.
- Intent preserved: the test still verifies "non-multiple input yields a non-zero remainder
  signal; exact multiple yields 0". It did not weaken the assertion to truthiness, and did
  not touch anything beyond the broken assertion.
- One notable detail from its reasoning: it mis-derived the sign/rounding (assumed
  `5.55/0.1` is exactly `55.5` → rounds to 56 → `-0.5`; in IEEE754 it is `55.49999…` →
  rounds to 55 → `+0.4999…`). It hedged with `Math.abs(...)`, which makes the assertion
  robust to exactly this uncertainty — the repair passes for the right intent despite the
  wrong microscopic arithmetic. Worth citing as a repair-behavior observation.
