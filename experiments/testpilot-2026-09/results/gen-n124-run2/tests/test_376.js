let mocha = require('mocha');
let assert = require('assert');
const { z } = require('zod'); // import the Zod namespace correctly

describe('test zod', function () {
    it('test zod.map', function (done) {
        // Create a map schema with string keys and number values
        const mapSchema = z.map(z.string(), z.number());

        // A valid Map instance
        const validMap = new Map([
            ['one', 1],
            ['two', 2],
        ]);

        // An invalid Map (value is not a number)
        const invalidMapValue = new Map([
            ['one', 'not a number'],
        ]);

        // A non‑Map value
        const notAMap = { one: 1 };

        // Should parse the valid map without throwing
        try {
            const parsed = mapSchema.parse(validMap);
            // The parsed value should be a Map and equal to the original
            assert(parsed instanceof Map, 'Parsed value should be a Map');
            assert.deepStrictEqual(
                Array.from(parsed.entries()),
                Array.from(validMap.entries())
            );
        } catch (e) {
            return done(e);
        }

        // Should throw on a map with an invalid value type
        assert.throws(
            () => {
                mapSchema.parse(invalidMapValue);
            },
            /Expected number/,
            'Should reject map with non‑number value'
        );

        // Should throw on a non‑Map input
        assert.throws(
            () => {
                mapSchema.parse(notAMap);
            },
            /Expected Map/,
            'Should reject non‑Map input'
        );

        done();
    });
});