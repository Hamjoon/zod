const assert = require('assert');
const { randomUUID } = require('crypto'); // Node's built‑in UUID generator

describe('test uuid generation', function () {
  it('should generate valid UUID strings', function () {
    // Generate two UUIDs
    const guid1 = randomUUID();
    const guid2 = randomUUID();

    // Verify they are strings
    assert.strictEqual(typeof guid1, 'string');
    assert.strictEqual(typeof guid2, 'string');

    // Verify they match the standard UUID format
    const guidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    assert.ok(guidPattern.test(guid1), 'guid1 does not match UUID pattern');
    assert.ok(guidPattern.test(guid2), 'guid2 does not match UUID pattern');

    // Verify that two successive calls produce different values
    assert.notStrictEqual(guid1, guid2, 'Two generated GUIDs should not be equal');
  });
});