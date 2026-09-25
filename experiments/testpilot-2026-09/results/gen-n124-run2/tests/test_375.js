let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.map', function(done) {
        // create a map schema with string keys and number values
        const mapSchema = zod.map(zod.string(), zod.number());

        // ---- valid case -------------------------------------------------
        const validMap = new Map([
            ['one', 1],
            ['two', 2],
        ]);
        const parsedValid = mapSchema.parse(validMap);
        // Zod returns a Map with the same entries; compare the entries
        assert.deepStrictEqual(Array.from(parsedValid.entries()), Array.from(validMap.entries()));

        // ---- invalid key type --------------------------------------------
        const invalidKeyMap = new Map([
            [1, 1], // key is a number, should be a string
        ]);
        assert.throws(() => mapSchema.parse(invalidKeyMap), zod.ZodError);

        // ---- invalid value type ------------------------------------------
        const invalidValueMap = new Map([
            ['one', '1'], // value is a string, should be a number
        ]);
        assert.throws(() => mapSchema.parse(invalidValueMap), zod.ZodError);

        done();
    });
});