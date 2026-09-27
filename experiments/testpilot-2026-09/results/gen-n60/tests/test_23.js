let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nullish', function(done) {
        // Create a nullish string schema
        const schema = zod.string().nullish();

        // Valid values
        assert.strictEqual(schema.parse('hello'), 'hello', 'should parse a regular string');
        assert.strictEqual(schema.parse(null), null, 'should parse null');
        assert.strictEqual(schema.parse(undefined), undefined, 'should parse undefined');

        // Invalid values should throw
        assert.throws(() => schema.parse(123), /Expected string/, 'should reject a number');
        assert.throws(() => schema.parse(true), /Expected string/, 'should reject a boolean');

        done();
    });
});