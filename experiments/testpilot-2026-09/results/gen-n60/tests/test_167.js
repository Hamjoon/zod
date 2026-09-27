let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.prefault', function(done) {
        // Example 1: prefault works with a transformed string
        const schema1 = zod.string()
            .transform(val => val.length)
            .prefault("tuna");               // "tuna".length === 4
        assert.strictEqual(schema1.parse(undefined), 4, 'prefault should apply default after transform');

        // Example 2: defaultValue can be a function and is evaluated lazily
        let callCount = 0;
        const schema2 = zod.number()
            .prefault(() => {
                callCount++;
                return 42;
            });
        // First parse – function should be called once
        assert.strictEqual(schema2.parse(undefined), 42, 'prefault function should return 42');
        // Second parse – function should be called again (lazy evaluation)
        assert.strictEqual(schema2.parse(undefined), 42, 'prefault function should be called again on subsequent parses');
        assert.strictEqual(callCount, 2, 'prefault default function should be invoked each parse');

        // Example 3: prefault does not interfere with .default()
        const schema3 = zod.string()
            .trim()
            .toUpperCase()
            .prefault("  tuna  ");               // after trim+toUpperCase => "TUNA"
        assert.strictEqual(schema3.parse(undefined), "TUNA", 'prefault should respect the full pipeline');

        const schema4 = zod.string()
            .trim()
            .toUpperCase()
            .default("  tuna  ");                 // default is applied before trim+toUpperCase
        assert.strictEqual(schema4.parse(undefined), "  tuna  ", 'default should not run through the pipeline');

        done();
    });
});