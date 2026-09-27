let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.safeParseAsync', async function() {
        // Simple schema: a string with minimum length 3
        const schema = zod.string().min(3);

        // Successful async parse
        const successResult = await zod.z.safeParseAsync(schema, "abc");
        assert.deepStrictEqual(successResult, {
            success: true,
            data: "abc"
        });

        // Failing async parse
        const failureResult = await zod.z.safeParseAsync(schema, "ab");
        assert.strictEqual(failureResult.success, false);
        // The error should be an instance of the internal ZodError (or at least an Error)
        assert(failureResult.error instanceof Error);
        // The error should contain at least one issue describing the min length violation
        assert(Array.isArray(failureResult.error.issues));
        assert(failureResult.error.issues.length > 0);
        assert.strictEqual(failureResult.error.issues[0].code, "too_small");
    });
});