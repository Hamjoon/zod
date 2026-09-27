let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.float64', function (done) {
        // Call the function without parameters to get the default float64 schema
        const schema = zod.z.float64();

        // The schema should be a ZodNumber instance
        assert(
            schema instanceof zod.ZodNumber,
            'schema should be an instance of ZodNumber'
        );

        // Extract the internal checks (Zod stores min/max constraints here)
        const checks = schema._def.checks;

        // Find the exclusive minimum and maximum checks
        const minCheck = checks.find(
            (c) => c.kind === 'min' && c.exclusive === true
        );
        const maxCheck = checks.find(
            (c) => c.kind === 'max' && c.exclusive === true
        );

        // Verify that both checks exist
        assert(minCheck, 'schema should have an exclusive minimum check');
        assert(maxCheck, 'schema should have an exclusive maximum check');

        // The exclusive bounds for a 64‑bit float should match Number.MAX_VALUE
        const expectedMin = -Number.MAX_VALUE;
        const expectedMax = Number.MAX_VALUE;

        assert.strictEqual(
            minCheck.value,
            expectedMin,
            'exclusiveMinimum should be -Number.MAX_VALUE'
        );
        assert.strictEqual(
            maxCheck.value,
            expectedMax,
            'exclusiveMaximum should be Number.MAX_VALUE'
        );

        // Ensure no unexpected checks are present (only min & max)
        const checkKinds = checks.map((c) => c.kind).sort();
        assert.deepStrictEqual(
            checkKinds,
            ['max', 'min'],
            'schema should only contain exclusive min and max checks'
        );

        done();
    });
});