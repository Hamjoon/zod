let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.parse', function(done) {
        // ---- Successful parse ----
        const stringSchema = zod.z.string();
        const ok = zod.z.parse(stringSchema, 'hello world');
        assert.strictEqual(ok, 'hello world');

        // ---- Validation error ----
        try {
            zod.z.parse(stringSchema, 123);
            // If we get here, the error was not thrown
            assert.fail('Expected a Zod validation error to be thrown');
        } catch (e) {
            // Zod throws an instance of Error (usually ZodError)
            assert(e instanceof Error, 'Thrown object should be an Error');
        }

        // ---- Async schema handling ----
        // Create a minimal mock schema whose run method returns a Promise.
        const asyncMockSchema = {
            _zod: {
                run: () => Promise.resolve({ value: 'async result', issues: [] })
            }
        };
        try {
            zod.z.parse(asyncMockSchema, 'any value');
            assert.fail('Expected a Zod async error to be thrown');
        } catch (e) {
            // The implementation throws core.$ZodAsyncError for async schemas.
            // We only need to verify that an error is thrown.
            assert(e instanceof Error, 'Async error should be an instance of Error');
        }

        done();
    });
});