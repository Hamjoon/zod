# Test smell rules used in the pilot (Phase 7, D4)

Two rules only, the paper's headline smells. Applied with `scripts/smells.ts` (TypeScript compiler API, no execution) to every structured LLM extraction (`generated/*.test.ts`) and to every dev test file at t (`packages/zod/src/v4/**/tests/*.test.ts`, 81 files). Conditional test logic and eager test are deferred to the full experiment.

**Test.** A call expression whose callee is rooted at the identifier `test` or `it` (plain `test(...)`, `it(...)`, `test.skip(...)`, `test.each(...)(...)` and similar) and that has at least one function argument (arrow function or function expression). The test body is the last function argument. `test.todo("...")` without a body is not a test. Tests are counted wherever they appear (inside `describe`, loops, or helpers) but only once each.

**Expect call.** A call expression whose callee is exactly the identifier `expect` (`expect(...)`). Calls of `expect.soft`, `expectTypeOf`, `assert` are not counted. An expect call carries an assertion message when it has a second argument (`expect(actual, "message")`, vitest's message form). Expect calls anywhere inside the test body count, including inside nested callbacks.

**Assertion roulette.** A test whose body contains 2 or more expect calls and where no expect call carries an assertion message.

**Magic number.** A test whose body contains at least one numeric literal (`NumericLiteral` or `BigIntLiteral`) other than `0`, `1`, `-1` (`-1` = unary minus applied to `1`; `0n`, `1n`, `-1n` likewise) located inside an expect chain, that is, inside the outermost expression built on an `expect(...)` call: the arguments of `expect(...)` itself and the arguments of every chained matcher (`expect(a).toBe(2)`, `expect(list).toHaveLength(3)`, `expect(f(5)).not.toEqual(...)`). Literals in the test body outside expect chains (setup values) do not count.

**Reported per file.** `test_count`, `expect_calls`, `assertion_roulette_tests` and share, `magic_number_tests` and share, `file_loc`, plus the per-test detail (name, line, expect calls, messages, magic literals).
