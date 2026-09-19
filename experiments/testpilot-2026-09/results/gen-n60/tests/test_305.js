let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.preprocess', function(done) {
        // Preprocess: if input is a number, convert it to a string; otherwise leave it unchanged.
        const schema = zod.z.preprocess(
            (arg) => (typeof arg === 'number' ? String(arg) : arg),
            zod.z.string()
        );

        // Valid case: number is converted to string and passes schema validation.
        const good = schema.safeParse(123);
        assert.strictEqual(good.success, true, 'Number should be preprocessed to a string');
        assert.strictEqual(good.data, '123', 'Preprocessed value should be the string "123"');

        // Invalid case: boolean is not transformed to a string and fails the string schema.
        const bad = schema.safeParse(true);
        assert.strictEqual(bad.success, false, 'Non‑string input should fail validation');

        done();
    });
});