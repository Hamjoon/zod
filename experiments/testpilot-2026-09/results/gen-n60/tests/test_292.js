let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.positive', function(done) {
        // Create a schema that validates positive numbers.
        // According to the prompt, the API is `zod.z.positive(params)`.
        // We'll assume it returns a Zod schema (or a function with a `parse` method).
        const schema = zod.z.positive();

        // Positive numbers should pass validation.
        assert.doesNotThrow(() => schema.parse(1), 'Positive number 1 should be valid');
        assert.doesNotThrow(() => schema.parse(123.45), 'Positive float should be valid');

        // Zero and negative numbers should fail validation.
        assert.throws(() => schema.parse(0), /positive/, 'Zero should be invalid');
        assert.throws(() => schema.parse(-5), /positive/, 'Negative number should be invalid');

        // Non‑numeric values should also fail.
        assert.throws(() => schema.parse('10'), /number/, 'String should be invalid');
        assert.throws(() => schema.parse(null), /number/, 'null should be invalid');

        done();
    });
});