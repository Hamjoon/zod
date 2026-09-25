let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nonoptional', function(done) {
        // Create a simple inner type
        const inner = zod.string();

        // Call the function under test
        const schema = zod.z.nonoptional(inner, { description: 'my nonoptional' });

        // Verify that the returned object is a ZodNonOptional instance
        assert(schema instanceof zod.ZodNonOptional, 'Returned schema should be an instance of ZodNonOptional');

        // Verify the internal definition
        const def = schema._def;
        assert.strictEqual(def.type, 'nonoptional', 'Def type should be "nonoptional"');
        assert.strictEqual(def.innerType, inner, 'Def innerType should match the provided inner type');
        assert.strictEqual(def.description, 'my nonoptional', 'Def description should be set from params');

        done();
    });
});