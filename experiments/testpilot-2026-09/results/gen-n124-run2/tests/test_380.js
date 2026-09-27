let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.set', function(done) {
        // Create a simple value type schema
        const valueType = zod.z.string();

        // Pass some params to be normalized (e.g., description)
        const params = { description: 'my set' };

        // Call the function under test
        const setSchema = zod.z.set(valueType, params);

        // Verify that the returned object is a ZodSet instance
        assert(setSchema instanceof zod.ZodSet, 'Returned schema should be an instance of ZodSet');

        // Verify the internal definition matches expectations
        const def = setSchema._def;
        assert.strictEqual(def.type, 'set', 'Def.type should be "set"');
        assert.strictEqual(def.valueType, valueType, 'Def.valueType should be the provided value type');
        assert.strictEqual(def.description, 'my set', 'Def.description should be normalized from params');

        done();
    });
});