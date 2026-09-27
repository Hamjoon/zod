let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');   // use the proper import for Zod

describe('test zod', function () {
    it('test zod.z.iso.datetime', function (done) {
        // Create a datetime schema that accepts both UTC (Z) and local (no offset) ISO strings
        // `offset: true` makes the Z suffix optional and also allows other timezone offsets.
        const schema = z.string().datetime({ offset: true });

        // Valid ISO datetime strings should pass
        assert.doesNotThrow(() => {
            // UTC format
            schema.parse("2023-07-15T12:34:56Z");
            // Local format (no timezone) – still valid ISO
            schema.parse("2023-07-15T12:34:56");
        });

        // Invalid strings should throw a ZodError
        assert.throws(() => {
            schema.parse("not-a-datetime");
        }, /Invalid/);

        assert.throws(() => {
            schema.parse("2023-13-01T00:00:00Z"); // month out of range
        }, /Invalid/);

        done();
    });
});