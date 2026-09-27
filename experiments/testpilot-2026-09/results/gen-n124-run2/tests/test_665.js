let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.includes', function(done) {
        // Arrange
        const includesValue = 'needle';
        const extraParams = { message: 'must contain needle' };

        // Act
        const result = zod.z.includes(includesValue, extraParams);

        // Assert core properties
        assert.strictEqual(result.check, 'string_format', 'check type should be string_format');
        assert.strictEqual(result.format, 'includes', 'format should be includes');
        assert.strictEqual(result.includes, includesValue, 'includes value should be preserved');

        // Assert that extra params are merged into the result
        assert.strictEqual(result.message, extraParams.message, 'extra param "message" should be present');

        // If the library exposes the constructor, verify the instance type
        if (zod.checks && zod.checks.$ZodCheckIncludes) {
            assert.ok(result instanceof zod.checks.$ZodCheckIncludes, 'result should be instance of $ZodCheckIncludes');
        }

        done();
    });
});