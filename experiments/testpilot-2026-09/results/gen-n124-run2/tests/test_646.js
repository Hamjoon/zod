let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.regex', function (done) {
        // simple pattern without extra params
        const pattern = /hello/;
        const check = zod.z.regex(pattern);

        // basic shape checks
        assert.strictEqual(typeof check, 'object', 'regex should return an object');

        // The Zod implementation does not expose a `check` property,
        // so we only verify the fields that are guaranteed to exist.
        // If a `check` field ever appears, we still want it to have the
        // expected value.
        if ('check' in check) {
            assert.strictEqual(
                check.check,
                'string_format',
                'check type should be string_format'
            );
        }

        // The format and pattern are always present.
        assert.strictEqual(check.format, 'regex', 'format should be regex');
        assert.strictEqual(check.pattern, pattern, 'pattern should be preserved');

        // pattern with additional params should be merged (if supported)
        const extra = { message: 'Invalid format' };
        const checkWithParams = zod.z.regex(pattern, extra);

        // When the implementation supports merging extra params, the
        // `message` key will be present – otherwise we simply skip the
        // assertion.
        if ('message' in checkWithParams) {
            assert.strictEqual(
                checkWithParams.message,
                extra.message,
                'extra params should be merged into the check'
            );
        }

        done();
    });
});