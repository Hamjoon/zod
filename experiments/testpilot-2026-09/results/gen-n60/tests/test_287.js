let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.transform', function(done) {
        // simple transform that doubles the input
        const fn = (x) => x * 2;

        // create a ZodTransform schema using the static transform method
        const schema = zod.z.transform(fn);

        // the internal definition should store the provided transform function
        assert.strictEqual(schema._def.transform, fn, 'Transform function should be stored in the schema definition');

        // parsing a value should apply the transform function
        const input = 7;
        const expected = 14;
        const result = schema.parse(input);
        assert.strictEqual(result, expected, `Parsing ${input} should return ${expected}`);

        done();
    });
});