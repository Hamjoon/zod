let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
        // Define a discriminated union schema with a "type" discriminator
        const Circle = zod.z.object({
            type: zod.z.literal('circle'),
            radius: zod.z.number().positive(),
        });

        const Square = zod.z.object({
            type: zod.z.literal('square'),
            side: zod.z.number().positive(),
        });

        const Shape = zod.z.discriminatedUnion('type', [Circle, Square]);

        // --- Successful parses -------------------------------------------------
        const circleInput = { type: 'circle', radius: 5 };
        const squareInput = { type: 'square', side: 10 };

        // Should parse without throwing
        const parsedCircle = Shape.parse(circleInput);
        const parsedSquare = Shape.parse(squareInput);

        // The parsed objects should equal the original inputs
        assert.deepStrictEqual(parsedCircle, circleInput);
        assert.deepStrictEqual(parsedSquare, squareInput);

        // --- Failure cases -----------------------------------------------------
        // 1. Missing discriminator
        assert.throws(() => {
            Shape.parse({ radius: 5 });
        }, (err) => {
            // Zod throws a ZodError; we just need to ensure it's an error
            return err instanceof zod.z.ZodError;
        });

        // 2. Unknown discriminator value
        assert.throws(() => {
            Shape.parse({ type: 'triangle', base: 3, height: 4 });
        }, (err) => {
            return err instanceof zod.z.ZodError;
        });

        // 3. Wrong shape for a known discriminator (missing required field)
        assert.throws(() => {
            Shape.parse({ type: 'circle', side: 10 });
        }, (err) => {
            return err instanceof zod.z.ZodError;
        });

        // 4. Extra keys are allowed by default, but we can test strict behavior
        //    by creating a strict version of the union
        const StrictShape = Shape.strict();

        assert.throws(() => {
            StrictShape.parse({ type: 'circle', radius: 5, extra: 'nope' });
        }, (err) => {
            return err instanceof zod.z.ZodError;
        });

        // All assertions passed
        done();
    });
});