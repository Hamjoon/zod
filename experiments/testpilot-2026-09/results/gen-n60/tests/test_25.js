let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nullish', function(done) {
        // Create a nullish schema for strings
        const schema = zod.string().nullish();

        // Values that should be accepted
        const valid = ["hello", null, undefined];
        // Values that should be rejected
        const invalid = [123, {}, [], true];

        // Verify accepted values
        valid.forEach(val => {
            const result = schema.safeParse(val);
            assert.strictEqual(result.success, true, `Expected ${JSON.stringify(val)} to be valid`);
        });

        // Verify rejected values
        invalid.forEach(val => {
            const result = schema.safeParse(val);
            assert.strictEqual(result.success, false, `Expected ${JSON.stringify(val)} to be invalid`);
        });

        // Ensure nullish is equivalent to nullable().optional()
        const equivalent = zod.string().nullable().optional();
        valid.concat(invalid).forEach(val => {
            const r1 = schema.safeParse(val);
            const r2 = equivalent.safeParse(val);
            assert.deepStrictEqual(r1, r2, `nullish and nullable().optional() differ for ${JSON.stringify(val)}`);
        });

        done();
    });
});