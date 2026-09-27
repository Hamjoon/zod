let mocha = require('mocha');
let assert = require('assert');
let { nanoid } = require('nanoid');

// Mock a `zod`‑like object that provides `z.nanoid` returning a string.
let zod = {
  z: {
    nanoid: (options) => {
      // If a custom length is supplied, pass it to nanoid, otherwise use the default.
      if (options && typeof options.length === 'number') {
        return nanoid(options.length);
      }
      return nanoid(); // default length is 21
    },
  },
};

describe('test zod', function () {
  it('test zod.z.nanoid', function (done) {
    // Generate two IDs with default settings
    const id1 = zod.z.nanoid();
    const id2 = zod.z.nanoid();

    // Both should be strings
    assert.strictEqual(typeof id1, 'string');
    assert.strictEqual(typeof id2, 'string');

    // They should be different (high probability)
    assert.notStrictEqual(id1, id2);

    // Default nanoid length is 21 characters (the typical nanoid default)
    assert.strictEqual(id1.length, 21);
    assert.strictEqual(id2.length, 21);

    // Generate an ID with a custom length
    const customLength = 10;
    const customId = zod.z.nanoid({ length: customLength });

    // The custom ID should have the requested length
    assert.strictEqual(customId.length, customLength);
    assert.strictEqual(typeof customId, 'string');

    done();
  });
});