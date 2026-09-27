let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.array', function (done) {
        // Define an array schema of strings with custom error messages
        const schema = zod.z.array(zod.z.string(), {
            required_error: "Array required",
            invalid_type_error: "Not an array",
        });

        // 1. Valid array should parse correctly
        const validInput = ["foo", "bar"];
        const parsed = schema.parse(validInput);
        assert.deepStrictEqual(
            parsed,
            validInput,
            "Valid array should be returned unchanged"
        );

        // 2. Passing a non‑array should throw the custom invalid_type_error
        assert.throws(
            () => schema.parse("not an array"),
            (err) =>
                err instanceof zod.ZodError &&
                err.issues.some((issue) => issue.message === "Not an array"),
            "Non‑array input should trigger invalid_type_error"
        );

        // 3. Passing an array with an invalid element should throw a ZodError for that element
        assert.throws(
            () => schema.parse(["valid", 123]),
            (err) =>
                err instanceof zod.ZodError &&
                err.issues.some((issue) =>
                    /Expected string, received number/.test(issue.message)
                ),
            "Array containing a non‑string should trigger element validation error"
        );

        done();
    });
});