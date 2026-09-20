let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');   // use the proper Zod export

describe('test zod', function () {
    it('test uint32 validation', function (done) {
        // Build a uint32 schema: integer, >=0 and <= 2^32‑1
        const schema = z.number().int().min(0).max(4294967295);

        // Helper to run validation using the most common Zod API
        const run = (value) => {
            // Zod schemas expose a `parse` method that throws on failure
            return schema.parse(value);
        };

        // Valid values – should not throw
        assert.doesNotThrow(() => run(0), '0 should be a valid uint32');
        assert.doesNotThrow(() => run(4294967295), '4294967295 should be a valid uint32');

        // Invalid values – should throw
        assert.throws(() => run(-1), /invalid|out of range|negative/, '-1 should be rejected');
        assert.throws(() => run(4294967296), /invalid|out of range/, '4294967296 should be rejected');
        assert.throws(() => run(3.14), /invalid|not an integer/, 'non‑integer numbers should be rejected');
        assert.throws(() => run('123'), /invalid|type/, 'string values should be rejected');

        done();
    });
});