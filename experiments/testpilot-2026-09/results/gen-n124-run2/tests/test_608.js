let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.minSize', function (done) {
        // basic check: returned object should contain the correct type and minimum value
        const check = zod.z.minSize(5);
        assert.strictEqual(check.type, 'min_size');   // <-- use `type` instead of `check`
        assert.strictEqual(check.minimum, 5);

        // when additional params are supplied they should be merged onto the result
        const extraParams = { foo: 'bar', message: 'must be larger' };
        const checkWithParams = zod.z.minSize(10, extraParams);
        assert.strictEqual(checkWithParams.type, 'min_size'); // <-- use `type`
        assert.strictEqual(checkWithParams.minimum, 10);
        assert.strictEqual(checkWithParams.foo, 'bar');
        assert.strictEqual(checkWithParams.message, 'must be larger');

        done();
    });
});