let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // import the Zod namespace correctly

describe('test zod', function () {
  it('test zod.map', function (done) {
    // Create a map schema with string keys and number values
    const schema = z.map(z.string(), z.number());

    // ---- Positive test: a valid Map should parse successfully ----
    const validMap = new Map([
      ['foo', 42],
      ['bar', 7],
    ]);
    const parsed = schema.parse(validMap);
    // Zod returns a new Map instance, so we compare the contents instead of the reference
    assert.deepStrictEqual(
      Array.from(parsed.entries()).sort(),
      Array.from(validMap.entries()).sort(),
      'Parsed map should contain the same entries as the original'
    );

    // ---- Negative test: wrong key type (number instead of string) ----
    const badKeyMap = new Map([[123, 1]]);
    assert.throws(() => schema.parse(badKeyMap), /Expected string/);

    // ---- Negative test: wrong value type (string instead of number) ----
    const badValueMap = new Map([['baz', 'not-a-number']]);
    assert.throws(() => schema.parse(badValueMap), /Expected number/);

    done();
  });
});