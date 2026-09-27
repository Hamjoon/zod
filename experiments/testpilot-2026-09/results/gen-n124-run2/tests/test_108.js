let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.uuidv7', function(done) {
        // Create a UUIDv7 schema
        const uuidv7Schema = zod.z.uuidv7();

        // A manually crafted valid UUIDv7 (version nibble is 7)
        const validUuidv7 = '01890b3e-0c3e-7c23-bfc2-ccf0f4668b3b';

        // The schema should accept a valid UUIDv7
        assert.doesNotThrow(() => {
            const parsed = uuidv7Schema.parse(validUuidv7);
            assert.strictEqual(parsed, validUuidv7);
        }, 'Valid UUIDv7 should not throw');

        // An invalid UUID (wrong version nibble, here set to 4)
        const invalidUuid = '01890b3e-0c3e-4c23-bfc2-ccf0f4668b3b';

        // The schema should reject an invalid UUIDv7
        assert.throws(() => {
            uuidv7Schema.parse(invalidUuid);
        }, /invalid|UUID/, 'Invalid UUID should throw');

        done();
    });
});