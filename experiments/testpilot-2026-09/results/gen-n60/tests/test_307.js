let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.preprocess', function(done) {
        // Create a schema that coerces strings to integers before validation
        const coercedInt = zod.z.preprocess(
            (val) => {
                if (typeof val === "string") {
                    return Number.parseInt(val);
                }
                return val;
            },
            zod.z.int()
        );

        // Should parse a numeric string to an integer
        const fromString = coercedInt.parse("42");
        assert.strictEqual(fromString, 42, 'String "42" should be coerced to integer 42');

        // Should pass through an already‑integer value unchanged
        const fromNumber = coercedInt.parse(7);
        assert.strictEqual(fromNumber, 7, 'Integer 7 should remain 7');

        // Non‑numeric string should fail validation
        assert.throws(
            () => coercedInt.parse("abc"),
            zod.ZodError,
            'Non‑numeric string should throw a ZodError'
        );

        // Float should fail integer validation
        assert.throws(
            () => coercedInt.parse(3.14),
            zod.ZodError,
            'Float should throw a ZodError'
        );

        done();
    });
});