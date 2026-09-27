let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.string', function(done) {
        // basic length constraints
        const schema = zod.z.string()
            .min(5, { message: "Too short" })
            .max(10, { message: "Too long" });

        // valid value passes through unchanged
        assert.strictEqual(schema.parse("12345"), "12345");

        // value shorter than min should throw with the custom message
        assert.throws(() => schema.parse("123"), /Too short/);

        // value longer than max should throw with the custom message
        assert.throws(() => schema.parse("12345678901"), /Too long/);

        // email validation
        const emailSchema = zod.z.string()
            .email({ message: "Invalid email address" });

        // valid email passes
        assert.strictEqual(emailSchema.parse("test@example.com"), "test@example.com");

        // invalid email throws with the custom message
        assert.throws(() => emailSchema.parse("not-an-email"), /Invalid email address/);

        done();
    });
});