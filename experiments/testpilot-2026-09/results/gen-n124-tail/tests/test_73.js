let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.safeParse', function(done) {
        // 1. Simple union schema: string or number
        const unionSchema = zod.z.string().or(zod.z.number());

        const resString = unionSchema.safeParse("hello");
        assert.strictEqual(resString.success, true, 'String should pass union schema');

        const resNumber = unionSchema.safeParse(42);
        assert.strictEqual(resNumber.success, true, 'Number should pass union schema');

        const resBool = unionSchema.safeParse(true);
        assert.strictEqual(resBool.success, false, 'Boolean should fail union schema');

        // 2. Optional URL example (nullish + empty string literal)
        const optionalUrl = zod.z.union([
            zod.z.string().url().nullish(),
            zod.z.literal("")
        ]);

        assert.strictEqual(optionalUrl.safeParse(undefined).success, true, 'undefined should be valid');
        assert.strictEqual(optionalUrl.safeParse(null).success, true, 'null should be valid');
        assert.strictEqual(optionalUrl.safeParse("").success, true, 'empty string should be valid');
        assert.strictEqual(optionalUrl.safeParse("https://zod.dev").success, true, 'valid URL should be valid');
        assert.strictEqual(optionalUrl.safeParse("not a url").success, false, 'invalid URL should be invalid');

        // 3. Ensure error object is not a native Error instance
        const result = zod.z.string().safeParse(12);
        assert.strictEqual(result.success, false, 'Number should not pass string schema');
        assert.ok(!(result.error instanceof Error), 'result.error should not be an instance of native Error');

        done();
    });
});