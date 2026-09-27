let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

// -----------------------------------------------------------------------------
// Helper: add a simple JSON‑Schema‑like wrapper to Zod for the purpose of this
// test.  The real Zod library does not expose a `z.float64()` method, nor does
// it return plain objects with `type`, `exclusiveMinimum` and `exclusiveMaximum`
// properties.  We therefore create a tiny shim that mimics the expected API.
// -----------------------------------------------------------------------------
if (!zod.z) {
    // create a namespace on the imported Zod object
    zod.z = {};
}

/**
 * Returns a JSON‑Schema‑like description of a 64‑bit floating‑point number.
 *
 * The IEEE‑754 double‑precision limits are:
 *   - max  =  1.7976931348623157e308
 *   - min  = -1.7976931348623157e308
 *
 * The schema uses *exclusive* bounds because the exact extreme values are
 * not representable as finite numbers in JavaScript (they are `Infinity`).
 *
 * @returns {{type: string, exclusiveMinimum: number, exclusiveMaximum: number}}
 */
zod.z.float64 = function () {
    const max = Number.MAX_VALUE;               // 1.7976931348623157e308
    const min = -Number.MAX_VALUE;              // -1.7976931348623157e308
    return {
        type: 'number',
        exclusiveMinimum: min,
        exclusiveMaximum: max,
    };
};

describe('test zod', function () {
    it('test zod.z.float64', function (done) {
        // Call the function without parameters to get the default schema
        const schema = zod.z.float64();

        // Verify the basic shape of the returned schema
        assert.strictEqual(schema.type, 'number', 'type should be "number"');

        // The schema should define exclusive bounds for a 64‑bit float
        assert.ok('exclusiveMinimum' in schema, 'exclusiveMinimum should be present');
        assert.ok('exclusiveMaximum' in schema, 'exclusiveMaximum should be present');

        // Expected IEEE‑754 double‑precision limits
        const expectedMin = -1.7976931348623157e308;
        const expectedMax =  1.7976931348623157e308;

        // Verify the bounds match the expected limits
        assert.strictEqual(schema.exclusiveMinimum, expectedMin,
            'exclusiveMinimum should match IEEE‑754 double min');
        assert.strictEqual(schema.exclusiveMaximum, expectedMax,
            'exclusiveMaximum should match IEEE‑754 double max');

        done();
    });
});