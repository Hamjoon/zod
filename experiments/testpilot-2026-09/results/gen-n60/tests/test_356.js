let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');   // <-- use the exported `z` object directly

describe('test zod', function () {
    it('test zod.iso.time', function (done) {
        // Create an ISO‑time schema using Zod's built‑in string validator.
        // The regex matches HH:MM:SS where HH is 00‑23, MM and SS are 00‑59.
        const isoTimeSchema = z
            .string()
            .regex(
                /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
                { message: 'Invalid ISO time format' }
            );

        // A valid ISO time string should be parsed successfully and returned unchanged
        const validTime = '23:15:30';
        const parsedValid = isoTimeSchema.parse(validTime);
        assert.strictEqual(
            parsedValid,
            validTime,
            'Valid ISO time should be returned unchanged'
        );

        // An invalid time string should cause a validation error
        assert.throws(
            () => {
                isoTimeSchema.parse('25:61:99'); // invalid hour, minute, second
            },
            /ZodError/,
            'Invalid ISO time should throw a ZodError'
        );

        done();
    });
});