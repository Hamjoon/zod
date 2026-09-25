let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nativeEnum', function(done) {
        // Define a simple enum-like object
        const MyEnum = { A: 'a', B: 'b' };
        // Create the nativeEnum schema
        const schema = zod.z.nativeEnum(MyEnum);
        // Valid value should parse correctly
        assert.strictEqual(schema.parse('a'), 'a');
        // Invalid value should throw a ZodError
        assert.throws(() => schema.parse('c'), zod.ZodError);
        // safeParse should succeed for a valid value
        const success = schema.safeParse('b');
        assert.strictEqual(success.success, true);
        assert.strictEqual(success.data, 'b');
        // safeParse should fail for an invalid value
        const failure = schema.safeParse('d');
        assert.strictEqual(failure.success, false);
        done();
    });
});