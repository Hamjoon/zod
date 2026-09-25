let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.string().endsWith', function (done) {
    // ---- valid case -------------------------------------------------
    const schema = zod.string().endsWith('.com');
    assert.doesNotThrow(() => schema.parse('example.com'));

    // ---- invalid case – default message -------------------------------
    try {
      schema.parse('example.org');
      assert.fail('Expected a ZodError for a non‑matching suffix');
    } catch (e) {
      // Zod v3 stores validation problems in `issues` (older versions used `errors`);
      const issue = (e.errors && e.errors[0]) || (e.issues && e.issues[0]);
      assert(e instanceof zod.ZodError, 'Error should be a ZodError');
      // The validation identifier is still `validation` for string checks.
      assert.strictEqual(issue.validation, 'endsWith', 'Validation type should be endsWith');
    }

    // ---- invalid case – custom message --------------------------------
    const customSchema = zod.string().endsWith('.net', { message: 'Only .net allowed' });
    try {
      customSchema.parse('example.com');
      assert.fail('Expected a ZodError for a custom‑message failure');
    } catch (e) {
      const issue = (e.errors && e.errors[0]) || (e.issues && e.issues[0]);
      assert(e instanceof zod.ZodError, 'Error should be a ZodError');
      assert.strictEqual(issue.message, 'Only .net allowed', 'Custom error message should be used');
    }

    done();
  });
});