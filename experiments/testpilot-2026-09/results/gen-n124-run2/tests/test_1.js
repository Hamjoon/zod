let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.iso.datetime', function(done) {
        // Create the ISO datetime schema
        const isoDateTimeSchema = zod.z.iso.datetime();

        // A valid ISO datetime string should pass validation
        const valid = isoDateTimeSchema.safeParse('2023-01-01T12:34:56Z');
        assert.strictEqual(valid.success, true, 'Valid ISO datetime should be accepted');

        // An invalid datetime string should fail validation
        const invalid = isoDateTimeSchema.safeParse('not-a-datetime');
        assert.strictEqual(invalid.success, false, 'Invalid datetime should be rejected');

        done();
    });
});