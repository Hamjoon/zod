let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nullable', function(done) {
        // Create a nullable string schema using the function under test
        const nullableString = zod.z.nullable(zod.z.string());

        // The schema should accept null and return it unchanged
        assert.strictEqual(nullableString.parse(null), null, 'null should be parsed as null');

        // The schema should accept a valid string and return it unchanged
        const testStr = 'hello world';
        assert.strictEqual(nullableString.parse(testStr), testStr, 'valid string should be parsed unchanged');

        // The schema should reject values that are not null or the inner type
        assert.throws(() => nullableString.parse(123), /Invalid/, 'non‑string, non‑null should throw');

        // Verify that the internal representation contains the correct inner type.
        // Instead of checking instance equality (which would fail because a new
        // ZodString instance is created for the comparison), we check the
        // definition of the inner type.
        assert.strictEqual(
            nullableString._def.innerType._def.type,
            'string',
            'inner type should be string'
        );

        done();
    });
});