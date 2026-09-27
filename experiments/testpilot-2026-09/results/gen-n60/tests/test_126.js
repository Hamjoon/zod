let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.ksuid', function(done) {
        // Call ksuid without parameters (the function should generate a KSUID)
        const result = zod.z.ksuid();

        // Verify that a KSUID string is returned
        assert.ok(typeof result === 'string', 'ksuid should return a string');

        // KSUID strings are 27 characters long (base‑62 encoded)
        assert.strictEqual(result.length, 27, 'ksuid should be 27 characters long');

        done();
    });
});