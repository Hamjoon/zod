let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.int', function(done) {
        const intSchema = zod.z.int();

        // ---- Valid safe integers ----
        const validValues = [
            0,
            1,
            -1,
            Number.MAX_SAFE_INTEGER,
            Number.MIN_SAFE_INTEGER
        ];
        validValues.forEach(v => {
            assert.doesNotThrow(() => {
                const parsed = intSchema.parse(v);
                assert.strictEqual(parsed, v);
            }, `Value ${v} should be accepted as a safe integer`);
        });

        // ---- Invalid values ----
        const invalidValues = [
            0.5,                     // non‑integer
            Infinity,                // infinite
            -Infinity,               // infinite
            NaN,                     // not a number
            Number.MAX_SAFE_INTEGER + 1, // out of safe range
            Number.MIN_SAFE_INTEGER - 1, // out of safe range
            "42",                    // wrong type
            null,                    // wrong type
            {},                      // wrong type
        ];
        invalidValues.forEach(v => {
            assert.throws(() => {
                intSchema.parse(v);
            }, /Invalid|Expected|must be/, `Value ${JSON.stringify(v)} should be rejected`);
        });

        done();
    });
});