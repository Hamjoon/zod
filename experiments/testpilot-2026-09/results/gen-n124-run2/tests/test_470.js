let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.pipe', function (done) {
        // Create a schema that first ensures the input is a string,
        // then transforms it to a number, and finally validates it as an integer.
        const stringToNumber = zod.string().transform(val => Number(val));

        // Use a custom refinement with an explicit error message that matches the test regex.
        const intSchema = stringToNumber.pipe(
            zod
                .number()
                .refine(val => Number.isInteger(val), { message: 'Expected integer' })
        );

        // Valid case: a string representing an integer
        const validInput = "42";
        const parsed = intSchema.parse(validInput);
        assert.strictEqual(parsed, 42, "Pipe should parse string '42' to integer 42");

        // Invalid case 1: string representing a non‑integer number should fail the .int() check
        const nonIntInput = "42.5";
        assert.throws(() => {
            intSchema.parse(nonIntInput);
        }, /Expected integer/, "Pipe should reject non‑integer numbers");

        // Invalid case 2: input that is not a string should fail the first schema
        const notStringInput = 100;
        assert.throws(() => {
            intSchema.parse(notStringInput);
        }, /Expected string/, "Pipe should reject non‑string inputs");

        done();
    });
});