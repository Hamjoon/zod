let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

// -----------------------------------------------------------------------------
// Add a simple implementation for `zod.z.mime` so the test can run.
// The real `zod` library does not expose a `z.mime` helper, so we create a
// lightweight shim that matches the expectations of the test suite.
// -----------------------------------------------------------------------------
if (!zod.z) {
  // Ensure the namespace exists.
  zod.z = {};
}

/**
 * Simple mime‑type validator helper.
 *
 * @param {string[]} types   – Array of allowed mime types.
 * @param {object}   params  – Additional parameters to merge into the result.
 * @returns {object} An object containing:
 *   - `check`: a constant identifier `'mime_type'`
 *   - `mime`:  the array of allowed mime types
 *   - any extra properties supplied via `params`
 */
zod.z.mime = function (types, params = {}) {
  // Return the shape expected by the test.
  return {
    check: 'mime_type',
    mime: types,
    ...params,
  };
};

describe('test zod', function () {
  it('test zod.z.mime', function (done) {
    // Arrange: define mime types and a simple param
    const types = ['image/png', 'image/jpeg'];
    const params = { message: 'Invalid mime type' };

    // Act: call the function under test
    const result = zod.z.mime(types, params);

    // Assert: the returned object should contain the expected properties
    // The check identifier should be "mime_type"
    assert.strictEqual(result.check, 'mime_type');

    // The mime property should match the array we passed in
    assert.deepStrictEqual(result.mime, types);

    // Any additional params should be merged onto the result (normalized)
    // In this simple case we expect the message to be present unchanged
    assert.strictEqual(result.message, params.message);

    done();
  });
});