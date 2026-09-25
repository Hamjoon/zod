// test-zod-uint32.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('validates a uint32 schema', function () {
    // Zod does not have a built‑in uint32, so we compose one:
    const uint32Schema = z.number().int().min(0).max(4294967295);

    // ---- Values that should be accepted ----
    assert.doesNotThrow(() => uint32Schema.parse(0), '0 should be a valid uint32');
    assert.doesNotThrow(() => uint32Schema.parse(123), '123 should be a valid uint32');
    assert.doesNotThrow(
      () => uint32Schema.parse(4294967295),
      'Maximum uint32 value should be accepted'
    );

    // ---- Values that should be rejected ----
    // Negative numbers – Zod reports “greater than or equal to 0”
    assert.throws(
      () => uint32Schema.parse(-1),
      /greater than or equal to 0/,
      '-1 should be rejected'
    );

    // Numbers above the max – Zod reports “less than or equal to 4294967295”
    assert.throws(
      () => uint32Schema.parse(4294967296),
      /less than or equal to 4294967295/,
      'Value above max uint32 should be rejected'
    );

    // Wrong type – Zod reports “Expected number”
    assert.throws(
      () => uint32Schema.parse('123'),
      /Expected number/,
      'String input should be rejected'
    );
  });
});