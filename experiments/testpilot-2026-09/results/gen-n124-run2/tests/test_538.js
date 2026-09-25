let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');   // <-- import the Zod namespace correctly

describe('test zod', function() {
    it('test zod.z.lt', function(done) {
        // Create a schema that only accepts numbers less than 10
        const schema = z.number().lt(10);   // <-- a Zod schema with a .parse() method

        // Values that should pass
        assert.doesNotThrow(() => schema.parse(0));
        assert.doesNotThrow(() => schema.parse(9.999));

        // Values that should fail (equal to or greater than the limit)
        // Zod throws a ZodError whose message contains “Number must be less than 10”
        assert.throws(() => schema.parse(10), /Number must be less than 10/);
        assert.throws(() => schema.parse(11), /Number must be less than 10/);
        assert.throws(() => schema.parse('5'), /Expected number, received string/);

        done();
    });
});