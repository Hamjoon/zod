let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
        const { z } = zod;

        // Define two object schemas that share a discriminating key `type`
        const Cat = z.object({
            type: z.literal('cat'),
            meows: z.boolean()
        });
        const Dog = z.object({
            type: z.literal('dog'),
            barks: z.boolean()
        });

        // Create a discriminated union schema
        const Pet = z.discriminatedUnion('type', [Cat, Dog]);

        // ---- Positive cases -------------------------------------------------
        // A valid cat object should parse correctly
        const catInput = { type: 'cat', meows: true };
        const catParsed = Pet.parse(catInput);
        assert.deepStrictEqual(catParsed, catInput);

        // A valid dog object should parse correctly
        const dogInput = { type: 'dog', barks: false };
        const dogParsed = Pet.parse(dogInput);
        assert.deepStrictEqual(dogParsed, dogInput);

        // ---- Negative cases -------------------------------------------------
        // Unknown discriminator value should throw a ZodError
        assert.throws(() => {
            Pet.parse({ type: 'bird', flies: true });
        }, err => err instanceof zod.ZodError);

        // Missing discriminator key should also throw a ZodError
        assert.throws(() => {
            Pet.parse({ meows: true });
        }, err => err instanceof zod.ZodError);

        done();
    });
});