let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.strictObject', function(done) {
        // Create a strict object schema with a single required string property
        const StrictDog = zod.z.strictObject({ name: zod.string() });

        // Valid object should parse without throwing
        assert.doesNotThrow(() => {
            StrictDog.parse({ name: "Yeller" });
        }, "Valid object should not throw");

        // Missing required property should throw a ZodError
        assert.throws(() => {
            StrictDog.parse({});
        }, zod.ZodError, "Missing required property should throw ZodError");

        // Extra unknown property should also throw a ZodError because the object is strict
        assert.throws(() => {
            StrictDog.parse({ name: "Yeller", extraKey: true });
        }, zod.ZodError, "Extra unknown property should throw ZodError");

        done();
    });
});