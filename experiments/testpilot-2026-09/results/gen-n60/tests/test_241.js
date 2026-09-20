let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.gte', function(done) {
        // Create a schema that requires a number >= 5
        const schema = zod.z.number().gte(5);

        // Values that should pass validation
        assert.doesNotThrow(() => schema.parse(5));
        assert.doesNotThrow(() => schema.parse(5.1));
        assert.doesNotThrow(() => schema.parse(100));

        // Values that should fail validation
        assert.throws(() => schema.parse(4), zod.ZodError);
        assert.throws(() => schema.parse(-10), zod.ZodError);
        assert.throws(() => schema.parse('6'), zod.ZodError); // wrong type

        done();
    });
});