let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.map', function(done) {
        // Create a map schema with string keys and number values
        const schema = zod.z.map(zod.z.string(), zod.z.number());

        // Valid map should parse without error
        const validMap = new Map([['foo', 42], ['bar', 7]]);
        const parsed = schema.parse(validMap);
        assert.ok(parsed instanceof Map, 'Parsed result should be a Map');
        assert.strictEqual(parsed.get('foo'), 42);
        assert.strictEqual(parsed.get('bar'), 7);

        // Invalid map (non‑string key) should throw a ZodError
        const invalidMap = new Map([[123, 42]]);
        try {
            schema.parse(invalidMap);
            // If we get here, the test should fail
            assert.fail('Expected schema.parse to throw an error for invalid map');
        } catch (e) {
            // Zod throws an error object with an `errors` array
            assert.ok(e && Array.isArray(e.errors), 'Error should contain an errors array');
        }

        done();
    });
});