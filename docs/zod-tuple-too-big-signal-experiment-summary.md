# Zod Tuple Too-Big Signal Experiment

This PR records a small end-to-end experiment for automatically checking whether
a test repair preserves the intended test signal.

## Case

- Baseline `t`: `7abe4e51` (`ae68f62f^`)
- Maintainer repair `t+1`: `ae68f62f` (`fix: Fix error details for tuples with extraneous elements (#5555)`)
- Production file: `packages/zod/src/v4/core/schemas.ts`
- Test file: `packages/zod/src/v4/classic/tests/tuple.test.ts`

The production change adds `inclusive: true` to tuple `too_big` issues. This
changes the English error message for a length-2 tuple receiving a length-3
array from:

```text
Too big: expected array to have <2 items
```

to:

```text
Too big: expected array to have <=2 items
```

## Stale Fixture

The fixture applies only the production change from `t+1` onto `t`. With the old
tests, the target tuple test fails with two snapshot mismatches:

- `successful validation`
- `async validation`

Artifact:

- `artifacts/gptoss-tuple-too-big-repair/stale-failure.log`

## LLM Repair

- Provider: OpenRouter
- Model: `openai/gpt-oss-120b`
- Mode: single-shot prompt
- Temperature: `0`
- Prompt: `artifacts/gptoss-tuple-too-big-repair/gptoss-prompt.md`
- Response: `artifacts/gptoss-tuple-too-big-repair/gptoss-response.md`
- Usage: `artifacts/gptoss-tuple-too-big-repair/gptoss-usage.json`

The model repaired the two stale snapshots by adding `inclusive: true` and
updating the message to `<=2 items`. The returned hunk header was not directly
`git apply`-able, but the content matched the maintainer repair and was applied
unchanged.

Validation:

```bash
pnpm vitest run packages/zod/src/v4/classic/tests/tuple.test.ts --config vitest.config.ts
```

Result:

- Test files: `2 passed`
- Tests: `14 passed`
- Type errors: none

Artifact:

- `artifacts/gptoss-tuple-too-big-repair/validation.log`

## Signal Comparison

Two passing repairs were compared:

- `current`: the LLM/oracle repair, preserving the full snapshot detail
- `weak-repair`: a deliberately weakened repair that only checks failure and
  `ZodError`, dropping the `code`, `maximum`, `inclusive`, and message signal

Both variants pass target validation.

### Coverage

Vitest v8 coverage produced identical totals for both variants:

| Variant | Lines | Statements | Branches | Functions |
| --- | ---: | ---: | ---: | ---: |
| `current` | 14.00% | 13.10% | 4.13% | 8.05% |
| `weak-repair` | 14.00% | 13.10% | 4.13% | 8.05% |

Interpretation: coverage confirms both repairs execute the same code, but it
does not distinguish whether the test still checks the changed error detail.

### StrykerJS

StrykerJS was run against only the changed production line:

```text
packages/zod/src/v4/core/schemas.ts:2537-2537
```

That range produced three mutants:

- `ObjectLiteral`: replace the `too_big` issue object with `{}`
- `StringLiteral`: replace `"too_big"` with `""`
- `BooleanLiteral`: replace `inclusive: true` with `inclusive: false`

Mutation results:

| Variant | Mutants | Killed | Survived | Score |
| --- | ---: | ---: | ---: | ---: |
| `current` | 3 | 3 | 0 | 100% |
| `weak-repair` | 3 | 0 | 3 | 0% |

Artifacts:

- `artifacts/tuple-too-big-signal/current/summary.json`
- `artifacts/tuple-too-big-signal/weak-repair/summary.json`
- `artifacts/tuple-too-big-signal/current/stryker/mutation.json`
- `artifacts/tuple-too-big-signal/weak-repair/stryker/mutation.json`

## Verdict

This case shows the intended distinction:

- Coverage is automatable but too coarse for this signal.
- StrykerJS mutation killed-set comparison detects the weakened repair.

For this small case, mutation testing is the stronger automatic signal for
whether the repaired test still protects the changed behavior.
