let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.ipv4', function(done) {
        // obtain the ipv4 schema
        const schema = zod.z.ipv4();

        // the schema should describe a string with ipv4 format
        assert.deepStrictEqual(schema, { type: "string", format: "ipv4" });

        // if the schema provides a validation method, test a couple of values
        if (typeof schema.validate === 'function') {
            // a valid IPv4 address should pass
            assert.strictEqual(schema.validate('192.168.0.1'), true);
            // an obviously invalid IPv4 address should fail
            assert.strictEqual(schema.validate('999.999.999.999'), false);
        }

        done();
    });
});