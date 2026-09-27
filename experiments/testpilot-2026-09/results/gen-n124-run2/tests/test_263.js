let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.undefined', function(done) {
        // obtain the undefined schema via the z namespace
        const undefSchema = zod.z.undefined();

        // parsing a literal undefined should succeed and return undefined
        const result = undefSchema.parse(undefined);
        assert.strictEqual(result, undefined, 'Parsing undefined should return undefined');

        // parsing any other value must throw a ZodError
        const invalidValues = [null, 0, '', false, {}, [], () => {}];
        invalidValues.forEach(value => {
            assert.throws(
                () => undefSchema.parse(value),
                err => err instanceof zod.ZodError,
                `Parsing ${JSON.stringify(value)} should throw a ZodError`
            );
        });

        done();
    });
});