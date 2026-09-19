let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.multipleOf', function(done) {
        // Create a schema that requires a number to be a multiple of 5
        const schema = zod.z.number().multipleOf(5);

        // Values that should pass
        const passing = [0, 5, 10, -5, 15];
        passing.forEach(val => {
            const result = schema.safeParse(val);
            assert.strictEqual(result.success, true, `expected ${val} to be a multiple of 5`);
        });

        // Values that should fail
        const failing = [1, 2, 3, 4, 7, -3, 11.5];
        failing.forEach(val => {
            const result = schema.safeParse(val);
            assert.strictEqual(result.success, false, `expected ${val} NOT to be a multiple of 5`);
        });

        done();
    });
});