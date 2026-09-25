let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.check', function(done) {
        // Create a schema with a custom check that adds an issue when the array length > 2
        const schema = zod.array(zod.string()).check((ctx) => {
            if (ctx.value.length > 2) {
                ctx.issues.push({
                    code: "too_big",
                    message: "Array is too large",
                    input: ctx.value
                });
            }
        });

        // 1️⃣ Verify that a valid input (length <= 2) passes without throwing
        try {
            const parsed = schema.parse(['a', 'b']);
            assert.deepStrictEqual(parsed, ['a', 'b']);
        } catch (e) {
            assert.fail('Valid input should not throw');
        }

        // 2️⃣ Verify that an invalid input (length > 2) triggers the custom issue
        let caughtError = null;
        try {
            schema.parse(['a', 'b', 'c']);
        } catch (e) {
            caughtError = e;
        }

        assert(caughtError, 'Invalid input should throw an error');
        // Zod errors expose an `issues` array (or `errors` depending on version)
        const issues = caughtError.issues || caughtError.errors || [];
        const hasTooBig = issues.some(issue => issue.code === "too_big");
        assert(hasTooBig, 'Custom "too_big" issue should be present');

        done();
    });
});