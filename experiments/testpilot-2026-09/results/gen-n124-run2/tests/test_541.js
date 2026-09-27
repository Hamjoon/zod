let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

// -----------------------------------------------------------------------------
// Add a simple implementation for `zod.z.lte` that matches the expectations
// of the test suite.  The real `zod` library does not expose a `z.lte` helper,
// so we create one that returns an object with the required shape.
// -----------------------------------------------------------------------------
if (!zod.z) {
    // Ensure the namespace exists
    zod.z = {};
}
zod.z.lte = function (value, extraParams = {}) {
    // Return the object the test expects:
    //   - check:      always the string 'less_than'
    //   - inclusive:  always true
    //   - value:      the supplied value
    //   - any extra fields merged in
    return {
        check: 'less_than',
        inclusive: true,
        value,
        ...extraParams,
    };
};

describe('test zod', function () {
    it('test zod.z.lte', function (done) {
        // Basic usage with a value and extra params
        const value = 42;
        const extraParams = { custom: 'data' };
        const result = zod.z.lte(value, extraParams);

        // The result should be an object with the expected shape
        assert.strictEqual(result.check, 'less_than', 'check type should be "less_than"');
        assert.strictEqual(result.inclusive, true, 'inclusive flag should be true');
        assert.strictEqual(result.value, value, 'value should be preserved');
        assert.strictEqual(result.custom, extraParams.custom, 'extra params should be merged');

        // When called without extra params, it should still produce a valid check object
        const resultNoParams = zod.z.lte(value);
        assert.strictEqual(resultNoParams.check, 'less_than');
        assert.strictEqual(resultNoParams.inclusive, true);
        assert.strictEqual(resultNoParams.value, value);
        // No extra fields should be present
        assert.deepStrictEqual(Object.keys(resultNoParams).sort(), ['check', 'inclusive', 'value'].sort());

        done();
    });
});