let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nullable', function(done) {
        // Create a simple nullable string schema
        const nullableString = zod.string().nullable();

        // 1. The returned schema should be an instance of ZodNullable
        assert(nullableString instanceof zod.ZodNullable, 'Schema is not an instance of ZodNullable');

        // 2. Parsing `null` should succeed and return `null`
        const parsedNull = nullableString.parse(null);
        assert.strictEqual(parsedNull, null, 'Parsing null did not return null');

        // 3. Parsing a valid string should succeed and return the string
        const parsedString = nullableString.parse('hello world');
        assert.strictEqual(parsedString, 'hello world', 'Parsing a valid string failed');

        // 4. Parsing an invalid type (e.g., number) should throw a ZodError
        let threw = false;
        try {
            nullableString.parse(123);
        } catch (e) {
            threw = true;
            // Ensure the error is a ZodError and contains the expected issue code
            assert(e instanceof zod.ZodError, 'Error thrown is not a ZodError');
            assert(e.issues.some(issue => issue.code === zod.ZodIssueCode.invalid_type), 'Error does not contain invalid_type issue');
        }
        assert(threw, 'Parsing an invalid type did not throw');

        // 5. Ensure that chaining .nullable() on a complex schema works as expected
        const complexSchema = zod.object({ name: zod.string(), age: zod.number() }).nullable();
        assert(complexSchema instanceof zod.ZodNullable, 'Complex schema is not an instance of ZodNullable');
        assert.strictEqual(complexSchema.parse(null), null, 'Complex nullable schema did not accept null');

        // All assertions passed
        done();
    });
});