let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.boolean', function (done) {
    const schema = zod.z.boolean();

    // valid boolean values
    assert.strictEqual(schema.parse(true), true);
    assert.strictEqual(schema.parse(false), false);

    // invalid values should throw – match the actual Zod error message
    // Zod now returns messages like "Invalid input: expected boolean, received ..."
    // so we look for the phrase "expected boolean" (case‑insensitive)
    assert.throws(() => schema.parse('true'), /expected boolean/i);
    assert.throws(() => schema.parse(1), /expected boolean/i);
    assert.throws(() => schema.parse(null), /expected boolean/i);
    assert.throws(() => schema.parse(undefined), /expected boolean/i);

    done();
  });
});