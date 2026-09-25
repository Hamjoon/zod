const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');   // import the Zod namespace correctly

describe('test zod', function () {
    it('test zod.z.positive', function (done) {
        // Create a schema that validates positive numbers
        // In Zod the positive validator is a method on a number schema
        const schema = z.number().positive();

        // Positive numbers should pass validation
        assert.doesNotThrow(() => schema.parse(1));
        assert.doesNotThrow(() => schema.parse(123.45));

        // Zero and negative numbers should fail validation
        assert.throws(() => schema.parse(0));
        assert.throws(() => schema.parse(-1));
        assert.throws(() => schema.parse(-99.99));

        done();
    });
});