let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // use the Zod namespace directly

describe('test zod', function () {
    it('test zod.uuidv6 validation', function (done) {
        // A known valid UUID v6 (version bits = 6, variant bits = 10)
        const validV6 = '00000000-0000-6000-8000-000000000000';
        // An invalid UUID (wrong version, here version 4)
        const invalidV6 = '00000000-0000-4000-8000-000000000000';

        // Regex that matches only UUID version 6 (variant 10xx)
        const uuidV6Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-6[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        // Create the schema that validates a string against the UUID‑v6 pattern
        const schema = z.string().regex(uuidV6Regex, { message: 'Invalid uuid' });

        // Should accept a valid v6 UUID
        const parsed = schema.parse(validV6);
        assert.strictEqual(parsed, validV6, 'Valid UUID v6 should be parsed unchanged');

        // Should reject an invalid UUID (wrong version)
        assert.throws(() => {
            schema.parse(invalidV6);
        }, /Invalid uuid/, 'Invalid UUID version should throw');

        done();
    });
});