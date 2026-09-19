// test-zod-coerce-boolean.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod'); // import the Zod namespace

describe('test zod', function () {
  it('test z.coerce.boolean', function () {
    // Valid coercions – use the schema's `parse` method
    assert.strictEqual(z.coerce.boolean().parse('true'), true);
    assert.strictEqual(z.coerce.boolean().parse('false'), false);
    assert.strictEqual(z.coerce.boolean().parse(1), true);
    assert.strictEqual(z.coerce.boolean().parse(0), false);

    // Invalid coercion should throw
    assert.throws(() => z.coerce.boolean().parse('yes'));
  });
});