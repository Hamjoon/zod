// test-uuidv4.js
const assert = require('assert');
const { v4: uuidv4 } = require('uuid'); // use the popular "uuid" package

describe('test uuid generation', function () {
  it('should generate valid UUID v4 strings', function () {
    // Generate a UUID v4 without parameters
    const uuid = uuidv4();

    // Regular expression for a UUID v4
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    // Basic type check
    assert.strictEqual(typeof uuid, 'string', 'uuid should be a string');

    // Validate format
    assert.ok(uuidV4Regex.test(uuid), `Generated UUID "${uuid}" does not match UUID v4 format`);

    // Generate a UUID v4 with an empty options object (uuidv4 ignores extra args)
    const uuidWithParams = uuidv4({});

    // Validate format again
    assert.ok(uuidV4Regex.test(uuidWithParams), `Generated UUID with params "${uuidWithParams}" does not match UUID v4 format`);
  });
});