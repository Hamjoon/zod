let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.iso.time', function(done) {
        // create the ISO time schema
        const timeSchema = zod.z.iso.time();

        // valid time strings – should not throw
        assert.doesNotThrow(() => timeSchema.parse("03:15"));
        assert.doesNotThrow(() => timeSchema.parse("03:15:00"));
        assert.doesNotThrow(() => timeSchema.parse("03:15:00.9999999"));

        // invalid time strings – should throw a ZodError
        assert.throws(() => timeSchema.parse("25:61"), zod.ZodError);
        assert.throws(() => timeSchema.parse("not-a-time"), zod.ZodError);
        assert.throws(() => timeSchema.parse("03:15:00.abc"), zod.ZodError);

        // ensure the underlying JSON schema reflects the correct format
        const jsonSchema = timeSchema._def; // internal definition used by Zod
        assert.strictEqual(jsonSchema.type, "string");
        assert.strictEqual(jsonSchema.format, "time");

        done();
    });
});