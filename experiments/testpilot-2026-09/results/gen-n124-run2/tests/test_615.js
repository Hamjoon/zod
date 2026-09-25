let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.size', function(done) {
        // basic usage – no extra params
        const check = zod.z.size(5);
        // the returned object should contain the expected properties
        assert.strictEqual(typeof check, 'object', 'size should return an object');
        assert.strictEqual(check.check, 'size_equals', 'check type should be "size_equals"');
        assert.strictEqual(check.size, 5, 'size property should match the supplied size');

        // usage with additional params – they should be merged into the result
        const customMessage = 'custom error';
        const checkWithParams = zod.z.size(3, { message: customMessage });
        assert.strictEqual(checkWithParams.check, 'size_equals', 'check type should still be "size_equals"');
        assert.strictEqual(checkWithParams.size, 3, 'size property should match the supplied size');
        // the custom param should be present on the returned object
        assert.strictEqual(checkWithParams.message, customMessage, 'custom param should be merged into the result');

        done();
    });
});