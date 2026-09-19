let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uppercase', function(done) {
        // basic usage without params
        const resultDefault = zod.z.uppercase();
        // The returned object should be an instance of the internal check class
        // and contain the expected properties.
        assert.ok(resultDefault, 'Result should be truthy');
        assert.strictEqual(resultDefault.check, 'string_format', 'check property should be "string_format"');
        assert.strictEqual(resultDefault.format, 'uppercase', 'format property should be "uppercase"');

        // usage with custom params – ensure they are merged correctly
        const customParams = { message: 'must be uppercase', errorCode: 123 };
        const resultCustom = zod.z.uppercase(customParams);
        assert.ok(resultCustom, 'Result with custom params should be truthy');
        assert.strictEqual(resultCustom.check, 'string_format', 'check property should still be "string_format"');
        assert.strictEqual(resultCustom.format, 'uppercase', 'format property should still be "uppercase"');
        // custom params should be present on the returned object
        assert.strictEqual(resultCustom.message, customParams.message, 'custom message should be preserved');
        assert.strictEqual(resultCustom.errorCode, customParams.errorCode, 'custom errorCode should be preserved');

        done();
    });
});