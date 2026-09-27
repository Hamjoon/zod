let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.ipv4', function(done) {
        // Create the IPv4 schema
        const schema = zod.z.ipv4();

        // A valid IPv4 address should parse without throwing
        assert.doesNotThrow(() => {
            schema.parse('192.168.0.1');
        }, 'Valid IPv4 address should not throw');

        // An invalid IPv4 address should throw a validation error
        assert.throws(() => {
            schema.parse('not.an.ip');
        }, /Invalid/, 'Invalid IPv4 address should throw');

        // Optional: ensure the underlying Zod schema reports the correct format
        // Zod schemas expose a `description` via `toJSON` in recent versions.
        // We check that the JSON representation contains the expected format.
        if (typeof schema.toJSON === 'function') {
            const json = schema.toJSON();
            assert.strictEqual(json.type, 'string', 'Schema type should be string');
            assert.strictEqual(json.format, 'ipv4', 'Schema format should be ipv4');
        }

        done();
    });
});