let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // use the Zod namespace directly

describe('test zod', function () {
    it('test z.string().uppercase()', function (done) {
        // ----- Test default behavior (no params) -----
        const schemaDefault = z.string().uppercase();

        // Zod stores validation checks in the internal `_def.checks` array.
        // Find the check that corresponds to the uppercase validation.
        const defaultCheck = schemaDefault._def.checks.find(c => c.kind === 'uppercase');

        // The check should exist and its kind should be 'uppercase'.
        assert.ok(defaultCheck, 'uppercase check should be present');
        assert.strictEqual(defaultCheck.kind, 'uppercase', 'check kind should be uppercase');

        // ----- Test that custom parameters are merged correctly -----
        const customParams = { message: 'must be uppercase' };
        const schemaCustom = z.string().uppercase(customParams);

        const customCheck = schemaCustom._def.checks.find(c => c.kind === 'uppercase');

        // The check should still be of kind 'uppercase'.
        assert.ok(customCheck, 'uppercase check should be present on custom schema');
        assert.strictEqual(customCheck.kind, 'uppercase', 'check kind should still be uppercase');

        // The custom message should be preserved.
        assert.strictEqual(
            customCheck.message,
            'must be uppercase',
            'custom message should be preserved'
        );

        done();
    });
});