let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nanoid', function(done) {
        // Create a nanoid schema (default length is 21, using URL‑friendly characters)
        const schema = zod.z.nanoid();

        // A valid nanoid – 21 characters, all from the allowed alphabet (a‑z, A‑Z, 0‑9, _ and -)
        const validNanoid = 'abcdefghijklmnopqrstu'; // 21 letters
        const validResult = schema.safeParse(validNanoid);
        assert.strictEqual(validResult.success, true, 'Valid nanoid should pass validation');

        // An invalid nanoid – contains characters not in the allowed set and wrong length
        const invalidNanoid = 'invalid!!';
        const invalidResult = schema.safeParse(invalidNanoid);
        assert.strictEqual(invalidResult.success, false, 'Invalid nanoid should fail validation');

        done();
    });
});