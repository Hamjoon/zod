// test-zod-date.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod.z.date', function () {
    // Basic date schema – should accept Date objects and reject non‑dates
    const dateSchema = z.date();

    const validDate = new Date();
    // parsing a valid Date should return the same value
    assert.deepStrictEqual(dateSchema.parse(validDate), validDate);

    // parsing a non‑Date (e.g., string) should throw
    assert.throws(() => dateSchema.parse('2023-01-01'));

    // Schema with min / max constraints
    const minDate = new Date('2000-01-01T00:00:00.000Z');
    const maxDate = new Date('2030-12-31T23:59:59.999Z');
    // Zod applies min / max via the .min() and .max() chainable methods
    const constrainedSchema = z.date().min(minDate).max(maxDate);

    // Values inside the range should pass
    assert.deepStrictEqual(constrainedSchema.parse(minDate), minDate);
    assert.deepStrictEqual(constrainedSchema.parse(maxDate), maxDate);
    const middleDate = new Date('2025-06-15T12:00:00.000Z');
    assert.deepStrictEqual(constrainedSchema.parse(middleDate), middleDate);

    // Values outside the range should throw
    const beforeMin = new Date('1999-12-31T23:59:59.999Z');
    const afterMax = new Date('2031-01-01T00:00:00.000Z');
    assert.throws(() => constrainedSchema.parse(beforeMin));
    assert.throws(() => constrainedSchema.parse(afterMax));
  });
});