let mocha = require('mocha');
let assert = require('assert');
let { z, ZodError } = require('zod');

describe('test zod', function () {
    it('test zod.z.union', function (done) {
        // Create a union schema of string and number
        const unionSchema = z.union([z.string(), z.number()]);

        // The returned object should be a ZodUnion instance
        assert.strictEqual(unionSchema.constructor.name, 'ZodUnion');

        // The internal definition should contain the original options.
        // Use the constructor name (which is stable across Zod versions) instead of the
        // internal `_def.typeName` property, which may be undefined in some releases.
        assert.deepStrictEqual(
            unionSchema._def.options.map(opt => opt.constructor.name),
            ['ZodString', 'ZodNumber']
        );

        // Valid values should parse correctly
        assert.strictEqual(unionSchema.parse('hello'), 'hello');
        assert.strictEqual(unionSchema.parse(123), 123);

        // Invalid value should throw a ZodError
        assert.throws(() => unionSchema.parse(true), /Expected/);

        // Using safeParse should indicate failure for invalid input
        const result = unionSchema.safeParse(false);
        assert.strictEqual(result.success, false);
        assert.ok(result.error instanceof ZodError);

        done();
    });
});