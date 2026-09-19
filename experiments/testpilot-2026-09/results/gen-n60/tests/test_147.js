let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.looseObject', function(done) {
        // Define a loose object schema with a required `name` string property
        const LooseDog = zod.z.looseObject({ name: zod.z.string() });

        // Input that contains the required key plus an extra key
        const input = { name: "Yeller", extraKey: true };

        // Parsing should succeed and retain the extra key
        const result = LooseDog.parse(input);
        assert.deepStrictEqual(result, input, "Loose object should retain extra keys");

        // Parsing an object missing the required `name` should throw a ZodError
        try {
            LooseDog.parse({ extraKey: true });
            // If we get here, the test should fail
            assert.fail("Parsing should have thrown a ZodError for missing required key");
        } catch (e) {
            // Ensure the thrown error is a ZodError
            assert(e instanceof zod.z.ZodError, "Error should be an instance of ZodError");
        }

        done();
    });
});