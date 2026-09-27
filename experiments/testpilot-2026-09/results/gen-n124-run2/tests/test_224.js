let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.uint32', function(done) {
        // Create a uint32 schema (no params needed for basic validation)
        const schema = zod.z.uint32();

        // Values that should be accepted
        assert.doesNotThrow(() => schema.parse(0), '0 should be a valid uint32');
        assert.doesNotThrow(() => schema.parse(123), '123 should be a valid uint32');
        assert.doesNotThrow(() => schema.parse(4294967295), 'Maximum uint32 value should be accepted');

        // Values that should be rejected
        assert.throws(() => schema.parse(-1), /invalid|out of range/, '-1 should be rejected');
        assert.throws(() => schema.parse(4294967296), /invalid|out of range/, 'Value above max uint32 should be rejected');
        assert.throws(() => schema.parse('123'), /invalid|expected/, 'String input should be rejected');

        done();
    });
});