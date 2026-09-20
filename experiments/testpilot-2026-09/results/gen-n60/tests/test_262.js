let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.number().multipleOf', function (done) {
        // basic usage with explicit params (custom error message)
        const divisor = 10;
        const customMessage = 'must be a multiple of 10';
        const schema = zod.z.number().multipleOf(divisor, { message: customMessage });

        // value that satisfies the constraint
        const goodValue = 10;
        const goodResult = schema.safeParse(goodValue);
        assert.strictEqual(goodResult.success, true, 'value should pass the multipleOf check');
        assert.strictEqual(goodResult.data, goodValue, 'parsed value should be preserved');

        // value that violates the constraint
        const badValue = 3;
        const badResult = schema.safeParse(badValue);
        assert.strictEqual(badResult.success, false, 'value should fail the multipleOf check');
        // the custom message should appear in the first issue
        const firstIssue = badResult.error?.issues?.[0];
        assert.ok(firstIssue, 'there should be at least one validation issue');
        assert.strictEqual(firstIssue.message, customMessage, 'custom message should be propagated');

        // usage without explicit params (default message)
        const divisorNoParams = 3;
        const schemaNoParams = zod.z.number().multipleOf(divisorNoParams);
        const resultNoParams = schemaNoParams.safeParse(3);
        assert.strictEqual(resultNoParams.success, true, 'value should pass without custom params');
        assert.strictEqual(resultNoParams.data, 3, 'parsed value should be preserved');

        done();
    });
});