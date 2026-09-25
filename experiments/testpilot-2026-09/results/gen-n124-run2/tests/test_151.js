let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.ksuid', function (done) {
        // Generate a KSUID without any parameters and convert it to a string
        const ksuid1 = zod.z.ksuid().toString();

        // It should be a string
        assert.strictEqual(typeof ksuid1, 'string', 'KSUID should be a string');

        // KSUIDs are 27‑character Base62 strings
        assert.strictEqual(ksuid1.length, 27, 'KSUID length should be 27 characters');
        assert.ok(/^[0-9A-Za-z]{27}$/.test(ksuid1), 'KSUID should match Base62 pattern');

        // Generate a second KSUID and ensure it is different from the first
        const ksuid2 = zod.z.ksuid().toString();
        assert.notStrictEqual(ksuid1, ksuid2, 'Two generated KSUIDs should not be equal');

        done();
    });
});