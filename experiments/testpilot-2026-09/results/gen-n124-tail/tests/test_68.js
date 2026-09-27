let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.safeParse', function(done) {
        // Define a simple schema
        const schema = zod.object({
            name: zod.string(),
            age: zod.number().int()
        });

        // Successful parse
        const successResult = schema.safeParse({ name: 'Alice', age: 30 });
        assert.strictEqual(successResult.success, true, 'Expected parse to succeed');
        assert.deepStrictEqual(successResult.data, { name: 'Alice', age: 30 }, 'Parsed data does not match');

        // Failing parse
        const failureResult = schema.safeParse({ name: 'Bob', age: 'not-a-number' });
        assert.strictEqual(failureResult.success, false, 'Expected parse to fail');
        assert.ok(failureResult.error, 'Error object should be present on failure');

        done();
    });
});