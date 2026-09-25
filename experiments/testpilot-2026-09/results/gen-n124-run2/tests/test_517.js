let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.superRefine', function (done) {
    // Build a schema that is nullable, then uses superRefine to enforce non‑null,
    // and a subsequent refine to enforce a specific value.
    const schema = zod
      .object({
        first: zod.string(),
        second: zod.number(),
      })
      .nullable()
      .superRefine((arg, ctx) => {
        // If the value is null/undefined we add a custom issue.
        if (arg === null || arg === undefined) {
          ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: 'object should exist',
          });
        }
        // No return value – superRefine expects a void function.
      })
      // At this point TypeScript would know arg is not null, but at runtime we still
      // need to guard against it.
      .refine(
        (arg) => arg && arg.first === 'bob',
        {
          message: '`first` is not `bob`',
        }
      );

    // 1. Parsing null should fail with our custom message.
    try {
      schema.parse(null);
      // If we get here, the test should fail.
      assert.fail('Parsing null should have thrown');
    } catch (e) {
      // Zod throws a ZodError; ensure it contains our custom issue.
      assert(e instanceof zod.ZodError, 'Error should be a ZodError');
      const messages = e.errors.map((err) => err.message);
      assert(
        messages.includes('object should exist'),
        'Missing custom issue for null'
      );
    }

    // 2. Parsing an object with wrong `first` value should fail with the refine message.
    try {
      schema.parse({ first: 'alice', second: 42 });
      assert.fail('Parsing object with wrong `first` should have thrown');
    } catch (e) {
      assert(e instanceof zod.ZodError, 'Error should be a ZodError');
      const messages = e.errors.map((err) => err.message);
      assert(
        messages.includes('`first` is not `bob`'),
        'Missing refine issue for wrong `first`'
      );
    }

    // 3. Parsing a correct object should succeed.
    const result = schema.parse({ first: 'bob', second: 123 });
    assert.deepStrictEqual(result, { first: 'bob', second: 123 });

    done();
  });
});