let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.minLength', function(done) {
        // Create a string schema that requires a minimum length of 3
        const schema = zod.string().check(zod.minLength(3));

        // A value that satisfies the minimum length should not throw
        assert.doesNotThrow(() => {
            // Using parse (or safeParse) to trigger validation
            schema.parse('abc');
        }, 'Valid string of length 3 should not throw');

        // A value that is too short should throw a validation error
        assert.throws(() => {
            schema.parse('ab');
        }, /min_length/, 'String shorter than 3 should throw a min_length error');

        // Also test that a longer string passes
        assert.doesNotThrow(() => {
            schema.parse('longer string');
        }, 'String longer than the minimum should not throw');

        done();
    });
});