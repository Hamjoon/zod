let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.safeParse', function() {
        const { z, core } = zod;

        // ----- successful parse -----
        const successSchema = z.string();
        const successResult = zod.z.safeParse(successSchema, 'hello');
        assert.strictEqual(successResult.success, true, 'should be successful');
        assert.strictEqual(successResult.data, 'hello', 'parsed data should match input');

        // ----- failing parse -----
        const failSchema = z.string().min(5);
        const failResult = zod.z.safeParse(failSchema, 'hi');
        assert.strictEqual(failResult.success, false, 'should fail validation');
        assert.ok(failResult.error, 'error object should be present');
        // ensure there is at least one issue reported
        assert.ok(failResult.error.issues && failResult.error.issues.length > 0, 'error should contain issues');

        // ----- async schema should throw $ZodAsyncError -----
        const asyncSchema = z.string().refine(async (val) => val.length > 0, {
            message: 'must not be empty',
        });

        assert.throws(
            () => {
                // This call should synchronously detect the async refinement and throw
                zod.z.safeParse(asyncSchema, '');
            },
            (err) => err instanceof core.$ZodAsyncError,
            'expected $ZodAsyncError for async schema'
        );
    });
});