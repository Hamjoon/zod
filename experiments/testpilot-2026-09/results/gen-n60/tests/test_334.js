let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.coerce.number', function(done) {
        const schema = zod.z.coerce.number();

        // Valid coercions from string to number
        assert.strictEqual(schema.parse('42'), 42);
        assert.strictEqual(schema.parse('3.14'), 3.14);

        // Passing a number should return the same number
        assert.strictEqual(schema.parse(10), 10);

        // Invalid coercions should throw a ZodError
        assert.throws(() => schema.parse('abc'), zod.ZodError);
        assert.throws(() => schema.parse(''), zod.ZodError);
        assert.throws(() => schema.parse(true), zod.ZodError);
        assert.throws(() => schema.parse(null), zod.ZodError);
        assert.throws(() => schema.parse(undefined), zod.ZodError);

        done();
    });
});