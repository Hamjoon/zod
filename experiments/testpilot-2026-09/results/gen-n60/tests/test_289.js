let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.transform', function (done) {
        // 1️⃣ Simple transform: string → length (number)
        const lengthSchema = zod.string().transform(s => s.length);
        assert.strictEqual(
            lengthSchema.parse('hello'),
            5,
            'Length of "hello" should be 5'
        );

        // 2️⃣ Transform + pipe: length must be >= 5
        const pipeSchema = zod
            .string()
            .transform(s => s.length)
            .pipe(zod.number().min(5));

        // valid case
        assert.strictEqual(
            pipeSchema.parse('hello'),
            5,
            'Pipe schema should return 5 for "hello"'
        );

        // invalid case – should throw a ZodError because 2 < 5
        assert.throws(
            () => pipeSchema.parse('hi'),
            err =>
                err instanceof zod.ZodError &&
                // ZodError stores issue messages in the `errors` array.
                // Checking the first issue’s message is more reliable than
                // matching the whole error string.
                err.errors.length > 0 &&
                /Number must be greater than or equal to 5/.test(
                    err.errors[0].message
                ),
            'Pipe schema should reject short strings'
        );

        // 3️⃣ Using the top‑level z.transform factory
        const toNumber = zod.transform(val => Number(val));
        assert.strictEqual(
            toNumber.parse('42'),
            42,
            'String "42" should be transformed to number 42'
        );

        // When the transform cannot produce a valid number we still get NaN (no validation applied)
        const result = toNumber.parse('abc');
        assert.ok(Number.isNaN(result), 'Transform of non‑numeric string should yield NaN');

        done();
    });
});