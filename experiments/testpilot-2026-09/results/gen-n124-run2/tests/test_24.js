// test/zod-iso-duration.test.js
const assert = require('assert');
const { z, ZodString } = require('zod');

describe('Zod ISO‑8601 duration schema', function () {
  // Simple (non‑exhaustive) regex for ISO‑8601 durations.
  // It matches strings like "P1Y2M3DT4H5M6S", "PT20M", "P3D", etc.
  const isoDurationRegex = /^P(?:(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?:\d+H)?(?:\d+M)?(?:\d+S)?)?)$/;

  // Build the schema: a string that must satisfy the regex.
  const schema = z
    .string()
    .refine(val => isoDurationRegex.test(val), {
      message: 'Invalid ISO‑8601 duration',
    });

  it('should be a ZodString instance', function () {
    // Zod schemas are class instances; a plain string schema is an instance of ZodString.
    assert(schema instanceof ZodString);
  });

  