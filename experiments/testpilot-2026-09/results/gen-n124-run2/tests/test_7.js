let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.iso.date', function(done) {
        // obtain the ISO date schema
        const schema = zod.z.iso.date();

        // a valid ISO‑8601 date string should pass
        const valid = schema.safeParse('2023-05-15');
        assert.strictEqual(valid.success, true, 'Valid ISO date string should be accepted');

        // an invalid string should fail
        const invalid = schema.safeParse('not-a-date');
        assert.strictEqual(invalid.success, false, 'Invalid date string should be rejected');

        // a Date object should also be rejected (schema expects a string)
        const dateObj = schema.safeParse(new Date('2023-05-15'));
        assert.strictEqual(dateObj.success, false, 'Date objects should not be accepted');

        done();
    });
});