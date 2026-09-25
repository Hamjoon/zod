const { describe, it } = require('mocha');
const assert = require('assert');
const { z, ZodError } = require('zod');

describe('test zod', function () {
  it('test zod.string().max', function (done) {
    // Create a string schema with a maximum length of 5 characters
    const schema = z.string().max(5);

    // Should succeed for strings of length <= 5
    assert.doesNotThrow(() => schema.parse('hello'));

    // Should fail for strings longer than 5 characters
    assert.throws(() => schema.parse('hello!'), ZodError);

    done();
  });
});