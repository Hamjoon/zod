let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.overwrite', function(done) {
        // Create a number schema that overwrites the parsed value by doubling it,
        // then enforces a maximum of 10 on the overwritten value.
        const schema = zod.number().overwrite(val => val * 2).max(10);

        // Valid case: 3 becomes 6, which is <= 10
        const parsed = schema.parse(3);
        assert.strictEqual(parsed, 6, 'The overwrite should double the input value');

        // Invalid case: 6 becomes 12, which exceeds the max constraint and should throw
        assert.throws(() => schema.parse(6), zod.ZodError, 'Value exceeding max after overwrite should throw');

        // safeParse should report failure for the same invalid input
        const safeResult = schema.safeParse(6);
        assert.strictEqual(safeResult.success, false, 'safeParse should indicate failure for out‑of‑range value');

        done();
    });
});