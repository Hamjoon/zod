let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.pipe', function(done) {
        // Simple pipe: transform string length then enforce a minimum number
        const schema = zod.z.string()
            .transform(s => s.length)
            .pipe(zod.z.number().min(5));

        // Valid input: "hello" -> length 5, passes min(5)
        const validResult = schema.parse("hello");
        assert.strictEqual(validResult, 5, 'Expected length 5 for "hello"');

        // Invalid input: "hi" -> length 2, should fail the .min(5) check
        assert.throws(
            () => schema.parse("hi"),
            /Number must be greater than or equal to 5/,
            'Expected validation error for short string'
        );

        // Pipe with an async transform
        const asyncSchema = zod.z.pipe(
            zod.z.string(),
            zod.z.transform(async (s) => s.length)
        );

        // Use parseAsync because the transform is async
        asyncSchema.parseAsync("test")
            .then(result => {
                assert.strictEqual(result, 4, 'Async transform should return length 4');
                done();
            })
            .catch(err => done(err));
    });
});