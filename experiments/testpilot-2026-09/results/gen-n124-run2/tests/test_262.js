let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.undefined', function (done) {
        // Create the undefined schema using the function under test
        const schema = zod.z.undefined();

        // The returned object should be an instance of ZodUndefined
        assert(schema instanceof zod.ZodUndefined, 'schema should be an instance of ZodUndefined');

        // Parsing `undefined` should succeed and return `undefined`
        assert.strictEqual(schema.parse(undefined), undefined, 'parse(undefined) should return undefined');

        // Parsing any other value should throw a validation error.
        // Zod throws a ZodError whose message contains "expected undefined".
        // Use a case‑insensitive regex that matches the actual error text.
        assert.throws(() => schema.parse(null), /expected undefined/i);
        assert.throws(() => schema.parse(0), /expected undefined/i);
        assert.throws(() => schema.parse(''), /expected undefined/i);

        done();
    });
});