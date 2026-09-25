let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.int64', function(done) {
        // basic schema without custom error handling
        const schema = zod.z.int64();

        // valid int64 values should pass
        assert.doesNotThrow(() => schema.parse(0n));
        assert.doesNotThrow(() => schema.parse(-9223372036854775808n));
        assert.doesNotThrow(() => schema.parse(9223372036854775807n));

        // values outside the int64 range should throw with appropriate codes
        assert.throws(() => schema.parse(-9223372036854775809n), err => {
            return err.errors && err.errors[0].code === 'too_small';
        });
        assert.throws(() => schema.parse(9223372036854775808n), err => {
            return err.errors && err.errors[0].code === 'too_big';
        });

        // schema with a custom error handler for the "too_big" case
        const customSchema = zod.z.int64({
            error: (issue) => {
                if (issue.code === 'too_big') {
                    // issue.maximum holds the maximum allowed value for int64
                    return { message: `Value must be <${issue.maximum}` };
                }
                // defer to default handling for other issues
                return undefined;
            }
        });

        // trigger the custom error and verify the overridden message
        try {
            customSchema.parse(9223372036854775808n);
        } catch (e) {
            assert.strictEqual(
                e.errors[0].message,
                `Value must be <${9223372036854775807n}`
            );
        }

        done();
    });
});