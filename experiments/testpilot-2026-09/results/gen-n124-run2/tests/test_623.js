let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.maxLength', function(done) {
        // Create a string schema that enforces a maximum length of 5
        const schema = zod.string().check(zod.maxLength(5));

        // A string of length exactly 5 should pass
        assert.doesNotThrow(() => schema.parse('abcde'));

        // A string longer than 5 should fail
        assert.throws(() => schema.parse('abcdef'), /max_length/);

        done();
    });
});