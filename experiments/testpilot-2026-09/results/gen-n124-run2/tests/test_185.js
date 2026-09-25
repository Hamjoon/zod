let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.e164', function(done) {
        // Create the E.164 schema
        const schema = zod.z.e164();

        // A set of valid E.164 numbers
        const validNumbers = [
            '+14155552671',      // US number
            '+442071838750',     // UK number
            '+8613800138000',    // China number
            '+918527001234',     // India number
            '+33123456789'       // France number
        ];

        // Ensure valid numbers pass without throwing
        validNumbers.forEach(num => {
            assert.doesNotThrow(() => schema.parse(num), `Valid E.164 number "${num}" threw an error`);
        });

        // A set of invalid numbers (wrong format, missing '+', too long, etc.)
        const invalidNumbers = [
            '12345',                 // No leading '+'
            '+1 415 555 2671',       // Contains spaces
            '++1234567890',          // Double plus
            '+',                     // Only plus sign
            '+12345678901234567890' // Exceeds max length
        ];

        // Ensure invalid numbers throw an error
        invalidNumbers.forEach(num => {
            assert.throws(() => schema.parse(num), `Invalid E.164 number "${num}" did not throw`);
        });

        done();
    });
});