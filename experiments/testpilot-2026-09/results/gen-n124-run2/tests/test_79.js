// test-zod-email.js
const assert = require('assert');
const { z } = require('zod');
const { zodToJsonSchema } = require('zod-to-json-schema');

describe('test zod', function () {
  it('test zod.z.email', function () {
    // Build a Zod schema that validates an e‑mail string
    const zodSchema = z.string().email();

    // Convert the Zod schema to a plain JSON‑Schema object
    const jsonSchema = zodToJsonSchema(zodSchema);

    // Verify that the generated JSON‑Schema has the expected properties
    assert.strictEqual(typeof jsonSchema, 'object', 'schema should be an object');
    assert.strictEqual(jsonSchema.type, 'string', 'type should be "string"');
    assert.strictEqual(jsonSchema.format, 'email', 'format should be "email"');
  });
});