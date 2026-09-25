let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.looseObject', function(done) {
        // Create a loose object schema
        const LooseDog = zod.z.looseObject({
            name: zod.z.string(),
        });

        // Input with an extra key should be accepted and retained
        const input = { name: "Yeller", extraKey: true };
        const parsed = LooseDog.parse(input);
        assert.deepStrictEqual(parsed, input, "Loose object should retain extra keys");

        // Invalid type for a defined key should throw a ZodError
        try {
            LooseDog.parse({ name: 123 });
            // If we get here, the test should fail
            assert.fail("Parsing should have thrown a ZodError for invalid type");
        } catch (e) {
            // Ensure the thrown error is a ZodError
            assert(e instanceof zod.ZodError, "Error should be an instance of ZodError");
        }

        done();
    });
});