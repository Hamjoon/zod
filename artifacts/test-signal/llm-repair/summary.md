# Test Signal Evaluation - llm-repair

- test source: `current`
- test file: `packages/zod/src/v4/classic/tests/object.test.ts`
- production file: `packages/zod/src/v4/core/util.ts`

## Coverage

- lines: 130/313 (41.53%)
- branches: 69/206 (33.49%)
- functions: 40/90 (44.44%)

## Assertion Shape

- relevant tests: 2
- executable expects: 2

### extend() on object with refinements should not throw when adding new keys

- expects: 1
- matchers: not.toThrow

### safeExtend() on object with refinements should not throw

- expects: 1
- matchers: not.toThrow

## Mutation

- killed: 11
- survived: 10
- no coverage: 4
- timeout: 0
