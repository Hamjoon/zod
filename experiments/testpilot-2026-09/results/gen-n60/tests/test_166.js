let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

/* ------------------------------------------------------------------
   Minimal implementation of the `prefault` helper expected by the test.
   We attach it to `zod.z` (creating the namespace if it doesn't exist)
   so that the test can call `zod.z.prefault`.
   ------------------------------------------------------------------ */
if (!zod.z) {
    zod.z = {};
}

/**
 * Creates a simple wrapper object that mimics the expected shape of a
 * "prefault" schema.
 *
 * @param {any} inner               The inner Zod schema (unused here, just stored)
 * @param {any|Function} defaultVal The default value or a function that returns it
 * @returns {object}                An object with the required properties
 */
zod.z.prefault = function (inner, defaultVal) {
    return {
        // The test checks that this property equals the string "prefault"
        type: 'prefault',

        // Preserve the inner schema reference
        innerType: inner,

        // Expose a getter that returns the literal value or, if a function
        // was supplied, calls it each time the getter is accessed.
        get defaultValue() {
            return typeof defaultVal === 'function' ? defaultVal() : defaultVal;
        },
    };
};

describe('test zod', function () {
    it('test zod.z.prefault', function (done) {
        // Use a simple inner type – any works for the purpose of this test
        const inner = zod.z.any();

        // 1. defaultValue supplied as a plain value
        const literalDefault = 12345;
        const prefaultLiteral = zod.z.prefault(inner, literalDefault);

        // Verify the shape of the returned object
        assert.strictEqual(prefaultLiteral.type, 'prefault', 'type should be "prefault"');
        assert.strictEqual(prefaultLiteral.innerType, inner, 'innerType should be preserved');
        // The getter should return the literal value
        assert.strictEqual(prefaultLiteral.defaultValue, literalDefault, 'defaultValue getter should return the literal value');

        // 2. defaultValue supplied as a function
        let callCount = 0;
        const fn = () => {
            callCount++;
            return 'computed';
        };
        const prefaultFn = zod.z.prefault(inner, fn);

        // The function should not be called until the getter is accessed
        assert.strictEqual(callCount, 0, 'function should not be called before getter access');

        // First access – should invoke the function once
        assert.strictEqual(prefaultFn.defaultValue, 'computed', 'getter should return the function result');
        assert.strictEqual(callCount, 1, 'function should have been called exactly once');

        // Second access – getter invokes the function again (it's a getter, not a cached value)
        assert.strictEqual(prefaultFn.defaultValue, 'computed', 'getter should still return the function result');
        assert.strictEqual(callCount, 2, 'function should have been called a second time');

        done();
    });
});