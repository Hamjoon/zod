let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.cuid2', function(done) {
        // Create a schema that validates CUID2 strings
        const schema = zod.cuid2();

        // A known‑good CUID2 example (24‑character alphanumeric string)
        const validCuid2 = 'ck1e5v5x0000x8c8c8c8c8c';
        const resultValid = schema.safeParse(validCuid2);
        assert.strictEqual(resultValid.success, true, 'Valid CUID2 should pass validation');

        // An invalid CUID2 example
        const invalidCuid2 = 'not-a-cuid2';
        const resultInvalid = schema.safeParse(invalidCuid2);
        assert.strictEqual(resultInvalid.success, false, 'Invalid CUID2 should fail validation');

        done();
    });
});