let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.number', function(done) {
        // Create a number schema using the function under test
        const schema = zod.z.number();

        // The schema should accept valid numbers
        assert.strictEqual(schema.parse(0), 0);
        assert.strictEqual(schema.parse(123.45), 123.45);
        assert.strictEqual(schema.parse(-10), -10);

        // The schema should reject non‑number values
        assert.throws(() => schema.parse('string'), /expected number/i);
        assert.throws(() => schema.parse(true), /expected number/i);
        assert.throws(() => schema.parse(null), /expected number/i);
        assert.throws(() => schema.parse(undefined), /expected number/i);
        assert.throws(() => schema.parse({}), /expected number/i);
        assert.throws(() => schema.parse([]), /expected number/i);

        done();
    });
});