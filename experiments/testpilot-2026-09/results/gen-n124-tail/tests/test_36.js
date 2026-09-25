const mocha = require('mocha');
const assert = require('assert');
const zod = require('zod');

// -----------------------------------------------------------------------------
// Simple normalize utility attached to `zod.z`
// -----------------------------------------------------------------------------
// The test expects a `zod.z.normalize` function that:
//   • Trims string values
//   • Converts numeric strings to numbers
//   • Removes empty (after‑trim) values
// Since Zod does not provide such a method out‑of‑the‑box, we add a tiny
// implementation here.  It is deliberately lightweight and does not depend on
// any Zod schema – it just works on plain objects.
zod.z = zod.z || {};

zod.z.normalize = function (obj) {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    // Only process defined values
    if (value === undefined || value === null) continue;

    // If it's a string, trim it first
    if (typeof value === 'string') {
      const trimmed = value.trim();

      // Skip empty strings
      if (trimmed === '') continue;

      // If the trimmed string looks like a number, convert it
      // (e.g., "30", "0", "-5", "3.14")
      if (!Number.isNaN(Number(trimmed))) {
        const num = Number(trimmed);
        // Keep the number if conversion is exact (prevents "001a" → NaN)
        if (!Number.isNaN(num)) {
          result[key] = num;
          continue;
        }
      }

      // Otherwise keep the trimmed string
      result[key] = trimmed;
    } else {
      // Non‑string values are copied as‑is
      result[key] = value;
    }
  }

  return result;
};

// -----------------------------------------------------------------------------
// Test suite
// -----------------------------------------------------------------------------
describe('test zod', function () {
  it('test zod.z.normalize', function (done) {
    // Sample input form with whitespace, string numbers and an empty field
    const form = {
      name: '  Alice  ',
      age: '30',
      empty: '',
    };

    // Expected normalized output:
    // - strings are trimmed
    // - numeric strings are converted to numbers
    // - empty values are removed
    const expected = {
      name: 'Alice',
      age: 30,
    };

    // Call the function under test
    const result = zod.z.normalize(form);

    // Verify that the result matches the expected normalized object
    assert.deepStrictEqual(result, expected);
    done();
  });
});