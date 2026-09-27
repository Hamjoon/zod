let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.endsWith', function(done) {
        // basic suffix check
        const suffix = 'world';
        const check = zod.z.endsWith(suffix);

        // the returned object should expose the configuration we passed
        assert.strictEqual(check.check, 'string_format', 'check type should be string_format');
        assert.strictEqual(check.format, 'ends_with', 'format should be ends_with');
        assert.strictEqual(check.suffix, suffix, 'suffix should be preserved');

        // ensure that additional params are merged correctly
        const extra = { custom: 'value' };
        const checkWithParams = zod.z.endsWith(suffix, extra);
        assert.strictEqual(checkWithParams.custom, extra.custom, 'custom param should be merged');

        done();
    });
});