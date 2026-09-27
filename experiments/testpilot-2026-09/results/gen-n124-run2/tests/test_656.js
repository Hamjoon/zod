let mocha = require('mocha');
let assert = require('assert');
const { z } = require('zod');   // import the Zod namespace correctly

describe('test zod', function () {
  it('test zod.z.lowercase', function (done) {
    // Create a string schema that **transforms** the input to lowercase
    const schema = z.string().transform((val) => val.toLowerCase());

    // The transformation should convert uppercase input to lowercase
    const result = schema.parse('HeLLo WoRLd');
    assert.strictEqual(result, 'hello world');

    // Non‑string values should cause a validation error
    assert.throws(() => {
      schema.parse(12345);
    }, /Expected string/);

    done();
  });
});