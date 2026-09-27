let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.safeParseAsync', async function() {
        // ---- success case ----
        // schema with an async refinement that allows strings up to length 8
        const successSchema = zod.string().refine(async (val) => val.length <= 8);
        const successResult = await successSchema.safeParseAsync("hello");
        assert.strictEqual(successResult.success, true, 'should succeed for short string');
        assert.strictEqual(successResult.data, "hello", 'returned data should match input');

        // ---- failure case ----
        // schema with an async refinement that only allows strings up to length 3
        const failSchema = zod.string().refine(
            async (val) => val.length <= 3,
            { message: "Too long" }
        );
        const failResult = await failSchema.safeParseAsync("abcd");
        assert.strictEqual(failResult.success, false, 'should fail for long string');
        assert.ok(failResult.error, 'error object should be present on failure');
        // The error should contain the custom message we supplied
        assert.ok(
            failResult.error.issues[0].message.includes("Too long"),
            'error message should contain custom message'
        );
    });
});