let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.minLength', function(done) {
        // Create a string schema that enforces a minimum length of 5
        const schema = zod.string().check(zod.z.minLength(5));

        // A string with length >= 5 should pass without throwing
        assert.doesNotThrow(() => {
            schema.parse('hello'); // length 5
        }, 'Expected valid string to not throw');

        // A string with length < 5 should throw a validation error
        assert.throws(() => {
            schema.parse('hi'); // length 2
        }, /min_length/, 'Expected validation error for short string');

        done();
    });
});