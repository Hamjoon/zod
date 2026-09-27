let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod function schema', function (done) {
        // Zod validates functions via the `z.function()` schema.
        // When a non‑function is supplied, parsing should throw an error.
        const fnSchema = zod.function()
            .args(zod.any(), zod.any())   // accept any two arguments
            .returns(zod.any());          // return any type

        // Should throw when the argument is not a function
        assert.throws(() => {
            fnSchema.parse(123);
        }, /function/);

        // When a proper function is supplied, it should return the same function
        // (i.e., behave like the original).
        const original = (a, b) => a + b;
        const checked = fnSchema.parse(original);
        assert.strictEqual(typeof checked, 'function');
        assert.strictEqual(checked(2, 3), 5);

        done();
    });
});