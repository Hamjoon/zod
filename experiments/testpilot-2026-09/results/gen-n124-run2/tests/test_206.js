let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.float32', function (done) {
        // call the function without parameters
        const result = zod.z.float32();

        // ensure we got a ZodNumber schema (the float32 helper returns a number schema)
        assert.ok(result instanceof zod.ZodNumber, 'result should be a ZodNumber');

        // expected IEEE‑754 float32 bounds
        const expectedMin = -3.4028234663852886e38;
        const expectedMax =  3.4028234663852886e38;

        // Zod stores range constraints in the internal `checks` array.
        // Look for exclusive (gt/lt) or inclusive (min/max) checks.
        const checks = result._def.checks || [];

        const minCheck = checks.find(c => c.kind === 'gt' || c.kind === 'min');
        const maxCheck = checks.find(c => c.kind === 'lt' || c.kind === 'max');

        const min = minCheck ? minCheck.value : undefined;
        const max = maxCheck ? maxCheck.value : undefined;

        // compare the extracted bounds with the expected float32 limits
        assert.strictEqual(min, expectedMin, 'minimum should match float32 lower bound');
        assert.strictEqual(max, expectedMax, 'maximum should match float32 upper bound');

        done();
    });
});