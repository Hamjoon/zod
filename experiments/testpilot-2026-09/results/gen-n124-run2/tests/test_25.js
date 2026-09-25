let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.coerce.string', function() {
        const schema = zod.z.coerce.string();

        // Coerce numbers, booleans, and strings correctly
        assert.strictEqual(schema.parse(123), "123");
        assert.strictEqual(schema.parse(true), "true");
        assert.strictEqual(schema.parse("hello"), "hello");

        // Undefined should trigger a validation error
        assert.throws(() => schema.parse(undefined), /Required/);
    });
});