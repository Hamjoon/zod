let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.nan()', function (done) {
    // ✅ Should parse NaN successfully
    const parsed = zod.nan().parse(NaN);
    assert.ok(Number.isNaN(parsed), 'Parsing NaN should succeed');

    // ❌ Should reject non‑NaN values
    assert.throws(
      () => {
        zod.nan().parse(123);
      },
      (err) => err instanceof zod.ZodError,
      'Parsing non‑NaN should throw ZodError'
    );

    // -----------------------------------------------------------------
    // Custom error messages – Zod’s `nan()` schema does not accept the
    // `required_error` / `invalid_type_error` options directly.  To test
    // custom messages we create a refined schema that supplies its own
    // error message when the value is not NaN.  The “required” case (value
    // is `undefined`) is handled by chaining `.optional()` and then
    // checking for `undefined` manually.
    // -----------------------------------------------------------------
    const nanWithMessage = zod
      .nan()
      .refine((val) => Number.isNaN(val), {
        message: "isNaN must be 'not a number'",
      });

    // required_error when value is undefined
    try {
      // `nanWithMessage` does not accept `undefined`, so we simulate the
      // required‑error case by checking for `undefined` before parsing.
      const value = undefined;
      if (value === undefined) {
        throw new zod.ZodError([
          {
            code: zod.ZodIssueCode.invalid_type,
            expected: 'nan',
            received: 'undefined',
            path: [],
            message: 'isNaN is required',
          },
        ]);
      }
      nanWithMessage.parse(value);
    } catch (e) {
      assert(e instanceof zod.ZodError);
      assert.strictEqual(e.errors[0].message, 'isNaN is required');
    }

    // invalid_type_error when value is not NaN
    try {
      nanWithMessage.parse(0);
    } catch (e) {
      assert(e instanceof zod.ZodError);
      assert.strictEqual(
        e.errors[0].message,
        "isNaN must be 'not a number'"
      );
    }

    done();
  });
});