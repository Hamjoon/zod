let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.overwrite', function(done) {
        // Create a number schema that overwrites the input by doubling it,
        // then enforces a maximum value of 10.
        const schema = zod.z.number().overwrite(val => val * 2).max(10);

        // Input 3 should be overwritten to 6 and pass validation.
        const result = schema.parse(3);
        assert.strictEqual(result, 6, 'Overwrite should double the input value');

        // Input 6 would be overwritten to 12, which exceeds the max(10) constraint,
        // so parsing should throw a ZodError.
        assert.throws(() => schema.parse(6), zod.ZodError, 'Value exceeding max after overwrite should throw');

        done();
    });
});