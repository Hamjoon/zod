let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nullish', function(done) {
        // .nullish() should accept undefined, null, and the original type (string)
        const schema = zod.string().nullish(); // equivalent to string | null | undefined

        // Valid values
        [undefined, null, 'hello world'].forEach((val) => {
            const res = schema.safeParse(val);
            assert.strictEqual(res.success, true, `expected ${JSON.stringify(val)} to be valid`);
        });

        // Invalid value (number is not allowed)
        const badRes = schema.safeParse(123);
        assert.strictEqual(badRes.success, false, 'expected number to be invalid');

        // Ensure it behaves the same as optional(nullable(innerType))
        const manual = zod.optional(zod.nullable(zod.string()));
        const manualRes = manual.safeParse(undefined);
        assert.strictEqual(manualRes.success, true);
        assert.deepStrictEqual(manualRes.data, undefined);

        done();
    });
});