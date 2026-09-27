let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.any', function(done) {
        // Create the any schema
        const anySchema = zod.z.any();

        // A collection of diverse values that should all be accepted
        const values = [
            undefined,
            null,
            42,
            'hello',
            true,
            { foo: 'bar' },
            [1, 2, 3],
            function () { return 'fn'; },
            Symbol('sym')
        ];

        // Verify that each value parses correctly and is returned unchanged
        for (const val of values) {
            const parseResult = anySchema.safeParse(val);
            assert.ok(parseResult.success, `Value ${String(val)} should be accepted`);
            assert.strictEqual(parseResult.data, val, `Parsed value should be exactly the original`);
        }

        done();
    });
});