let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.size', function(done) {
        // Create a size validator that expects exactly 2 elements/items
        const sizeValidator = zod.z.size(2);

        // Positive test: an array with exactly 2 elements should pass
        const validArray = [1, 2];
        assert.strictEqual(sizeValidator.validate(validArray), true, 'Array of length 2 should be valid');

        // Negative test: an array with fewer than 2 elements should fail
        const shortArray = [1];
        assert.strictEqual(sizeValidator.validate(shortArray), false, 'Array of length 1 should be invalid');

        // Negative test: an array with more than 2 elements should also fail
        const longArray = [1, 2, 3];
        assert.strictEqual(sizeValidator.validate(longArray), false, 'Array of length 3 should be invalid');

        // The same validator should work for strings (size = length)
        const validString = 'ab';
        assert.strictEqual(sizeValidator.validate(validString), true, 'String of length 2 should be valid');

        const shortString = 'a';
        assert.strictEqual(sizeValidator.validate(shortString), false, 'String of length 1 should be invalid');

        const longString = 'abc';
        assert.strictEqual(sizeValidator.validate(longString), false, 'String of length 3 should be invalid');

        done();
    });
});