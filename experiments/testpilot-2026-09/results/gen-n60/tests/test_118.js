let mocha = require('mocha');
let assert = require('assert');
const { z } = require('zod'); // use the named export `z`

describe('test zod', function () {
  it('test zod.z.templateLiteral', function (done) {
    // Create a template literal schema that matches strings like "hello <any string>!"
    // The template literal is built from literals and interpolated schemas.
    const schema = z
      .string()
      .templateLiteral([
        z.literal('hello '), // leading literal
        z.string(),          // interpolated part (any string)
        z.literal('!'),      // trailing literal
      ]);

    // Should accept a valid string
    assert.doesNotThrow(() => {
      schema.parse('hello world!');
    });

    // Should reject strings that do not follow the template
    assert.throws(() => {
      schema.parse('hi world!');
    });

    // Should also reject when the interpolated part is missing
    assert.throws(() => {
      schema.parse('hello !');
    });

    done();
  });
});