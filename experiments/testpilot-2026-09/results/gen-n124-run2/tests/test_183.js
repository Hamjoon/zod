let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.e164', function(done) {
        // Create the E.164 schema (no special params needed for default behavior)
        const schema = zod.z.e164({});

        // A valid E.164 phone number (starts with + and contains 10‑15 digits)
        const validNumber = '+14155552671';
        // An invalid phone number (missing leading + and too short)
        const invalidNumber = '4155552671';

        // The schema should accept the valid number without throwing
        assert.doesNotThrow(() => {
            const result = schema.parse(validNumber);
            // The parsed result should be exactly the input string
            assert.strictEqual(result, validNumber);
        }, 'Valid E.164 number threw an error');

        // The schema should reject the invalid number and throw a ZodError
        assert.throws(() => {
            schema.parse(invalidNumber);
        }, /Invalid|E\.164/, 'Invalid E.164 number did not throw');

        done();
    });
});