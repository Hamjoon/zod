let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.trim', function (done) {
    // 1. Trim should remove surrounding whitespace before other checks
    const trimmedSchema = zod.string().trim().min(3);
    assert.strictEqual(trimmedSchema.parse('  abc  '), 'abc');
    // after trimming, length is 3, so min(3) passes
    // Zod's default error message for .min() is:
    // "Too small: expected string to have >=3 characters"
    // Adjust the regex to match this message.
    assert.throws(
      () => trimmedSchema.parse('  ab  '),
      /Too small: expected string to have >=3 characters/
    );

    // 2. Order of .trim() and .default() matters
    // a) .trim() before .default() – default value is NOT trimmed
    const schemaTrimThenDefault = zod.string().trim().default('  tuna  ');
    assert.strictEqual(schemaTrimThenDefault.parse(undefined), '  tuna  ');

    // b) .default() before .trim() – default value IS trimmed
    const schemaDefaultThenTrim = zod.string().default('  tuna  ').trim();
    assert.strictEqual(schemaDefaultThenTrim.parse(undefined), 'tuna');

    done();
  });
});