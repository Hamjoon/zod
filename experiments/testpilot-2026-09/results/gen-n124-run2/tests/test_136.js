let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // use the proper Zod export

describe('test zod', function () {
  it('test zod.z.cuid2', function () {
    // Create the CUID2 schema – use the string schema with .cuid2() validation
    const schema = z.string().cuid2();

    // A valid CUID2 (24 characters, starts with "c")
    const validCuid2 = 'c' + 'a'.repeat(23); // "caaaaaaaaaaaaaaaaaaaaaa"

    // Various invalid values
    const tooShort = 'c' + 'a'.repeat(22);   // 23 chars total
    const wrongPrefix = 'b' + 'a'.repeat(23); // does not start with "c"
    const notAString = 12345;                 // not a string

    // The valid CUID2 should parse without throwing
    assert.doesNotThrow(() => schema.parse(validCuid2));

    // Invalid values should cause a validation error
    assert.throws(() => schema.parse(tooShort));
    assert.throws(() => schema.parse(wrongPrefix));
    assert.throws(() => schema.parse(notAString));
  });
});