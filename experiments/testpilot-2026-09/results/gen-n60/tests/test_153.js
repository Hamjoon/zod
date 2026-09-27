let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.symbol', function(done) {
        // Create a symbol value to test successful parsing
        const testSymbol = Symbol('test');

        // Obtain the Zod symbol schema.  Depending on the version,
        // the API may be exposed as `zod.z.symbol` or directly as `zod.symbol`.
        const schema = (zod.z && typeof zod.z.symbol === 'function')
            ? zod.z.symbol()
            : (typeof zod.symbol === 'function' ? zod.symbol() : null);

        // Ensure we actually got a schema object
        assert.ok(schema, 'Could not locate Zod symbol schema');

        // 1️⃣  Valid case – parsing a Symbol should succeed and return the same Symbol
        const parsed = schema.parse(testSymbol);
        assert.strictEqual(parsed, testSymbol, 'Parsed symbol does not match original');

        // 2️⃣  Invalid case – parsing a non‑symbol should throw a ZodError
        assert.throws(
            () => schema.parse('not a symbol'),
            err => err instanceof zod.ZodError && /symbol/.test(err.message),
            'Parsing a non‑symbol did not throw the expected ZodError'
        );

        done();
    });
});