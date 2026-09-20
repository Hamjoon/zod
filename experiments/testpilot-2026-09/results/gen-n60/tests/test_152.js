// test-zod-symbol.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z, ZodError } = require('zod');

describe('test zod', function () {
  it('test zod.z.symbol', function (done) {
    // Basic symbol validation
    const schema = z.symbol();
    const sym = Symbol('mySymbol');
    assert.strictEqual(schema.parse(sym), sym);

    // Non‑symbol values should throw a ZodError
    assert.throws(
      () => schema.parse('not a symbol'),
      (err) => err instanceof ZodError
    );

    // Custom error messages
    const customSchema = z.symbol({
      required_error: 'Required',
      invalid_type_error: 'Invalid',
    });

    // Missing value triggers required_error
    try {
      customSchema.parse(undefined);
    } catch (e) {
      assert(e instanceof ZodError);
      // ZodError uses `issues` internally; `errors` is kept for backward‑compatibility.
      const message = e.errors?.[0]?.message ?? e.issues?.[0]?.message;
      assert.strictEqual(message, 'Required');
    }

    // Wrong type triggers invalid_type_error
    try {
      customSchema.parse(123);
    } catch (e) {
      assert(e instanceof ZodError);
      const message = e.errors?.[0]?.message ?? e.issues?.[0]?.message;
      assert.strictEqual(message, 'Invalid');
    }

    done();
  });
});