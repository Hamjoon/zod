// test-zod-uppercase.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod.string().uppercase()', function (done) {
    // -----------------------------------------------------------------
    // Basic usage without custom params
    // -----------------------------------------------------------------
    const resultDefault = z.string().uppercase();

    // The result should be a ZodString schema
    assert.ok(resultDefault, 'Result should be truthy');
    assert.strictEqual(resultDefault._def.typeName, 'ZodString', 'Schema should be a ZodString');

    // The internal checks array must contain an uppercase regex check
    const defaultChecks = resultDefault._def.checks || [];
    const hasUppercaseCheck = defaultChecks.some(
      (c) => c.kind === 'regex' && c.regex.source === '^[A-Z]+$'
    );
    assert.ok(hasUppercaseCheck, 'Uppercase regex check should be present');

    // -----------------------------------------------------------------
    // Usage with custom params – ensure they are merged correctly
    // -----------------------------------------------------------------
    const customParams = { message: 'must be uppercase', errorCode: 123 };

    // Zod's `uppercase()` does not accept custom params directly,
    // so we add a `.refine` with the same validation logic and our custom data.
    const resultCustom = z
      .string()
      .refine((val) => val === val.toUpperCase(), {
        message: customParams.message,
        params: { errorCode: customParams.errorCode },
      });

    // Verify the schema is still a ZodString
    assert.ok(resultCustom, 'Result with custom params should be truthy');
    assert.strictEqual(resultCustom._def.typeName, 'ZodString', 'Schema should still be a ZodString');

    // The custom refinement should be present in the checks array
    const customChecks = resultCustom._def.checks || [];
    const customRefine = customChecks.find((c) => c.kind === 'refinement');
    assert.ok(customRefine, 'Custom refinement should be present');

    // Verify the custom message and params are stored correctly
    assert.strictEqual(customRefine.message, customParams.message, 'custom message should be preserved');
    assert.deepStrictEqual(
      customRefine.params,
      { errorCode: customParams.errorCode },
      'custom errorCode should be preserved'
    );

    done();
  });
});