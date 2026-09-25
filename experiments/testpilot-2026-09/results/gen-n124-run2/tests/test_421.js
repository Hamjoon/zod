let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.optional', function(done) {
        // create an optional string schema
        const schema = zod.optional(zod.string());

        // the schema should be a ZodOptional with the correct inner type
        assert.strictEqual(schema._def.type, 'optional');
        assert(schema._def.innerType instanceof zod.ZodString);

        // parsing undefined (or missing) should succeed and return undefined
        assert.strictEqual(schema.parse(undefined), undefined);

        // parsing a valid string should succeed and return the string
        assert.strictEqual(schema.parse('hello world'), 'hello world');

        // parsing an invalid type should throw a ZodError
        assert.throws(() => schema.parse(123), /Expected string, received number/);

        done();
    });
});