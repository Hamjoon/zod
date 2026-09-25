let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // use the named export for clarity

describe('test zod', function () {
    it('test zod.z.boolean', function (done) {
        const schema = z.boolean();

        // Valid boolean values should be parsed unchanged
        assert.strictEqual(schema.parse(true), true);
        assert.strictEqual(schema.parse(false), false);

        // Invalid values should throw a ZodError containing the expected message.
        // Zod's error message now reads: "Invalid input: expected boolean, received <type>"
        // Adjust the regex to match this wording.
        assert.throws(() => schema.parse('true'), /expected boolean/);
        assert.throws(() => schema.parse(1), /expected boolean/);
        assert.throws(() => schema.parse(null), /expected boolean/);
        assert.throws(() => schema.parse(undefined), /expected boolean/);

        done();
    });
});