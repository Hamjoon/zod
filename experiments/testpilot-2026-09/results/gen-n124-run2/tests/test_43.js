let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.coerce.boolean (fixed)', function (done) {
    // Custom preprocessing to correctly coerce strings "true"/"false"
    // and numbers 1/0 to booleans.
    const schema = zod.z.preprocess((val) => {
      // Handle string inputs
      if (typeof val === 'string') {
        const lowered = val.toLowerCase().trim();
        if (lowered === 'true') return true;
        if (lowered === 'false') return false;
      }
      // Handle numeric inputs (1 and 0)
      if (typeof val === 'number') {
        if (val === 1) return true;
        if (val === 0) return false;
      }
      // Let Zod handle booleans and any other values (will throw if invalid)
      return val;
    }, zod.z.boolean());

    // Valid coercions
    assert.strictEqual(schema.parse(true), true);
    assert.strictEqual(schema.parse(false), false);
    assert.strictEqual(schema.parse('true'), true);
    assert.strictEqual(schema.parse('false'), false);
    assert.strictEqual(schema.parse(1), true);
    assert.strictEqual(schema.parse(0), false);

    // Invalid value should throw
    assert.throws(() => schema.parse('yes'));

    done();
  });
});