let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.int', function(done) {
        // Create an integer schema
        const intSchema = zod.z.int();

        // Valid integer should succeed
        const validResult = intSchema.safeParse(42);
        assert.strictEqual(validResult.success, true, 'Integer 42 should be valid');
        assert.strictEqual(validResult.data, 42, 'Parsed value should be 42');

        // Float should fail
        const floatResult = intSchema.safeParse(3.14);
        assert.strictEqual(floatResult.success, false, 'Float 3.14 should be invalid');

        // String should fail
        const stringResult = intSchema.safeParse('10');
        assert.strictEqual(stringResult.success, false, 'String "10" should be invalid');

        // Null should fail
        const nullResult = intSchema.safeParse(null);
        assert.strictEqual(nullResult.success, false, 'null should be invalid');

        done();
    });
});