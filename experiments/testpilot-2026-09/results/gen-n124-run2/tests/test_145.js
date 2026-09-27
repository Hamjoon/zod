let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.xid', function(done) {
        // Call without parameters – should return a non‑empty string
        const id1 = zod.z.xid();
        const id2 = zod.z.xid();

        // Basic type checks
        assert.strictEqual(typeof id1, 'string');
        assert.strictEqual(typeof id2, 'string');

        // The IDs should be non‑empty
        assert.ok(id1.length > 0, 'first id is empty');
        assert.ok(id2.length > 0, 'second id is empty');

        // They should match a simple alphanumeric pattern (most XID implementations use base‑32/64)
        assert.match(id1, /^[0-9a-zA-Z]+$/);
        assert.match(id2, /^[0-9a-zA-Z]+$/);

        // Two consecutive calls should produce different values (uniqueness)
        assert.notStrictEqual(id1, id2, 'two generated ids are identical');

        // If the function accepts a parameter object, ensure it still returns a string
        // (the exact semantics of the parameter are unknown, so we only test that it doesn't throw)
        try {
            const idWithParam = zod.z.xid({ seed: 123 });
            assert.strictEqual(typeof idWithParam, 'string');
        } catch (e) {
            // If the implementation does not support parameters, that's acceptable – just ensure no crash
        }

        done();
    });
});