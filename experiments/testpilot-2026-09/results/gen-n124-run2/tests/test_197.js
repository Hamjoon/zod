let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.number', function(done) {
        // extract the Zod builder
        const { z } = zod;

        // Basic number schema with integer and max constraints
        const intMaxSchema = z.number().int().max(10);

        // Valid integer within range
        assert.strictEqual(intMaxSchema.safeParse(5).success, true);

        // Float should fail because of .int()
        assert.strictEqual(intMaxSchema.safeParse(5.5).success, false);

        // Number exceeding max should fail
        assert.strictEqual(intMaxSchema.safeParse(11).success, false);

        // Non‑number should fail
        assert.strictEqual(intMaxSchema.safeParse('5').success, false);

        // Test .overwrite() transformation and .max()
        const transformedSchema = z.number()
            .overwrite(val => val * 2) // double the input
            .max(20); // after transformation, value must be ≤ 20

        const transformedResult = transformedSchema.safeParse(8);
        assert.strictEqual(transformedResult.success, true);
        // The output should be the transformed value (8 * 2 = 16)
        assert.strictEqual(transformedResult.data, 16);

        // Ensure infinite values are rejected
        assert.strictEqual(z.number().safeParse(Infinity).success, false);
        assert.strictEqual(z.number().safeParse(-Infinity).success, false);

        done();
    });
});