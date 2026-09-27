let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.length', function(done) {
        // Test exact length on a string
        const stringSchema = zod.z.string().length(5);
        const validString = stringSchema.safeParse('hello');
        const invalidString = stringSchema.safeParse('hi');

        assert.strictEqual(validString.success, true, 'String of length 5 should be valid');
        assert.strictEqual(invalidString.success, false, 'String of length != 5 should be invalid');

        // Test exact length on an array
        const arraySchema = zod.z.array(zod.z.number()).length(3);
        const validArray = arraySchema.safeParse([1, 2, 3]);
        const invalidArray = arraySchema.safeParse([1, 2]);

        assert.strictEqual(validArray.success, true, 'Array of length 3 should be valid');
        assert.strictEqual(invalidArray.success, false, 'Array of length != 3 should be invalid');

        done();
    });
});