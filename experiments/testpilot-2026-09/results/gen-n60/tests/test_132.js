let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.never', function(done) {
        // The never schema should reject any input
        const neverSchema = zod.never();

        assert.throws(() => neverSchema.parse(undefined));
        assert.throws(() => neverSchema.parse(null));
        assert.throws(() => neverSchema.parse(0));
        assert.throws(() => neverSchema.parse("any string"));
        assert.throws(() => neverSchema.parse({}));

        // When combined with another schema via .or, the never schema should be ignored
        const Keys = zod.enum(["id", "name", "email"]).or(zod.never());

        // Valid enum values are accepted
        assert.strictEqual(Keys.parse("id"), "id");
        assert.strictEqual(Keys.parse("name"), "name");
        assert.strictEqual(Keys.parse("email"), "email");

        // Values not in the enum should still be rejected (never does not make them valid)
        assert.throws(() => Keys.parse("unknown"));
        assert.throws(() => Keys.parse(123));

        done();
    });
});