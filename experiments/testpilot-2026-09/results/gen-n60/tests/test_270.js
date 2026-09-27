// test-zod-maxSize.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod.maxSize', function () {
    // Create a maxSize check with a custom message
    const maxSizeCheck = z.maxSize(5, { message: 'Too many items' });

    // The check should expose the expected properties.
    assert.strictEqual(maxSizeCheck.check, 'max_size', 'check type should be "max_size"');
    assert.strictEqual(maxSizeCheck.maximum, 5, 'maximum should be the value passed to maxSize');
    assert.strictEqual(maxSizeCheck.message, 'Too many items', 'custom param should be preserved');

    // Verify that the check works when attached to a schema.
    // For strings, maxSize is exposed via the .max() shortcut.
    const schema = z.string().max(5);

    // Valid case (length 5)
    const resultOk = schema.safeParse('abcde');
    assert.strictEqual(resultOk.success, true, 'String of length 5 should pass maxSize(5)');

    // Invalid case (length 6)
    const resultFail = schema.safeParse('abcdef');
    assert.strictEqual(resultFail.success, false, 'String of length 6 should fail maxSize(5)');

    // The error message should indicate a max_size violation.
    const errorMessage = resultFail.error.errors[0].message;
    assert.ok(
      /max_size/.test(errorMessage),
      'Error message should indicate a max_size violation'
    );
  });
});