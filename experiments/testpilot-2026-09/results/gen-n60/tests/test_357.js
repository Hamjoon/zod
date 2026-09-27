let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.iso.time', function(done) {
        // Create the ISO time schema
        const timeSchema = zod.z.iso.time();

        // Valid ISO time strings should parse without throwing
        assert.doesNotThrow(() => timeSchema.parse("03:15"));
        assert.doesNotThrow(() => timeSchema.parse("03:15:00"));
        assert.doesNotThrow(() => timeSchema.parse("03:15:00.9999999"));

        // Invalid strings should cause a validation error
        assert.throws(() => timeSchema.parse("25:00"));
        assert.throws(() => timeSchema.parse("03:15:00.abc"));
        assert.throws(() => timeSchema.parse("not-a-time"));

        done();
    });
});