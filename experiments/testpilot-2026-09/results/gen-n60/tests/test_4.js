let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // use the proper import for Zod

describe('test zod', function () {
    it('test z.discriminatedUnion', function (done) {
        // Define two discriminated object schemas
        const schemaA = z.object({
            type: z.literal('a'),
            a: z.string(),
        });
        const schemaB = z.object({
            type: z.literal('b'),
            b: z.number(),
        });

        // Create the discriminated union schema
        const unionSchema = z.discriminatedUnion('type', [schemaA, schemaB]);

        // Valid cases
        const parsedA = unionSchema.parse({ type: 'a', a: 'hello' });
        assert.deepStrictEqual(parsedA, { type: 'a', a: 'hello' });

        const parsedB = unionSchema.parse({ type: 'b', b: 42 });
        assert.deepStrictEqual(parsedB, { type: 'b', b: 42 });

        // Invalid cases
        // a should be a string – Zod's error message contains "Invalid input: expected string"
        assert.throws(
            () => {
                unionSchema.parse({ type: 'a', a: 123 });
            },
            /Invalid input: expected string/
        );

        // unknown discriminator – Zod reports an "Invalid discriminator value" error
        assert.throws(
            () => {
                unionSchema.parse({ type: 'c', c: true });
            },
            /Invalid discriminator value/
        );

        done();
    });
});