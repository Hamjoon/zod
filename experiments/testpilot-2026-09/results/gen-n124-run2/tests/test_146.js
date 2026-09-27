let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.xid', function(done) {
        try {
            // Call the function without any special parameters
            const id = zod.z.xid({});

            // Verify that an XID string is returned
            assert.strictEqual(typeof id, 'string', 'XID should be a string');
            // XIDs are 20‑character base32 strings (lower‑case alphanumerics)
            assert.strictEqual(id.length, 20, 'XID should be 20 characters long');
            assert.match(id, /^[0-9a-z]{20}$/i, 'XID should match the base32 pattern');

            done();
        } catch (err) {
            done(err);
        }
    });
});