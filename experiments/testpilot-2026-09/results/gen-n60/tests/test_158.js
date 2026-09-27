let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uuid', function(done) {
        // Create a UUID validator schema (no special params needed)
        const uuidSchema = zod.z.uuid({});

        // A valid UUID should pass without throwing
        const validUuid = '123e4567-e89b-12d3-a456-426614174000';
        assert.doesNotThrow(() => {
            // Most Zod versions expose a `parse` method for validation
            uuidSchema.parse(validUuid);
        }, 'Valid UUID threw an error');

        // An invalid UUID should cause a validation error
        const invalidUuid = 'not-a-valid-uuid';
        assert.throws(() => {
            uuidSchema.parse(invalidUuid);
        }, /invalid/i, 'Invalid UUID did not throw an error');

        done();
    });
});