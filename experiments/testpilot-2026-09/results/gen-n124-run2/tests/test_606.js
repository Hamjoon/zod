const mocha = require('mocha');
const { describe, it } = mocha;
const assert = require('assert');
const zod = require('zod');

describe('test suite', function() {
    it('test case', function() {
        // Simple assertion to ensure the test is not empty
        assert.strictEqual(1 + 1, 2);

        // Example usage of Zod to show the library works
        const NumberSchema = zod.number().int().positive();
        const parsed = NumberSchema.parse(5); // should not throw
        assert.strictEqual(parsed, 5);
    });
});