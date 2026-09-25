let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.promise', function (done) {
    // Use the Zod `promise` helper instead of a non‑existent `.promise()` method
    const stringPromise = zod.promise(zod.string());

    // First, a successful validation of a Promise that resolves to a string
    stringPromise
      .parse(Promise.resolve('hello'))
      .then((value) => {
        assert.strictEqual(value, 'hello');

        // Then, attempt to validate a Promise that resolves to a number (should fail)
        return stringPromise.parse(Promise.resolve(123));
      })
      .then(() => {
        // If we get here, the validation incorrectly succeeded
        done(new Error('Expected validation to fail for non‑string value'));
      })
      .catch((err) => {
        // The error should be a ZodError for the invalid case
        if (err instanceof zod.ZodError) {
          done();
        } else {
          done(err);
        }
      });
  });
});