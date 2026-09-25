let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.prefault', function(done) {
        // Test 1: prefault before a transform (length)
        const schema1 = zod.z.string().transform(val => val.length).prefault("tuna");
        const result1 = schema1.parse(undefined);
        assert.strictEqual(result1, 4, 'prefault should apply default before transform');

        // Test 2: prefault before trim and toUpperCase
        const schema2 = zod.z.string().trim().toUpperCase().prefault("  tuna  ");
        const result2 = schema2.parse(undefined);
        assert.strictEqual(result2, "TUNA", 'prefault should apply default before trim/uppercase');

        // Test 3: compare with .default (default is applied after transforms)
        const schema3 = zod.z.string().trim().toUpperCase().default("  tuna  ");
        const result3 = schema3.parse(undefined);
        assert.strictEqual(result3, "  tuna  ", 'default should not run through trim/uppercase');

        done();
    });
});