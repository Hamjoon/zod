// test-zod-map.js
let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // use the Zod namespace

describe('test zod', function () {
  it('test z.map', function (done) {
    // Create a map schema where keys must be strings and values must be numbers
    const mapSchema = z.map(z.string(), z.number());

    // ---- Positive test: a valid Map should pass ----
    const validMap = new Map([
      ['one', 1],
      ['two', 2],
      ['three', 3],
    ]);
    const validResult = mapSchema.safeParse(validMap);
    assert.strictEqual(validResult.success, true, 'Valid map should succeed');
    // Zod returns a new Map instance; deep equality works for Map objects
    assert.deepStrictEqual(validResult.data, validMap, 'Returned map should equal the input map');

    // ---- Negative test 1: invalid key type (number instead of string) ----
    const invalidKeyMap = new Map([[1, 100]]); // key is a number, should be rejected
    const invalidKeyResult = mapSchema.safeParse(invalidKeyMap);
    assert.strictEqual(invalidKeyResult.success, false, 'Map with invalid key type should fail');
    // Ensure the error mentions the expected key type
    assert.ok(
      invalidKeyResult.error.issues.some((issue) => /string/.test(issue.message)),
      'Error message should mention expected string key type'
    );

    // ---- Negative test 2: invalid value type (string instead of number) ----
    const invalidValueMap = new Map([['validKey', 'notANumber']]); // value is a string, should be rejected
    const invalidValueResult = mapSchema.safeParse(invalidValueMap);
    assert.strictEqual(invalidValueResult.success, false, 'Map with invalid value type should fail');
    // Ensure the error mentions the expected value type
    assert.ok(
      invalidValueResult.error.issues.some((issue) => /number/.test(issue.message)),
      'Error message should mention expected number value type'
    );

    done();
  });
});