// test-zod-fix.js
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod parse', function () {
    // 1. ISO datetime parsing (valid)
    // `z.coerce.date()` will coerce a valid ISO string into a Date instance.
    const datetimeSchema = z.coerce.date();
    const dtResult = datetimeSchema.parse('2020-01-01T06:15Z');
    assert(
      dtResult instanceof Date,
      'datetime should be parsed to a Date object'
    );

    // 2. ISO datetime parsing (invalid) should throw ZodError
    assert.throws(() => {
      datetimeSchema.parse('not-a-date');
    }, /ZodError/, 'invalid datetime should throw ZodError');

    // 3. stringbool parsing
    // Custom schema that accepts various truthy/falsy strings and transforms them
    // into real booleans.
    const boolSchema = z
      .string()
      .transform((val) => {
        const lowered = val.toLowerCase();
        if (['true', '1', 'yes', 'on'].includes(lowered)) return true;
        if (['false', '0', 'no', 'off'].includes(lowered)) return false;
        // Force a validation error for any other value
        return z.NEVER;
      });

    assert.strictEqual(boolSchema.parse('true'), true, '"true" => true');
    assert.strictEqual(boolSchema.parse('1'), true, '"1" => true');
    assert.strictEqual(boolSchema.parse('yes'), true, '"yes" => true');
    assert.strictEqual(boolSchema.parse('on'), true, '"on" => true');
    assert.strictEqual(boolSchema.parse('false'), false, '"false" => false');
    assert.strictEqual(boolSchema.parse('0'), false, '"0" => false');
    assert.strictEqual(boolSchema.parse('no'), false, '"no" => false');

    // 4. Object schema stripping extra keys
    // By default Zod strips unknown keys.
    const Dog = z.object({ name: z.string() });
    const dogResult = Dog.parse({ name: 'Yeller', extraKey: true });
    assert.deepStrictEqual(
      dogResult,
      { name: 'Yeller' },
      'extra keys should be stripped'
    );
  });
});