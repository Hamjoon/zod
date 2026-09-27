let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.lt', function(done) {
        // Schema using the .lt validator (internally uses zod.z.lt)
        const schema = zod.z.number().lt(5);

        // Value strictly less than the limit should pass
        assert.doesNotThrow(() => schema.parse(3));

        // Value equal to the limit should fail
        assert.throws(() => schema.parse(5), zod.ZodError);

        // Value greater than the limit should also fail
        assert.throws(() => schema.parse(10), zod.ZodError);

        // Additional edge‑case: negative limit
        const negativeSchema = zod.z.number().lt(0);
        assert.doesNotThrow(() => negativeSchema.parse(-1));
        assert.throws(() => negativeSchema.parse(0), zod.ZodError);

        done();
    });
});