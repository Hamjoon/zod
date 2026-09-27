let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // use the exported `z` helper directly

describe('test zod', function () {
    it('test zod.string().includes', function (done) {
        // Arrange
        const includesValue = 'needle';
        const extraParams = { message: 'must contain needle' };

        // Act – create a ZodString schema with an `includes` check
        const schema = z.string().includes(includesValue, extraParams);

        // The `includes` check is stored inside the schema definition
        const check = schema._def.checks[0];

        // Assert core properties of the check
        assert.strictEqual(check.kind, 'includes', 'check kind should be "includes"');
        assert.strictEqual(check.value, includesValue, 'includes value should be preserved');

        // Assert that extra params (e.g., message) are merged into the check
        assert.strictEqual(
            check.message,
            extraParams.message,
            'extra param "message" should be present on the check'
        );

        // Optionally verify the schema type (ZodString)
        assert.strictEqual(schema._def.typeName, 'ZodString', 'schema should be a ZodString');

        // If the library exposes the constructor, verify the instance type
        if (z.ZodString) {
            assert.ok(schema instanceof z.ZodString, 'schema should be instance of ZodString');
        }

        done();
    });
});