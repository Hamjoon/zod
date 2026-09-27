const mocha = require('mocha');
const assert = require('assert');
const { z } = require('zod');   // import the Zod namespace

describe('test zod', function () {
    it('test zod.string().trim()', function (done) {
        // Create a string schema that automatically trims leading/trailing whitespace
        const schema = z.string().trim();

        // Valid case – no surrounding whitespace
        assert.doesNotThrow(() => schema.parse('hello'));

        // The .trim() transformer removes whitespace, so parsing should succeed
        // and the returned value should be the trimmed string.
        assert.strictEqual(schema.parse(' hello'), 'hello');
        assert.strictEqual(schema.parse('hello '), 'hello');
        assert.strictEqual(schema.parse('  hello  '), 'hello');

        done();
    });
});