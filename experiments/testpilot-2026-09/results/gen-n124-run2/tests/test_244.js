let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.int64', function(done) {
        // Create an int64 schema with default parameters
        const schema = zod.z.int64();

        // A valid 64‑bit signed integer as BigInt
        const valid = 1234567890123456789n;
        assert.strictEqual(schema.parse(valid), valid, 'Valid int64 should parse correctly');

        // Invalid type: plain Number should be rejected
        assert.throws(() => schema.parse(123), /.+/, 'Number should not be accepted as int64');

        // Out‑of‑range value: larger than 2^63‑1 (max signed 64‑bit integer)
        const tooBig = 9223372036854775808n; // max + 1
        assert.throws(() => schema.parse(tooBig), /.+/, 'Value exceeding int64 range should be rejected');

        done();
    });
});