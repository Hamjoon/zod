let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.int64', function(done) {
        // Create an int64 schema
        const int64Schema = zod.z.int64();

        // Helper to test parsing
        function shouldParse(value) {
            assert.doesNotThrow(() => {
                const result = int64Schema.parse(value);
                // The result should be a BigInt
                assert.strictEqual(typeof result, 'bigint');
            }, `Expected value ${value} to be parsed successfully`);
        }

        function shouldReject(value) {
            assert.throws(() => {
                int64Schema.parse(value);
            }, /.+/, `Expected value ${value} to be rejected`);
        }

        // Valid 64-bit signed integer range: -(2^63) to 2^63-1
        const minInt64 = -(2n ** 63n);
        const maxInt64 = (2n ** 63n) - 1n;

        // Test valid values
        shouldParse(0n);
        shouldParse(123n);
        shouldParse(minInt64);
        shouldParse(maxInt64);

        // Test values just outside the range
        shouldReject(minInt64 - 1n);
        shouldReject(maxInt64 + 1n);

        // Test non‑BigInt types
        shouldReject(42);          // number
        shouldReject("123");       // string
        shouldReject(null);
        shouldReject(undefined);
        shouldReject({});

        done();
    });
});