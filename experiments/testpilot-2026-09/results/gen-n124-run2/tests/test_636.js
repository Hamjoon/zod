let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.length', function(done) {
        const length = 10;
        const params = { someOption: true, extra: 'value' };

        // Call the function under test
        const result = zod.z.length(length, params);

        // Verify that an object is returned
        assert.ok(result && typeof result === 'object');

        // Verify the core properties added by the function
        assert.strictEqual(result.check, 'length_equals');
        assert.strictEqual(result.length, length);

        // Verify that the provided params are merged into the result
        Object.keys(params).forEach(key => {
            assert.strictEqual(result[key], params[key]);
        });

        done();
    });
});