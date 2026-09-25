let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.parseAsync', function(done) {
        (async () => {
            // Define a schema with both synchronous and asynchronous validation rules
            const schema = zod.z.object({
                id: zod.z.number().int(),
                name: zod.z.string().min(3)
            });

            // ---- Positive test: valid input should resolve correctly ----
            const validInput = { id: 42, name: "Alice" };
            const parsed = await schema.parseAsync(validInput);
            // The parsed result should be exactly the input object
            assert.deepStrictEqual(parsed, validInput);

            // ---- Negative test: invalid input should reject with a ZodError ----
            const invalidInput = { id: "not-a-number", name: "Al" };
            try {
                await schema.parseAsync(invalidInput);
                // If we reach here, parseAsync did not throw as expected
                assert.fail('parseAsync should have thrown a ZodError for invalid input');
            } catch (err) {
                // Ensure the error is a ZodError
                assert(err instanceof zod.z.ZodError, 'Error should be an instance of ZodError');

                // Extract the paths of the validation issues
                const issuePaths = err.errors.map(issue => issue.path[0]);

                // Both 'id' and 'name' should have validation errors
                assert(issuePaths.includes('id'), "Expected validation error for 'id'");
                assert(issuePaths.includes('name'), "Expected validation error for 'name'");
            }
        })()
        .then(() => done())
        .catch(err => done(err));
    });
});