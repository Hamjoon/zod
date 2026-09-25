let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.bigint', function (done) {
        // Create a bigint schema using the function under test
        const schema = zod.z.bigint();

        // Valid bigint should be parsed unchanged
        assert.strictEqual(schema.parse(42n), 42n);

        // Non‑bigint values should throw a validation error.
        // Zod's error message is: "Invalid input: expected bigint, received ..."
        // Hence we match on the lower‑case “expected bigint” part.
        assert.throws(() => schema.parse(42), /expected bigint/);
        assert.throws(() => schema.parse("42"), /expected bigint/);
        assert.throws(() => schema.parse(null), /expected bigint/);

        done();
    });
});