let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.int64', function(done) {
        // basic range checks
        const int64 = zod.z.int64();

        // values inside the signed 64‑bit range should pass
        assert.doesNotThrow(() => int64.parse(-9223372036854775808n));
        assert.doesNotThrow(() => int64.parse(0n));
        assert.doesNotThrow(() => int64.parse(9223372036854775807n));

        // values outside the range should throw a ZodError
        try {
            int64.parse(-9223372036854775809n);
            assert.fail('Expected too_small error');
        } catch (e) {
            assert(e.errors && e.errors[0].code === 'too_small', 'got too_small error');
        }

        try {
            int64.parse(9223372036854775808n);
            assert.fail('Expected too_big error');
        } catch (e) {
            assert(e.errors && e.errors[0].code === 'too_big', 'got too_big error');
        }

        // custom error handling – override the message for a too_big issue
        const customInt64 = zod.z.int64({
            error: (issue) => {
                if (issue.code === 'too_big') {
                    return { message: `Value must be <${issue.maximum}` };
                }
                // defer to default handling for other issues
                return undefined;
            },
        });

        try {
            customInt64.parse(9223372036854775808n);
            assert.fail('Expected custom too_big error');
        } catch (e) {
            const err = e.errors && e.errors[0];
            assert(err, 'error object exists');
            assert.strictEqual(err.message, `Value must be <${9223372036854775807n}`);
        }

        done();
    });
});