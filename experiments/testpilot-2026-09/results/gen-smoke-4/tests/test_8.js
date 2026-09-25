let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.check', function(done) {
        // A simple predicate function to be checked
        function isEven(n) {
            return typeof n === 'number' && n % 2 === 0;
        }

        // Use zod.z.check to wrap the predicate
        const checkFn = zod.z.check(isEven);

        // The returned function should behave like the original predicate
        assert.strictEqual(checkFn(2), true, '2 should be even');
        assert.strictEqual(checkFn(3), false, '3 should not be even');

        // Passing a non‑function should throw a TypeError (or the library's error type)
        assert.throws(() => {
            zod.z.check(123);
        }, /TypeError|invalid|function/i);

        done();
    });
});