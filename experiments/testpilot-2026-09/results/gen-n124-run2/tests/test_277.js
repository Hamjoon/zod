let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.unknown', function(done) {
        // Create the unknown schema
        const schema = zod.z.unknown();

        // It should be an instance of ZodUnknown
        assert(schema instanceof zod.ZodUnknown, 'schema is not an instance of ZodUnknown');

        // The schema should accept any value and return it unchanged
        const values = [42, 'hello', true, null, undefined, { a: 1 }, [1, 2, 3]];
        values.forEach(val => {
            // parse should return the original value
            const parsed = schema.parse(val);
            assert.strictEqual(parsed, val, `parse did not return the original value for ${JSON.stringify(val)}`);

            // safeParse should indicate success and contain the same value
            const result = schema.safeParse(val);
            assert.strictEqual(result.success, true, `safeParse reported failure for ${JSON.stringify(val)}`);
            assert.strictEqual(result.data, val, `safeParse data mismatch for ${JSON.stringify(val)}`);
        });

        done();
    });
});