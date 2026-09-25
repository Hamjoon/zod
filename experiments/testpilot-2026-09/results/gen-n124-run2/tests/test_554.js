let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.gte', function(done) {
        // Create a schema that validates numbers >= 5
        const schema = zod.z.gte(5);

        // Helper to run validation using either .validate or .parse
        const runValidation = (value) => {
            if (typeof schema.validate === 'function') {
                // Older Zod API
                return schema.validate(value);
            } else if (typeof schema.parse === 'function') {
                // Newer Zod API
                return schema.parse(value);
            } else {
                throw new Error('No known validation method on schema');
            }
        };

        // Values that should pass
        assert.doesNotThrow(() => runValidation(5), '5 should be valid (equal to 5)');
        assert.doesNotThrow(() => runValidation(10), '10 should be valid (greater than 5)');

        // Values that should fail
        assert.throws(() => runValidation(4), /.+/, '4 should be invalid (less than 5)');

        done();
    });
});