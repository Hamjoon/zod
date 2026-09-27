let mocha = require('mocha');
let assert = require('assert');
let { z, ZodError } = require('zod');

describe('test zod', function () {
  it('test zod.string().includes', function (done) {
    // Basic includes check – should pass
    const schema = z.string().includes('tuna');
    assert.strictEqual(schema.parse('I love tuna sandwiches'), 'I love tuna sandwiches');

    // Basic includes check – should fail
    try {
      schema.parse('I love salmon');
      assert.fail('Expected a ZodError to be thrown for missing substring');
    } catch (e) {
      // Ensure a ZodError was thrown
      assert(e instanceof ZodError, 'Error should be an instance of ZodError');
      // Default error message is "Invalid input"
      // Guard against unexpected shape of the error object
      if (e.errors && e.errors.length > 0) {
        assert.strictEqual(e.errors[0].message, 'Invalid input');
      } else {
        // If for some reason the errors array is missing, fail the test explicitly
        assert.fail('ZodError did not contain an errors array');
      }
    }

    // Includes with a custom message – should fail with that message
    const schemaWithMsg = z.string().includes('tuna', { message: 'Must include tuna' });
    try {
      schemaWithMsg.parse('no fish here');
      assert.fail('Expected a ZodError to be thrown for missing substring with custom message');
    } catch (e) {
      assert(e instanceof ZodError, 'Error should be an instance of ZodError');
      if (e.errors && e.errors.length > 0) {
        assert.strictEqual(e.errors[0].message, 'Must include tuna');
      } else {
        assert.fail('ZodError did not contain an errors array');
      }
    }

    done();
  });
});