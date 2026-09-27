let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.multipleOf', function(done) {
        // Arrange: define a value and some custom params
        const multipleValue = 7;
        const customParams = { message: 'must be a multiple of 7' };

        // Act: call the function under test
        const result = zod.z.multipleOf(multipleValue, customParams);

        // Assert: result should be an instance of the internal check class
        const CheckClass = zod.checks.$ZodCheckMultipleOf;
        assert.ok(result instanceof CheckClass, 'Result should be instance of $ZodCheckMultipleOf');

        // Assert: the check type should be "multiple_of"
        assert.strictEqual(result.check, 'multiple_of', 'Check type should be "multiple_of"');

        // Assert: the stored value should match the one we passed
        assert.strictEqual(result.value, multipleValue, 'Stored value should match the input value');

        // Assert: custom params should be merged (normalizeParams may copy them directly)
        // We only test that the custom message is present on the result
        assert.strictEqual(result.message, customParams.message, 'Custom message should be preserved');

        done();
    });
});