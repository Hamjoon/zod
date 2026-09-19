let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.check', function(done) {
        // Define a simple custom check function
        const customFn = function(value) {
            // For testing purposes, just return true for any input
            return true;
        };

        // Invoke the zod.z.check method with the custom function
        const result = zod.z.check(customFn);

        // Verify that the result is an object
        assert.ok(result, 'zod.z.check should return an object');

        // Verify that the internal _zod.check property is set to the provided function
        assert.ok(result._zod, 'Result should have a _zod property');
        assert.strictEqual(result._zod.check, customFn, 'The _zod.check property should reference the original function');

        // Optionally, ensure that the returned object has the expected type identifier
        // (based on the implementation, it should have a check property set to "custom")
        assert.strictEqual(result.check, "custom", 'The check type should be "custom"');

        done();
    });
});