let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.never', function(done) {
        // never schema should reject any input
        const neverSchema = zod.never();
        const neverResult = neverSchema.safeParse('anything');
        assert.strictEqual(neverResult.success, false, 'never schema should not succeed');

        // Using never in a union should have no effect on the other schema
        const Keys = zod.enum(['id', 'name', 'email']).or(zod.never());

        // Valid enum values should still parse correctly
        assert.strictEqual(Keys.parse('id'), 'id');
        assert.strictEqual(Keys.parse('name'), 'name');
        assert.strictEqual(Keys.parse('email'), 'email');

        // Invalid enum values should still throw
        assert.throws(() => Keys.parse('foo'));

        // The union with never should not make the schema optional
        assert.throws(() => Keys.parse(undefined));

        done();
    });
});