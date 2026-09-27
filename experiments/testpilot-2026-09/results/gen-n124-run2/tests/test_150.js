let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.ksuid', function(done) {
        // Create a KSUID schema using the function under test
        const ksuidSchema = zod.z.ksuid();

        // A known‑good KSUID (27‑character base62 string)
        const validKsuid = '0ujtsYcgvSTl8PAuAdqWYSMnLOv';
        // Ensure the schema accepts a valid KSUID
        assert.doesNotThrow(() => ksuidSchema.parse(validKsuid));

        // An obviously invalid KSUID
        const invalidKsuid = 'invalid-ksuid';
        // Ensure the schema rejects an invalid KSuid
        assert.throws(() => ksuidSchema.parse(invalidKsuid));

        done();
    });
});