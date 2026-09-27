let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.never', function(done) {
        // Create a never schema
        const schema = zod.z.never();

        // The schema should reject any value – parse should throw a ZodError
        assert.throws(() => schema.parse(undefined), zod.ZodError);
        assert.throws(() => schema.parse(null), zod.ZodError);
        assert.throws(() => schema.parse(0), zod.ZodError);
        assert.throws(() => schema.parse('any string'), zod.ZodError);
        assert.throws(() => schema.parse({}), zod.ZodError);
        assert.throws(() => schema.parse([]), zod.ZodError);

        // safeParse should return a failure result
        const safeResult = schema.safeParse('whatever');
        assert.strictEqual(safeResult.success, false);
        // The error message should mention that the value is never allowed
        assert.ok(safeResult.error.errors[0].message.includes('Never'));

        done();
    });
});