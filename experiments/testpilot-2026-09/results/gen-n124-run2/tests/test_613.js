let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.size', function(done) {
        // Arrange: define size and custom params
        const size = 42;
        const params = { customKey: 'customValue' };

        // Act: call the function under test
        const result = zod.z.size(size, params);

        // Assert: result should be a Zod size‑equals check with the correct fields
        // The check type must be "size_equals"
        assert.strictEqual(result.check, 'size_equals', 'check type should be size_equals');

        // The size property must match the supplied size
        assert.strictEqual(result.size, size, 'size property should match the supplied size');

        // Any additional params should be merged onto the result (normalizeParams is a pass‑through for unknown keys)
        assert.strictEqual(result.customKey, params.customKey, 'custom params should be preserved');

        // The result should be an instance of the internal $ZodCheckSizeEquals class
        // We cannot import the class directly, but we can check the constructor name
        assert.ok(
            result.constructor && result.constructor.name === '$ZodCheckSizeEquals',
            'result should be an instance of $ZodCheckSizeEquals'
        );

        done();
    });
});