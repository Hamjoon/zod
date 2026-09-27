let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');   // use the proper Zod import

describe('test zod', function () {
  it('test zod string uuid validation', function (done) {
    // Build a Zod schema that validates UUID strings
    const guidSchema = z.string().uuid();

    // Verify that a typical UUID string passes validation
    const exampleGuid = '123e4567-e89b-12d3-a456-426614174000';
    assert.doesNotThrow(
      () => guidSchema.parse(exampleGuid),
      'example GUID should be accepted by the schema'
    );

    // Verify that an invalid UUID string fails validation
    const badGuid = 'not-a-valid-uuid';
    assert.throws(
      () => guidSchema.parse(badGuid),
      /Invalid uuid/,
      'invalid GUID should be rejected by the schema'
    );

    // (Optional) If you still need the JSON‑Schema representation you can
    // generate it with a helper like `zod-to-json-schema`, but the core
    // Zod schema does not expose `type` or `format` properties directly.
    done();
  });
});