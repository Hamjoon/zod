let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.boolean', function(done) {
        const schema = zod.boolean();

        // valid booleans should be returned unchanged
        assert.strictEqual(schema.parse(true), true);
        assert.strictEqual(schema.parse(false), false);

        // invalid values should throw a ZodError
        assert.throws(() => schema.parse('true'), zod.ZodError);
        assert.throws(() => schema.parse('false'), zod.ZodError);
        assert.throws(() => schema.parse(1), zod.ZodError);
        assert.throws(() => schema.parse(null), zod.ZodError);
        assert.throws(() => schema.parse(undefined), zod.ZodError);
        assert.throws(() => schema.parse({}), zod.ZodError);

        done();
    });
});