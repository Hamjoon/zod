let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nan', function(done) {
        // Create a schema that validates NaN values
        const nanSchema = zod.z.nan();

        // It should accept NaN and return a NaN value
        const result = nanSchema.parse(NaN);
        assert.ok(Number.isNaN(result), 'Schema should parse NaN to NaN');

        // It should reject any non‑NaN value (e.g., a regular number)
        assert.throws(() => nanSchema.parse(0), /Invalid input/);
        assert.throws(() => nanSchema.parse('NaN'), /Invalid input/);
        assert.throws(() => nanSchema.parse(undefined), /Invalid input/);

        done();
    });
});