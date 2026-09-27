let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uppercase', function(done) {
        // Test default behavior (no params)
        const checkDefault = zod.z.uppercase();
        assert.strictEqual(checkDefault.check, 'string_format', 'check type should be string_format');
        assert.strictEqual(checkDefault.format, 'uppercase', 'format should be uppercase');

        // Test that custom parameters are merged correctly
        const customParams = { message: 'must be uppercase' };
        const checkCustom = zod.z.uppercase(customParams);
        assert.strictEqual(checkCustom.check, 'string_format', 'check type should still be string_format');
        assert.strictEqual(checkCustom.format, 'uppercase', 'format should still be uppercase');
        assert.strictEqual(checkCustom.message, 'must be uppercase', 'custom message should be preserved');

        done();
    });
});