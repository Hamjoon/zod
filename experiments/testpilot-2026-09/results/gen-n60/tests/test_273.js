const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod string max length', function () {
    // Build a string schema that enforces a maximum size of 5 characters
    const schema = z.string().max(5);

    // A string whose length is exactly 5 should pass without throwing
    assert.doesNotThrow(() => schema.parse('hello'));

    // A string longer than 5 characters should cause the maxSize check to fail
    // Zod's error message contains "at most 5 characters"
    assert.throws(() => schema.parse('hello!'), /at most 5 characters/);
  });
});