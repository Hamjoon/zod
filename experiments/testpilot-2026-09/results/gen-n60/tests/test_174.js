let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.unknown', function(done) {
        // Create the unknown schema
        const schema = zod.z.unknown();

        // It should be an instance of ZodUnknown
        assert(schema instanceof zod.ZodUnknown, 'schema should be instance of ZodUnknown');

        // Define a set of diverse values to test
        const values = [
            42,
            'hello world',
            true,
            null,
            undefined,
            { a: 1, b: 'test' },
            [1, 2, 3],
            Symbol('sym')
        ];

        // Ensure each value parses back to itself without error
        values.forEach((val) => {
            const parsed = schema.parse(val);
            // For Symbol, deep equality with assert.strictEqual works
            assert.strictEqual(parsed, val, `parsed value should equal original for ${String(val)}`);
        });

        // Ensure that the schema does not coerce or modify the input
        const obj = { nested: { x: 10 } };
        const parsedObj = schema.parse(obj);
        assert.strictEqual(parsedObj, obj, 'object reference should be preserved');

        done();
    });
});