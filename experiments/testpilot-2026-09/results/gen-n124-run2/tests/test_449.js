let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.success', function(done) {
        // Use a simple value to pass to z.success
        const value = 'hello world';
        const result = zod.z.success(value);

        // The result should be an object with success:true and data equal to the original value
        assert.deepStrictEqual(result, { success: true, data: value });
        done();
    });
});