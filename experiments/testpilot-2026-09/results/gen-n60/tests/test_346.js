let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');

describe('test zod', function () {
  it('test custom boolean coercion', function (done) {
    // Custom schema that coerces values to boolean the way the test expects
    const schema = z.preprocess((val) => {
      // already a boolean – keep it
      if (typeof val === 'boolean') return val;

      // numbers 0 / 1
      if (typeof val === 'number') {
        if (val === 1) return true;
        if (val === 0) return false;
      }

      // strings "true"/"false"/"1"/"0" (case‑insensitive)
      if (typeof val === 'string') {
        const lowered = val.toLowerCase();
        if (lowered === 'true' || lowered === '1') return true;
        if (lowered === 'false' || lowered === '0') return false;
      }

      // let Zod handle everything else (will throw)
      return val;
    }, z.boolean());

    // Values that should be successfully coerced
    const validCases = [
      [true, true],
      [false, false],
      ['true', true],
      ['false', false],
      [1, true],
      [0, false],
      ['1', true],
      ['0', false],
    ];

    // Verify each valid case
    validCases.forEach(([input, expected]) => {
      assert.strictEqual(
        schema.parse(input),
        expected,
        `Failed to coerce ${JSON.stringify(input)}`
      );
    });

    // Values that should cause a validation error
    const invalidCases = [
      'yes',
      'no',
      2,
      -1,
      null,
      undefined,
      {},
      [],
    ];

    // Verify each invalid case throws
    invalidCases.forEach((input) => {
      assert.throws(() => schema.parse(input));
    });

    done();
  });
});