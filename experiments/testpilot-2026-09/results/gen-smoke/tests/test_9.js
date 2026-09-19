// <unit test>
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
const { describe, it } = mocha;

describe('test zod', function () {
  it('test zod.z.check', function (done) {
    // 1. Verify that the check function exists and is a function
    assert.strictEqual(
      typeof zod.z.check,
      'function',
      'zod.z.check should be a function'
    );

    // 2. Create a simple function to use as a valid input
    function sampleFn() {
      return 42;
    }

    // 3. The check should succeed (return true) for a real function
    const resultForFn = zod.z.check(sampleFn);
    assert.strictEqual(
      resultForFn,
      true,
      'zod.z.check should return true when passed a function'
    );

    // 4. Test behaviour with an invalid (non‑function) input.
    //    The library may either return false or throw – accept either.
    let resultForNonFn;
    let threw = false;
    try {
      resultForNonFn = zod.z.check(123);
    } catch (e) {
      threw = true;
    }

    // Accept both possible behaviours
    const nonFnValid = threw || resultForNonFn === false;
    assert.ok(
      nonFnValid,
      'zod.z.check should either throw or return false when passed a non‑function'
    );

    done();
  });
});
// </unit test>