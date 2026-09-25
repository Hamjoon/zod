let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.preprocess', function(done) {
        // Preprocess: trim whitespace before validating a string of at least 3 characters
        const schema = zod.z.preprocess(
            (val) => (typeof val === 'string' ? val.trim() : val),
            zod.z.string().min(3)
        );

        // Should succeed after trimming
        const ok = schema.safeParse('  abc  ');
        assert.strictEqual(ok.success, true);
        assert.strictEqual(ok.data, 'abc');

        // Should fail because the trimmed value is too short
        const fail = schema.safeParse('  ab  ');
        assert.strictEqual(fail.success, false);

        done();
    });
});