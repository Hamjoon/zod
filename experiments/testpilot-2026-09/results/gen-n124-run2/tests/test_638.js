let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.length', function(done) {
        // basic usage – no extra params
        const checkDefault = zod.z.length(5);
        // the returned object should contain the correct check type and length
        assert.strictEqual(checkDefault.check, 'length_equals', 'check type should be length_equals');
        assert.strictEqual(checkDefault.length, 5, 'length should be the value passed in');

        // when a params object is supplied, its properties should be merged into the result
        const customMessage = 'Must be exactly 5 characters long';
        const checkWithParams = zod.z.length(5, { message: customMessage });
        assert.strictEqual(checkWithParams.check, 'length_equals', 'check type should still be length_equals');
        assert.strictEqual(checkWithParams.length, 5, 'length should still be the value passed in');
        // the custom message should be present on the returned object
        assert.strictEqual(checkWithParams.message, customMessage, 'custom message should be propagated');

        done();
    });
});