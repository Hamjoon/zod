let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.negative', function(done) {
        // Negative numbers should pass
        assert.strictEqual(zod.z.negative(-10), true, '-10 should be considered negative');
        assert.strictEqual(zod.z.negative(-0.0001), true, '-0.0001 should be considered negative');

        // Zero and positive numbers should fail
        assert.strictEqual(zod.z.negative(0), false, '0 should not be considered negative');
        assert.strictEqual(zod.z.negative(5), false, '5 should not be considered negative');
        assert.strictEqual(zod.z.negative(123.45), false, '123.45 should not be considered negative');

        done();
    });
});