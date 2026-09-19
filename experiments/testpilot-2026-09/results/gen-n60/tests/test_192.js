let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.catch', function(done) {
        // Prepare an inner type
        const inner = zod.z.string();

        // 1️⃣ Test with a non‑function catch value
        const fallback = 'fallback value';
        const catchSchema = zod.z.catch(inner, fallback);

        // The returned object should be a ZodCatch instance
        assert(catchSchema instanceof zod.ZodCatch, 'Result should be instance of ZodCatch');

        // Its internal definition should match the expectations
        const def = catchSchema._def;
        assert.strictEqual(def.type, 'catch', 'def.type should be "catch"');
        assert.strictEqual(def.innerType, inner, 'def.innerType should be the provided inner type');
        assert.strictEqual(typeof def.catchValue, 'function', 'def.catchValue should be a function');
        assert.strictEqual(def.catchValue(), fallback, 'catchValue() should return the fallback value');

        // 2️⃣ Test with a function as catch value
        const fn = () => 12345;
        const catchSchemaFn = zod.z.catch(inner, fn);

        assert(catchSchemaFn instanceof zod.ZodCatch, 'Result should be instance of ZodCatch when using a function');
        const defFn = catchSchemaFn._def;
        assert.strictEqual(defFn.catchValue, fn, 'When a function is supplied, it should be used directly');

        done();
    });
});