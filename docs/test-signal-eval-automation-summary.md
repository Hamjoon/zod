# LLM Test Repair Signal Evaluation Automation - Zod object extend

## Goal

This follow-up experiment evaluates whether a test repair preserves the intended test signal after a stale-test repair. It builds on PR #2's `z.object(...).refine(...).extend(...)` case and replaces manual judgement with three automatic proxy measurements:

- targeted Vitest coverage on the production file
- assertion-shape analysis on the repaired test file
- StrykerJS mutation testing over the changed `extend()` implementation

The reference oracle is `hamjoon/repair/object-extend-refinement-test`, which represents the upstream maintainer-style test repair for the same production behavior.

## Compared Variants

- LLM repair: current PR #2 test-only repair generated with `openai/gpt-oss-120b`
- oracle repair: `hamjoon/repair/object-extend-refinement-test`
- production under test: PR #2 fixture production behavior in `packages/zod/src/v4/core/util.ts`
- target test file: `packages/zod/src/v4/classic/tests/object.test.ts`

The runner keeps the production file fixed and can temporarily load the oracle branch's test file with `--test-source`. This makes the comparison focus on the test repair, not on unrelated branch state.

## Commands

```bash
node scripts/run-test-signal-eval.mjs \
  --label llm-repair \
  --out artifacts/test-signal/llm-repair

node scripts/run-test-signal-eval.mjs \
  --label oracle-repair \
  --test-source hamjoon/repair/object-extend-refinement-test \
  --out artifacts/test-signal/oracle-repair

node scripts/compare-test-signal-results.mjs \
  artifacts/test-signal/llm-repair/summary.json \
  artifacts/test-signal/oracle-repair/summary.json \
  > artifacts/test-signal/comparison.md
```

## Result Summary

Coverage barely differs:

- LLM repair line coverage: 130/313 lines, 41.53%
- oracle repair line coverage: 131/313 lines, 41.85%
- branch coverage delta: 33.49% vs 33.98%

Assertion shape shows a clearer difference:

- LLM repair: 2 relevant tests, 2 executable expects
- oracle repair: 3 relevant tests, 3 executable expects
- missing LLM signal: the oracle's `extend() on object with refinements should still reject overlapping keys` assertion

Mutation testing shows the strongest signal:

- LLM repair: 11 killed, 10 survived, 4 no coverage
- oracle repair: 19 killed, 4 survived, 2 no coverage
- 8 mutants missed by the LLM repair are killed by the oracle repair

The missed mutants cluster around the refined-object overwrite guard in `extend()`:

- `hasChecks` forced false
- `if (hasChecks)` forced false
- overwrite loop body removed
- overlapping-key condition forced false
- overlapping-key throw block removed

## Assessment

The LLM repair passes the targeted Vitest suite and has almost the same coarse coverage as the oracle, so coverage alone would under-report the signal loss.

The assertion-shape check catches that the LLM repair has one fewer relevant behavioral assertion. StrykerJS makes the loss executable: the LLM repair does not kill mutants that disable the refined-object overwrite guard, while the oracle repair does.

For this case, the best automatic judgement is:

- targeted pass: yes
- coverage preservation: mostly preserved
- assertion preservation: weakened
- mutation signal preservation: weakened
- final verdict: `signal loss suspected`

This supports the experiment idea: coverage is useful as a cheap first proxy, but mutation kill-set overlap is closer to the intended "test signal preservation" question.
