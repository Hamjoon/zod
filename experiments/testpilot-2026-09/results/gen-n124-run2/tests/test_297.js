let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.date', function(done) {
        // Create a date schema
        const dateSchema = zod.z.date();

        // Valid case: a proper Date instance
        const validDate = new Date('2023-01-10T12:34:56Z');
        const validResult = dateSchema.safeParse(validDate);
        assert.strictEqual(validResult.success, true, 'Date instance should be valid');

        // Invalid case: a string (not coerced)
        const invalidString = '2023-01-10';
        const invalidResult1 = dateSchema.safeParse(invalidString);
        assert.strictEqual(invalidResult1.success, false, 'String should not be accepted by z.date()');

        // Invalid case: a number
        const invalidNumber = 12345;
        const invalidResult2 = dateSchema.safeParse(invalidNumber);
        assert.strictEqual(invalidResult2.success, false, 'Number should not be accepted by z.date()');

        // Invalid case: null
        const invalidNull = null;
        const invalidResult3 = dateSchema.safeParse(invalidNull);
        assert.strictEqual(invalidResult3.success, false, 'null should not be accepted by z.date()');

        done();
    });
});