const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod.z.nullish', function () {
    // nullish with a string inner type
    const stringSchema = z.string().nullish();

    // valid values
    assert.strictEqual(stringSchema.parse('hello'), 'hello');
    assert.strictEqual(stringSchema.parse(null), null);
    assert.strictEqual(stringSchema.parse(undefined), undefined);

    // invalid values
    assert.throws(() => stringSchema.parse(123), /expected string/i);
    assert.throws(() => stringSchema.parse(true), /expected string/i);

    // nullish with a number inner type
    const numberSchema = z.number().nullish();

    assert.strictEqual(numberSchema.parse(42), 42);
    assert.strictEqual(numberSchema.parse(null), null);
    assert.strictEqual(numberSchema.parse(undefined), undefined);
    assert.throws(() => numberSchema.parse('not a number'), /expected number/i);

    // nullish with a constrained inner type (integer)
    const intSchema = z.number().int().nullish();

    assert.strictEqual(intSchema.parse(5), 5);
    assert.strictEqual(intSchema.parse(null), null);
    assert.strictEqual(intSchema.parse(undefined), undefined);
    assert.throws(() => intSchema.parse(5.5), /expected integer/i);
  });
});