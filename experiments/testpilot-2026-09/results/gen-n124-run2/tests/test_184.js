let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.e164', function(done) {
        // Create the E.164 schema (no custom params needed for basic validation)
        const schema = zod.z.e164();

        // Valid E.164 numbers should pass
        const validSamples = [
            '+14155552671',
            '+442071838750',
            '+8613800138000',
            '+918527001234'
        ];
        validSamples.forEach(sample => {
            const result = schema.safeParse(sample);
            assert.strictEqual(result.success, true, `Expected "${sample}" to be valid`);
        });

        // Invalid numbers should fail
        const invalidSamples = [
            '4155552671',          // missing leading '+'
            '+1 415 555 2671',     // spaces not allowed
            '+1-415-555-2671',     // dashes not allowed
            '+123',                // too short
            '+1234567890123456',   // too long (max 15 digits after '+')
            '++14155552671',       // double plus
            '+1415a552671'         // non‑digit character
        ];
        invalidSamples.forEach(sample => {
            const result = schema.safeParse(sample);
            assert.strictEqual(result.success, false, `Expected "${sample}" to be invalid`);
        });

        done();
    });
});