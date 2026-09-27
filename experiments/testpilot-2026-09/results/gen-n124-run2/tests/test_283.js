const mocha = require('mocha');
const { describe, it } = mocha;
const assert = require('assert');
const zod = require('zod');

describe('test suite', function () {
  it('test case', function (done) {
    // Simple sanity check – this ensures the test is not empty
    assert.strictEqual(1, 1);

    // You could also add a Zod schema example if needed
    const schema = zod.string().min(1);
    const result = schema.safeParse('ok');
    assert.ok(result.success, 'Zod validation should succeed');

    // Signal Mocha that the async test is finished
    done();
  });
});