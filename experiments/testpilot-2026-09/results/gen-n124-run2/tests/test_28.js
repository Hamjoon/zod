let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.coerce.string', function(done) {
        // Basic coercion: number -> string
        const coerceString = zod.z.coerce.string();
        const coerced = coerceString.parse(12345);
        assert.strictEqual(coerced, '12345');

        // Coercion with validation: min length
        const minFive = zod.z.coerce.string().min(5);
        // Should succeed when the coerced string meets the length requirement
        assert.strictEqual(minFive.parse('hello'), 'hello');
        // Should fail when the coerced string is too short
        assert.throws(() => {
            minFive.parse('hi');
        });

        done();
    });
});