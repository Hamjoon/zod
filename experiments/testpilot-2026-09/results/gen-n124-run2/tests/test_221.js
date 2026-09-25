let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.int32', function(done) {
        // Obtain the int32 schema
        const schema = zod.z.int32();

        // Verify that the schema has the expected shape
        assert.strictEqual(schema.type, 'integer', 'type should be integer');

        // The exclusive bounds should correspond to the int32 range:
        // values must be > exclusiveMinimum and < exclusiveMaximum,
        // therefore the bounds are one step outside the inclusive range.
        assert.strictEqual(schema.exclusiveMinimum, -2147483649, 'exclusiveMinimum should be -2147483649');
        assert.strictEqual(schema.exclusiveMaximum, 2147483648, 'exclusiveMaximum should be 2147483648');

        // Ensure that the schema does not contain unexpected properties
        const allowedKeys = ['type', 'exclusiveMinimum', 'exclusiveMaximum'];
        Object.keys(schema).forEach(key => {
            assert.ok(allowedKeys.includes(key), `Unexpected property ${key} in schema`);
        });

        done();
    });
});