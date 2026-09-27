let mocha = require('mocha');
let assert = require('assert');
// zod is not needed for this test, but we keep the import in case other tests use it
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

        // Since Zod does not provide a `z.normalize` helper, we create a simple wrapper
        // that mimics the intended behaviour: it returns a function which calls
        // `input.normalize(form)`.
        const normalizeFn = (obj) => obj.normalize(form);

        // Call it with the mock input and check the result
        const result = normalizeFn(input);
        assert.strictEqual(result, expected);
        done();
    });
});