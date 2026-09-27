let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.array', function(done) {
        // 1️⃣ Simple array of strings – happy path
        const stringArray = zod.array(zod.string());
        assert.deepStrictEqual(stringArray.parse(['foo', 'bar']), ['foo', 'bar']);

        // 1️⃣ Simple array – type error
        assert.throws(
            () => stringArray.parse([1, 2]),
            err => err instanceof zod.ZodError && /Expected string/.test(err.message)
        );

        // 2️⃣ Array with custom error messages via params
        const numberArray = zod.array(zod.number(), {
            required_error: "Numbers required",
            invalid_type_error: "Not an array"
        });

        // required_error (null/undefined)
        assert.throws(
            () => numberArray.parse(undefined),
            err => err instanceof zod.ZodError && /Numbers required/.test(err.message)
        );

        // invalid_type_error (non‑array)
        assert.throws(
            () => numberArray.parse(42),
            err => err instanceof zod.ZodError && /Not an array/.test(err.message)
        );

        // 3️⃣ superRefine example – duplicate & size constraints
        const limitedUnique = zod.array(zod.string()).superRefine((val, ctx) => {
            if (val.length > 3) {
                ctx.addIssue({
                    code: zod.ZodIssueCode.too_big,
                    maximum: 3,
                    type: "array",
                    inclusive: true,
                    message: "Too many items 😡",
                });
            }
            if (val.length !== new Set(val).size) {
                ctx.addIssue({
                    code: zod.ZodIssueCode.custom,
                    message: "No duplicates allowed.",
                });
            }
        });

        // valid case
        assert.deepStrictEqual(limitedUnique.parse(['a', 'b']), ['a', 'b']);

        // too many items
        const tooManyErr = assert.throws(
            () => limitedUnique.parse(['a', 'b', 'c', 'd']),
            err => err instanceof zod.ZodError
        );
        assert.ok(
            tooManyErr.errors.some(e => e.message === "Too many items 😡"),
            "Expected too_big issue"
        );

        // duplicate items
        const dupErr = assert.throws(
            () => limitedUnique.parse(['x', 'x']),
            err => err instanceof zod.ZodError
        );
        assert.ok(
            dupErr.errors.some(e => e.message === "No duplicates allowed."),
            "Expected custom duplicate issue"
        );

        done();
    });
});