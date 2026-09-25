let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uint32', function(done) {
        // Create a uint32 schema
        const schema = zod.z.uint32();

        // Valid boundary values should parse correctly
        assert.strictEqual(schema.parse(0), 0, 'uint32 should accept 0');
        assert.strictEqual(schema.parse(4294967295), 4294967295, 'uint32 should accept max uint32 value');

        // Values outside the uint32 range should throw
        assert.throws(() => schema.parse(-1), /.+/, 'uint32 should reject negative numbers');
        assert.throws(() => schema.parse(4294967296), /.+/, 'uint32 should reject numbers larger than max');

        // Non‑numeric values should also throw
        assert.throws(() => schema.parse('123'), /.+/, 'uint32 should reject non‑numeric input');
        assert.throws(() => schema.parse(null), /.+/, 'uint32 should reject null');

        done();
    });
});