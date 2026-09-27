let assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test number .lt() validation', function (done) {
    // Create a "less than" schema with a custom error message
    const schema = z.number().lt(10, { message: 'must be less than 10' });

    // Values lower than the limit should pass without throwing
    assert.doesNotThrow(() => schema.parse(5));

    // Values equal to the limit should fail with the custom message
    assert.throws(() => schema.parse(10), /must be less than 10/);

    // Values greater than the limit should also fail with the custom message
    assert.throws(() => schema.parse(15), /must be less than 10/);

    done();
  });
});