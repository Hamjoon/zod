let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // use the proper Zod import

describe('test zod', function () {
    it('test zod.iso.duration', function (done) {
        // -----------------------------------------------------------------
        // Create a schema that validates ISO‑8601 duration strings.
        // Zod does not ship a built‑in duration validator, so we use a
        // regular expression that follows the ISO‑8601 spec.
        // -----------------------------------------------------------------
        const isoDurationRegex = /^P(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(\d+H)?(\d+M)?(\d+S)?)?$/;

        const schema = z
            .string()
            .refine((val) => isoDurationRegex.test(val), {
                message: 'Invalid ISO 8601 duration',
            });

        // A known‑good ISO 8601 duration
        const validDuration = 'P1Y2M3DT4H5M6S';

        // Ensure parsing a valid duration does not throw and returns the same string
        assert.doesNotThrow(() => {
            const parsed = schema.parse(validDuration);
            assert.strictEqual(parsed, validDuration);
        }, 'Valid ISO duration should be accepted');

        // An invalid duration string
        const invalidDuration = 'not-a-duration';

        // Ensure parsing an invalid duration throws a ZodError
        assert.throws(
            () => {
                schema.parse(invalidDuration);
            },
            /ZodError/,
            'Invalid duration should be rejected'
        );

        done();
    });
});