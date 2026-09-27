let mocha = require('mocha');
let assert = require('assert');
let { z, ZodError } = require('zod');

describe('test zod', function () {
    it('test zod.string().uuid()', function (done) {
        // Create the UUID schema
        const schema = z.string().uuid();

        // A known valid UUID (RFC 4122 version 4 format)
        const validUuid = '123e4567-e89b-12d3-a456-426614174000';

        // The schema should accept a valid UUID without throwing
        try {
            const parsed = schema.parse(validUuid);
            assert.strictEqual(parsed, validUuid);
        } catch (err) {
            return done(err);
        }

        // An invalid UUID should cause a validation error
        const invalidUuid = 'not-a-valid-uuid';
        assert.throws(
            () => schema.parse(invalidUuid),
            (err) => {
                // Zod throws a ZodError; we check its first error message
                return err instanceof ZodError && err.errors[0].message === 'Invalid UUID';
            },
            'Expected a ZodError with message "Invalid UUID"'
        );

        done();
    });
});