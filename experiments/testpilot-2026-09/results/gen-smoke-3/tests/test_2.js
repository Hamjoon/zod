let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
        // Define two object schemas that share the same discriminator key
        const Cat = zod.object({
            type: zod.literal('cat'),
            meow: zod.string()
        });
        const Dog = zod.object({
            type: zod.literal('dog'),
            bark: zod.string()
        });

        // Create a discriminated union schema
        const Pet = zod.discriminatedUnion('type', [Cat, Dog]);

        // ---- Internal definition checks ----
        // The discriminator key should be stored correctly
        assert.strictEqual(Pet._def.discriminator, 'type');

        // The options should contain the literal values we supplied
        // In Zod v3 the shape is a function, so we need to call it to get the actual shape object
        const literalValues = Pet._def.options.map(opt => opt._def.shape().type._def.value);
        assert.deepStrictEqual(literalValues.sort(), ['cat', 'dog']);

        // ---- Valid parsing ----
        const parsedCat = Pet.parse({ type: 'cat', meow: 'purr' });
        assert.deepStrictEqual(parsedCat, { type: 'cat', meow: 'purr' });

        const parsedDog = Pet.parse({ type: 'dog', bark: 'woof' });
        assert.deepStrictEqual(parsedDog, { type: 'dog', bark: 'woof' });

        // ---- Invalid parsing ----
        // Wrong shape for a known discriminator value
        assert.throws(
            () => Pet.parse({ type: 'cat', bark: 'woof' }),
            /Expected string/
        );

        // Unknown discriminator value
        assert.throws(
            () => Pet.parse({ type: 'bird', chirp: 'tweet' }),
            /Invalid discriminator value/
        );

        done();
    });
});