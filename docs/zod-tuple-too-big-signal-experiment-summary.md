# Zod Tuple Too-Big Signal Experiment

This PR records a compact experiment for checking whether an LLM-generated test
repair preserves the intended test signal.

## Case

- Baseline `t`: `7abe4e51` (`ae68f62f^`)
- Maintainer repair `t+1`: `ae68f62f` (`fix: Fix error details for tuples with extraneous elements (#5555)`)
- Production file: `packages/zod/src/v4/core/schemas.ts`
- Test file: `packages/zod/src/v4/classic/tests/tuple.test.ts`

The production change adds `inclusive: true` to tuple `too_big` issues. This
changes the English error message for a length-2 tuple receiving a length-3
array from `<2 items` to `<=2 items`.

## Fixture

The fixture applies only the production change from `t+1` onto `t`. With the old
tests, the tuple test fails because two snapshots still expect the old `<2`
message:

- `successful validation`
- `async validation`

## LLM Repair

- Provider: OpenRouter
- Model: `openai/gpt-oss-120b`
- Mode: single-shot prompt
- Runner: `scripts/run-gptoss-test-maintenance.py`
- Usage: 2,218 prompt tokens, 559 completion tokens, 2,777 total tokens
- Cost: `$0.0006681`

The runner constructs the prompt from the stale failure log, a relevant test
snippet, and the changed production-code snippet. It stores the prompt, model
response, and usage data as local artifacts when executed, but those raw
artifacts are intentionally not committed in this compact report PR.

The model repaired the stale snapshots by preserving the issue detail and
updating the expected message to `<=2 items`.

Validation:

```bash
pnpm vitest run packages/zod/src/v4/classic/tests/tuple.test.ts --config vitest.config.ts
```

Result:

- Test files: `2 passed`
- Tests: `14 passed`
- Type errors: none

## Signal Check

I compared the LLM/oracle-style repair against a deliberately weakened repair
that only checks failure and `ZodError`, dropping the detailed `code`,
`maximum`, `inclusive`, and message assertions.

Both repairs pass the target tuple test. Their coverage totals are also
identical:

| Variant | Lines | Statements | Branches | Functions |
| --- | ---: | ---: | ---: | ---: |
| LLM/oracle repair | 14.00% | 13.10% | 4.13% | 8.05% |
| Weak repair | 14.00% | 13.10% | 4.13% | 8.05% |

Focused mutation testing on the changed production line separates the two
repairs:

| Variant | Mutants | Killed | Survived |
| --- | ---: | ---: | ---: |
| LLM/oracle repair | 3 | 3 | 0 |
| Weak repair | 3 | 0 | 3 |

## Verdict

This small case shows the intended distinction:

- Coverage is automatable, but too coarse to judge whether the repaired test
  still checks the changed error detail.
- Focused mutation testing is a stronger automatic signal for whether the test
  repair preserves the intended behavior check.
