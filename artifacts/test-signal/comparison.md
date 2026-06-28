# Test Signal Comparison - llm-repair vs oracle-repair

## Coverage Delta

- lines: 41.53% vs 41.85% (-0.32)
- branches: 33.49% vs 33.98% (-0.49)
- functions: 44.44% vs 44.44% (+0)
- statements: 39.42% vs 39.71% (-0.29)

## Assertion Shape

- llm-repair: 2 relevant tests, 2 executable expects
- oracle-repair: 3 relevant tests, 3 executable expects

## Mutation Totals

- llm-repair: 11 killed, 10 survived, 4 no coverage
- oracle-repair: 19 killed, 4 survived, 2 no coverage

## Mutants Missed By llm-repair But Killed By oracle-repair

- line 663, BlockStatement, replacement `{}`: NoCoverage vs Killed
- line 664, StringLiteral, replacement `""`: NoCoverage vs Killed
- line 657, ConditionalExpression, replacement `false`: Survived vs Killed
- line 657, EqualityOperator, replacement `checks.length <= 0`: Survived vs Killed
- line 658, ConditionalExpression, replacement `false`: Survived vs Killed
- line 658, BlockStatement, replacement `{}`: Survived vs Killed
- line 662, BlockStatement, replacement `{}`: Survived vs Killed
- line 663, ConditionalExpression, replacement `false`: Survived vs Killed
