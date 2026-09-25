```javascript
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.int32 schema using Zod API', function (done) {
        // Build an int32 schema using Zod's fluent API.
        // The exclusive bounds are one step outside the inclusive int32 range.
        const schema = zod.z
            .number()          // base number type
            .int()             // must be an integer
            .gt(-2147483649)   // exclusive minimum (value > -2147483649)
            .lt(2147483648);   // exclusive maximum (value < 2147483648)

        // Verify that the schema is a ZodNumber instance.
        // Zod stores the type name in the internal `_def.typeName` property.
        assert.strictEqual(
            schema._def.typeName,
            'ZodNumber',
            'schema should be a ZodNumber'
        );

        // Extract the checks that Zod attached to the schema.
        // They are stored in the internal `_def.checks` array.
        const checks = schema._def.checks;

        // Helper to find a check by its kind.
        const findCheck = (kind) => checks.find((c) => c.kind === kind);

        // Verify the exclusive minimum (gt) check.
        const gtCheck = findCheck('gt');
        assert.ok(gtCheck, 'gt (exclusive minimum) check should exist');
        assert.strictEqual(
            gtCheck.value,
            -2147483649,
            'exclusiveMinimum should be -2147483649'
        );

        // Verify the exclusive maximum (lt) check.
        const ltCheck = findCheck('lt');
        assert.ok(ltCheck, 'lt (exclusive maximum) check should exist');
        assert.strictEqual(
            ltCheck.value,
            2147483648,
            'exclusiveMaximum should be 2147483648'
        );

        // Ensure that no unexpected checks are present