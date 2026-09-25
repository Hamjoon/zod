let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.templateLiteral', function (done) {
        // Create a template literal schema: `age: ${number}`
        const schema = zod.z.templateLiteral(['age: ', ''], [zod.z.number()]);

        // ---- Valid case -------------------------------------------------
        // Should parse without throwing and return the original string.
        assert.doesNotThrow(() => {
            const result = schema.parse('age: 42');
            assert.strictEqual(result, 'age: 42');
        });

        // ---- Invalid cases -----------------------------------------------
        // 1. The interpolated part does not satisfy the number schema.
        assert.throws(() => {
            schema.parse('age: forty');
        });

        // 2. The static prefix does not match.
        assert.throws(() => {
            schema.parse('ag: 42');
        });

        // 3. Missing the trailing static part (empty string is fine, but we test a mismatch).
        assert.throws(() => {
            schema.parse('age:42extra');
        });

        done();
    });
});