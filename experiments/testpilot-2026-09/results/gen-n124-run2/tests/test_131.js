let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.cuid', function(done) {
        // valid CUID example (taken from Zod documentation)
        const validCuid = 'ck1e5v9x0000x7v5c8c8c8c8';
        const validResult = zod.z.cuid().safeParse(validCuid);
        assert.strictEqual(validResult.success, true, 'Valid CUID should pass validation');

        // invalid CUID example
        const invalidCuid = 'not-a-cuid';
        const invalidResult = zod.z.cuid().safeParse(invalidCuid);
        assert.strictEqual(invalidResult.success, false, 'Invalid CUID should fail validation');

        done();
    });
});