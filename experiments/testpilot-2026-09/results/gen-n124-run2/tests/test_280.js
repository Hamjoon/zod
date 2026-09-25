let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.never', function(done) {
        // Create a never schema
        const neverSchema = zod.z.never();

        // The schema should reject any value when using parse (throws)
        assert.throws(() => neverSchema.parse(undefined));
        assert.throws(() => neverSchema.parse(null));
        assert.throws(() => neverSchema.parse(123));
        assert.throws(() => neverSchema.parse('any string'));

        // The schema should report failure when using safeParse
        const result1 = neverSchema.safeParse(undefined);
        const result2 = neverSchema.safeParse('test');
        assert.strictEqual(result1.success, false);
        assert.strictEqual(result2.success, false);

        done();
    });
});