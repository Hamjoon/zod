const { z, ZodError } = require('zod');
const assert = require('assert');

describe('test zod', function () {
  it('test zod.z.templateLiteral', function () {
    // Create a template literal schema: "hello " + <string> + "!"
    const schema = z.templateLiteral(['hello ', '!'], [z.string()]);

    // Verify internal definition
    assert.strictEqual(schema._def.type, 'template_literal');
    assert.deepStrictEqual(schema._def.parts, ['hello ', '!']);

    // Valid value should parse correctly
    const valid = 'hello world!';
    const parsed = schema.parse(valid);
    assert.strictEqual(parsed, valid);

    // Invalid value should throw a ZodError
    assert.throws(() => schema.parse('hi world!'), ZodError);
  });
});