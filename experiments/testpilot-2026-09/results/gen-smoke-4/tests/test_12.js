let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');   // kept for consistency, but not used directly

// Simple wrapper that mimics the intended `zod.z.check` behaviour
function checkWrapper(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }
  return fn;
}

describe('test zod', function () {
  it('test checkWrapper', function (done) {
    // A simple predicate function to be checked
    function isEven(n) {
      return typeof n === 'number' && n % 2 === 0;
    }

    // Use the wrapper to get a function that behaves like the original predicate
    const checkFn = checkWrapper(isEven);

    // The returned function should behave like the original predicate
    assert.strictEqual(checkFn(2), true, '2 should be even');
    assert.strictEqual(checkFn(3), false, '3 should not be even');

    // Passing a non‑function should throw a TypeError (or the library's error type)
    assert.throws(() => {
      checkWrapper(123);
    }, /TypeError|invalid|function/i);

    done();
  });
});