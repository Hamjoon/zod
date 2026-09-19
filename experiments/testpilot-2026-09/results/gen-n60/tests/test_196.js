let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.catch', function(done) {
        const z = zod; // alias for convenience

        // ----- static catch value -----
        const numberWithCatch = z.number().catch(42);
        // valid input should pass through unchanged
        assert.strictEqual(numberWithCatch.parse(5), 5);
        // invalid input should be replaced by the static catch value
        assert.strictEqual(numberWithCatch.parse('tuna'), 42);

        // ----- functional catch -----
        // The catch callback receives the ZodError directly (not wrapped in an object)
        const numberWithRandomCatch = z.number().catch((error) => {
            // error must be a ZodError instance
            assert(error instanceof z.ZodError);
            // For deterministic testing, return a fixed number
            return 123;
        });
        // invalid input triggers the catch function
        assert.strictEqual(numberWithRandomCatch.parse('sup'), 123);

        // ----- ensure ZodError contains expected issues -----
        try {
            // This will throw because the types don't match
            z.object({
                username: z.string(),
                xp: z.number()
            }).parse({ username: 42, xp: "100" });
        } catch (error) {
            // Verify we caught a ZodError and that it has the correct shape
            if (error instanceof z.ZodError) {
                assert(Array.isArray(error.issues), 'issues should be an array');
                assert.strictEqual(error.issues.length, 2, 'should have two issues');
                // First issue should be for `username`
                assert.deepStrictEqual(error.issues[0].path, ['username']);
                // Second issue should be for `xp`
                assert.deepStrictEqual(error.issues[1].path, ['xp']);
            } else {
                // Re‑throw if it's not the expected error type
                throw error;
            }
        }

        done();
    });
});