let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.set', function (done) {
    // basic set schema with string values
    const stringSet = zod.set(zod.string());

    // a valid Set should parse correctly
    const validSet = new Set(['foo', 'bar']);
    const parsedValid = stringSet.parse(validSet);
    assert.deepStrictEqual(parsedValid, validSet);

    // an invalid Set (contains non‑string values) should throw
    const invalidSet = new Set([1, 2, 3]);
    assert.throws(() => {
      stringSet.parse(invalidSet);
    }, /Invalid input: expected string, received number/);

    // custom error message should be used when validation fails
    // Zod expects the custom message to be passed via an options object
    const customSet = zod.set(zod.string(), { invalid_type_error: 'Bad set!' });
    assert.throws(() => {
      customSet.parse(invalidSet);
    }, /Bad set!/);

    done();
  });
});