const mocha = require('mocha');
const assert = require('assert');
const { z } = require('zod'); // use the proper Zod API

describe('test zod', function () {
  it('test zod.z.positive', function (done) {
    // Positive numbers should pass without throwing
    assert.doesNotThrow(() => {
      z.number().positive().parse(1);
      z.number().positive().parse(123.45);
    }, 'Positive numbers should not cause an error');

    // Zero should cause an error
    assert.throws(() => {
      z.number().positive().parse(0);
    }, /.+/, 'Zero should cause an error');

    // Negative numbers should cause an error
    assert.throws(() => {
      z.number().positive().parse(-5);
    }, /.+/, 'Negative numbers should cause an error');

    done();
  });
});