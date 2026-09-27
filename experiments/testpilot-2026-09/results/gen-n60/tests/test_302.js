let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.overwrite', function(done) {
        // simple string overwrite – should transform the input before validation
        const upperSchema = zod.string().overwrite(s => s.toUpperCase());
        const upperResult = upperSchema.parse('hello');
        assert.strictEqual(upperResult, 'HELLO');

        // number overwrite combined with a max check
        const numSchema = zod.number().overwrite(n => n * n).max(100);
        // 5² = 25, which satisfies the max constraint
        assert.strictEqual(numSchema.parse(5), 25);

        // 11² = 121, which violates the max constraint and should throw a ZodError
        try {
            numSchema.parse(11);
            assert.fail('Expected a ZodError to be thrown for value exceeding max');
        } catch (e) {
            assert(e instanceof zod.ZodError, 'Thrown error should be a ZodError');
        }

        done();
    });
});