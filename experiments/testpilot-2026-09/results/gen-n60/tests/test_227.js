let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');

describe('test zod', function() {
    it('test zod.string.min', function(done) {
        // Create a string validator that requires a minimum length of 3
        const validator = z.string().min(3);

        // A value that meets the minimum length should NOT throw
        assert.doesNotThrow(() => {
            validator.parse('abc');           // exactly 3 characters
            validator.parse('hello world');  // longer than 3
        });

        // Values shorter than the minimum length should throw
        assert.throws(() => {
            validator.parse('ab'); // 2 characters, below the limit
        });

        // Also test edge case: empty string should fail
        assert.throws(() => {
            validator.parse(''); // length 0
        });

        done();
    });
});