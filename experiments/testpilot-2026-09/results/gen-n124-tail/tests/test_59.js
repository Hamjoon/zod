let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.parse', function(done) {
        // 1️⃣ Successful parse should return the original value
        const stringSchema = zod.string();
        const parsed = zod.z.parse(stringSchema, 'hello world');
        assert.strictEqual(parsed, 'hello world');

        // 2️⃣ Invalid value should throw a ZodError
        const minSchema = zod.string().min(5);
        assert.throws(() => {
            zod.z.parse(minSchema, 'hi');
        }, err => err instanceof zod.ZodError);

        // 3️⃣ Async schema should cause $ZodAsyncError to be thrown
        const asyncSchema = zod.string().refine(async () => true, { message: 'ok' });
        assert.throws(() => {
            zod.z.parse(asyncSchema, 'any');
        }, err => {
            // The internal async error class is named `$ZodAsyncError`
            return err && (err.name === '$ZodAsyncError' || err.constructor.name === '$ZodAsyncError');
        });

        done();
    });
});