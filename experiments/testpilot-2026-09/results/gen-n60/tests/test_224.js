// test-zod.minLength.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z, ZodError } = require('zod');

describe('test zod', function () {
  it('test zod.string().min()', function (done) {
    // Create a string schema that enforces a minimum length of 5
    const schema = z.string().min(5); // <-- correct Zod API

    // A string with length >= 5 should pass without throwing
    assert.doesNotThrow(() => {
      schema.parse('hello'); // length 5
    }, 'Expected valid string to not throw');

    // A string with length < 5 should throw a validation error
    assert.throws(
      () => {
        schema.parse('hi'); // length 2
      },
      (err) => err instanceof ZodError, // ensure it is a Zod validation error
      'Expected validation error for short string'
    );

    done();
  });
});