let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.keyof', function(done) {
        // Define an object schema with known keys
        const schema = zod.object({
            foo: zod.string(),
            bar: zod.number(),
        });

        // Use the static `z.keyof` helper to get a ZodEnum of the keys
        const keysEnum = zod.z.keyof(schema);

        // Verify that the returned schema is indeed a ZodEnum
        // (use instanceof check instead of accessing the internal _def.typeName)
        assert(keysEnum instanceof zod.ZodEnum, 'keysEnum should be an instance of ZodEnum');

        // Valid keys should parse successfully
        assert.strictEqual(keysEnum.parse('foo'), 'foo');
        assert.strictEqual(keysEnum.parse('bar'), 'bar');

        // Invalid keys should throw a validation error
        assert.throws(() => keysEnum.parse('baz'), /Invalid enum value/);

        done();
    });
});