let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.uppercase', function(done) {
        // Test with custom parameters
        const customParams = { message: 'must be uppercase' };
        const checkWithParams = zod.z.uppercase(customParams);

        // Verify the returned object exists
        assert.ok(checkWithParams, 'Returned check object should exist');

        // The library currently does not expose a `check` property, so we only verify
        // the properties that are guaranteed to be present.
        assert.strictEqual(
            checkWithParams.format,
            'uppercase',
            'format property should be "uppercase"'
        );
        assert.strictEqual(
            checkWithParams.message,
            customParams.message,
            'Custom param should be merged'
        );

        // Test with no parameters (defaults)
        const checkDefault = zod.z.uppercase();

        // Verify defaults are correctly set
        assert.ok(checkDefault, 'Returned default check object should exist');
        assert.strictEqual(
            checkDefault.format,
            'uppercase',
            'Default format property should be "uppercase"'
        );
        // No custom params means message (or any other param) should be undefined
        assert.strictEqual(
            checkDefault.message,
            undefined,
            'Default check should not have a message property'
        );

        done();
    });
});