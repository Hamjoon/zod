let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // use the proper Zod import

describe('test zod', function () {
    it('test zod.z.templateLiteral', function (done) {
        // Create a template literal schema: `age: ${number}`
        // NOTE: `templateLiteral` is a method on ZodString, not a top‑level Zod export.
        const schema = z.string().templateLiteral(['age: ', ''], [z.number()]);

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

        // 3. Extra characters after the valid template (trailing static part is empty, so any extra chars are invalid).
        assert.throws(() => {
            schema.parse('age:42extra');
        });

        done();
    });
});