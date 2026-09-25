let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.int32', function(done) {
        // Create the int32 schema
        const schema = zod.z.int32();

        // Values that should be accepted (within int32 range)
        const withinValues = [
            0,
            1,
            -1,
            2147483647,   // INT32_MAX
            -2147483648   // INT32_MIN
        ];

        // Values that should be rejected (outside int32 range)
        const outsideValues = [
            2147483648,   // INT32_MAX + 1
            -2147483649,  // INT32_MIN - 1
            Number.MAX_SAFE_INTEGER,
            Number.MIN_SAFE_INTEGER,
            3.14,         // non‑integer
            '123'         // not a number
        ];

        // Verify all within‑range values pass validation
        withinValues.forEach(val => {
            const result = schema.safeParse(val);
            assert.strictEqual(result.success, true, `Expected ${val} to be valid int32`);
        });

        // Verify all outside‑range values fail validation
        outsideValues.forEach(val => {
            const result = schema.safeParse(val);
            assert.strictEqual(result.success, false, `Expected ${val} to be invalid int32`);
        });

        done();
    });
});