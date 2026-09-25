let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.startsWith', function(done) {
        // basic usage – only prefix
        const prefix = 'hello';
        const check = zod.z.startsWith(prefix);

        // the returned object should contain the expected fields
        assert.strictEqual(check.check, 'string_format', 'check type should be string_format');
        assert.strictEqual(check.format, 'starts_with', 'format should be starts_with');
        assert.strictEqual(check.prefix, prefix, 'prefix should be preserved');

        // usage with additional params – they should be merged into the result
        const extraParams = { message: 'must start with hello' };
        const checkWithParams = zod.z.startsWith(prefix, extraParams);

        assert.strictEqual(checkWithParams.check, 'string_format');
        assert.strictEqual(checkWithParams.format, 'starts_with');
        assert.strictEqual(checkWithParams.prefix, prefix);
        assert.strictEqual(checkWithParams.message, extraParams.message, 'extra params should be merged');

        done();
    });
});