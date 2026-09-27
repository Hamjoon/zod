const mocha = require('mocha');
const assert = require('assert');
const { z } = require('zod');   // import the Zod namespace correctly

describe('test zod', function () {
  it('test zod.z.nonpositive', function (done) {
    // Create a schema that only accepts non‑positive numbers
    const schema = z.number().nonpositive();

    // Values that should pass validation
    const valid = [0, -1, -42.5];
    valid.forEach((val) => {
      assert.doesNotThrow(
        () => schema.parse(val),
        `Expected ${val} to be accepted`
      );
    });

    // Values that should fail validation
    const invalid = [1, 0.1, 'string', null, undefined, {}];
    invalid.forEach((val) => {
      assert.throws(
        () => schema.parse(val),
        `Expected ${val} to be rejected`
      );
    });

    done();
  });
});