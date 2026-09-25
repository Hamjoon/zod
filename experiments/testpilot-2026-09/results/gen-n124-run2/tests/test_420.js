let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.optional', function(done) {
        // Create an optional string schema
        const inner = zod.z.string();
        const optionalSchema = zod.z.optional(inner);

        // Verify the returned object is a ZodOptional and holds the correct inner type
        assert(optionalSchema instanceof zod.ZodOptional, 'Result should be an instance of ZodOptional');
        assert.strictEqual(optionalSchema._def.type, 'optional', 'Definition type should be "optional"');
        assert.strictEqual(optionalSchema._def.innerType, inner, 'Inner type should be the original string schema');

        // Parsing undefined should succeed and return undefined
        const parsedUndefined = optionalSchema.parse(undefined);
        assert.strictEqual(parsedUndefined, undefined, 'Parsing undefined should return undefined');

        // Parsing a valid string should succeed and return the string
        const parsedString = optionalSchema.parse('hello world');
        assert.strictEqual(parsedString, 'hello world', 'Parsing a valid string should return the same string');

        // Parsing null should succeed and return null (optional only makes the value optional,
        // it does not reject null – null is treated as a valid value for the inner schema)
        const parsedNull = optionalSchema.parse(null);
        assert.strictEqual(parsedNull, null, 'Parsing null should return null');

        done();
    });
});