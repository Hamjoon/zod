let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.array', function(done) {
        // Basic array of strings
        const stringArray = zod.z.array(zod.z.string());

        // Valid input should succeed
        const validResult = stringArray.safeParse(['foo', 'bar']);
        assert.strictEqual(validResult.success, true);
        assert.deepStrictEqual(validResult.data, ['foo', 'bar']);

        // Invalid input (non‑string element) should fail
        const invalidResult = stringArray.safeParse(['foo', 123]);
        assert.strictEqual(invalidResult.success, false);

        // Test array with parameters (min length)
        const minNumberArray = zod.z.array(zod.z.number()).min(2);

        // Fails because length is less than the minimum
        const tooShort = minNumberArray.safeParse([42]);
        assert.strictEqual(tooShort.success, false);

        // Succeeds when the minimum length requirement is met
        const sufficient = minNumberArray.safeParse([1, 2, 3]);
        assert.strictEqual(sufficient.success, true);
        assert.deepStrictEqual(sufficient.data, [1, 2, 3]);

        done();
    });
});