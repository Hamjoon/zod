let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');

describe('test zod', function () {
    it('test zod.z.coerce.string', function () {
        // Use preprocess to coerce values to string,
        // but let `undefined` pass through so the underlying `z.string()`
        // can raise the expected "Required" error.
        const schema = z.preprocess(
            (val) => (val === undefined ? undefined : String(val)),
            z.string()
        );

        // Coerce numbers, booleans, and strings correctly
        assert.strictEqual(schema.parse(123), "123");
        assert.strictEqual(schema.parse(true), "true");
        assert.strictEqual(schema.parse("hello"), "hello");

        // Undefined should trigger a validation error
        assert.throws(() => schema.parse(undefined), /Required/);
    });
});