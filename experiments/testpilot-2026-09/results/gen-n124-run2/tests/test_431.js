let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nullish', function(done) {
        // Build a schema that accepts a string or null/undefined
        const schema = zod.z.string().nullish();

        // Valid cases
        assert.strictEqual(schema.parse('hello'), 'hello');
        assert.strictEqual(schema.parse(null), null);
        assert.strictEqual(schema.parse(undefined), undefined);

        // Invalid case – should throw a ZodError
        assert.throws(() => schema.parse(123), zod.z.ZodError);

        done();
    });
});