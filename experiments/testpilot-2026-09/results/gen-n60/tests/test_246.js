let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.size', function(done) {
        // basic usage – only size argument
        const check1 = zod.z.size(3);
        // Zod stores validation rules in the internal `_def.checks` array.
        // The first (and only) check should be a `size_equals` rule with the
        // provided value.
        assert.strictEqual(
            check1._def.checks[0].kind,
            'size_equals',
            'check kind should be size_equals'
        );
        assert.strictEqual(
            check1._def.checks[0].value,
            3,
            'size should be the value passed'
        );

        // usage with additional params – ensure they are preserved
        const check2 = zod.z.size(5, { message: 'must be exactly 5' });
        assert.strictEqual(
            check2._def.checks[0].kind,
            'size_equals',
            'check kind should still be size_equals'
        );
        assert.strictEqual(
            check2._def.checks[0].value,
            5,
            'size should be the value passed'
        );
        // the params object is normalized, but the message should survive
        assert.strictEqual(
            check2._def.checks[0].message,
            'must be exactly 5',
            'custom message should be retained'
        );

        done();
    });
});