let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uint32', function(done) {
        // Create a uint32 schema (no extra params)
        const schema = zod.z.uint32();

        // Valid values should parse without throwing
        assert.doesNotThrow(() => schema.parse(0));
        assert.doesNotThrow(() => schema.parse(123));
        assert.doesNotThrow(() => schema.parse(4294967295)); // max uint32

        // Invalid values should throw a validation error
        assert.throws(() => schema.parse(-1));               // below range
        assert.throws(() => schema.parse(4294967296));       // above range
        assert.throws(() => schema.parse(3.14));             // not an integer
        assert.throws(() => schema.parse("123"));            // not a number

        done();
    });
});