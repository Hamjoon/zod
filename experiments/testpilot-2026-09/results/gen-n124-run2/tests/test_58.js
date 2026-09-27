let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.stringbool', function(done) {
        const schema = zod.z.stringbool();

        // Valid inputs should be parsed to booleans
        assert.strictEqual(schema.parse('true'), true);
        assert.strictEqual(schema.parse('false'), false);
        assert.strictEqual(schema.parse(true), true);
        assert.strictEqual(schema.parse(false), false);

        // Invalid inputs should throw
        assert.throws(() => schema.parse('yes'));
        assert.throws(() => schema.parse('no'));
        assert.throws(() => schema.parse(1));
        assert.throws(() => schema.parse(null));

        done();
    });
});