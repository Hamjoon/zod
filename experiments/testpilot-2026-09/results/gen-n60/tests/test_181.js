let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.uint32', function(done) {
        // obtain the uint32 schema/validator
        const schema = zod.z.uint32();

        // Helper to run validation using the most common Zod API
        const run = (value) => {
            if (typeof schema.parse === 'function') {
                return schema.parse(value);
            }
            if (typeof schema.validate === 'function') {
                // some Zod‑like libraries expose a validate method that returns an object
                const result = schema.validate(value);
                if (result.error) throw result.error;
                return result.value;
            }
            // fallback: treat the schema itself as a function
            return schema(value);
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