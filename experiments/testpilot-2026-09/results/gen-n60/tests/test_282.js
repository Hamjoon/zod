let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.trim', function(done) {
        // basic trimming
        const trimSchema = zod.string().trim();
        assert.strictEqual(trimSchema.parse('  tuna  '), 'tuna');

        // chaining after trim (toUpperCase) should work on the trimmed value
        const upperSchema = zod.string().trim().toUpperCase();
        assert.strictEqual(upperSchema.parse('  tuna  '), 'TUNA');

        // parsing undefined should throw because the value is required
        assert.throws(() => trimSchema.parse(undefined), /Required/);

        done();
    });
});