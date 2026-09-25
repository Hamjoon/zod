let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.optional', function(done) {
        // Define an inner type (string) and make it optional
        const optionalString = zod.z.optional(zod.z.string());

        // 1. Parsing undefined should succeed and return undefined
        const resultUndefined = optionalString.parse(undefined);
        assert.strictEqual(resultUndefined, undefined, 'Optional should allow undefined');

        // 2. Parsing a valid string should succeed and return the string
        const testValue = 'hello world';
        const resultString = optionalString.parse(testValue);
        assert.strictEqual(resultString, testValue, 'Optional should return the provided value when valid');

        // 3. Parsing null should fail (since the inner type does not allow null)
        let threw = false;
        try {
            optionalString.parse(null);
        } catch (e) {
            threw = true;
            // Ensure the error is a ZodError
            assert(e instanceof zod.ZodError, 'Error should be a ZodError');
        }
        assert(threw, 'Optional should reject null when inner type does not allow it');

        done();
    });
});