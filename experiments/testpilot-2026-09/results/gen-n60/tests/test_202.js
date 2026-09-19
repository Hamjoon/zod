let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nonoptional', function(done) {
        // Create an optional string schema
        const optionalString = zod.string().optional();

        // Convert it to a non‑optional schema using the static helper
        const schema = zod.z.nonoptional(optionalString);

        // The schema should accept a valid string
        assert.strictEqual(schema.parse('hello world'), 'hello world');

        // The schema should reject `undefined` (the value that makes it optional)
        assert.throws(() => schema.parse(undefined), zod.ZodError);

        done();
    });
});