# Test Signal Evaluation - oracle-repair

- test source: `hamjoon/repair/object-extend-refinement-test`
- test file: `packages/zod/src/v4/classic/tests/object.test.ts`
- production file: `packages/zod/src/v4/core/util.ts`

## Coverage

- lines: 131/313 (41.85%)
- branches: 70/206 (33.98%)
- functions: 40/90 (44.44%)

## Assertion Shape

- relevant tests: 3
- executable expects: 3

### extend() on object with refinements should allow adding non-overlapping properties

- expects: 1
- matchers: not.toThrow

### extend() on object with refinements should still reject overlapping keys

- expects: 1
- matchers: toThrow

### safeExtend() on object with refinements should not throw

- expects: 1
- matchers: not.toThrow

## Mutation

- killed: 19
- survived: 4
- no coverage: 2
- timeout: 0
