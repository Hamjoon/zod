let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.size', function(done) {
        // Basic size validation – should accept an array of length 3
        const sizeThreeSchema = zod.z.size(3);
        assert.doesNotThrow(() => {
            const result = sizeThreeSchema.parse([1, 2, 3]);
            // The parsed value should be the original array
            assert.deepStrictEqual(result, [1, 2, 3]);
        });

        // Should reject an array that does not match the required size
        assert.throws(() => {
            sizeThreeSchema.parse([1, 2]); // length 2, not 3
        }, err => {
            // Zod throws a ZodError; ensure it has at least one issue
            return err && err.errors && err.errors.length > 0;
        });

        // Test custom parameters (e.g., custom error message)
        const customMessage = 'Array must contain exactly 2 items';
        const sizeTwoSchema = zod.z.size(2, { message: customMessage });
        assert.throws(() => {
            sizeTwoSchema.parse([1, 2, 3]); // length 3, not 2
        }, err => {
            // Verify that the custom message appears in the error
            return err && err.errors && err.errors.some(issue => issue.message === customMessage);
        });

        done();
    });
});