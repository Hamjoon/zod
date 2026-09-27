let mocha = require('mocha');
let assert = require('assert');
const { z } = require('zod'); // use the named export `z`

describe('test zod', function () {
    it('test zod.z.nonoptional (using unwrap)', function (done) {
        // Create an optional string schema
        const optionalString = z.string().optional();

        // Convert it to a non‑optional schema using the instance method `unwrap`
        const nonOptional = optionalString.unwrap();

        // 1. Parsing a valid string should succeed
        assert.doesNotThrow(() => {
            const result = nonOptional.parse('hello world');
            assert.strictEqual(result, 'hello world');
        });

        // 2. Parsing undefined should throw a validation error
        assert.throws(() => {
            nonOptional.parse(undefined);
        }, /required|undefined/);

        // 3. Ensure the schema type is still a string (the inner type is preserved)
        // `nonOptional` is now a ZodString, so its definition's typeName should be 'ZodString'
        assert.strictEqual(nonOptional._def.typeName, 'ZodString');

        done();
    });
});