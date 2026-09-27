// test-zod-endsWith.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod'); // use the named export `z`

describe('test zod', function () {
  it('test zod.string().endsWith', function (done) {
    const suffix = 'abc';
    const params = { message: 'must end with abc' };

    // Build a Zod string schema that must end with the given suffix
    const schema = z.string().endsWith(suffix, params);

    // Zod stores validation checks in the internal `_def.checks` array.
    // The first (and only) check for `endsWith` should have:
    //   - kind: 'endsWith'
    //   - value: the suffix we passed
    //   - message: our custom error message
    const check = schema._def.checks[0];

    // Verify the core properties of the returned check object
    assert.strictEqual(
      check.kind,
      'endsWith',
      'check kind should be endsWith'
    );
    assert.strictEqual(
      check.value,
      suffix,
      'suffix should match the provided value'
    );

    // Verify that additional params are merged correctly
    assert.strictEqual(
      check.message,
      params.message,
      'custom message should be preserved'
    );

    done();
  });
});