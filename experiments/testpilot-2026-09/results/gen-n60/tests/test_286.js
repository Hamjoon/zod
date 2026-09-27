let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.transform', function(done) {
        // Transform a string to uppercase
        const upperSchema = zod.string().transform(str => str.toUpperCase());
        const upperResult = upperSchema.parse('hello');
        assert.strictEqual(upperResult, 'HELLO');

        // Transform a string into its length (changing the output type)
        const lengthSchema = zod.string().transform(str => str.length);
        const lengthResult = lengthSchema.parse('abcd');
        assert.strictEqual(lengthResult, 4);

        done();
    });
});