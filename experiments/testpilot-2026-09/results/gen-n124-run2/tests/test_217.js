let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.int32', function(done) {
        const schema = zod.z.int32();

        // Valid 32‑bit integers should pass
        assert.strictEqual(schema.parse(0), 0);
        assert.strictEqual(schema.parse(123), 123);
        assert.strictEqual(schema.parse(-456), -456);
        assert.strictEqual(schema.parse(2147483647), 2147483647); // INT32_MAX
        assert.strictEqual(schema.parse(-2147483648), -2147483648); // INT32_MIN

        // Values outside the 32‑bit signed integer range should throw
        assert.throws(() => schema.parse(2147483648), /Invalid/);
        assert.throws(() => schema.parse(-2147483649), /Invalid/);

        // Non‑numeric values should also throw
        assert.throws(() => schema.parse('123'), /Invalid/);
        assert.throws(() => schema.parse(null), /Invalid/);
        assert.throws(() => schema.parse(undefined), /Invalid/);
        assert.throws(() => schema.parse({}), /Invalid/);

        done();
    });
});