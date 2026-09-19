let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.minLength', function(done) {
        // Test with only the minimum argument
        const checkOnlyMin = zod.z.minLength(5);
        assert.strictEqual(checkOnlyMin.check, "min_length", "check type should be 'min_length'");
        assert.strictEqual(checkOnlyMin.minimum, 5, "minimum should be set to the provided value");
        // No extra params should be present (except internal ones like _type if any)
        // Ensure that the object does not have an unexpected 'message' property
        assert.strictEqual(checkOnlyMin.message, undefined, "message should be undefined when not provided");

        // Test with additional params (e.g., a custom message)
        const customMessage = "Value is too short";
        const checkWithParams = zod.z.minLength(3, { message: customMessage });
        assert.strictEqual(checkWithParams.check, "min_length", "check type should still be 'min_length'");
        assert.strictEqual(checkWithParams.minimum, 3, "minimum should reflect the provided value");
        assert.strictEqual(checkWithParams.message, customMessage, "custom message should be preserved");

        // Ensure the returned objects are plain objects (not null/undefined)
        assert.ok(checkOnlyMin && typeof checkOnlyMin === 'object', "Returned check should be an object");
        assert.ok(checkWithParams && typeof checkWithParams === 'object', "Returned check should be an object");

        done();
    });
});