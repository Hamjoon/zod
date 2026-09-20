const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test z.coerce.number', function (done) {
    // Create a coerced number schema
    const schema = z.coerce.number();

    // Valid coercions
    assert.strictEqual(schema.parse('42'), 42);
    assert.strictEqual(schema.parse(3.14), 3.14);
    assert.strictEqual(schema.parse('0'), 0);

    // safeParse should succeed for a numeric string
    const safeResult = schema.safeParse('100');
    assert.strictEqual(safeResult.success, true);
    assert.strictEqual(safeResult.data, 100);

    // Invalid coercion should throw – match the actual error message
    assert.throws(() => schema.parse('not-a-number'), /expected number/i);

    done();
  });
});