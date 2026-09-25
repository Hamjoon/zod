let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');   // use the proper Zod export

describe('test zod', function () {
    it('test zod.z.catch fallback', function (done) {
        // Define an inner schema that expects a string of at least 3 characters
        const innerSchema = z.string().min(3);

        // Create a schema that falls back to a default value on any validation error
        const schema = innerSchema.catch('default-value');

        // Valid input should pass through unchanged
        const validResult = schema.parse('hello');
        assert.strictEqual(validResult, 'hello');

        // Invalid input (too short) should fall back to the default value
        const invalidResult = schema.parse('hi');
        assert.strictEqual(invalidResult, 'default-value');

        // Also ensure that non‑string input falls back to the default
        const nonStringResult = schema.parse(123);
        assert.strictEqual(nonStringResult, 'default-value');

        done();
    });
});