# Zod Tuple Single-Shot Test Repair Experiment

This PR records a single-shot LLM test maintenance attempt for a stale Zod tuple
test after an upstream production behavior change.

## Goal

Evaluate whether `openai/gpt-oss-120b` can repair a stale test while preserving
the intended test signal, without a validation feedback loop.

## Commit Pair

- Baseline `t`: `95ccab42` (`test(v3): restore optional undefined expectations`)
- Maintainer repair `t+1`: `cede2c63` (`fix(v4): reject tuple holes before required defaults (#5900)`)

The experiment fixture applies the `t+1` production change from
`packages/zod/src/v4/core/schemas.ts` onto `t`, leaving
`packages/zod/src/v4/classic/tests/tuple.test.ts` stale.

## LLM Run

- Provider: OpenRouter
- Model: `openai/gpt-oss-120b`
- Mode: single-shot prompt
- Temperature: `0`
- Prompt artifact: `artifacts/gptoss-tuple-repair/gptoss-prompt.md`
- Response artifact: `artifacts/gptoss-tuple-repair/gptoss-response.md`
- Usage artifact: `artifacts/gptoss-tuple-repair/gptoss-usage.json`

Usage:

- Prompt tokens: `3142`
- Completion tokens: `1771`
- Total tokens: `4913`
- Reported cost: `$0.00037362`

## Result

The single-shot repair modified only the stale tuple test, but it did not pass
the targeted validation run.

Command:

```bash
pnpm vitest run packages/zod/src/v4/classic/tests/tuple.test.ts --config vitest.config.ts
```

Result:

- Test file: failed
- Failed tests: `1`
- Passing tests: `16`
- Type errors: none

Failure:

```text
FAIL |zod| src/v4/classic/tests/tuple.test.ts > tuple breaks and truncates on first absent-optional rejection
AssertionError: expected true to be false
```

The model over-generalized the new behavior. It correctly recognized that
missing optional slots followed by a later default should now surface the
refinement rejection, but it also changed the no-trailing-default case to expect
failure. The production implementation still truncates and succeeds for that
case, so the repaired test is wrong.

Full validation log:

- `artifacts/gptoss-tuple-repair/single-shot-validation-failure.log`

## Assessment

- Production-source preservation: pass
- Test-only repair constraint: pass
- Targeted test validation: fail
- Coverage / mutation signal evaluation: not applicable

Because the single-shot candidate did not pass the targeted test file, the
experiment stops before coverage or StrykerJS mutation comparison. Running signal
preservation metrics on a candidate that is already invalid would make the result
look more meaningful than it is.

## Verdict

`openai/gpt-oss-120b` did not complete this test repair correctly in a single
shot for this case. The useful signal is the failure mode: the model collapsed
two nearby behaviors into one broader rule and weakened the distinction between
"optional rejection before later default" and "optional rejection at the trailing
edge."
