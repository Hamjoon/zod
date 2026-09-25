const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod.z.json', function () {
    // JSON schema that accepts any JSON value,
    // but enforces a minimum length of 2 for string values.
    const schema = z
      .json()
      .refine(
        (val) => typeof val !== 'string' || val.length >= 2,
        { message: 'String must be at least 2 characters' }
      );

    // ---- Valid values -------------------------------------------------
    // Simple primitives
    assert.deepStrictEqual(schema.parse('ab'), 'ab');
    assert.deepStrictEqual(schema.parse(123), 123);
    assert.deepStrictEqual(schema.parse(false), false);
    assert.deepStrictEqual(schema.parse(null), null);

    // Arrays of JSON values (including nested arrays/objects)
    assert.deepStrictEqual(schema.parse(['x', 'yz', 5]), ['x', 'yz', 5]);
    assert.deepStrictEqual(
      schema.parse([null, true, { a: 'bc' }]),
      [null, true, { a: 'bc' }]
    );

    // Objects with string keys and JSON values
    assert.deepStrictEqual(
      schema.parse({ foo: 'bar', num: 42, flag: true }),
      { foo: 'bar', num: 42, flag: true }
    );
    assert.deepStrictEqual(
      schema.parse({ nested: { arr: [null, 'ok'] } }),
      { nested: { arr: [null, 'ok'] } }
    );

    // ---- Invalid values ------------------------------------------------
    // String too short (fails the min‑length constraint)
    assert.throws(() => schema.parse('a'), /String must be at least 2 characters/);

    // Unsupported types (undefined, function, symbol, etc.)
    assert.throws(() => schema.parse(undefined));
    assert.throws(() => schema.parse(() => {}));
    assert.throws(() => schema.parse(Symbol('sym')));
  });
});