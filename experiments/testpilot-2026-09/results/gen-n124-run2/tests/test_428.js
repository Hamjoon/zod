let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nullable', function(done) {
        // create a base schema
        const inner = zod.string();

        // make it nullable
        const schema = inner.nullable();

        // the inner type should be preserved
        assert.strictEqual(schema._def.innerType, inner, 'inner type should be the original schema');

        // valid parsing
        assert.strictEqual(schema.parse('hello'), 'hello', 'should return the original string');
        assert.strictEqual(schema.parse(null), null, 'should allow null values');

        // safeParse should succeed for null
        const safeResult = schema.safeParse(null);
        assert.strictEqual(safeResult.success, true, 'safeParse should succeed for null');
        assert.strictEqual(safeResult.data, null, 'safeParse data should be null');

        // invalid parsing (number is not allowed)
        assert.throws(() => schema.parse(123), zod.ZodError, 'should throw ZodError for non‑string, non‑null');

        done();
    });
});