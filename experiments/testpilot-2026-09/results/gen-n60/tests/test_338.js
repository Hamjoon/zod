let mocha = require('mocha');
let assert = require('assert');
let { z, ZodError } = require('zod');

describe('test zod', function () {
    it('test zod.z.coerce.number', function (done) {
        const schema = z.coerce.number();

        // Valid coercions from string to number
        assert.strictEqual(schema.parse('42'), 42);
        assert.strictEqual(schema.parse('3.14'), 3.14);

        // Passing a number should return the same number
        assert.strictEqual(schema.parse(10), 10);

        // Empty string is coerced to 0 by Number(''), so we expect 0
        assert.strictEqual(schema.parse(''), 0);

        // Invalid coercions should throw a ZodError
        assert.throws(() => schema.parse('abc'), ZodError);
        assert.throws(() => schema.parse(true), ZodError);
        assert.throws(() => schema.parse(null), ZodError);
        assert.throws(() => schema.parse(undefined), ZodError);

        done();
    });
});