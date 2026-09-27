let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.int32', function(done) {
        // Create the int32 schema (no params needed for basic behavior)
        const schema = zod.z.int32();

        // Helper to check success flag
        const expectSuccess = (value, shouldSucceed) => {
            const result = schema.safeParse(value);
            assert.strictEqual(result.success, shouldSucceed, 
                `expected ${value} to ${shouldSucceed ? 'pass' : 'fail'} validation`);
        };

        // Valid 32‑bit integer range
        expectSuccess(0, true);
        expectSuccess(2147483647, true);   // INT32_MAX
        expectSuccess(-2147483648, true);  // INT32_MIN

        // Out‑of‑range values
        expectSuccess(2147483648, false);  // INT32_MAX + 1
        expectSuccess(-2147483649, false); // INT32_MIN - 1

        // Non‑integer numbers should fail
        expectSuccess(123.456, false);
        expectSuccess('123', false);
        expectSuccess(null, false);
        expectSuccess(undefined, false);

        done();
    });
});