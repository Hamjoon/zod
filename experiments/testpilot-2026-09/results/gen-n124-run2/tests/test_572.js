const mocha = require('mocha');
const assert = require('assert');
const { z } = require('zod'); // import the Zod namespace correctly

describe('test zod', function () {
    it('test zod.z.negative', function (done) {
        // Create a schema that only accepts negative numbers
        const schema = z.number().negative();

        // Positive test: a negative number should pass validation
        assert.strictEqual(schema.parse(-42), -42);

        // Negative tests: zero and positive numbers should fail validation
        // Zod throws a ZodError with a message that includes "Number must be less than 0"
        assert.throws(() => schema.parse(0), /Number must be less than 0/);
        assert.throws(() => schema.parse(7), /Number must be less than 0/);

        done();
    });
});