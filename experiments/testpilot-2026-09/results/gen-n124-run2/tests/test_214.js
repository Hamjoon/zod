const mocha = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod.z.float64', function (done) {
    // Valid input should be accepted and returned unchanged
    const validNumber = 3.1415926535;
    const result = z.float64().parse(validNumber);
    assert.strictEqual(typeof result, 'number');
    assert.strictEqual(result, validNumber);

    // Invalid input should cause an exception
    assert.throws(() => {
      z.float64().parse('not a number');
    });

    done();
  });
});