let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.null', function(done) {
        // Create a schema that only accepts null
        const schema = zod.z.null();

        // Valid case: parsing null should succeed and return null
        const result = schema.parse(null);
        assert.strictEqual(result, null, 'Parsing null should return null');

        // Invalid cases: parsing any non‑null value should throw a ZodError
        const invalidValues = [undefined, 0, '', {}, [], true];
        invalidValues.forEach((val) => {
            assert.throws(
                () => schema.parse(val),
                (err) => err instanceof zod.ZodError,
                `Parsing ${JSON.stringify(val)} should throw a ZodError`
            );
        });

        done();
    });
});