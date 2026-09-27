let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uppercase', function(done) {
        // Valid uppercase input should not throw
        assert.doesNotThrow(() => {
            // Assuming zod.z.uppercase returns a Zod schema or validates directly
            // If it returns a schema, we call .parse; otherwise we just invoke it.
            const result = zod.z.uppercase('HELLO');
            // If the function returns a schema, parse the value
            if (typeof result?.parse === 'function') {
                result.parse('HELLO');
            }
        });

        // Invalid (non‑uppercase) input should throw a ZodError
        assert.throws(() => {
            const result = zod.z.uppercase('Hello');
            if (typeof result?.parse === 'function') {
                result.parse('Hello');
            } else {
                // If the function validates directly, the call itself should throw
                // (no further action needed)
            }
        }, /uppercase/i);

        done();
    });
});