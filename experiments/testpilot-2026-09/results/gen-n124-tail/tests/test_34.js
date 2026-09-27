let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.normalize', function(done) {
        const form = 'myForm';
        const expected = 'normalizedResult';
        // Mock input object with a normalize method
        const input = {
            normalize: function(passedForm) {
                // Verify that the correct form is passed to normalize
                assert.strictEqual(passedForm, form);
                return expected;
            }
        };
        // Get the function returned by zod.z.normalize
        const normalizeFn = zod.z.normalize(form);
        // Call it with the mock input and check the result
        const result = normalizeFn(input);
        assert.strictEqual(result, expected);
        done();
    });
});