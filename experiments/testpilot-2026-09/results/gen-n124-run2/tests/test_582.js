let mocha = require('mocha');
let assert = require('assert');
let { z, ZodError } = require('zod'); // use the proper Zod exports

describe('test zod', function() {
    it('test zod.z.nonpositive', function(done) {
        // Create a number schema that only allows non‑positive values (<= 0)
        const schema = z.number().nonpositive();

        // Valid cases: negative numbers and zero should pass
        assert.strictEqual(schema.parse(-10), -10);
        assert.strictEqual(schema.parse(0), 0);

        // Invalid case: any positive number should throw a ZodError
        assert.throws(
            () => schema.parse(5),
            err =>
                err instanceof ZodError &&
                // Zod's error message for non‑positive numbers is "Too big: expected number to be <=0"
                /Too big/.test(err.message)
        );

        // Also ensure non‑numeric values are rejected
        assert.throws(
            () => schema.parse("not a number"),
            err => err instanceof ZodError
        );

        done();
    });
});