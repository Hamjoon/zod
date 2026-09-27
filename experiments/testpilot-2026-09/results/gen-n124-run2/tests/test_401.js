let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.literal', function(done) {
        // Single literal value
        const helloSchema = zod.literal('hello');
        const singleSuccess = helloSchema.safeParse('hello');
        assert.strictEqual(singleSuccess.success, true);
        assert.strictEqual(singleSuccess.data, 'hello');

        const singleFail = helloSchema.safeParse('world');
        assert.strictEqual(singleFail.success, false);

        // Multiple literal values via an array
        const colorsSchema = zod.literal(['red', 'green', 'blue']);
        const multiSuccess = colorsSchema.safeParse('green');
        assert.strictEqual(multiSuccess.success, true);
        assert.strictEqual(multiSuccess.data, 'green');

        const multiFail = colorsSchema.safeParse('yellow');
        assert.strictEqual(multiFail.success, false);

        done();
    });
});