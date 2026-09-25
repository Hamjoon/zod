let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod string uppercase validation', function (done) {
        // Build a Zod schema that requires an uppercase string
        const UppercaseString = zod.z.string().uppercase();

        // Valid uppercase input should not throw
        assert.doesNotThrow(() => {
            UppercaseString.parse('HELLO');
        });

        // Invalid (non‑uppercase) input should throw a ZodError
        assert.throws(() => {
            UppercaseString.parse('Hello');
        }, /uppercase/i);

        done();
    });
});