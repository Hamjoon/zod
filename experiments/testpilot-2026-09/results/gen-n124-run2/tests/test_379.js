let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.set', function(done) {
        // Create a Set schema that expects numbers
        const NumberSet = zod.z.set(zod.z.number());

        // ---- Positive case: a valid Set of numbers ----
        const validSet = new Set([1, 2, 3]);
        const parsed = NumberSet.parse(validSet);
        // Zod returns the same Set instance (or an equivalent one)
        assert.deepStrictEqual(parsed, validSet);

        // ---- Negative case 1: Set contains an invalid element ----
        assert.throws(
            () => NumberSet.parse(new Set([1, 'a'])),
            (err) => err instanceof zod.ZodError
        );

        // ---- Negative case 2: Value is not a Set at all ----
        assert.throws(
            () => NumberSet.parse([1, 2, 3]),
            (err) => err instanceof zod.ZodError
        );

        done();
    });
});