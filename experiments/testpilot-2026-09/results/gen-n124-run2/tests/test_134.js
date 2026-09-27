let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.cuid2', function(done) {
        // Create a CUID2 schema
        const schema = zod.cuid2();

        // A known‑good CUID2 (24 characters, starts with "c")
        const validCuid2 = 'ck1e5v5x0000x7c8c8c8c8c';

        // Should parse without throwing
        assert.doesNotThrow(() => schema.parse(validCuid2));

        // Various invalid inputs should throw a ZodError
        const invalidValues = [
            '',                                 // empty string
            'not-a-cuid2',                      // completely wrong format
            'ck1e5v5x0000x7c8c8c8c8',           // 23 chars (too short)
            'ck1e5v5x0000x7c8c8c8c8cextra',    // too long
            'bk1e5v5x0000x7c8c8c8c8c'           // does not start with "c"
        ];

        invalidValues.forEach(val => {
            assert.throws(() => schema.parse(val), /Invalid/);
        });

        done();
    });
});