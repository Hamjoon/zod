let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.safeParseAsync', function(done) {
        (async () => {
            // Create a schema with an async refinement (max length 5)
            const schema = zod.string().refine(
                async (val) => val.length <= 5,
                { message: "Too long" }
            );

            // Successful parse
            const successResult = await zod.z.safeParseAsync(schema, "hello");
            assert.strictEqual(successResult.success, true);
            assert.strictEqual(successResult.data, "hello");

            // Failing parse
            const failResult = await zod.z.safeParseAsync(schema, "excessive");
            assert.strictEqual(failResult.success, false);
            assert.ok(failResult.error, "Expected an error object on failure");
        })()
        .then(() => done())
        .catch(err => done(err));
    });
});