let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.cuid2', function (done) {
        // Create a CUID2 schema – use the correct Zod API
        const schema = zod.string().cuid2();

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
            // ZodError messages contain the word "Invalid", so this regex will match
            assert.throws(() => schema.parse(val), /Invalid/);
        });

        done();
    });
});