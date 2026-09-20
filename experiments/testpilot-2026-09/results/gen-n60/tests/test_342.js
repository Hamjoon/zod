let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.coerce.boolean', function(done) {
        // Valid coercions
        assert.strictEqual(zod.z.coerce.boolean('true'), true);
        assert.strictEqual(zod.z.coerce.boolean('false'), false);
        assert.strictEqual(zod.z.coerce.boolean(1), true);
        assert.strictEqual(zod.z.coerce.boolean(0), false);
        // Invalid coercion should throw
        assert.throws(() => zod.z.coerce.boolean('yes'));
        done();
    });
});