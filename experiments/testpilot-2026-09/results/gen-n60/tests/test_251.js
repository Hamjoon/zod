let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.endsWith', function(done) {
        const suffix = 'abc';
        const params = { message: 'must end with abc' };
        const check = zod.z.endsWith(suffix, params);

        // Verify the core properties of the returned check object
        assert.strictEqual(check.check, 'string_format', 'check type should be string_format');
        assert.strictEqual(check.format, 'ends_with', 'format should be ends_with');
        assert.strictEqual(check.suffix, suffix, 'suffix should match the provided value');

        // Verify that additional params are merged correctly
        assert.strictEqual(check.message, params.message, 'custom message should be preserved');

        done();
    });
});