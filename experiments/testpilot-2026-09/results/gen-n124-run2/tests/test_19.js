let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.iso.duration', function(done) {
        // Create the ISO duration schema
        const schema = zod.z.iso.duration();

        // A known‑good ISO‑8601 duration string
        const validDuration = 'P1Y2M3DT4H5M6S';
        // Parsing a valid value should return the same string
        assert.strictEqual(schema.parse(validDuration), validDuration);

        // An invalid duration string should cause a Zod validation error
        assert.throws(() => {
            schema.parse('not-a-duration');
        }, /ZodError/);

        done();
    });
});