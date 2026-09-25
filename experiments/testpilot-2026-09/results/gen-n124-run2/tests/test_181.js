let mocha = require('mocha');
let assert = require('assert');
let z = require('zod'); // use the same name that the test expects

describe('test zod', function () {
  it('test zod.string().base64url', function (done) {
    // obtain a Zod schema that validates base64url strings
    const schema = z.string().base64url();

    // ---- valid base64url strings ----
    const validSamples = [
      // "abc123" encoded without padding
      'YWJjMTIz',
      // "Hello-World" (URL‑safe characters, no padding)
      'SGVsbG8tV29ybGQ',
      // numeric string "1234567890"
      'MTIzNDU2Nzg5MA',
      // empty string is technically a valid base64url representation of empty data
      '',
    ];

    validSamples.forEach((sample) => {
      // Zod schemas are not callable, so we use safeParse to get a boolean result
      const result = schema.safeParse(sample).success;
      assert(
        result,
        `Expected valid base64url string "${sample}" to be accepted`
      );
    });

    // ---- invalid base64url strings ----
    const invalidSamples = [
      // Contains illegal character '+'
      'YWJj+MTIz',
      // Contains illegal character '/' (not URL‑safe)
      'YWJj/MTIz',
      // Contains padding characters '=' which are not allowed in base64url
      'YWJjMTIz==',
      // Contains characters outside the base64url alphabet
      '!!!',
      // Not a string (number)
      12345,
      // Null value
      null,
      // Undefined value
      undefined,
    ];

    invalidSamples.forEach((sample) => {
      const result = schema.safeParse(sample).success;
      assert(
        !result,
        `Expected invalid base64url value "${sample}" to be rejected`
      );
    });

    done();
  });
});