let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.e164', function(done) {
        // Create the E.164 schema
        const schema = zod.z.e164();

        // Valid E.164 numbers should parse without throwing
        assert.doesNotThrow(() => schema.parse('+14155552671'));
        assert.doesNotThrow(() => schema.parse('+442071838750'));
        assert.doesNotThrow(() => schema.parse('+8613800138000'));

        // Invalid numbers should throw a ZodError
        assert.throws(() => schema.parse('14155552671'), /Invalid/); // missing '+'
        assert.throws(() => schema.parse('+1'), /Invalid/); // too short
        assert.throws(() => schema.parse('+12345678901234567890'), /Invalid/); // too long
        assert.throws(() => schema.parse('+12-3456-7890'), /Invalid/); // contains non‑digit characters

        done();
    });
});