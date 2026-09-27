let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uuidv6', function(done) {
        // Create a schema for UUID v6 (no special params needed)
        const schema = zod.z.uuidv6();

        // A known‑good UUID v6 (version digit is 6, variant is 8/9/a/b)
        const validUuidV6 = '123e4567-e89b-6d3a-a456-426614174000';
        // Various invalid examples
        const invalidUuidV6_1 = '123e4567-e89b-5d3a-a456-426614174000'; // wrong version
        const invalidUuidV6_2 = '123e4567e89b6d3aa456426614174000';   // missing dashes
        const invalidUuidV6_3 = 'g23e4567-e89b-6d3a-a456-426614174000'; // illegal hex char

        // Should parse without throwing for a valid UUID v6
        assert.doesNotThrow(() => {
            const result = schema.parse(validUuidV6);
            // Ensure the parsed value is exactly the input string
            assert.strictEqual(result, validUuidV6);
        }, 'Valid UUID v6 should not throw');

        // Should throw for each invalid case
        assert.throws(() => schema.parse(invalidUuidV6_1), /invalid/i, 'Wrong version should fail');
        assert.throws(() => schema.parse(invalidUuidV6_2), /invalid/i, 'Missing dashes should fail');
        assert.throws(() => schema.parse(invalidUuidV6_3), /invalid/i, 'Non‑hex character should fail');

        done();
    });
});