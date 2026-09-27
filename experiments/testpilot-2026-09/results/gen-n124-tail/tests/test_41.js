const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test z.string().trim', function (done) {
    // Create a string schema with .trim()
    const schema = z.string().trim();

    // Should trim leading and trailing whitespace
    const input = '   hello world   ';
    const trimmed = schema.parse(input);
    assert.strictEqual(trimmed, 'hello world');

    // Should leave an already‑trimmed string unchanged
    const alreadyTrimmed = 'foo';
    assert.strictEqual(schema.parse(alreadyTrimmed), 'foo');

    // Should reject non‑string inputs
    // Zod's error message is "Invalid input: expected string, received number"
    assert.throws(() => schema.parse(123), /Invalid input: expected string/);

    done();
  });
});