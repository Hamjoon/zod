let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.pipe', async function () {
    // ----- Sync pipe test -----
    // Transform a string into its length, then enforce a minimum number via pipe
    const lengthSchema = zod.z
      .string()
      .transform((val) => val.length)
      .pipe(zod.z.number().min(5));

    // Valid input: length is 5 (meets min(5))
    const resultValid = await lengthSchema.parseAsync('hello');
    assert.strictEqual(resultValid, 5, 'Expected length 5 for "hello"');

    // Invalid input: length is 2 (fails min(5))
    try {
      await lengthSchema.parseAsync('hi');
      // If we get here, the test should fail
      assert.fail('Expected validation error for short string');
    } catch (e) {
      // Zod throws a ZodError; use `issues` (not `errors`) to inspect problems
      assert.ok(
        e.issues.some(
          (issue) => issue.code === 'too_small' && issue.minimum === 5
        ),
        'Expected a "too_small" error with minimum 5'
      );
    }

    // ----- Async pipe test -----
    // First schema: string, then pipe into an async transform that upper‑cases the string
    const asyncUpperCase = zod.z
      .string()
      .pipe(zod.z.transform(async (val) => val.toUpperCase()));

    const asyncResult = await asyncUpperCase.parseAsync('test');
    assert.strictEqual(asyncResult, 'TEST', 'Async pipe should convert to upper case');

    // Ensure that the pipe works with a second schema that validates the transformed value
    const asyncValidated = zod.z
      .string()
      .pipe(
        zod.z
          .transform(async (val) => val.toUpperCase())
          .pipe(zod.z.string().regex(/^HELLO$/))
      );

    const finalResult = await asyncValidated.parseAsync('hello');
    assert.strictEqual(finalResult, 'HELLO', 'Combined async pipe should produce "HELLO"');

    // Invalid case for the combined async pipe
    try {
      await asyncValidated.parseAsync('world');
      assert.fail('Expected validation error for non‑matching string');
    } catch (e) {
      // Use `issues` to check the regex validation error
      assert.ok(
        e.issues.some(
          (issue) => issue.code === 'invalid_string' && issue.validation === 'regex'
        ),
        'Expected a regex validation error'
      );
    }
  });
});