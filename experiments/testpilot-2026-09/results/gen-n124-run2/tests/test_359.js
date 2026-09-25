let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.record', function(done) {
        // Create a record schema where keys are strings and values are numbers
        const schema = zod.z.record(zod.z.string(), zod.z.number());

        // ---- Positive test: a valid object should parse unchanged ----
        const validObj = { foo: 42, bar: 0 };
        const parsedValid = schema.parse(validObj);
        assert.deepStrictEqual(parsedValid, validObj, 'Valid object should be parsed correctly');

        // ---- Edge case: empty object should also be valid ----
        const emptyParsed = schema.parse({});
        assert.deepStrictEqual(emptyParsed, {}, 'Empty object should be parsed as empty');

        // ---- Negative test: value of wrong type should throw a ZodError ----
        const invalidObj = { foo: "not a number" };
        try {
            schema.parse(invalidObj);
            // If we reach this line, the validation did not fail as expected
            assert.fail('Expected schema.parse to throw a ZodError for invalid value types');
        } catch (err) {
            // Zod throws an instance of ZodError; ensure it contains error details
            assert(err && typeof err === 'object' && Array.isArray(err.errors), 'Error should be a ZodError with an errors array');
            // Optionally, check that the error points to the correct path
            const errorPath = err.errors[0].path;
            assert.deepStrictEqual(errorPath, ['foo'], 'Error path should point to the offending key');
        }

        done();
    });
});