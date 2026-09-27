let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');   // import the Zod namespace

describe('test zod', function () {
    it('test zod.z.trim', function (done) {
        // Obtain the trim validator from Zod.
        // In Zod you create a string schema and call .trim() on it.
        const trimValidator = z.string().trim();

        // Test that it correctly trims whitespace from a string
        const input = '   hello world   ';
        const expected = 'hello world';

        // .parse() runs the validation / transformation
        const result = trimValidator.parse(input);

        assert.strictEqual(result, expected);
        done();
    });
});