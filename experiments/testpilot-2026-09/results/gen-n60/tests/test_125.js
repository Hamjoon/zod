let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.ksuid', function(done) {
        // Generate a KSUID with default parameters
        const idDefault = zod.z.ksuid();
        assert.strictEqual(typeof idDefault, 'string', 'KSUID should be a string');
        assert.strictEqual(idDefault.length, 27, 'KSUID should be 27 characters long');

        // Generate a KSUID with an explicit timestamp (seconds since epoch)
        const timestamp = Math.floor(Date.now() / 1000);
        const idWithTimestamp = zod.z.ksuid({ timestamp });
        assert.strictEqual(typeof idWithTimestamp, 'string', 'KSUID with timestamp should be a string');
        assert.strictEqual(idWithTimestamp.length, 27, 'KSUID with timestamp should be 27 characters long');

        // The two generated IDs should not be identical
        assert.notStrictEqual(idDefault, idWithTimestamp, 'Two KSUIDs generated with different inputs should differ');

        done();
    });
});