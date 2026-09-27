let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.map', function(done) {
        // Create a map schema with string keys and number values
        const stringNumberMap = zod.map(zod.string(), zod.number());

        // A valid Map instance that should pass validation
        const validMap = new Map([
            ['one', 1],
            ['two', 2],
        ]);

        // Parsing should succeed and return a Map instance
        const parsedValid = stringNumberMap.parse(validMap);
        assert.ok(parsedValid instanceof Map, 'Result should be a Map');
        assert.strictEqual(parsedValid.get('one'), 1);
        assert.strictEqual(parsedValid.get('two'), 2);

        // An invalid Map (wrong value type) should throw a ZodError
        const invalidMap = new Map([
            ['bad', 'not-a-number'],
        ]);

        assert.throws(() => {
            stringNumberMap.parse(invalidMap);
        }, err => {
            // Zod throws an instance of ZodError; we just ensure it's thrown
            return err && err.name === 'ZodError';
        }, 'Parsing an invalid map should throw a ZodError');

        // Test the readonly variant – it should still parse the same data
        const readonlySchema = stringNumberMap.readonly();
        const parsedReadonly = readonlySchema.parse(validMap);
        assert.ok(parsedReadonly instanceof Map, 'Readonly schema should still return a Map instance');
        // Runtime does not enforce immutability, but type‑level readonly is verified by TypeScript.
        // Here we just ensure parsing works without error.
        done();
    });
});