let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.minLength', function(done) {
        // Create a string validator that requires a minimum length of 3
        const validator = zod.string().check(zod.minLength(3));

        // A value that meets the minimum length should NOT throw
        assert.doesNotThrow(() => {
            validator('abc');   // exactly 3 characters
            validator('hello world'); // longer than 3
        });

        // Values shorter than the minimum length should throw
        assert.throws(() => {
            validator('ab'); // 2 characters, below the limit
        });

        // Also test edge case: empty string should fail
        assert.throws(() => {
            validator(''); // length 0
        });

        done();
    });
});