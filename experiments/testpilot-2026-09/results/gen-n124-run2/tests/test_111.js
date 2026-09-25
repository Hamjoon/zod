let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test suite', function() {
    it('test case', function(done) {
        // Example: validate a simple schema with Zod
        const schema = zod.object({
            name: zod.string(),
            age: zod.number().int().positive()
        });

        const data = { name: 'Alice', age: 30 };
        const result = schema.safeParse(data);

        // Ensure the validation succeeded
        assert.strictEqual(result.success, true, 'Zod validation should succeed');

        // If you reach this point, the test passed
        done();
    });
});