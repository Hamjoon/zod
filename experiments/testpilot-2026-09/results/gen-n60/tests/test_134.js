let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.never', function(done) {
        // 1. The never schema should reject any value
        const neverSchema = zod.never();

        assert.throws(
            () => neverSchema.parse('any value'),
            (err) => err instanceof zod.ZodError,
            "never schema should throw a ZodError for any input"
        );

        // Using safeParse should return success: false
        const result = neverSchema.safeParse(123);
        assert.strictEqual(result.success, false, 'never schema should not succeed in safeParse');

        // 2. Integration test with .or(z.never()) as shown in the example
        const Keys = zod.enum(["id", "name", "email"]).or(zod.never());
        const Person = zod.partialRecord(Keys, zod.string());

        // Valid cases: empty object and objects with allowed optional keys
        assert.doesNotThrow(() => Person.parse({}), 'empty object should be valid');
        assert.doesNotThrow(() => Person.parse({ id: "1", name: "Alice" }), 'allowed optional keys should be valid');

        // Invalid case: a key not listed in the enum should cause a validation error
        assert.throws(
            () => Person.parse({ foo: "bar" }),
            (err) => err instanceof zod.ZodError,
            'object with unknown key should throw a ZodError'
        );

        done();
    });
});