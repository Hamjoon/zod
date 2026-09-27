let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uint32', function(done) {
        // Create a uint32 schema
        const schema = zod.z.uint32();

        // Valid values should parse correctly
        assert.strictEqual(schema.parse(0), 0);
        assert.strictEqual(schema.parse(123), 123);
        assert.strictEqual(schema.parse(4294967295), 4294967295); // max uint32

        // Invalid values should throw
        assert.throws(() => schema.parse(-1), /.*/);
        assert.throws(() => schema.parse(4294967296), /.* /);
        assert.throws(() => schema.parse(3.14), /.* /);
        assert.throws(() => schema.parse('123'), /.* /);
        assert.throws(() => schema.parse(null), /.* /);
        assert.throws(() => schema.parse(undefined), /.* /);

        done();
    });
});