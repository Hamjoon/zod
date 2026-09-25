let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nanoid', function(done) {
        // Create a nanoid schema using the helper
        const nanoidSchema = zod.z.nanoid();

        // A known‑good nanoid: 21 URL‑safe characters (a‑z, A‑Z, 0‑9, "_" or "-")
        const validNanoid = '0123456789ABCDEFGHIJK'; // 21 characters

        // An invalid nanoid (wrong length and contains an illegal character "!")
        const invalidNanoid = 'invalid!';

        // The schema should accept the valid value without throwing
        assert.doesNotThrow(() => {
            nanoidSchema.parse(validNanoid);
        }, 'Valid nanoid should not throw');

        // The schema should reject the invalid value and throw a ZodError
        assert.throws(() => {
            nanoidSchema.parse(invalidNanoid);
        }, /ZodError/, 'Invalid nanoid should throw a ZodError');

        done();
    });
});