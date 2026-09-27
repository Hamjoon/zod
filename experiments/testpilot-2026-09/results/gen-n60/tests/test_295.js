let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.positive', function(done) {
        // Create a schema that only accepts positive numbers (> 0)
        const schema = zod.number().positive();

        // Positive numbers should pass validation
        assert.doesNotThrow(() => schema.parse(1));
        assert.doesNotThrow(() => schema.parse(123.45));

        // Zero and negative numbers should fail validation
        assert.throws(() => schema.parse(0), zod.ZodError);
        assert.throws(() => schema.parse(-1), zod.ZodError);
        assert.throws(() => schema.parse(-99.99), zod.ZodError);

        done();
    });
});