// test-zod-date.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod.z.date', function (done) {
    // Create a date schema with custom error messages
    const schema = z.date({
      required_error: 'Date required',
      invalid_type_error: 'Invalid date',
    });

    // ---- Valid case -------------------------------------------------
    const validResult = schema.safeParse(new Date());
    assert.strictEqual(validResult.success, true, 'Valid Date should pass');

    // ---- Invalid type case (string instead of Date) -----------------
    const invalidTypeResult = schema.safeParse('2023-01-01');
    assert.strictEqual(invalidTypeResult.success, false, 'String should be rejected');
    // Ensure the custom invalid_type_error message appears
    assert.ok(
      invalidTypeResult.error.errors.some((err) => err.message === 'Invalid date'),
      "Error message should be 'Invalid date'"
    );

    // ---- Missing value case (undefined) -----------------------------
    const missingResult = schema.safeParse(undefined);
    assert.strictEqual(missingResult.success, false, 'Undefined should be rejected');
    // Ensure the custom required_error message appears
    assert.ok(
      missingResult.error.errors.some((err) => err.message === 'Date required'),
      "Error message should be 'Date required'"
    );

    done();
  });
});