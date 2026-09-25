let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.check', function(done) {
        // Should throw when the argument is not a function
        assert.throws(() => {
            zod.z.check(123);
        }, /function/);

        // When a proper function is supplied, it should return a function
        // that behaves like the original.
        const original = (a, b) => a + b;
        const checked = zod.z.check(original);
        assert.strictEqual(typeof checked, 'function');
        assert.strictEqual(checked(2, 3), 5);

        done();
    });
});