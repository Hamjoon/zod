let mocha = require('mocha');
let assert = require('assert');
let { z, ZodError } = require('zod');

describe('test zod', function () {
    it('test zod.object().strict()', function (done) {
        // Define a simple shape
        const shape = {
            name: z.string(),
            age: z.number(),
        };

        // Create a strict object schema
        const schema = z.object(shape).strict();

        // ---- Positive test: object matches the shape exactly ----
        const validObj = { name: 'Alice', age: 30 };
        assert.deepStrictEqual(
            schema.parse(validObj),
            validObj,
            'Valid object should parse unchanged'
        );

        // ---- Negative test: object contains an extra key ----
        const invalidObj = { name: 'Bob', age: 25, extra: true };
        try {
            schema.parse(invalidObj);
            // If we reach this line, the test should fail
            assert.fail('Expected validation error for object with extra keys');
        } catch (err) {
            // Zod should throw a ZodError for unknown keys
            assert(err instanceof ZodError, 'Error should be an instance of ZodError');
            // The error message should mention "unrecognized key(s)" or similar
            const msg = err.errors.map((e) => e.message).join(' ');
            assert(
                /unrecognized key/.test(msg) || /unknown key/.test(msg),
                'Error message should indicate unrecognized keys'
            );
        }

        // ---- Shape integrity test ----
        // The schema should expose the same shape that was passed in
        assert.deepStrictEqual(schema.shape, shape, 'Schema shape should match the original shape');

        done();
    });
});