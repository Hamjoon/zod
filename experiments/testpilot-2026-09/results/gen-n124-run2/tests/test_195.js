let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.number', function(done) {
        // basic number validation
        const basic = zod.number();
        assert.strictEqual(basic.safeParse(42).success, true, '42 should be valid');
        assert.strictEqual(basic.safeParse('42').success, false, '"42" should be invalid');

        // infinite values are not allowed
        assert.strictEqual(zod.number().safeParse(Infinity).success, false, 'Infinity should be invalid');
        assert.strictEqual(zod.number().safeParse(-Infinity).success, false, '-Infinity should be invalid');

        // integer validation
        const intSchema = zod.number().int();
        assert.strictEqual(intSchema.safeParse(10).success, true, '10 should be a valid int');
        assert.strictEqual(intSchema.safeParse(10.5).success, false, '10.5 should be invalid as int');

        // max constraint
        const maxSchema = zod.number().max(100);
        assert.strictEqual(maxSchema.safeParse(100).success, true, '100 should be <= max 100');
        assert.strictEqual(maxSchema.safeParse(101).success, false, '101 should be > max 100');

        done();
    });
});