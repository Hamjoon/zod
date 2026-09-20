let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.safeParse', function(done) {
        // Define a simple schema
        const schema = zod.z.object({
            username: zod.z.string().min(3),
            score: zod.z.number().int().nonnegative()
        });

        // ---- Valid input -------------------------------------------------
        const validResult = zod.z.safeParse(schema, {
            username: 'alice',
            score: 42
        });

        // success should be true and data should match the input
        assert.strictEqual(validResult.success, true);
        assert.deepStrictEqual(validResult.data, {
            username: 'alice',
            score: 42
        });

        // ---- Invalid input ------------------------------------------------
        const invalidResult = zod.z.safeParse(schema, {
            username: 'ab',   // too short
            score: -5         // negative not allowed
        });

        // success should be false and an error should be present
        assert.strictEqual(invalidResult.success, false);
        assert(invalidResult.error instanceof zod.z.ZodError);

        // The error should contain issues for both fields
        const issuePaths = invalidResult.error.issues.map(issue => issue.path.join('.'));
        assert(issuePaths.includes('username'), 'username issue missing');
        assert(issuePaths.includes('score'), 'score issue missing');

        done();
    });
});