let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.cuid2', function(done) {
        // Create a schema that validates CUID2 strings
        const schema = zod.z.cuid2();

        // Example of a known‑good CUID2 (24‑character, starts with "c")
        const validCuid2 = 'cjr5v6g6c0000x7c5c5c5c5';
        // An obviously invalid string
        const invalidCuid2 = 'invalid-cuid2-string';

        // The valid CUID2 should pass validation without throwing
        assert.doesNotThrow(() => schema.parse(validCuid2));

        // The invalid CUID2 should cause a validation error
        assert.throws(() => schema.parse(invalidCuid2));

        done();
    });
});