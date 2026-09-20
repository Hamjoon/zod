let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.endsWith', function(done) {
        // Basic usage – should accept strings that end with the suffix
        const schema = zod.string().endsWith('.com');
        // Should parse without throwing
        assert.doesNotThrow(() => schema.parse('mydomain.com'));

        // Should reject strings that do not end with the suffix
        const resultFail = schema.safeParse('mydomain.org');
        assert.strictEqual(resultFail.success, false, 'Expected validation to fail for wrong suffix');
        // Default error message contains the suffix information
        assert.ok(
            resultFail.error?.issues?.some(issue => issue.message.includes('.com')),
            'Error message should mention the required suffix'
        );

        // Custom message – ensure the provided message is used
        const customMsg = 'Only .org domains are allowed';
        const schemaCustom = zod.string().endsWith('.org', { message: customMsg });
        const resultCustomFail = schemaCustom.safeParse('example.com');
        assert.strictEqual(resultCustomFail.success, false, 'Custom schema should fail for wrong suffix');
        // The custom message should appear in the first issue
        assert.strictEqual(
            resultCustomFail.error?.issues?.[0]?.message,
            customMsg,
            'Custom error message was not used'
        );

        // Ensure a correct value passes with the custom schema as well
        assert.doesNotThrow(() => schemaCustom.parse('example.org'));

        done();
    });
});