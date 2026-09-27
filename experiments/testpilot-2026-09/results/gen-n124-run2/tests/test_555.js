let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.gte', function(done) {
        const testValue = 42;
        const result = zod.z.gte(testValue, {}); // no extra params

        // The result should be a Zod check object with the expected shape
        assert.strictEqual(result.check, 'greater_than', 'check type should be "greater_than"');
        assert.strictEqual(result.inclusive, true, 'inclusive flag should be true');
        assert.strictEqual(result.value, testValue, 'value should be preserved');

        // The constructor name should indicate a GreaterThan check
        // (the exact name may vary depending on the library version, but it should contain "ZodCheckGreaterThan")
        const ctorName = result.constructor && result.constructor.name;
        assert.ok(
            typeof ctorName === 'string' && ctorName.includes('ZodCheckGreaterThan'),
            `constructor name should include "ZodCheckGreaterThan", got "${ctorName}"`
        );

        done();
    });
});