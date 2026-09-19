let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.iso.time', function(done) {
        // Create the ISO time schema
        const isoTimeSchema = zod.z.iso.time();

        // A valid ISO time string should be parsed successfully and returned unchanged
        const validTime = '23:15:30';
        const parsedValid = isoTimeSchema.parse(validTime);
        assert.strictEqual(parsedValid, validTime, 'Valid ISO time should be returned unchanged');

        // An invalid time string should cause a validation error
        assert.throws(() => {
            isoTimeSchema.parse('25:61:99'); // invalid hour, minute, second
        }, /ZodError/, 'Invalid ISO time should throw a ZodError');

        done();
    });
});