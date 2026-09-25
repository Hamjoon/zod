let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.boolean', function(done) {
        const schema = zod.z.boolean();

        // valid boolean values
        assert.strictEqual(schema.parse(true), true);
        assert.strictEqual(schema.parse(false), false);

        // invalid values should throw
        assert.throws(() => schema.parse('true'), /Expected boolean/);
        assert.throws(() => schema.parse(1), /Expected boolean/);
        assert.throws(() => schema.parse(null), /Expected boolean/);
        assert.throws(() => schema.parse(undefined), /Expected boolean/);

        done();
    });
});