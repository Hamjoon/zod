let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');   // import the Zod namespace

describe('test zod', function () {
    it('test zod.z.iso.duration', function (done) {
        // Create the ISO duration schema
        const schema = z.iso.duration();

        // A known‑good ISO‑8601 duration string
        const validDuration = 'P1Y2M3DT4H5M6S';
        // Parsing a valid value should return the same string
        assert.strictEqual(schema.parse(validDuration), validDuration);

        // An invalid duration string should cause a Zod validation error.
        // Use the ZodError constructor (or check the message) instead of a regex.
        assert.throws(
            () => {
                schema.parse('not-a-duration');
            },
            z.ZodError,                     // expect a ZodError instance
            'Expected a ZodError to be thrown for an invalid ISO duration'
        );

        done();
    });
});