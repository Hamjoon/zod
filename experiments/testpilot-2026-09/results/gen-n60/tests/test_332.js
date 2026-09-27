// test/zod-parseAsync.test.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z, ZodError } = require('zod');

describe('test zod', function () {
  it('test zod.parseAsync', async function () {
    // Define a schema with an asynchronous refinement
    const schema = z
      .string()
      .refine(
        async (val) => {
          // Simulate async work (e.g., a DB lookup)
          await new Promise((r) => setTimeout(r, 10));
          return val === 'hello';
        },
        { message: 'must be hello' }
      );

    // ---- Valid value -------------------------------------------------
    const valid = await schema.parseAsync('hello');
    assert.strictEqual(valid, 'hello');

    // ---- Invalid value ------------------------------------------------
    await assert.rejects(
      async () => {
        await schema.parseAsync('world');
      },
      (err) => {
        // Ensure the error is a ZodError with the correct message
        assert(err instanceof ZodError);
        // In recent Zod versions the array is called `issues`
        const issue = err.issues?.[0];
        assert(issue, 'Expected at least one validation issue');
        assert.strictEqual(issue.message, 'must be hello');
        return true; // indicate that the rejection matches our expectations
      }
    );
  });
});