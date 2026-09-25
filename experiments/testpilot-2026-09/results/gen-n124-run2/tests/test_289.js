let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.void', function (done) {
        // Basic void schema should accept undefined and reject everything else
        const voidSchema = zod.z.void();

        // Valid case
        assert.strictEqual(voidSchema.parse(undefined), undefined);

        // Invalid cases – should throw with the default error message
        // Zod's default message uses lowercase "expected void", so match that
        assert.throws(() => voidSchema.parse(null), /expected void/);
        assert.throws(() => voidSchema.parse(0), /expected void/);
        assert.throws(() => voidSchema.parse(''), /expected void/);

        // Custom error message via params
        const customVoid = zod.z.void({ invalid_type_error: "Not void" });
        assert.throws(() => customVoid.parse('test'), /Not void/);

        done();
    });
});