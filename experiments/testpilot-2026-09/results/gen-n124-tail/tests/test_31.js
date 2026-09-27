let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');   // import the Zod namespace

describe('test zod', function () {
    it('test zod.transform + pipe', function (done) {
        // 1️⃣ Verify that the transform callback is executed and its result is used
        let called = false;
        const transformFn = (val) => {
            called = true;
            return val + 'b';
        };
        const stringSchema = z.string().transform(transformFn);
        const overwritten = stringSchema.parse('a');
        assert.strictEqual(called, true, 'transform callback should have been called');
        assert.strictEqual(overwritten, 'ab', 'value should be transformed by transform');

        // 2️⃣ Verify that subsequent checks run on the transformed value
        //   - first double the input
        //   - then enforce max ≤ 5 on the doubled value
        const numberSchema = z
            .number()
            .transform((n) => n * 2)          // double the input first
            .pipe(z.number().max(5));          // then enforce max ≤ 5

        // Input 2 → doubled to 4, which satisfies max(5)
        assert.strictEqual(numberSchema.parse(2), 4, '2 should be doubled to 4 and pass max(5)');

        // Input 3 → doubled to 6, which violates max(5)
        assert.throws(
            () => numberSchema.parse(3),
            /Number must be less than or equal to 5/,
            '3 should be doubled to 6 and fail max(5)'
        );

        done();
    });
});