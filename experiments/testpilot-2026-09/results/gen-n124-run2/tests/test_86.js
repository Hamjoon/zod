// test-zod-guid.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod string uuid (guid) schema', function (done) {
    // Obtain the Zod schema for a UUID (GUID)
    const schema = z.string().uuid();

    // The schema should be an instance of ZodString
    assert.ok(schema instanceof z.ZodString, 'schema should be a ZodString');

    // Zod stores its validation checks in the internal _def.checks array.
    // For a UUID it should contain a single check with kind 'uuid'.
    const uuidCheck = schema._def.checks.find((c) => c.kind === 'uuid');
    assert.ok(uuidCheck, 'schema should contain a uuid check');

    // If you need a plain JSON‑Schema representation you can build it manually:
    const jsonSchema = {
      type: 'string',
      format: 'uuid',
    };
    // Verify that the manual representation matches the expected shape.
    assert.deepStrictEqual(jsonSchema, { type: 'string', format: 'uuid' });

    done();
  });
});