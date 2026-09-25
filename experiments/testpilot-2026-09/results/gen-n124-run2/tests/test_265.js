let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.undefined', function(done) {
        // Create an undefined schema
        const schema = zod.z.undefined();

        // ✅ Should accept undefined without throwing
        assert.doesNotThrow(() => schema.parse(undefined));

        // ❌ Should reject any other value
        const invalidValues = [null, 0, '', false, {}, [], () => {}];
        invalidValues.forEach(val => {
            assert.throws(() => schema.parse(val), zod.ZodError);
        });

        done();
    });
});