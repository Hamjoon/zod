let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.strictObject', function(done) {
        // Define a strict schema
        const StrictDog = zod.strictObject({ name: zod.string() });

        // Valid object should parse without throwing
        assert.doesNotThrow(() => {
            StrictDog.parse({ name: "Yeller" });
        }, "Valid object threw an error");

        // Object with extra keys should throw a ZodError
        assert.throws(() => {
            StrictDog.parse({ name: "Yeller", extraKey: true });
        }, (err) => {
            // Ensure the error is a ZodError and mentions the unexpected key
            return err instanceof zod.ZodError && /extraKey/.test(err.message);
        }, "Invalid object did not throw the expected ZodError");

        done();
    });
});