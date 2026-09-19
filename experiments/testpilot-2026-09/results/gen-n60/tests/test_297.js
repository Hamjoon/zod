let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.positive', function(done) {
        // Create a schema that only accepts positive numbers (> 0)
        const schema = zod.z.number().positive();

        // Valid case: a positive number should parse successfully
        const valid = 42;
        assert.strictEqual(schema.parse(valid), valid, 'Positive number should be accepted');

        // Invalid cases: zero and negative numbers should throw
        const invalidZero = 0;
        const invalidNegative = -7;

        assert.throws(
            () => schema.parse(invalidZero),
            /Number must be greater than 0/,
            'Zero should be rejected by .positive()'
        );

        assert.throws(
            () => schema.parse(invalidNegative),
            /Number must be greater than 0/,
            'Negative number should be rejected by .positive()'
        );

        done();
    });
});