// test-zod-check.js
// Self‑contained unit test for the `zod.z.check` method.

let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // Zod's public API

describe('zod.z.check', function () {
  it('should run custom validation logic added via .check()', function (done) {
    // ------------------------------------------------------------
    // 1️⃣  Build a schema that uses .check() to enforce two rules:
    //    • No more than 3 items in the array.
    //    • All items must be unique.
    // ------------------------------------------------------------
    const schema = z
      .array(z.string())
      .check((ctx) => {
        // `ctx` is the Zod check context:
        //   ctx.value  – the value being validated
        //   ctx.issues – an array we can push custom issues onto
        if (ctx.value.length > 3) {
          ctx.issues.push({
            code: 'custom',
            message: 'Too many items 😡',
            input: ctx.value,
          });
        }
        if (ctx.value.length !== new Set(ctx.value).size) {
          ctx.issues.push({
            code: 'custom',
            message: 'No duplicates allowed.',
            input: ctx.value,
          });
        }
      });

    // ------------------------------------------------------------
    // 2️⃣  Helper to run `parse` and capture the thrown ZodError (if any)
    // ------------------------------------------------------------
    const parse = (value) => {
      try {
        return { success: true, data: schema.parse(value) };
      } catch (e) {
        // Zod throws a ZodError that contains an `issues` array
        return { success: false, issues: e.issues };
      }
    };

    // ------------------------------------------------------------
    // 3️⃣  Valid input – should pass without issues
    // ------------------------------------------------------------
    const valid = parse(['a', 'b']);
    assert.strictEqual(valid.success, true, 'Valid array should parse successfully');
    assert.deepStrictEqual(valid.data, ['a', 'b']);

    // ------------------------------------------------------------
    // 4️⃣  Too many items – should produce a single “Too many items” issue
    // ------------------------------------------------------------
    const tooMany = parse(['a', 'b', 'c', 'd']);
    assert.strictEqual(tooMany.success, false, 'Array with >3 items should fail');
    assert.strictEqual(
      tooMany.issues.length,
      1,
      'Exactly one issue should be reported for length violation'
    );
    assert.strictEqual(
      tooMany.issues[0].message,
      'Too many items 😡',
      'Length‑violation message should match'
    );

    // ------------------------------------------------------------
    // 5️⃣  Duplicate items – should produce a single “No duplicates” issue
    // ------------------------------------------------------------
    const duplicate = parse(['x', 'y', 'x']);
    assert.strictEqual(duplicate.success, false, 'Array with duplicates should fail');
    assert.strictEqual(
      duplicate.issues.length,
      1,
      'Exactly one issue should be reported for duplicate violation'
    );
    assert.strictEqual(
      duplicate.issues[0].message,
      'No duplicates allowed.',
      'Duplicate‑violation message should match'
    );

    // ------------------------------------------------------------
    // 6️⃣  Both violations together – should report both issues
    // ------------------------------------------------------------
    const both = parse(['p', 'p', 'q', 'r']);
    assert.strictEqual(both.success, false, 'Array violating both rules should fail');
    // Order is not guaranteed, so we just check that both messages appear.
    const messages = both.issues.map((i) => i.message).sort();
    assert.deepStrictEqual(
      messages,
      ['No duplicates allowed.', 'Too many items 😡'].sort(),
      'Both custom issue messages should be present'
    );

    done();
  });
});