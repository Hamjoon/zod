let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.boolean', function(done) {
        // Obtain a boolean schema from the library
        const schema = zod.z.boolean();

        // The schema should accept true and false and return the same values
        assert.strictEqual(schema.parse(true), true);
        assert.strictEqual(schema.parse(false), false);

        // The schema should reject non‑boolean values
        assert.throws(() => schema.parse(1), /Expected boolean/);
        assert.throws(() => schema.parse('true'), /Expected boolean/);
        assert.throws(() => schema.parse(null), /Expected boolean/);
        assert.throws(() => schema.parse(undefined), /Expected boolean/);

        done();
    });
});