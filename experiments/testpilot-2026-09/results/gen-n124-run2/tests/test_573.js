let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.negative', function(done) {
        // Create a schema that only accepts negative numbers
        const schema = zod.z.number().negative();

        // Valid case: a negative number should pass and be returned unchanged
        const valid = schema.parse(-42);
        assert.strictEqual(valid, -42, 'Negative number should be accepted');

        // Invalid cases: zero and positive numbers should throw a ZodError
        assert.throws(() => schema.parse(0), /Invalid|negative/, 'Zero should be rejected');
        assert.throws(() => schema.parse(7), /Invalid|negative/, 'Positive number should be rejected');

        done();
    });
});