let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.date', function(done) {
        // basic date schema without params
        const schema = zod.z.date();

        // valid Date instance should pass
        const validDate = new Date('2023-01-01T00:00:00Z');
        const validResult = schema.safeParse(validDate);
        assert.strictEqual(validResult.success, true, 'Valid Date should be parsed successfully');

        // invalid value (string) should fail
        const invalidResult = schema.safeParse('not-a-date');
        assert.strictEqual(invalidResult.success, false, 'Non‑Date value should fail validation');

        // schema with custom required_error message
        const schemaWithMessage = zod.z.date({ required_error: 'Date required' });
        const missingResult = schemaWithMessage.safeParse(undefined);
        assert.strictEqual(missingResult.success, false, 'Undefined should fail validation');
        assert.strictEqual(
            missingResult.error.errors[0].message,
            'Date required',
            'Custom required_error message should be used'
        );

        done();
    });
});