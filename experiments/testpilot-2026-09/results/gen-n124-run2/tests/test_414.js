let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.transform', function(done) {
        // 1️⃣ Simple transform: string → length
        const lengthSchema = zod.string().transform(s => s.length);
        assert.strictEqual(lengthSchema.parse('hello'), 5);

        // 2️⃣ Transform + pipe: length must be >= 5
        const pipeSchema = zod.string()
            .transform(s => s.length)
            .pipe(zod.number().min(5));

        // valid case
        assert.strictEqual(pipeSchema.parse('world!'), 6);
        // invalid case (length 2 < 5) should throw a ZodError
        assert.throws(() => pipeSchema.parse('hi'), zod.ZodError);

        // 3️⃣ Using the top‑level z.transform directly
        const coercedInt = zod.transform((val, ctx) => {
            const parsed = Number.parseInt(String(val));
            if (Number.isNaN(parsed)) {
                // push a custom issue – this will cause a ZodError
                ctx.addIssue({
                    code: zod.ZodIssueCode.custom,
                    message: 'Not a number',
                    path: [],
                });
                // returning zod.NEVER aborts the transform without changing the inferred type
                return zod.NEVER;
            }
            return parsed;
        });

        // valid integer string
        assert.strictEqual(coercedInt.parse('123'), 123);
        // invalid string should raise a ZodError
        assert.throws(() => coercedInt.parse('abc'), zod.ZodError);

        done();
    });
});