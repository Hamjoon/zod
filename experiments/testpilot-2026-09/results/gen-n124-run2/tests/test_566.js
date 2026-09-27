let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.positive', function(done) {
        // Create a schema that only accepts positive numbers (> 0)
        const schema = zod.z.number().positive();

        // Should accept a positive number without throwing
        assert.doesNotThrow(() => schema.parse(42));

        // Zero is not positive – should throw a ZodError
        assert.throws(() => schema.parse(0));

        // Negative numbers are not positive – should throw a ZodError
        assert.throws(() => schema.parse(-7));

        // Non‑numeric values should also throw
        assert.throws(() => schema.parse('123'));

        done();
    });
});