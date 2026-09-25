let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.any', function(done) {
        // create the schema using zod.z.any()
        const anySchema = zod.z.any();

        // it should be an instance of ZodAny
        assert(anySchema instanceof zod.ZodAny, 'Schema should be instance of ZodAny');

        // a collection of diverse values that should all pass validation
        const testValues = [
            42,
            'hello world',
            true,
            false,
            null,
            undefined,
            Symbol('sym'),
            123n,
            () => {},
            { a: 1, b: [2, 3] },
            [1, 2, 3],
        ];

        // each value should be returned unchanged by parse()
        testValues.forEach((value) => {
            const parsed = anySchema.parse(value);
            // For primitives and objects, strict equality works because parse returns the exact input
            assert.strictEqual(parsed, value, `Value ${String(value)} should be unchanged`);
        });

        done();
    });
});