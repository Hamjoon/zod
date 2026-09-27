const mocha = require('mocha');
const assert = require('assert');
const { z, ZodSymbol, ZodError } = require('zod');

describe('test zod', function () {
  it('test zod.z.symbol', function (done) {
    // Create a Zod symbol schema
    const schema = z.symbol();

    // The schema should be an instance of ZodSymbol
    assert(schema instanceof ZodSymbol, 'schema should be an instance of ZodSymbol');

    // Valid symbol should parse correctly
    const sym = Symbol('test');
    const parsed = schema.parse(sym);
    assert.strictEqual(parsed, sym, 'parsed value should be the original Symbol');

    // Invalid (non‑symbol) values should throw a ZodError
    // The error message contains "expected symbol", so we match that.
    assert.throws(
      () => schema.parse('not a symbol'),
      /expected symbol/
    );

    done();
  });
});