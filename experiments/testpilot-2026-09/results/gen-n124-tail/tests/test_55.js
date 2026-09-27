let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.toUpperCase', function(done) {
        // Create a schema that upper‑cases any string input
        const schema = zod.string().toUpperCase();

        // Normal case: lower‑case input should be transformed to upper‑case
        const input = 'helloWorld';
        const result = schema.parse(input);
        assert.strictEqual(result, 'HELLOWORLD');

        // Edge case: non‑string values should cause a validation error
        assert.throws(() => schema.parse(123), zod.ZodError);

        done();
    });
});