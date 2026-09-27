let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.safeParse returns a success result', function (done) {
    // Use a simple value to pass to a Zod schema
    const value = 'hello world';

    // Create a schema that matches the value type (string)
    const schema = zod.z.string();

    // safeParse returns an object { success: true, data: value } when validation passes
    const result = schema.safeParse(value);

    // The result should be an object with success:true and data equal to the original value
    assert.deepStrictEqual(result, { success: true, data: value });
    done();
  });
});