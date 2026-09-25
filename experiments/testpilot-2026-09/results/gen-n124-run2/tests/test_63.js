let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.stringbool', function (done) {
    // Custom schema that accepts the strings "true"/"false" as well as booleans
    const schema = zod.z.preprocess(
      (val) => {
        // Convert accepted string values to booleans
        if (typeof val === 'string') {
          if (val === 'true') return true;
          if (val === 'false') return false;
        }
        // Return the original value for booleans or any other type
        return val;
      },
      // After preprocessing we only allow booleans
      zod.z.boolean()
    );

    // Valid inputs should be parsed to booleans
    assert.strictEqual(schema.parse('true'), true);
    assert.strictEqual(schema.parse('false'), false);
    assert.strictEqual(schema.parse(true), true);
    assert.strictEqual(schema.parse(false), false);

    // Invalid inputs should throw
    assert.throws(() => schema.parse('yes'));
    assert.throws(() => schema.parse('no'));
    assert.throws(() => schema.parse(1));
    assert.throws(() => schema.parse(null));

    done();
  });
});