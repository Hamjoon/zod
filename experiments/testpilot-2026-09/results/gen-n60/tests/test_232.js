let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // import the Zod namespace correctly

describe('test zod', function () {
    it('test zod.negative', function (done) {
        // Create a schema that only accepts negative numbers
        const schema = z.number().negative();

        // Should accept a negative number without throwing
        assert.doesNotThrow(() => {
            const result = schema.parse(-42);
            assert.strictEqual(result, -42);
        });

        // Zero is not negative – should throw a validation error
        assert.throws(() => {
            schema.parse(0);
        });

        // Positive numbers are not allowed – should throw a validation error
        assert.throws(() => {
            schema.parse(7);
        });

        // Non‑numeric values should also cause a validation error
        assert.throws(() => {
            schema.parse('not a number');
        });

        done();
    });
});