let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.never', function(done) {
        // Create a ZodNever schema
        const neverSchema = zod.z.never();

        // The schema should always reject any input.
        // 1. Using parse should throw an error.
        assert.throws(() => {
            neverSchema.parse('any value');
        }, /Invalid input/);

        // 2. Using safeParse should return a failure result.
        const safeResult = neverSchema.safeParse('any value');
        assert.strictEqual(safeResult.success, false);
        assert.ok(safeResult.error, 'Error object should be present on failure');

        // 3. Even with undefined, it should still fail.
        assert.throws(() => {
            neverSchema.parse(undefined);
        }, /Invalid input/);
        const safeResultUndefined = neverSchema.safeParse(undefined);
        assert.strictEqual(safeResultUndefined.success, false);

        done();
    });
});