let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.safeParse', function(done) {
        // Define a simple schema: an object with a non‑negative integer `age`
        const schema = zod.z.object({
            age: zod.z.number().int().min(0)
        });

        // ---- Successful parse ----
        const validValue = { age: 30 };
        const validResult = zod.z.safeParse(schema, validValue, undefined);
        // `success` should be true and `data` should equal the input
        assert.strictEqual(validResult.success, true);
        assert.deepStrictEqual(validResult.data, validValue);

        // ---- Failing parse ----
        const invalidValue = { age: -5 };
        const invalidResult = zod.z.safeParse(schema, invalidValue, undefined);
        // `success` should be false and an error object should be present
        assert.strictEqual(invalidResult.success, false);
        assert.ok(invalidResult.error);

        done();
    });
});