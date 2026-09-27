let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');   // use the named export `z`

describe('test zod', function () {
    it('test zod.z.uint64', function (done) {
        // default schema – should accept the full uint64 range
        const defaultSchema = z.uint64();

        // valid values
        assert.doesNotThrow(() => defaultSchema.parse(0n));
        assert.doesNotThrow(() => defaultSchema.parse(18446744073709551615n));

        // out‑of‑range values – we only need to assert that *some* error is thrown
        assert.throws(() => defaultSchema.parse(-1n));
        assert.throws(() => defaultSchema.parse(18446744073709551616n));

        // schema with a custom minimum
        const minSchema = z.uint64({ min: 10n });
        assert.doesNotThrow(() => minSchema.parse(10n));
        assert.throws(() => minSchema.parse(9n));

        // schema with a custom maximum
        const maxSchema = z.uint64({ max: 100n });
        assert.doesNotThrow(() => maxSchema.parse(100n));
        assert.throws(() => maxSchema.parse(101n));

        done();
    });
});