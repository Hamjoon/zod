let mocha = require('mocha');
let assert = require('assert');
let { z, ZodError } = require('zod'); // import the schema builder and the error class

describe('test zod', function () {
    it('test z.uint32', function (done) {
        // Create the uint32 schema
        const schema = z.uint32();

        // Valid values should parse without throwing
        assert.doesNotThrow(() => schema.parse(0));
        assert.doesNotThrow(() => schema.parse(123));
        assert.doesNotThrow(() => schema.parse(4294967295));

        // Invalid values should throw a ZodError instance
        assert.throws(() => schema.parse(-1), ZodError);
        assert.throws(() => schema.parse(4294967296), ZodError);
        assert.throws(() => schema.parse('123'), ZodError);
        assert.throws(() => schema.parse(null), ZodError);
        assert.throws(() => schema.parse(undefined), ZodError);
        assert.throws(() => schema.parse(NaN), ZodError);
        assert.throws(() => schema.parse(Infinity), ZodError);

        done();
    });
});