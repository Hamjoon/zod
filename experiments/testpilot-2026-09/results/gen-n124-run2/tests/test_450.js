let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.success', function(done) {
        // create an inner type schema (any simple Zod schema works)
        const inner = zod.string();

        // invoke the function under test
        const result = zod.z.success(inner);

        // the returned object should be an instance of ZodSuccess
        assert.ok(result instanceof zod.ZodSuccess, 'result should be a ZodSuccess instance');

        // it should expose the same inner type we passed in
        assert.strictEqual(result.innerType, inner, 'innerType should be preserved');

        // the internal definition should indicate a success type
        // Depending on Zod version, the type information lives on the `_def` property
        if (result._def) {
            assert.strictEqual(result._def.type, 'success', 'def.type should be "success"');
        } else {
            // fallback check for older versions that expose the type directly
            assert.strictEqual(result.type, 'success', 'type should be "success"');
        }

        done();
    });
});