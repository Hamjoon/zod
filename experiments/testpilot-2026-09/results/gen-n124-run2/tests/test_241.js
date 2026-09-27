let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');   // <-- import the Zod namespace correctly

describe('test zod', function () {
    it('test zod.z.bigint', function (done) {
        try {
            // Create a schema without any parameters
            const schema = z.bigint();   // <-- use z.bigint() directly

            // The schema should expose a `parse` method
            assert.strictEqual(
                typeof schema.parse,
                'function',
                'schema.parse should be a function'
            );

            // It must correctly accept a BigInt value
            const bigIntValue = 12345678901234567890n;
            assert.strictEqual(
                schema.parse(bigIntValue),
                bigIntValue,
                'parse should return the same bigint'
            );

            // It must reject values that are not BigInt
            assert.throws(
                () => schema.parse(123),          // number
                /Expected bigint/,                // Zod’s default error contains this phrase
                'parse should throw on non‑bigint values'
            );
            assert.throws(
                () => schema.parse('123'),        // string
                /Expected bigint/,
                'parse should throw on non‑bigint string values'
            );

            // If the implementation supports a coercion option, verify it works.
            // Zod provides coercion via the `z.coerce` namespace.
            if (typeof z.coerce?.bigint === 'function') {
                const coerceSchema = z.coerce.bigint(); // <-- coercion schema
                // The coercion should turn a numeric string into a bigint.
                const coerced = coerceSchema.parse('42');
                assert.strictEqual(
                    coerced,
                    42n,
                    'coerce option should convert string to bigint'
                );
            }

            done();
        } catch (err) {
            done(err);
        }
    });
});