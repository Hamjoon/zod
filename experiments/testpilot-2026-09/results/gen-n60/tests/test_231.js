let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.negative', function(done) {
        // Create a schema that only accepts negative numbers
        const negativeNumber = zod.number().negative();

        // Positive case: a valid negative number should parse successfully
        const valid = negativeNumber.parse(-42);
        assert.strictEqual(valid, -42, 'Negative number should be parsed unchanged');

        // Edge case: zero is not negative, should throw
        assert.throws(
            () => negativeNumber.parse(0),
            (err) => err instanceof zod.ZodError,
            'Zero should not satisfy .negative()'
        );

        // Positive case: a positive number should also throw
        assert.throws(
            () => negativeNumber.parse(123),
            (err) => err instanceof zod.ZodError,
            'Positive number should not satisfy .negative()'
        );

        // Non-number input should also throw (type error)
        assert.throws(
            () => negativeNumber.parse('not a number'),
            (err) => err instanceof zod.ZodError,
            'Non-number input should not satisfy .negative()'
        );

        done();
    });
});