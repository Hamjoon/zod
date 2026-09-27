let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.safeParse', function(done) {
        // 1️⃣ Successful parse
        const stringSchema = zod.z.string();
        const successResult = zod.z.safeParse(stringSchema, 'hello');
        assert.strictEqual(successResult.success, true, 'should be successful');
        assert.strictEqual(successResult.data, 'hello', 'parsed data should match input');

        // 2️⃣ Failing parse (min length violation)
        const minSchema = zod.z.string().min(5, { message: 'Too short' });
        const failResult = zod.z.safeParse(minSchema, 'hi');
        assert.strictEqual(failResult.success, false, 'should fail validation');
        // The error should be an instance of ZodError (or the internal error class)
        assert.ok(failResult.error instanceof zod.ZodError, 'error should be a ZodError');

        // 3️⃣ Async schema should throw $ZodAsyncError when used with safeParse
        const asyncSchema = zod.z.string().refine(async (val) => true, {
            message: 'async check',
        });
        let asyncErrorCaught = false;
        try {
            zod.z.safeParse(asyncSchema, 'test');
        } catch (e) {
            asyncErrorCaught = true;
            // The thrown error should be the internal async error; we just verify it's an Error
            assert.ok(e instanceof Error, 'thrown error should be an Error');
        }
        assert.strictEqual(asyncErrorCaught, true, 'async schema should cause an error');

        done();
    });
});