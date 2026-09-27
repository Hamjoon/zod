// Import the required libraries
const mocha = require('mocha');
const assert = require('assert');
const KSUID = require('ksuid');   // <-- use the ksuid package instead of zod

describe('test ksuid generation', function () {
    it('should generate a valid KSUID string', function (done) {
        // Generate a KSUID (synchronous version)
        const result = KSUID.randomSync().toString();   // returns a 27‑character base‑62 string

        // Verify that a KSUID string is returned
        assert.ok(typeof result === 'string', 'ksuid should return a string');

        // KSUID strings are 27 characters long (base‑62 encoded)
        assert.strictEqual(result.length, 27, 'ksuid should be 27 characters long');

        done();
    });
});