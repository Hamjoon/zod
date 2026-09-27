let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');   // Zod exports the `z` namespace directly

describe('test zod', function () {
    it('test zod.maxSize', function (done) {
        // create a string schema with a maximum length of 5 characters.
        // Provide a custom error message that includes the word "maxSize"
        // so the regex in the assertion can match it.
        const schema = z.string().max(5, { message: 'maxSize' });

        // A value whose length is exactly the limit should pass.
        assert.doesNotThrow(() => {
            schema.parse('hello'); // length 5
        }, 'Value with length 5 should not throw');

        // A value that exceeds the limit should throw an error.
        assert.throws(() => {
            schema.parse('hello!'); // length 6 > 5
        }, /maxSize/, 'Value exceeding maxSize should throw');

        done();
    });
});