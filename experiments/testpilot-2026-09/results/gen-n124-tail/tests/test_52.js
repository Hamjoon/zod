let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');   // import the Zod namespace correctly

describe('test zod', function () {
    it('test zod.z.toUpperCase', function (done) {
        // Create a Zod schema that transforms a string to upper‑case
        const upperSchema = z.string().transform((s) => s.toUpperCase());

        // Helper function that runs the schema's parse method
        const upper = (value) => upperSchema.parse(value);

        // basic string
        assert.strictEqual(upper('hello'), 'HELLO');
        // mixed characters
        assert.strictEqual(upper('World123'), 'WORLD123');
        // empty string
        assert.strictEqual(upper(''), '');
        done();
    });
});