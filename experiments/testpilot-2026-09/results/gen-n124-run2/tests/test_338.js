let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.union', function(done) {
        // --- Union of string and number ---
        const stringOrNumber = zod.union([zod.string(), zod.number()]);

        // valid string
        const resString = stringOrNumber.safeParse('hello');
        assert.strictEqual(resString.success, true);
        assert.strictEqual(resString.data, 'hello');

        // valid number
        const resNumber = stringOrNumber.safeParse(42);
        assert.strictEqual(resNumber.success, true);
        assert.strictEqual(resNumber.data, 42);

        // invalid type (boolean)
        const resBool = stringOrNumber.safeParse(true);
        assert.strictEqual(resBool.success, false);

        // --- Optional URL validation using union with empty string literal ---
        const optionalUrl = zod.union([
            zod.string().url().nullish(),
            zod.literal('')
        ]);

        // undefined should be accepted (nullish)
        assert.strictEqual(optionalUrl.safeParse(undefined).success, true);

        // null should be accepted (nullish)
        assert.strictEqual(optionalUrl.safeParse(null).success, true);

        // empty string should be accepted (literal)
        assert.strictEqual(optionalUrl.safeParse('').success, true);

        // valid URL should be accepted
        assert.strictEqual(optionalUrl.safeParse('https://zod.dev').success, true);

        // invalid URL should be rejected
        assert.strictEqual(optionalUrl.safeParse('not a valid url').success, false);

        done();
    });
});