let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nullable', function(done) {
        const inner = zod.z.string();
        const schema = zod.z.nullable(inner);

        // Should accept null
        assert.strictEqual(schema.parse(null), null);

        // Should accept a valid string
        assert.strictEqual(schema.parse('hello world'), 'hello world');

        // Should reject a value that does not match the inner type
        assert.throws(() => schema.parse(123), zod.ZodError);

        done();
    });
});