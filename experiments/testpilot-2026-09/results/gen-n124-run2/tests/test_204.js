let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.float32', function(done) {
        // Obtain the schema / validator for a 32‑bit float
        const schema = zod.z.float32();

        // Basic sanity checks – the function should return something usable
        assert.ok(schema, 'zod.z.float32() should return a truthy value');

        // The returned object may expose a `parse` method (as in the official Zod API)
        // or be directly callable as a validator function. We handle both cases.
        if (typeof schema.parse === 'function') {
            // Valid number should pass without throwing
            assert.doesNotThrow(() => schema.parse(3.1415), 'Valid float should parse successfully');
            // Invalid type should throw
            assert.throws(() => schema.parse('not a number'), /invalid/i, 'Non‑number should cause a validation error');
        } else if (typeof schema === 'function') {
            // Directly callable validator
            assert.doesNotThrow(() => schema(2.718), 'Valid float should be accepted');
            assert.throws(() => schema('oops'), /invalid/i, 'Non‑number should be rejected');
        } else {
            // Fallback: ensure we got an object (the exact shape is library‑specific)
            assert.strictEqual(typeof schema, 'object', 'Returned value should be an object');
        }

        done();
    });
});