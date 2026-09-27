let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.overwrite', function (done) {
    // Prepare a simple transaction object
    const tx = { id: 123, amount: 1000, status: 'pending' };

    // Call the overwrite function – it should return a Zod wrapper (or the same object)
    let result;
    try {
      result = zod.z.overwrite(tx);
    } catch (err) {
      // If the function throws, the test should fail
      assert.fail('zod.z.overwrite threw an error: ' + err);
    }

    // Basic sanity checks
    assert.ok(result !== undefined, 'Result should be defined');

    // The function returns a Zod wrapper object.  In most Zod versions the
    // underlying plain value can be obtained via `.value` or `.toJSON()`.
    // We fall back to the raw result if neither accessor exists.
    const plainResult =
      typeof result.value === 'function'
        ? result.value()
        : typeof result.value !== 'undefined'
        ? result.value
        : typeof result.toJSON === 'function'
        ? result.toJSON()
        : result;

    // Now compare the plain representation with the original transaction.
    assert.deepStrictEqual(
      plainResult,
      tx,
      'Result (plain value) should equal the input transaction object'
    );

    done();
  });
});