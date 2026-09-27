let mocha = require('mocha');
let assert = require('assert');
let { z, ZodError } = require('zod'); // import the Zod namespace

describe('test zod', function () {
    it('test zod.z.parse', function () {
        // 1️⃣ Successful parse should return the original value
        const schemaSuccess = z.string();
        const successResult = schemaSuccess.parse('hello'); // use the schema's parse method
        assert.strictEqual(successResult, 'hello');

        // 2️⃣ Validation error should throw a ZodError
        const schemaError = z.string().min(5);
        assert.throws(
            () => {
                schemaError.parse('hi'); // sync parse throws ZodError
            },
            err => err instanceof ZodError
        );

        // 3️⃣ Async schema should throw a ZodAsyncError when used with the sync parse
        const schemaAsync = z.string().refine(
            async (val) => true,
            { message: 'always true' }
        );
        assert.throws(
            () => {
                // Intentionally use the synchronous parse to trigger ZodAsyncError
                schemaAsync.parse('test');
            },
            err => err && typeof err.name === 'string' && err.name.includes('ZodAsyncError')
        );
    });
});