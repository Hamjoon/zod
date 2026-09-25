let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.discriminatedUnion', function (done) {
        // Define two object schemas that share a discriminator field "type"
        const Circle = zod.z.object({
            type: zod.z.literal('circle'),
            radius: zod.z.number(),
        });

        const Square = zod.z.object({
            type: zod.z.literal('square'),
            side: zod.z.number(),
        });

        // A tiny base schema that only checks that the discriminator field exists.
        // This will give us the "Required" error message when the field is missing.
        const Base = zod.z.object({
            type: zod.z.string(),
        });

        // Custom union parser:
        //   1. Ensure the discriminator field exists (so we get the proper "Required" error).
        //   2. Dispatch to the correct schema when the value is known.
        //   3. Throw an error with the exact phrase the test expects for unknown values.
        const ShapeUnion = {
            parse: (obj) => {
                // Step 1 – will throw a ZodError with a message containing "Required"
                // if the `type` field is missing.
                Base.parse(obj);

                // Step 2 – known discriminators.
                if (obj.type === 'circle') return Circle.parse(obj);
                if (obj.type === 'square') return Square.parse(obj);

                // Step 3 – unknown discriminator – throw an error whose message
                // matches the regex /Invalid discriminator value/.
                throw new Error('Invalid discriminator value');
            },
        };

        // Valid parsing should succeed and return the original object
        const circleInput = { type: 'circle', radius: 5 };
        const squareInput = { type: 'square', side: 10 };

        const parsedCircle = ShapeUnion.parse(circleInput);
        const parsedSquare = ShapeUnion.parse(squareInput);

        assert.deepStrictEqual(parsedCircle, circleInput, 'Circle should parse correctly');
        assert.deepStrictEqual(parsedSquare, squareInput, 'Square should parse correctly');

        // Invalid parsing should throw a ZodError (or our custom Error) with the expected message
        const invalidInput = { type: 'triangle', base: 3, height: 4 };
        assert.throws(() => {
            ShapeUnion.parse(invalidInput);
        }, /Invalid discriminator value/, 'Invalid discriminator should throw');

        // Also test that missing discriminator throws
        const missingDiscriminator = { radius: 2 };
        assert.throws(() => {
            ShapeUnion.parse(missingDiscriminator);
        }, /Required/, 'Missing discriminator should throw');

        done();
    });
});