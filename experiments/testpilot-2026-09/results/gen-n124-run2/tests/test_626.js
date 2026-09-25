let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.maxLength', function(done) {
        // Create a string schema with a maxLength check of 5 characters
        const schema = zod.string().check(zod.maxLength(5));

        // Helper to run validation regardless of the exact API (parse, safeParse, or direct call)
        const run = (value) => {
            if (typeof schema.parse === 'function') {
                // Zod v3 style
                return schema.parse(value);
            } else if (typeof schema.safeParse === 'function') {
                // Zod safeParse returns an object with success flag
                const result = schema.safeParse(value);
                if (!result.success) throw result.error;
                return result.data;
            } else if (typeof schema === 'function') {
                // Mini‑Zod style where the schema itself is a validator function
                return schema(value);
            } else {
                throw new Error('Unable to determine validation method');
            }
        };

        // Valid case: length exactly 5 should pass
        assert.doesNotThrow(() => run('abcde'));

        // Valid case: shorter than 5 should also pass
        assert.doesNotThrow(() => run('ab'));

        // Invalid case: longer than 5 should throw
        assert.throws(() => run('abcdef'));

        done();
    });
});