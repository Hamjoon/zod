let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nanoid', function(done) {
        // Create a schema that validates nanoid strings
        const schema = zod.z.nanoid();

        // A known‑good nanoid (21 characters, URL‑friendly alphabet)
        const validNanoid = 'V1StGXR8_Z5jdHi6B-myT';

        // An invalid nanoid (contains illegal characters and wrong length)
        const invalidNanoid = 'invalid!!';

        // The valid nanoid should pass without throwing
        assert.doesNotThrow(() => {
            schema.parse(validNanoid);
        }, 'Valid nanoid threw an error');

        // The invalid nanoid should cause a validation error
        assert.throws(() => {
            schema.parse(invalidNanoid);
        }, /invalid|validation/i, 'Invalid nanoid did not throw');

        done();
    });
});