let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
        // Define two object schemas that share a discriminator field "type"
        const Circle = zod.z.object({
            type: zod.z.literal('circle'),
            radius: zod.z.number()
        });

        const Square = zod.z.object({
            type: zod.z.literal('square'),
            side: zod.z.number()
        });

        // Create a discriminated union schema using the "type" field
        const ShapeUnion = zod.z.discriminatedUnion('type', [Circle, Square]);

        // Valid parsing should succeed and return the original object
        const circleInput = { type: 'circle', radius: 5 };
        const squareInput = { type: 'square', side: 10 };

        const parsedCircle = ShapeUnion.parse(circleInput);
        const parsedSquare = ShapeUnion.parse(squareInput);

        assert.deepStrictEqual(parsedCircle, circleInput, 'Circle should parse correctly');
        assert.deepStrictEqual(parsedSquare, squareInput, 'Square should parse correctly');

        // Invalid parsing should throw a ZodError
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