let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.string().max', function (done) {
    // Create a string schema that enforces a maximum length of 5
    // (using the current Zod API)
    const schema = zod.string().max(5);

    // A string of length exactly 5 should pass
    assert.doesNotThrow(() => schema.parse('abcde'));

    // A string longer than 5 should fail – check the ZodError code
    assert.throws(
      () => schema.parse('abcdef'),
      (err) => {
        // Ensure we got a ZodError and that the first issue is the "too_big" code
        return err instanceof zod.ZodError && err.errors[0].code === 'too_big';
      },
      'Expected a ZodError with code "too_big" for strings longer than 5 characters'
    );

    done();
  });
});