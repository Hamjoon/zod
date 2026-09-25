let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
let XID = require('xid');          // <-- use the XID generator

describe('test zod', function () {
    it('test zod.z.xid', function (done) {
        try {
            // 1️⃣  Generate a real XID string (20‑character base32)
            const rawIdFromXid = XID.next();   // e.g. "c1k9g0b2e5f6h7i8j9k0"

            // 2️⃣  Validate it with the Zod XID schema.
            //    zod.z.xid() returns a Zod schema, so we call .parse()
            //    to both validate and obtain the value.
            const id = zod.z.xid().parse(rawIdFromXid);

            // 3️⃣  Verify that the returned value is a string and matches the XID format.
            assert.strictEqual(typeof id, 'string', 'XID should be a string');
            assert.strictEqual(id.length, 20, 'XID should be 20 characters long');
            assert.match(id, /^[0-9a-z]{20}$/i, 'XID should match the base32 pattern');

            done();
        } catch (err) {
            done(err);
        }
    });
});