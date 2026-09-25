let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.union', function(done) {
        // Basic union of string and number
        const stringOrNumber = zod.union([zod.string(), zod.number()]);

        const r1 = stringOrNumber.safeParse('hello');
        assert.strictEqual(r1.success, true);
        assert.strictEqual(r1.data, 'hello');

        const r2 = stringOrNumber.safeParse(123);
        assert.strictEqual(r2.success, true);
        assert.strictEqual(r2.data, 123);

        const r3 = stringOrNumber.safeParse(true);
        assert.strictEqual(r3.success, false);

        // Optional URL example using union with a literal empty string
        const optionalUrl = zod.union([
            zod.string().url().nullish(),
            zod.literal('')
        ]);

        // undefined and null should be accepted via .nullish()
        assert.strictEqual(optionalUrl.safeParse(undefined).success, true);
        assert.strictEqual(optionalUrl.safeParse(null).success, true);

        // empty string literal should be accepted
        assert.strictEqual(optionalUrl.safeParse('').success, true);

        // valid URL should be accepted
        assert.strictEqual(optionalUrl.safeParse('https://zod.dev').success, true);

        // invalid URL should be rejected
        assert.strictEqual(optionalUrl.safeParse('not a valid url').success, false);

        done();
    });
});