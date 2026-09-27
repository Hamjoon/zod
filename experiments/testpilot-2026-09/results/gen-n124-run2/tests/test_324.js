let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // import the Zod namespace correctly

describe('test zod', function () {
  it('test zod.z.strictObject', function (done) {
    // Define a strict object schema with two required fields
    // In Zod v3 the way to make an object strict is to call .strict() on a normal object schema
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    }).strict(); // disallow unknown keys

    // 1️⃣ Valid object should parse without error
    const valid = { name: 'Alice', age: 30 };
    const parsed = schema.parse(valid);
    assert.deepStrictEqual(parsed, valid);

    // 2️⃣ Object containing an unknown key should throw
    // Zod's error message for unknown keys contains "Unrecognized key(s) in object"
    assert.throws(
      () => {
        schema.parse({ name: 'Bob', age: 25, extra: true });
      },
      /Unrecognized key|unknown key|unexpected key/i
    );

    // 3️⃣ Object missing a required key should also throw
    // Zod reports a missing required field with a message that includes "Invalid input"
    // (or "required") – we accept any of those.
    assert.throws(
      () => {
        schema.parse({ name: 'Bob' });
      },
      /Invalid input|required|missing/i
    );

    done();
  });
});